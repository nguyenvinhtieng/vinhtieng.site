mkdir -p output

for img in home/*.webp; do
  filename=$(basename "$img")
  cwebp -resize 500 0 "$img" -o "output/$filename"
done
