---
title: "Các Dockerfile Phổ Biến Cho Nhiều Dự Án Khác Nhau"
description: "Tìm hiểu về Docker và khám phá các Dockerfile phổ biến cho nhiều dự án như Node.js, PHP với Laravel, React, Vue, Nuxt và Next.js. Khám phá các kỹ thuật tối ưu và thực hành tốt nhất."
tags: ["docker"]
image: "/images/blog/common-docker-file/banner.png"
date: 2025-04-25
published: true
---

**Các Dockerfile Phổ Biến Cho Nhiều Dự Án Khác Nhau**

Docker là một công cụ ảo hóa nhẹ giúp phát triển, triển khai và chạy ứng dụng trong các container. Nó cho phép bạn đóng gói ứng dụng và tất cả các phụ thuộc của nó vào một container duy nhất, giúp dễ dàng triển khai trên bất kỳ môi trường nào mà không cần lo lắng về sự khác biệt giữa các môi trường.

::alert{type="info"}
Đây là một số Dockerfile cho các dự án thường gặp, bạn có thể tham khảo và điều chỉnh theo nhu cầu của mình.
::

<br>

## 1. Dockerfile cho Node.js

Dockerfile cho Node.js rất quan trọng khi triển khai ứng dụng JavaScript phía server. Đây là một Dockerfile đã được tối ưu cho một dự án Node.js điển hình:
::code-block
---
files:
  - title: Dockerfile
    language: dockerfile
    content: |
      FROM node:18-slim
      WORKDIR /app
      COPY package*.json ./
      RUN npm install --production
      COPY . .
      EXPOSE 3000
      CMD ["node", "index.js"]
---
::

## 2. Dockerfile cho PHP với Laravel

Laravel là một framework PHP phổ biến để xây dựng ứng dụng web. Dưới đây là Dockerfile cho một dự án Laravel:
::code-block
---
files:
  - title: Dockerfile
    language: dockerfile
    content: |
      FROM php:8.1-fpm-alpine
      RUN apk add --no-cache libpng libjpeg-turbo libfreetype && \
          docker-php-ext-configure gd --with-freetype --with-jpeg && \
          docker-php-ext-install gd pdo pdo_mysql
      WORKDIR /var/www
      COPY . .
      RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
      RUN composer install --optimize-autoloader --no-dev
      EXPOSE 9000
      CMD ["php-fpm"]
---
::

## 3. Dockerfile cho React

React thường được tạo bằng Create React App. Đây là Dockerfile cho dự án React:
::code-block
---
files:
  - title: Dockerfile
    language: dockerfile
    content: |
      FROM node:18-slim as build
      WORKDIR /app
      COPY . .
      RUN npm install
      RUN npm run build

      FROM nginx:alpine
      COPY --from=build /app/build /usr/share/nginx/html
      EXPOSE 80
      CMD ["nginx", "-g", "daemon off;"]
---
::

## 4. Dockerfile cho Vue

Vue cũng được xây dựng tương tự như React. Dưới đây là Dockerfile cho Vue:
::code-block
---
files:
  - title: Dockerfile
    language: dockerfile
    content: |
      FROM node:18-slim as build
      WORKDIR /app
      COPY . .
      RUN npm install
      RUN npm run build

      FROM nginx:alpine
      COPY --from=build /app/dist /usr/share/nginx/html
      EXPOSE 80
      CMD ["nginx", "-g", "daemon off;"]
---
::

## 5. Dockerfile cho Nuxt.js

Nuxt.js là một framework mạnh mẽ để xây dựng ứng dụng Vue. Đây là Dockerfile cho dự án Nuxt:
::code-block
---
files:
  - title: Dockerfile
    language: dockerfile
    content: |
      FROM node:18-slim as build
      WORKDIR /app
      COPY . .
      RUN npm install
      RUN npm run build

      FROM node:18-slim
      WORKDIR /app
      COPY --from=build /app /app
      EXPOSE 3000
      CMD ["npm", "run", "start"]
---
::

## 6. Dockerfile cho Next.js

Next.js là một framework React phổ biến cho việc render phía server. Đây là Dockerfile cho dự án Next:
::code-block
---
files:
  - title: Dockerfile
    language: dockerfile
    content: |
      FROM node:18-slim as build
      WORKDIR /app
      COPY . .
      RUN npm install
      RUN npm run build

      FROM node:18-slim
      WORKDIR /app
      COPY --from=build /app /app
      EXPOSE 3000
      CMD ["npm", "run", "start"]
---
::

## Đang cập nhật...

Nếu bạn có các cấu hình hoặc Dockerfile khác muốn chia sẻ, vui lòng gửi email về [vinhtieng123@gmail.com](mailto:vinhtieng123@gmail.com). Mình rất trân trọng điều đó.