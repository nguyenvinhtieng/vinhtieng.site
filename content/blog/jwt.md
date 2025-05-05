---
title: "Tất tần tật về JWT"
description: "Giới thiệu về JWT, các thành phần của JWT, cách sử dụng JWT trong ứng dụng và các vấn đề liên quan đến bảo mật."
tags: ["npm"]
image: "/images/blog/jwt/banner.webp"
date: 2025-05-05
published: true
---

# 1. Giới thiệu về JWT
JWT (JSON Web Token) là một tiêu chuẩn mở (RFC 7519) cho phép truyền tải thông tin giữa các bên dưới dạng JSON. JWT thường được sử dụng để xác thực và phân quyền trong các ứng dụng web.

Một JWT token trông như sau:

::alert
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
::

Trang web chính thức của JWT: [jwt.io](https://jwt.io/)

# 2. Các thành phần của JWT

JWT bao gồm ba phần chính: `Header`, `Payload` và `Signature`. Mỗi phần được mã hóa bằng Base64Url và được phân tách bằng dấu chấm (.).
- **Header**: Chứa thông tin về thuật toán mã hóa và loại token. Ví dụ:

::code-block
---
files:
  - title: json
    language: json
    content: |
      {
        "alg": "HS256",
        "typ": "JWT"
      }
---
::

- **Payload**: Chứa thông tin mà bạn muốn truyền tải. Đây có thể là thông tin người dùng, quyền truy cập, thời gian hết hạn, v.v. Ví dụ:
::code-block
---
files:
  - title: json
    language: json
    content: |
      {
        "sub": "1234567890",
        "name": "John Doe",
        "iat": 1516239022
      }
---
::

- **Signature**: Được tạo bằng cách mã hóa `Header` và `Payload` với một khóa bí mật và thuật toán đã chỉ định trong `Header`. Điều này giúp đảm bảo rằng token không bị thay đổi trong quá trình truyền tải. Ví dụ:
::code-block
---
files:
  - title: json
    language: json
    content: |
      HMACSHA256(
        base64UrlEncode(header) + "." +
        base64UrlEncode(payload),
        your-256-bit-secret
      )
---
::

# 3. Viết lại hàm để generate JWT token và verify JWT token trong NodeJs

Khi làm việc với jwt và nodeJs, hầu hết mọi người sẽ sử dụng thư viện `jsonwebtoken` để tạo và xác thực JWT token. Tuy nhiên, để hiểu rõ hơn về cách hoạt động của JWT, chúng ta có thể tự viết hàm để tạo và xác thực JWT token.

Giả sử chúng ta muốn tạo JWT token từ thông tin user_id=123, khi đó phần payload sẽ là:
::code-block
---
files:
  - title: javascript
    language: javascript
    content: |
      const payload = {
        user_id: 123
      }
---
::

Ở phần header, chúng ta sẽ sử dụng thuật toán HS256 để mã hóa JWT token.
::code-block
---
files:
  - title: javascript
    language: javascript
    content: |
      const header = {
        alg: 'HS256',
        typ: 'JWT'
      }
---
::

Để tạo JWT token, chúng ta cần mã hóa `Header` và `Payload` bằng Base64Url. Sau đó, chúng ta sẽ tạo chữ ký bằng cách sử dụng thuật toán HMACSHA256 với khóa bí mật (secret key) và kết hợp `Header` và `Payload`.

Đầu tiên chúng ta cần viết 1 hàm để mã hóa Base64Url:
::code-block
---
files:
  - title: javascript
    language: javascript
    content: |
      function base64UrlEncode(str) {
        return Buffer.from(str)
          .toString('base64')
          .replace(/=/g, '')
          .replace(/\+/g, '-')
          .replace(/\//g, '_');
      }
---
::

Ở đây, vì chúng ta sử dụng NodeJs nên có thể sử dụng `Buffer` để mã hóa Base64Url. Nếu bạn đang làm việc với JavaScript trên trình duyệt, bạn có thể sử dụng `btoa()` để mã hóa Base64Url. Khi muốn giải mã, bạn có thể sử dụng `atob()`. Hàm này là hàm có sẵn trong trình duyệt.

Tiếp theo, chúng ta sẽ triển khai hàm tạo JWT token. Thay vì tự mã hóa thủ công bằng cách base64UrlEncode Header và Payload rồi nối với secret key, chúng ta sẽ thực hiện đúng theo chuẩn thực tế bằng cách sử dụng thuật toán HMAC-SHA256 để tạo chữ ký số.

Trong Node.js, chúng ta có thể dễ dàng thực hiện điều này bằng cách dùng thư viện tích hợp sẵn là crypto, cụ thể là hàm createHmac. Hàm này sẽ giúp chúng ta tạo ra chữ ký (signature) từ chuỗi đã mã hóa gồm Header và Payload, kết hợp với secret key để đảm bảo tính toàn vẹn và xác thực của token.

Full code mã hóa JWT token sẽ như sau:

::code-block
---
files:
  - title: javascript
    language: javascript
    content: |
      const crypto = require('crypto');
      function base64UrlEncode(str) {
        return Buffer.from(str)
          .toString('base64')
          .replace(/=/g, '')
          .replace(/\+/g, '-')
          .replace(/\//g, '_');
      }

      function createJWT(payload, secret) {
        const header = {
          alg: 'HS256',
          typ: 'JWT'
        };

        const encodedHeader = base64UrlEncode(JSON.stringify(header));
        const encodedPayload = base64UrlEncode(JSON.stringify(payload));

        const signature = crypto
          .createHmac('sha256', secret)
          .update(`${encodedHeader}.${encodedPayload}`)
          .digest('base64')
          .replace(/=/g, '')
          .replace(/\+/g, '-')
          .replace(/\//g, '_');

        return `${encodedHeader}.${encodedPayload}.${signature}`;
      }
---
::

# 4. Xác thực JWT token
Để xác thực JWT token, chúng ta cần kiểm tra chữ ký (signature) của token. Đầu tiên, chúng ta sẽ tách `Header`, `Payload` và `Signature` từ token. Sau đó, chúng ta sẽ mã hóa lại `Header` và `Payload` bằng cùng một khóa bí mật và thuật toán đã chỉ định trong `Header`. Cuối cùng, chúng ta so sánh chữ ký đã tạo với chữ ký trong token.
::code-block
---
files:
  - title: javascript
    language: javascript
    content: |
      function verifyJWT(token, secret) {
        const [encodedHeader, encodedPayload, signature] = token.split('.');
        const expectedSignature = crypto
          .createHmac('sha256', secret)
          .update(`${encodedHeader}.${encodedPayload}`)
          .digest('base64')
          .replace(/=/g, '')
          .replace(/\+/g, '-')
          .replace(/\//g, '_');

        return expectedSignature === signature;
      }
      const token = createJWT(payload, secret);
      const isValid = verifyJWT(token, secret);
      console.log('Token is valid:', isValid);
---
::
Hàm `verifyJWT` sẽ trả về `true` nếu chữ ký hợp lệ và `false` nếu không hợp lệ.
Nếu bạn muốn kiểm tra xem token có hết hạn hay không, bạn có thể thêm một trường `exp` vào payload. Trường này sẽ chứa thời gian hết hạn của token dưới dạng timestamp (số giây kể từ 1/1/1970).
::code-block
---
files:
  - title: javascript
    language: javascript
    content: |
      const payload = {
        user_id: 123,
        exp: Math.floor(Date.now() / 1000) + (60 * 60) // Hết hạn sau 1 giờ
      };
      const token = createJWT(payload, secret);
      const isValid = verifyJWT(token, secret);
      const decodedPayload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      const isExpired = decodedPayload.exp < Math.floor(Date.now() / 1000);
      console.log('Token is valid:', isValid);
      console.log('Token is expired:', isExpired);
---
::
# 5. Kết luận
JWT là một công cụ mạnh mẽ để xác thực và phân quyền trong các ứng dụng web. Bằng cách hiểu rõ cách hoạt động của JWT, bạn có thể tự tạo và xác thực JWT token mà không cần phụ thuộc vào thư viện bên ngoài. Tuy nhiên, trong thực tế, bạn nên sử dụng thư viện `jsonwebtoken` để tiết kiệm thời gian và công sức.

Hy vọng bài viết này đã giúp bạn hiểu rõ hơn về JWT và cách sử dụng nó trong ứng dụng của mình. Nếu bạn có bất kỳ câu hỏi nào, hãy liên hệ với mình qua các kênh liên lạc như email, facebook, zalo hoặc telegram nhé!

# 6. Tài liệu tham khảo
- [jwt.io](https://jwt.io/)
- [RFC 7519 - JSON Web Token (JWT)](https://datatracker.ietf.org/doc/html/rfc7519)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)