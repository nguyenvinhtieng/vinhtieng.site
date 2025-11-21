---
title: "Các Dockerfile Phổ Biến Cho Nhiều Dự Án Khác Nhau"
description: "Tìm hiểu về Docker và khám phá các Dockerfile phổ biến cho nhiều dự án như Node.js, PHP với Laravel, React, Vue, Nuxt và Next.js. Khám phá các kỹ thuật tối ưu và thực hành tốt nhất."
tags: ["docker"]
keywords: "docker, dockerfile, file docker mẫu, dockerfile cho nodejs, dockerfile cho php, dockerfile cho react, dockerfile cho vue, dockerfile cho nuxt, dockerfile cho next"
image: "/images/blog/common-docker-file/banner.webp"
date: 2025-04-25
published: true
---

**Các Dockerfile Phổ Biến Cho Nhiều Dự Án Khác Nhau**

Docker là một công cụ ảo hóa nhẹ giúp phát triển, triển khai và chạy ứng dụng trong các container. Nó cho phép bạn đóng gói ứng dụng và tất cả các phụ thuộc của nó vào một container duy nhất, giúp dễ dàng triển khai trên bất kỳ môi trường nào mà không cần lo lắng về sự khác biệt giữa các môi trường.

::alert{type="info"}
Đây là một số Dockerfile cho các dự án thường gặp, bạn có thể tham khảo và điều chỉnh theo nhu cầu của mình.
::

Nội dung bài viết được tổng hợp và tích góp từ nhiều nguồn khác nhau, bao gồm cả các dự án thực tế mà mình đã làm.
<br>

## Dockerfile cho Node.js

Dockerfile cho Node.js rất quan trọng khi triển khai ứng dụng JavaScript phía server. Đây là một Dockerfile đã được tối ưu cho một dự án Node.js điển hình:
::code-block
---
files:
  - title: Dockerfile
    language: dockerfile
    content: |
      FROM node:10-alpine

      RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
      WORKDIR /home/node/app
      COPY package*.json ./
      USER node
      RUN npm install
      COPY --chown=node:node . .

      EXPOSE 8080
      CMD [ "node", "app.js" ]
---
::

Cách 2, sử dụng `pm2`. Về cơ bản thì cách này nhẹ hơn kha khá so với npm
::code-block
---
files:
  - title: Dockerfile
    language: dockerfile
    content: |
      # Stage 1: Build
      FROM node:18-alpine AS build

      WORKDIR /app

      COPY package*.json ./

      RUN npm ci --only=production

      COPY . .

      RUN npm run build

      # Stage 2: Run
      FROM node:18-alpine

      RUN npm install -g pm2

      WORKDIR /app
      COPY --from=build /app/node_modules ./node_modules
      COPY --from=build /app .

      ENV NODE_ENV=production
      ENV PORT=3000

      EXPOSE 3000
      CMD ["pm2-runtime", "start", "server.js"]
---
::

## Dockerfile ReactJs

Có thể sử dụng Dockerfile này cho các dự án như Vue, Angular,...

**Lưu ý:** ở đây thư mục chứa nginx/nginx.conf đặt cùng cấp với Dockerfile

::code-block
---
files:
  - title: Dockerfile
    language: dockerfile
    content: |
      ## build stage ##
      FROM node:18.18-alpine as build
      WORKDIR /app
      COPY . .
      RUN npm install
      RUN npm run build

      ## run stage ##
      FROM nginx:alpine
      RUN mkdir /run
      COPY --from=build /app/build /run
      COPY nginx.conf /etc/nginx/nginx.conf
  - title: nginx.conf
    language: nginx
    content: |
      user  nginx;
      worker_processes  1;
      error_log  /var/log/nginx/error.log warn;
      pid        /var/run/nginx.pid;
      events {
        worker_connections  1024;
      }
      http {
        include       /etc/nginx/mime.types;
        default_type  application/octet-stream;
        log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                          '$status $body_bytes_sent "$http_referer" '
                          '"$http_user_agent" "$http_x_forwarded_for"';
        access_log  /var/log/nginx/access.log  main;
        sendfile        on;
        keepalive_timeout  65;
        server {
          listen       80;
          server_name  webclient;
          location / {
            root   /run;
            index  index.html;
            try_files $uri $uri/ /index.html;
          }
          error_page   500 502 503 504  /50x.html;
          location = /50x.html {
            root   /usr/share/nginx/html;
          }
        }
      }
---
::

## Dockerfile cho PHP với Laravel

**Lưu ý:** thư mục **conf/nginx.conf** và **conf/supervisord.conf** cùng cấp với Dockerfile

::code-block
---
files:
  - title: Dockerfile
    language: dockerfile
    content: |
      # Stage 1: Composer Dependencies
      FROM composer:2 AS composer

      WORKDIR /app
      COPY composer.json composer.lock ./

      RUN composer install --no-dev --optimize-autoloader --no-interaction

      # Stage 2: Build
      FROM php:8.2-fpm-alpine AS php

      WORKDIR /var/www/html
      COPY --from=composer /app/vendor ./vendor
      COPY . .

      RUN apk add --no-cache \
              libzip-dev \
              libpng-dev \
              libjpeg-turbo-dev \
              freetype-dev \
              && docker-php-ext-configure gd --with-freetype --with-jpeg \
              && docker-php-ext-install -j$(nproc) gd pdo_mysql zip opcache

      RUN { \
              echo 'opcache.enable=1'; \
              echo 'opcache.revalidate_freq=0'; \
              echo 'opcache.validate_timestamps=1'; \
              echo 'opcache.max_accelerated_files=10000'; \
              echo 'opcache.memory_consumption=192'; \
              echo 'opcache.max_wasted_percentage=10'; \
              echo 'opcache.interned_strings_buffer=16'; \
              echo 'opcache.fast_shutdown=1'; \
          } > /usr/local/etc/php/conf.d/opcache-recommended.ini

      RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

      # Stage 3: Nginx và Supervisord
      FROM nginx:alpine AS nginx

      WORKDIR /var/www/html
      COPY --from=php /var/www/html /var/www/html
      COPY conf/nginx.conf /etc/nginx/conf.d/default.conf

      RUN apk add --no-cache supervisor

      COPY conf/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

      EXPOSE 80
      CMD ["supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
  - title: nginx.conf
    language: nginx
    content: |
      server {
        listen 80;
        server_name localhost;

        root /var/www/html/public;
        index index.php index.html index.htm;

        location / {
            try_files $uri $uri/ /index.php?$query_string;
        }

        location ~ \.php$ {
            include fastcgi_params;
            fastcgi_pass 127.0.0.1:9000;
            fastcgi_index index.php;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        }

        location ~ /\.ht {
            deny all;
        }

        error_log /var/log/nginx/error.log;
        access_log /var/log/nginx/access.log;
      }
  - title: conf/supervisord.conf
    language: ini
    content: |
      [supervisord]
      nodaemon=true

      [program:php-fpm]
      command=php-fpm
      autostart=true
      autorestart=true
      stderr_logfile=/var/log/php-fpm.err.log
      stdout_logfile=/var/log/php-fpm.out.log

      [program:nginx]
      command=nginx -g "daemon off;"
      autostart=true
      autorestart=true
      stderr_logfile=/var/log/nginx.err.log
      stdout_logfile=/var/log/nginx.out.log
---
::

## Dockerfile cho NextJs
::code-block
---
files:
  - title: Dockerfile
    language: dockerfile
    content: |
      FROM node:18-alpine AS base

      FROM base AS deps
      RUN apk add --no-cache libc6-compat
      WORKDIR /app

      COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
      RUN npm install
      FROM base AS builder
      WORKDIR /app
      COPY --from=deps /app/node_modules ./node_modules
      COPY . .
      RUN npm run build


      FROM base AS runner
      WORKDIR /app

      ENV NODE_ENV production

      RUN addgroup --system --gid 1001 nodejs
      RUN adduser --system --uid 1001 nextjs

      COPY --from=builder /app/public ./public

      RUN mkdir .next
      RUN chown nextjs:nodejs .next

      COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
      COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

      USER nextjs

      EXPOSE 3000

      ENV PORT 3000
      ENV HOSTNAME "0.0.0.0"

      CMD ["node", "server.js"]
---
::

## Tham khảo
Một số Dockerfile được tham khảo từ [Devops Edu](https://elroydevops.tech/mau-dockerfile-cac-du-an/){:target="_blank"}
