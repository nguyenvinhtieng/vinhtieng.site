---
title: "Tổng quan và cấu hình thông dụng Nginx" 
description: "Hướng dẫn chi tiết về cấu hình và triển khai Nginx như web server, reverse proxy, load balancer, và các thiết lập nâng cao." 
tags: ["nginx"] 
keywords: "nginx, cấu hình, load balancer"
image: "/images/blog/basic-nginx/banner.webp" 
date: 2025-04-25 
published: true
---

**Giới thiệu về Nginx**

::alert{type=info}
nginx ("engine x") is an HTTP web server, reverse proxy, content cache, load balancer, TCP/UDP proxy server, and mail proxy server. Originally written by Igor Sysoev and distributed under the 2-clause BSD License. Enterprise distributions, commercial support and training are available from F5, Inc.
::
Nginx là một web server, phần mềm chạy trên máy chủ để nhận và xử lý các request (yêu cầu) từ trình duyệt hoặc client (như API request).

Ban đầu, Nginx được tạo ra để xử lý nhiều kết nối cùng lúc với hiệu năng cao, và ngày nay nó còn được dùng như:
	•	Web Server (máy chủ web)
	•	Reverse Proxy (proxy ngược)
	•	Load Balancer (cân bằng tải)
	•	Cache server (bộ nhớ đệm)
	•	API Gateway (ở mức cơ bản)

---

# Cài đặt Nginx

Hướng dẫn cài đặt Nginx trên Ubuntu:

::code-block
---
files:
  - title: bash
    language: nginx
    content: |
      sudo apt update
      sudo apt install nginx
---
::

Sau khi cài đặt, bạn có thể kiểm tra trạng thái Nginx:

::code-block
---
files:
  - title: bash
    language: nginx
    content: sudo systemctl status nginx
---
::

**Kiểm tra tường lửa:**
Để kiểm tra các cấu hình đang được chạy thì chạy lệnh
::code-block
---
files:
  - title: bash
    language: nginx
    content: sudo ufw app list
---
::

Kết quả hiện ra ở terminal sẽ dạng như sau:
::code-block
---
files:
  - title: bash
    language: nginx
    content: |
      Available applications:
      Nginx Full
      Nginx HTTP
      Nginx HTTPS
      OpenSSH
---
::

Sau khi cài đặt Nginx, bạn nên đảm bảo rằng tường lửa (firewall) cho phép lưu lượng HTTP và HTTPS để máy chủ có thể phục vụ nội dung web.

::code-block
---
files:
  - title: bash
    language: nginx
    content: |
      sudo ufw allow 'Nginx Full'
      sudo ufw status
---
::

Lệnh sudo ufw allow 'Nginx Full' sẽ mở cả hai cổng 80 (HTTP) và 443 (HTTPS).
Sau đó, dùng sudo ufw status để xác nhận rằng các cổng này đã được mở.

::alert{type=warning}
Nếu bạn chưa bật ufw (Uncomplicated Firewall), bạn có thể bật bằng lệnh sudo ufw enable. Tuy nhiên, hãy đảm bảo cấu hình chính xác để không bị khóa SSH.
::

Kiểm tra hoạt động của Nginx:

Mở trình duyệt và truy cập địa chỉ:
👉 `http://<địa_chỉ_IP_của_bạn>` hoặc `http://localhost` nếu kiểm tra cục bộ.

Bạn sẽ thấy trang mặc định “Welcome to nginx!” nếu mọi thứ hoạt động đúng cách.


# ⚙️ Cấu hình Default Host trong Nginx

Trên Ubuntu, file cấu hình của Nginx thường được lưu tại các vị trí sau:
- `/etc/nginx/sites-available/default` (Nếu sử dụng thư mục sites-available và sites-enabled).
- `/etc/nginx/conf.d/default.conf` (Thông dụng cho các cấu hình đơn giản).

Mặc định, khi cài đặt Nginx, sẽ có một file cấu hình default trong thư mục /etc/nginx/sites-available/ với một số cấu hình cơ bản. Bạn có thể sửa file này để cấu hình server block cho website của mình.

**Cấu hình Default Host**

Mở file cấu hình Nginx mặc định:
::code-block
---
files:
  - title: default.conf
    language: nginx
    content: sudo nano /etc/nginx/sites-available/default
---
::


Mặc định, Nginx sẽ chọn block đầu tiên khi không tìm thấy `server_name` tương ứng. Để cấu hình rõ ràng host mặc định, bạn thêm `default_server` vào dòng `listen`:

::code-block
---
files:
  - title: default.conf
    language: nginx
    content: |
      server {
          listen 80 default_server;
          server_name _;
          root /var/www/html;
          index index.html index.htm;

          location / {
              try_files $uri $uri/ =404;
          }
      }
---
::

**Ghi chú:**

- `listen 80 default_server;`: Cấu hình Nginx lắng nghe cổng 80 (HTTP) và đánh dấu đây là default_server (server mặc định cho các yêu cầu không khớp với server block khác).
- `root /var/www/html;`: Đường dẫn tới thư mục chứa các tệp tin của website. Bạn có thể thay đổi đường dẫn này thành thư mục của website bạn muốn phục vụ.
- `server_name _;`: Chỉ thị này cho phép server chấp nhận tất cả các yêu cầu không khớp với server block khác. Nếu bạn có tên miền cụ thể, hãy thay thế dấu gạch dưới (_) bằng tên miền của bạn.
- `location /`: Đây là phần cấu hình định tuyến cho các yêu cầu đến. Cấu hình này giúp Nginx tìm kiếm các tệp tin khi người dùng truy cập vào website.
- `try_files $uri $uri/ =404;`: Nếu yêu cầu không trùng khớp với tệp tin hoặc thư mục, sẽ trả về lỗi 404.

Sau khi chỉnh sửa xong, bạn cần kiểm tra xem cấu hình có chính xác không:
::code-block
---
files:
  - title: bash
    language: bash
    content: sudo nginx -t
---
::

Nếu không có lỗi nào, bạn có thể khởi động lại Nginx để áp dụng cấu hình mới:
::code-block
---
files:
  - title: bash
    language: bash
    content: sudo systemctl restart nginx
---
::

Giới thiệu về sites-available và sites-enabled

Trong Nginx, thư mục sites-available và sites-enabled là một cơ chế để quản lý các website (virtual hosts) mà Nginx có thể phục vụ. Cấu trúc này giúp dễ dàng bật/tắt các website mà không cần phải xóa hoặc thay đổi cấu hình trực tiếp.
1. `sites-available`:
- Đây là nơi bạn tạo và lưu trữ tất cả các file cấu hình của các website hoặc ứng dụng mà bạn muốn Nginx phục vụ.
- Mỗi file cấu hình trong sites-available đại diện cho một website hoặc ứng dụng riêng biệt.
- Ví dụ: /etc/nginx/sites-available/example.com là cấu hình cho website example.com.
2. `sites-enabled`:
- Đây là nơi chứa các liên kết tượng trưng (symlink) đến các file cấu hình trong sites-available mà bạn muốn Nginx thực thi.
- Các liên kết này cho phép Nginx biết được website nào sẽ được kích hoạt.
- Bạn không nên trực tiếp chỉnh sửa các file trong sites-enabled. Thay vào đó, bạn tạo symlink từ sites-available.

Cách thức hoạt động:
- Khi bạn tạo một file cấu hình trong sites-available, bạn có thể kích hoạt nó bằng cách tạo một symlink đến file đó trong thư mục sites-enabled.
- Để tạo symlink, sử dụng lệnh `ln -s`.

Ví dụ, nếu bạn có cấu hình example.com trong sites-available, bạn có thể tạo symlink vào sites-enabled như sau:

::code-block
---
files:
  - title: bash
    language: bash
    content: sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/
---
::

# Cấu hình Deploy page tĩnh

Để phục vụ một trang web tĩnh với Nginx, bạn cần cấu hình server block để trỏ đến thư mục chứa các tệp HTML, CSS, JavaScript và các tài nguyên khác của trang web.
::code-block
---
files:
  - title: static-site.conf
    language: nginx
    content: |
      server {
          listen 80 default_server;
          server_name _;
          root /var/www/my_static_site;
          index index.html index.htm;

          location / {
              try_files $uri $uri/ =404;
          }
      }
---
::

Trong đó:
- `root /var/www/my_static_site;`: Đường dẫn tới thư mục chứa các tệp tin của trang web tĩnh. Hãy thay đổi đường dẫn này thành thư mục thực tế của bạn.
- `index index.html index.htm;`: Xác định các tệp tin mặc định khi truy cập vào thư mục gốc.

# Cấu hình revert proxy
Để cấu hình Nginx làm reverse proxy, bạn cần thiết lập một server block để chuyển tiếp các yêu cầu từ Nginx đến một server backend khác (ví dụ: một ứng dụng web chạy trên cổng khác hoặc trên một máy chủ khác).
::code-block
---
files:
  - title: reverse-proxy.conf
    language: nginx
    content: |
      server {
          listen 80;
          server_name example.com;

          location / {
              proxy_pass http://backend;
              proxy_set_header Host $host;
              proxy_set_header X-Real-IP $remote_addr;
              proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
              proxy_set_header X-Forwarded-Proto $scheme;
          }
      }
---
::

# Load Balancer trong Nginx

Nginx hỗ trợ cấu hình cân bằng tải với nhiều thuật toán lựa chọn backend:

- `round-robin`: Mặc định, phân phối đều cho các request.
- `least_conn`: Chọn server ít kết nối nhất.
- `ip_hash`: Duy trì session cho client.
- `least_time`: chọn server có thời gian phản hồi ít nhất

Có thể thêm trọng số cho server bằng cách thêm số sau ip:port
- Ex: server 192.168.1.0:8000 weight=3;

::code-block
---
files:
  - title: upstream.conf
    language: nginx
    content: |
      upstream myapp1 {
          ip_hash;
          server 192.168.1.10:8000;
          server 192.168.2.10:8000;
          # server 192.168.1.10:8000 weight=3;
      }
---
::

Cấu hình server block proxy đến upstream:

::code-block
---
files:
  - title: proxy.conf
    language: nginx
    content: |
      server {
        listen 80 default_server;
        server_name _;
        root /var/www/html;
        index index.html index.htm;

        location / {
            proxy_pass http://myapp1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
      }
---
::

---

# Gzip Compression

Bật gzip giúp tăng tốc độ tải trang bằng cách nén nội dung trả về:

::code-block
---
files:
  - title: gzip.conf
    language: nginx
    content: |
      gzip on;
      gzip_disable "msie6";
      gzip_vary on;
      gzip_proxied any;
      gzip_comp_level 6;
      gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
---
::

---

# Kích hoạt HTTP/2

HTTP/2 cải thiện hiệu suất thông qua multiplexing và header compression:

::code-block
---
files:
  - title: http2.conf
    language: nginx
    content: |
      listen 443 ssl http2;
---
::

---

# Rate Limiting

Giới hạn số lượng request để tránh DDoS và abuse:

::code-block
---
files:
  - title: rate-limiting.conf
    language: nginx
    content: |
      limit_req_zone $binary_remote_addr zone=mylimit:10m rate=1r/s;

      location /api/ {
          limit_req zone=mylimit burst=5;
      }
---
::

---

# Redirect và Rewrites

Chuyển hướng toàn bộ traffic HTTP sang HTTPS:

::code-block
---
files:
  - title: redirect.conf
    language: nginx
    content: |
      server {
          listen 80;
          server_name example.com;
          return 301 https://$host$request_uri;
      }
      server {
          listen 443 ssl;
          server_name example.com;
          ssl_certificate /path/to/cert.pem;
          ssl_certificate_key /path/to/key.pem;
      }
---
::

Viết lại URL cho SPA:

::code-block
---
files:
  - title: rewrite.conf
    language: nginx
    content: |
      location /api/ {
          rewrite ^/api/(.*)$ /$1 break;
      }
---
::

---

# Hardening & Security

Bảo vệ server bằng cách từ chối truy cập file nhạy cảm:

::code-block
---
files:
  - title: deny.conf
    language: nginx
    content: |
      location ~* \\.(git|env|bak|log)$ {
        deny all;
      }
---
::

Ẩn thông tin server:

::code-block
---
files:
  - title: security.conf
    language: nginx
    content: |
      server_tokens off;
---
::

Chống clickjacking và XSS:

::code-block
---
files:
  - title: headers.conf
    language: nginx
    content: |
      add_header X-Content-Security-Policy "default-src 'self'";
      add_header X-Frame-Options "DENY";
      add_header X-XSS-Protection "1; mode=block";
      add_header Referrer-Policy "no-referrer";
---
::

---

# Logging nâng cao

Cấu hình custom log format để dễ debug:

::code-block
---
files:
  - title: logging.conf
    language: nginx
    content: |
      log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                     '$status $body_bytes_sent "$http_referer" '
                     '"$http_user_agent" "$http_x_forwarded_for"';
      access_log /var/log/nginx/access.log main;
---
::

---

# 📚 Tài liệu tham khảo

- [Nginx Documentation](https://nginx.org/en/docs/){:target="_blank"}
- [Nginx Load Balancing Guide](https://docs.nginx.com/nginx/admin-guide/load-balancer/http-load-balancer/){:target="_blank"}
- [Nginx + PHP-FPM Setup](https://www.php.net/manual/en/install.fpm.configuration.php){:target="_blank"}
- [OWASP Nginx Hardening Guide](https://owasp.org/www-project-secure-headers/){:target="_blank"}

---

<br />

**Tóm lại:**

Nginx là công cụ cực kỳ mạnh mẽ và linh hoạt, không chỉ giới hạn ở web server mà còn là reverse proxy, caching layer, và load balancer. Việc nắm vững và khai thác tốt các tính năng sẽ giúp hệ thống của bạn hiệu suất cao, bảo mật và dễ mở rộng.

