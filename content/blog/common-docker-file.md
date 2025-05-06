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
      # Stage 1: Build
      FROM node:18-alpine AS build

      WORKDIR /app
      COPY package*.json ./

      RUN npm ci --only=production

      COPY . .

      RUN npm run build

      # Stage 2: Run
      FROM node:18-alpine

      WORKDIR /app
      COPY --from=build /app/node_modules ./node_modules
      COPY --from=build /app .

      ENV NODE_ENV=production
      ENV PORT=3000

      EXPOSE 3000
      CMD ["node", "server.js"]

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

## Dockerfile NodeJS (NestJS)

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

      RUN npm ci

      COPY . .

      RUN npm run build

      # Stage 2: Run
      FROM node:18-alpine

      WORKDIR /app

      COPY --from=build /app/node_modules ./node_modules
      COPY --from=build /app/dist ./dist

      EXPOSE 3000
      CMD ["node", "dist/main"]
---
::

## Dockerfile NodeJS (Express.js)
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

      RUN npm ci

      COPY . .

      # Stage 2: Run
      FROM node:18-alpine

      WORKDIR /app

      COPY --from=build /app/node_modules ./node_modules
      COPY --from=build /app .

      EXPOSE 3000
      CMD ["node", "index.js"]
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
      # Stage 1: Build
      FROM node:18-alpine AS build
      WORKDIR /app

      COPY package*.json ./

      RUN npm ci

      COPY . .

      RUN npm run build

      # Stage 2: Run
      FROM nginx:alpine

      COPY --from=build /app/build /usr/share/nginx/html
      COPY nginx.conf /etc/nginx/nginx.conf

      EXPOSE 3000
      CMD ["nginx", "-g", "daemon off;"]
  - title: nginx.conf
    language: nginx
    content: |
      worker_processes auto;
      error_log /var/log/nginx/error.log warn;
      pid /var/run/nginx.pid;

      events {
          worker_connections 1024;
      }

      http {
          include /etc/nginx/mime.types;
          default_type application/octet-stream;

          log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                        '$status $body_bytes_sent "$http_referer" '
                        '"$http_user_agent" "$http_x_forwarded_for"';

          access_log /var/log/nginx/access.log main;

          server_tokens off;

          gzip on;
          gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

          server {
              listen 3000;  # Lắng nghe trên cổng 3000
              server_name localhost;

              root /usr/share/nginx/html;
              index index.html;

              location / {
                  try_files $uri $uri/ /index.html;
              }

              location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
                  expires 1y;
                  add_header Cache-Control "public, no-transform";
              }

              error_page 404 /404.html;
              location = /404.html {
                  internal;
              }

              error_page 500 502 503 504 /50x.html;
              location = /50x.html {
                  internal;
              }

              location ~ /\.ht {
                  deny all;
              }

              add_header X-Frame-Options "SAMEORIGIN";
              add_header X-Content-Type-Options "nosniff";
              add_header X-XSS-Protection "1; mode=block";
              add_header Referrer-Policy "no-referrer-when-downgrade";
              add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; frame-ancestors 'self';";
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
      # Stage 1: Build
      FROM node:18-alpine AS build

      WORKDIR /app
      COPY package*.json ./

      RUN npm ci

      COPY . .

      RUN npm run build

      # Stage 2: Run
      FROM node:18-alpine

      WORKDIR /app
      COPY --from=build /app/node_modules ./node_modules
      COPY --from=build /app .

      ENV NODE_ENV=production
      ENV PORT=3000

      EXPOSE 3000
      CMD ["npm", "start"]
  - title: conf/nginx.conf
    language: nginx
    content: |
      server {
          listen 3000;
          server_name localhost;

          location / {
              proxy_pass http://localhost:3000;
              proxy_http_version 1.1;
              proxy_set_header Upgrade $http_upgrade;
              proxy_set_header Connection 'upgrade';
              proxy_set_header Host $host;
              proxy_cache_bypass $http_upgrade;
          }
      }
---
::


## Đang cập nhật...

Nếu bạn có các cấu hình hoặc Dockerfile khác muốn chia sẻ, vui lòng gửi email về [vinhtieng123@gmail.com](mailto:vinhtieng123@gmail.com). Mình rất trân trọng điều đó.
