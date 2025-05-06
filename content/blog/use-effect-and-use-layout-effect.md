---
title: "Phân biệt useEffect và useLayoutEffect trong React"
description: "Tìm hiểu điểm khác nhau giữa useEffect và useLayoutEffect trong React, giúp bạn sử dụng đúng hook trong từng tình huống cụ thể để tối ưu hiệu năng và trải nghiệm người dùng."
tags: ["react", "hooks"]
keywords: "react, useEffect, useLayoutEffect, react hooks, hiệu năng react"
image: "/images/blog/use-effect-and-use-layout-effect/banner.webp"
date: 2025-05-06
published: true
---

# useEffect và useLayoutEffect trong React

React cung cấp hai hook mạnh mẽ để xử lý hiệu ứng phụ: `useEffect` và `useLayoutEffect`. Tuy chúng có cú pháp giống nhau, nhưng cách chúng hoạt động khác biệt và ảnh hưởng trực tiếp đến trải nghiệm người dùng cũng như hiệu suất của ứng dụng.

---

## Tóm tắt quy trình thực thi

### `useEffect`  
- Chạy **sau khi React cập nhật DOM xong và render UI xong**.  
- Thích hợp cho các **tác vụ không ảnh hưởng trực tiếp đến layout**, như gọi API, đăng ký sự kiện, log, animation nhẹ…

**Quy trình:**

1. Cập nhật lại state
2. Cập nhật DOM (mutated)
3. React render lại UI
4. Clean up nếu có
5. Gọi useEffect callback


### `useLayoutEffect`
- Chạy ngay sau khi DOM được cập nhật, nhưng **trước khi browser vẽ lại giao diện (paint)**.
- Dùng khi bạn cần đo lường DOM, thay đổi layout hoặc ngăn nhấp nháy giao diện.

**Quy trình:**

1. Cập nhật lại state
2. Cập nhật DOM (mutated)
3. Clean up nếu dependencies thay đổi
4. Gọi useLayoutEffect callback
5. React render lại UI

**Khi nào dùng cái nào?**

| Tình huống                                           | Nên dùng          |
|------------------------------------------------------|-------------------|
| Gọi API, thao tác không ảnh hưởng layout             | `useEffect`       |
| Đo kích thước DOM, scroll, position                  | `useLayoutEffect` |
| Cập nhật class, focus vào input                      | `useLayoutEffect` |
| Hiệu ứng animation nhẹ sau render                    | `useEffect`       |
| Ngăn nháy layout (flicker) khi hiển thị components   | `useLayoutEffect` |
| Cập nhật DOM trước khi browser vẽ lại                | `useLayoutEffect` |
