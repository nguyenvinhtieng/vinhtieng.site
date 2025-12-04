---
title: Tổng hợp các scripts hữu ích
description: Danh sách các scripts hữu ích cho lập trình viên, giúp tiết kiệm
  thời gian và công sức trong quá trình phát triển phần mềm.
tags:
  - scripts
keywords: scripts, useful scripts
image: /images/blog/useful-script/banner.webp
date: 2025-05-06
published: true
---

# Nén ảnh và convert ảnh sang định dạng webp

- Cài đặt cwebp

Đối với window thì có thể xem hướng dẫn tại: <https://developers.google.com/speed/webp/download?hl=vi>

::code-block
---
files:
  - title: bash
    language: bash
    content: |
      # Cài đặt cwebp trên Ubuntu
      sudo apt-get install webp
      # Cài đặt cwebp trên MacOS
      brew install webp
---
::

- Script nén ảnh :code-block{:files="[{&#x22;title&#x22;:&#x22;compress-image.sh&#x22;,&#x22;language&#x22;:&#x22;bash&#x22;,&#x22;content&#x22;:&#x22;#!/bin/bashn# Kiểm tra đối số đầu vàonif [ -z &#x22;$1&#x22; ]; thenn  echo &#x22;❌ Vui lòng cung cấp đường dẫn file ảnh.&#x22;n  echo &#x22;👉 Ví dụ: ./compress-local-image.sh ./image.png&#x22;n  exit 1nfinnINPUT=&#x22;$1&#x22;nn# Kiểm tra file tồn tạinif [ ! -f &#x22;$INPUT&#x22; ]; thenn  echo &#x22;❌ File không tồn tại: $INPUT&#x22;n  exit 1nfinn# Lấy tên filenBASENAME=$(basename &#x22;$INPUT&#x22;)nFILENAME=&#x22;${BASENAME%.*}&#x22;nEXT=&#x22;${BASENAME##*.}&#x22;nn# Nén và chuyển sang WebPnecho &#x22;🔄 Đang nén và chuyển sang WebP...&#x22;ncwebp -q 80 &#x22;$INPUT&#x22; -o &#x22;${FILENAME}.webp&#x22;nnecho &#x22;✅ Đã tạo file: ${FILENAME}.webp&#x22;n&#x22;}]"}

Sau khi tạo xong file, cần phải gán quyền thực thi cho file script bằng lệnh sau:

::code-block
---
files:
  - title: bash
    language: bash
    content: |
      chmod +x compress-image.sh
---
::

Sau đó có thể chạy script để có thể thực hiện nén ảnh và chuyển đổi sang định dạng webp.

::code-block
---
files:
  - title: bash
    language: bash
    content: |
      ./compress-image.sh ./image.png
---
::

## Đang cập nhật...
