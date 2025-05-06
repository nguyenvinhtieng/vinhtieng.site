---
title: "Tổng hợp các scripts hữu ích"
description: "Danh sách các scripts hữu ích cho lập trình viên, giúp tiết kiệm thời gian và công sức trong quá trình phát triển phần mềm."
tags: ["scripts"]
keywords: "scripts, useful scripts"
image: "/images/blog/useful-script/banner.webp"
date: 2025-05-06
published: true
---

# Nén ảnh và convert ảnh sang định dạng webp

- Cài đặt cwebp

Đối với window thì có thể xem hướng dẫn tại: https://developers.google.com/speed/webp/download?hl=vi

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

- Script nén ảnh
::code-block
---
files:
  - title: compress-image.sh
    language: bash
    content: |
      #!/bin/bash
      # Kiểm tra đối số đầu vào
      if [ -z "$1" ]; then
        echo "❌ Vui lòng cung cấp đường dẫn file ảnh."
        echo "👉 Ví dụ: ./compress-local-image.sh ./image.png"
        exit 1
      fi

      INPUT="$1"

      # Kiểm tra file tồn tại
      if [ ! -f "$INPUT" ]; then
        echo "❌ File không tồn tại: $INPUT"
        exit 1
      fi

      # Lấy tên file
      BASENAME=$(basename "$INPUT")
      FILENAME="${BASENAME%.*}"
      EXT="${BASENAME##*.}"

      # Nén và chuyển sang WebP
      echo "🔄 Đang nén và chuyển sang WebP..."
      cwebp -q 80 "$INPUT" -o "${FILENAME}.webp"

      echo "✅ Đã tạo file: ${FILENAME}.webp"
---
::

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

