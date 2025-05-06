---
title: "JWT là gì? Cách hoạt động và ứng dụng thực tế"
description: "JWT (JSON Web Token) là gì? Cách JWT hoạt động, cấu trúc gồm Header, Payload, Signature và cách ứng dụng trong xác thực bảo mật."
tags: ["npm"]
image: "/images/blog/jwt/banner.webp"
date: 2025-05-05
published: true
---

# 1. Giới thiệu về JWT
JSON Web Token (JWT) là một tiêu chuẩn mở ( RFC 7519 ) định nghĩa một cách thức nhỏ gọn và độc lập để truyền thông tin an toàn giữa các bên dưới dạng đối tượng JSON. Thông tin này có thể được xác minh và tin cậy vì nó được ký kỹ thuật số. JWT có thể được ký bằng một bí mật (với thuật toán HMAC ) hoặc một cặp khóa công khai/riêng tư bằng RSA hoặc ECDSA .

*Trích từ: https://jwt.io/introduction*

# 2. Các thành phần của JWT


JWT bao gồm ba thành phần chính: `Header`, `Payload` và `Signature`. Mỗi phần đều được mã hóa bằng Base64Url và được phân tách bằng dấu chấm (.).
Một JWT token thường sẽ trông như sau:

::alert{type=info}
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
::

như vậy với JWT token ở trên thì các thành phần sau khi được mã hóa sẽ là:

- Header: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`

- Payload: `eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ`

- Signature: `SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`

<br />

**Chi tiết về các thành phần**

- **Header**: Thường sẽ chứa thông tin về thuật toán mã hóa và loại token. 

Ví dụ:

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

- **Payload**: Đây là phần sẽ chứa các thông tin mà chúng ta muốn mã hóa và truyền tải. Thường thì chúng ta sẽ lưu thông tin người dùng, user_id,...

::alert{type=info}
Lưu ý rằng JWT token không có hết hạn, tuy nhiên chúng ta có thể giới hạn thời gian sống của token bằng cách thêm các trường như `exp`, `nbf`, `iat` vào payload. Và khi chúng ta xác thực token chúng ta sẽ cần thêm một bước kiểm tra thời gian sống của token. Như vậy chúng ta có thể sử dụng JWT token như một session token.
::

Ví dụ về payload:
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

- **Signature**: Được tạo bằng cách mã hóa `Header` và `Payload` với một khóa bí mật và thuật toán đã chỉ định trong Header. Điều này giúp đảm bảo rằng token không bị thay đổi trong quá trình truyền tải. Ví dụ:
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

Ở phần header, chúng ta sẽ sử dụng thuật toán HS256 để mã hóa JWT token. Nên payload sẽ có dạng như sau:
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

Tiếp theo, chúng ta sẽ triển khai hàm tạo JWT token. Trong Node.js, chúng ta có thể dễ dàng thực hiện điều này bằng cách dùng thư viện tích hợp sẵn là `crypto`, cụ thể là hàm `createHmac`. Hàm này sẽ giúp chúng ta tạo ra chữ ký (signature) từ chuỗi đã mã hóa gồm Header và Payload, kết hợp với secret key để đảm bảo tính toàn vẹn và xác thực của token.

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

Như vậy chúng ta đã có hàm `createJWT` để tạo JWT token. Hàm này sẽ nhận vào 2 tham số là `payload` và `secret`. `payload` là thông tin mà chúng ta muốn mã hóa và truyền tải, còn `secret` là khóa bí mật mà chúng ta sẽ sử dụng để tạo chữ ký cho token.
::alert{type=error}
Đối với JWT token, chúng ta có thể sử dụng bất kỳ chuỗi nào làm khóa bí mật. Tuy nhiên, để đảm bảo tính bảo mật, chúng ta nên sử dụng một chuỗi ngẫu nhiên và đủ dài. Vì khi sử dụng thuật toán HMACSHA256, nếu kẻ tấn công biết được khóa bí mật, họ có thể tạo ra token giả mạo và truy cập vào hệ thống của bạn.
::
Có thể sử dụng trang web [randomkeygen.com](https://randomkeygen.com/) để tạo ra một chuỗi ngẫu nhiên và đủ dài làm khóa bí mật.

# 4. Xác thực JWT token

Token JWT gồm ba phần: Header, Payload và Signature, được nối với nhau bằng dấu chấm (.). Quá trình xác thực diễn ra như sau:
1. Tách token thành ba phần: Header, Payload và Signature.
2. Tạo lại chữ ký bằng cách kết hợp Header và Payload đã mã hóa bằng Base64Url, sau đó sử dụng cùng thuật toán và khóa bí mật (secret key) đã được dùng khi tạo token ban đầu.
3. So sánh chữ ký mới tạo với chữ ký ban đầu trong token:
	- Nếu hai chữ ký giống nhau, token được xác nhận là hợp lệ (không bị chỉnh sửa).
	- Nếu khác nhau, token đã bị thay đổi hoặc không hợp lệ.

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


Ngoài ra, để kiểm tra xem token có hết hạn hay chưa, bạn có thể thêm trường exp (expiration) vào Payload. Trường này lưu thời gian hết hạn dưới dạng timestamp (số giây kể từ ngày 1/1/1970). Khi xác thực, chỉ cần so sánh giá trị exp với thời gian hiện tại để biết token còn hiệu lực hay không.

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