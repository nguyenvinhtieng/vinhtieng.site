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