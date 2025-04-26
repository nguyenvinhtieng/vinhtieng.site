---
title: "Common Dockerfiles for Various Projects"
description: "Learn about Docker and explore common Dockerfiles for different projects including Node.js, PHP with Laravel, React, Vue, Nuxt, and Next.js. Discover best practices and optimization techniques."
tags: ["docker"]
image: "/images/blog/common-docker-file/banner.png"
date: 2025-04-25
published: true
---

**Common Dockerfiles for Various Projects**

Docker has revolutionized the way we deploy and manage applications, offering a streamlined and efficient method of packaging applications and their dependencies into containers. In this article, we'll walk through some common Dockerfiles for various types of projects, including Node.js, PHP with Laravel, React, Vue, Nuxt, and Next.js. We will also cover best practices and optimizations to ensure that your Dockerfiles are efficient and production-ready.

## 1. Node.js Dockerfile

A Dockerfile for Node.js is essential for deploying server-side JavaScript applications. Here's an optimized Dockerfile for a typical Node.js project:
::code-block
---
files:
  - title: Dockerfile
    language: dockerfile
    content: |
      # Use a minimal, official Node.js image
      FROM node:18-slim

      # Set the working directory inside the container
      WORKDIR /app

      # Copy package.json and package-lock.json first (for better cache layer utilization)
      COPY package*.json ./

      # Install dependencies
      RUN npm install --production

      # Copy the rest of the application code
      COPY . .

      # Expose the port the app runs on
      EXPOSE 3000

      # Command to start the app
      CMD ["node", "index.js"]
---
::

## 2. PHP with Laravel Dockerfile
Laravel is a popular PHP framework for building web applications. Below is a Dockerfile for a Laravel project:
::code-block
---
files:
  - title: Dockerfile
    language: dockerfile
    content: |
      # Use the official PHP image with required extensions for Laravel
      FROM php:8.1-fpm-alpine

      # Install system dependencies and PHP extensions
      RUN apk add --no-cache libpng libjpeg-turbo libfreetype && \
          docker-php-ext-configure gd --with-freetype --with-jpeg && \
          docker-php-ext-install gd pdo pdo_mysql

      # Set the working directory
      WORKDIR /var/www

      # Copy the Laravel application code into the container
      COPY . .

      # Install Composer for dependency management
      RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

      # Install the Laravel dependencies
      RUN composer install --optimize-autoloader --no-dev

      # Expose the PHP-FPM port
      EXPOSE 9000

      # Start PHP-FPM
      CMD ["php-fpm"]
---
::


## 3. React Dockerfile
React applications are typically built using Create React App. Here's a Dockerfile for a React project:
::code-block
---
files:
  - title: Dockerfile
    language: dockerfile
    content: |
      # Build the React app using the official Node image
      FROM node:18-slim as build

      WORKDIR /app
      COPY . .
      RUN npm install
      RUN npm run build

      # Serve the app using Nginx
      FROM nginx:alpine

      # Copy the build folder from the build stage
      COPY --from=build /app/build /usr/share/nginx/html

      # Expose port 80 for the Nginx server
      EXPOSE 80

      # Run Nginx
      CMD ["nginx", "-g", "daemon off;"]
---
::

## 4. Vue Dockerfile
Vue applications can also be built using a similar approach to React. Here's a Dockerfile for a Vue project:
::code-block
---
files:
  - title: Dockerfile
    language: dockerfile
    content: |
      # Build the Vue.js app using the official Node image
      FROM node:18-slim as build

      WORKDIR /app
      COPY . .
      RUN npm install
      RUN npm run build

      # Serve the app with Nginx
      FROM nginx:alpine

      # Copy the build folder from the build stage
      COPY --from=build /app/dist /usr/share/nginx/html

      # Expose the default Nginx port
      EXPOSE 80

      # Run Nginx
      CMD ["nginx", "-g", "daemon off;"]
---
::

## 5. Nuxt.js Dockerfile
Nuxt.js is a powerful framework for building Vue applications. Here's a Dockerfile for a Nuxt.js project:
::code-block
---
files:
  - title: Dockerfile
    language: dockerfile
    content: |
      # Use Node.js official image for building Nuxt.js
      FROM node:18-slim as build

      WORKDIR /app
      COPY . .
      RUN npm install
      RUN npm run build

      # Run the Nuxt app in production mode using Node.js
      FROM node:18-slim

      WORKDIR /app
      COPY --from=build /app /app

      # Expose port 3000 for the Nuxt app
      EXPOSE 3000

      # Run Nuxt.js in production mode
      CMD ["npm", "run", "start"]
---
::

## 6. Next.js Dockerfile
Next.js is a popular React framework for server-side rendering. Here's a Dockerfile for a Next.js project:
::code-block
---
files:
  - title: Dockerfile
    language: dockerfile
    content: |
      # Build the Next.js app using Node.js
      FROM node:18-slim as build

      WORKDIR /app
      COPY . .
      RUN npm install
      RUN npm run build

      # Run the Next.js app in production mode using Node.js
      FROM node:18-slim

      WORKDIR /app
      COPY --from=build /app /app

      # Expose the port the Next.js app runs on
      EXPOSE 3000

      # Start the Next.js server
      CMD ["npm", "run", "start"]
---
::


<!-- Continue updating text -->

## Updating...

If you have any other configurations or Dockerfiles that you would like to share, please feel free to share it to email me at [vinhtieng123@gmail.com](mailto:vinhtieng123@gmail.com). I really appreciate it.
