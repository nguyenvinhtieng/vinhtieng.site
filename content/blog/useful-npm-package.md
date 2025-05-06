---
title: "Tổng hợp các npm package hữu ích cho Frontend và Backend"
description: "Danh sách các npm package hữu ích cho lập trình Frontend và Backend, được tổng hợp từ kinh nghiệm thực tế và các chia sẻ trong cộng đồng."
tags: ["npm"]
keywords: "npm, package, frontend, backend"
image: "/images/blog/useful-npm-package/banner.webp"
date: 2025-05-05
published: true
---

# Frontend
- `react-query` - [React Query](https://react-query.tanstack.com/) Thư viện quản lý trạng thái cho React, giúp xử lý các yêu cầu API và cache dữ liệu một cách dễ dàng.
- `@progress/kendo-react-pdf` - Thư viện tạo PDF cho React, hay hơn các thư viện khác ở chỗ hình ảnh sẽ được xuất ra dưới định dạng SVG, giúp cho việc xuất ảnh chất lượng cao và nét hơn, không bị vỡ ảnh khi zoom in.
- `react-split-pane` - Thư viện tạo giao diện chia tách (split view) cho React, giúp dễ dàng tạo các layout với các phần tử có thể kéo và thả.
- `react-window` - Thư viện giúp tối ưu hóa hiệu suất cho bảng và danh sách lớn trong React bằng cách chỉ render các phần tử đang hiển thị trên UI nhẹ và dễ sử dụng.

# Backend

- Updating...

# Các đoạn code mẫu hữu dụng

- Code template cho custom send and listen event document
::code-block
---
files:
  - title: javascript
    language: javascript
    content: |
      export const sendEvent = (eventName, detail) => {
        document.dispatchEvent(new CustomEvent(eventName, { detail }));
      }
      export const listenEvent = (eventName, callback, context = document) => {
        context.addEventListener(eventName, callback);
        return () => context.removeEventListener(eventName, callback);
      }
---
::