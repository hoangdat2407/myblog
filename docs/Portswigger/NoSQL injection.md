# NoSQL injection

## **Lab: Detecting NoSQL injection**

[Lab: Detecting NoSQL injection | Web Security Academy](https://portswigger.net/web-security/nosql-injection/lab-nosql-injection-detection)

- Trước hết, chèn thử dấu `'`  thì response trả về 500 nhưng khi chèn `\'` thì response trả về 200. Tiếp tục thử payload sau để confirm NoSQLi
    - Payload
        
        ```jsx
        Accessories' && 0 && '
        Accessories' && 1 && '
        ```
        
    - Với payload đúng response trả về như sau:
        
        ![image.png](NoSQL%20injection/image.png)
        
    - Với payload sai, response trả về như sau:
        
        ![image.png](NoSQL%20injection/image%201.png)
        
    
    ⇒ có NoSQLi 
    
- Ở bài này, chỉ cần làm hiện những sản phẩm chưa release là hoàn thành giải lab
    - Payload
        
        ```jsx
        Accessories' || '1'=='1
        ```
        
    - Response trả về
        
        ![image.png](NoSQL%20injection/image%202.png)
        
    - Hoàn thành giải lab
        
        ![image.png](NoSQL%20injection/image%203.png)
        

## **Lab: Exploiting NoSQL operator injection to bypass authentication**

[Lab: Exploiting NoSQL operator injection to bypass authentication | Web Security Academy](https://portswigger.net/web-security/nosql-injection/lab-nosql-injection-bypass-authentication)

- Trước hết, đăng nhập với account `wiener:peter` . Sau đó, chèn payload sau vào param `password` thì nhận thấy có thể đăng nhập mà không cần password
    - Payload
        
        ```jsx
        {"username":"wiener","password":{"$ne":""}}
        ```
        
    - Request gửi
        
        ![image.png](NoSQL%20injection/image%204.png)
        
- Thử với `username` `administrator` nhưng không được
    
    ![image.png](NoSQL%20injection/image%205.png)
    
- Tuy nhiên, chúng ta có thể dùng biểu thức regex vì tài khoản admin có thể chứa chữ `admin`
    - Payload
        
        ```jsx
        	{"username":{ "$regex":"admin"},"password":{"$ne":""}}
        ```
        
    - Request gửi
        
        ![image.png](NoSQL%20injection/image%206.png)
        
- Hoàn thành việc giải lab
    
    ![image.png](NoSQL%20injection/image%207.png)
    

## **Lab: Exploiting NoSQL injection to extract data**

[Lab: Exploiting NoSQL injection to extract data | Web Security Academy](https://portswigger.net/web-security/nosql-injection/lab-nosql-injection-extract-data)

- Trước hết, thực hiện chèn `'` và `\'` thì `'` trả về thông báo lỗi còn `\'` thì không → tiếp tục với biểu thức logic thì với `' && 1 && 'x` trả về user còn `' && 0 &&  x'` thì không ⇒ có NoSQL injection
    - Với payload logic sai:
        
        ![image.png](NoSQL%20injection/image%208.png)
        
    - Với payload logic đúng:
        
        ![image.png](NoSQL%20injection/image%209.png)
        
- Tiếp theo, thử đoán từng ký tự mật khẩu bằng payload sau:
    - Payload
        
        ```jsx
        administrator' && (this.password[0] == 'a') && 'x
        ```
        
    - Config BurpIntruder như sau:
        
        ![image.png](NoSQL%20injection/image%2010.png)
        
        ![image.png](NoSQL%20injection/image%2011.png)
        
        ![image.png](NoSQL%20injection/image%2012.png)
        
    - Kết quả sau khi chạy attack
        
        ![image.png](NoSQL%20injection/image%2013.png)
        
    - Từ đó lấy được `password` là `ngezbgqu` . Thực hiện login và hoàn thành giải lab
        
        ![image.png](NoSQL%20injection/image%2014.png)
        

## **Lab: Exploiting NoSQL operator injection to extract unknown fields**

[Lab: Exploiting NoSQL operator injection to extract unknown fields | Web Security Academy](https://portswigger.net/web-security/nosql-injection/lab-nosql-injection-extract-unknown-fields)

- Trước hết thử chèn payload sau vào tham số `password` thì nhận thấy response thay đổi như sau:
    - Request gửi đi ban đầu:
        
        ![image.png](NoSQL%20injection/image%2015.png)
        
    - Payload
        
        ```jsx
        {"$ne":""}
        ```
        
    - Request gửi đi
        
        ![image.png](NoSQL%20injection/image%2016.png)
        
    - Từ đó suy ra rằng với payload `{"$ne":""}` , chúng ta đã vượt qua được cơ chế kiểm tra mật khẩu. Tuy nhiên, vì tài khoản đã khóa nên không thể vào tài khoản được.
    - Ở đây, việc lấy được password là không có ích nhưng có thể dump trường khác trong bảng.
- Trước hết cần lấy được tên cột. Ở đây, chúng ta thử thêm một câu `where` .
    - Payload với biểu thức đúng
        
        ```jsx
        {"username":"carlos","password":{"$ne":""},"$where":"1"}
        ```
        
    - Response trả về:
        
        ![image.png](NoSQL%20injection/image%2017.png)
        
    - Payload với biểu thức sai
        
        ```jsx
        {"username":"carlos","password":{"$ne":""},"$where":"0"}
        ```
        
        ![image.png](NoSQL%20injection/image%2018.png)
        
    - Câu lệnh khi MongoDB thực hiện truy vấn sẽ như này:
        
        ![image.png](NoSQL%20injection/image%2019.png)
        
- Vì câu lệnh `where` có thể chạy code js nên chúng ta có thể lấy ra thông tin các cột bằng payload sau:
    - Payload (ở đây, chỉ số 0 mặc định là `_id`)
        
        ```jsx
        Object.keys(this)[1]
        ```
        
    - Ở đây, chúng ta xem tiếp chức năng forgot password. Ban đầu, khi chưa thực hiện chức năng này, bảng chỉ có 4 cột (id, username, password và email). Tuy nhiên, MongoDB là một NoSQL nên nó có thể dễ dàng scale theo chiều ngang. Cơ chế việc gửi reset token ở đây chính là tìm username → thêm trường token vào object
        - Payload
            
            ```jsx
            "$where":"Object.keys(this)[4].length==1"
            ```
            
        - Trước khi sử dụng chức năng `forget password`, thì response như sau:
            
            ![image.png](NoSQL%20injection/image%2020.png)
            
        - Sau khi thực hiện chức năng `forget password` , thì response như sau:
            
            ![image.png](NoSQL%20injection/image%2021.png)
            
    - Tiếp theo xác định độ dài tên của cột, sau đó dễ dàng hơn trong việc enum ra tên cột. Ví dụ với cột số 4 như sau:
        - Lấy độ dài tên của cột
            - Payload
                
                ```jsx
                "$where":"Object.keys(this)[4].length==5"
                ```
                
            - Response trả về ⇒ tên cột có 9 ký tự
                
                ![image.png](NoSQL%20injection/image%2022.png)
                
        - Lấy tên cột
            - Payload
                
                ```jsx
                "$where":"Object.keys(this)[4][0]=='a'"
                ```
                
            - Response trả về ⇒ tên cột là `changePwd`
                
                ![image.png](NoSQL%20injection/image%2023.png)
                
- Thực hiện lấy dữ liệu trong cột
    - Payload
        
        ```jsx
        "$where":"this.changePwd[0]=='a'"
        ```
        
        - Response trả về ⇒ token là `081de57cb48fcd51`
        
        ![image.png](NoSQL%20injection/image%2024.png)
        
- Vì trường trong bảng là `changePwd` ⇒ API reset có thể là `GET /forgot-password?changePwd`
- Thực hiện sử dụng token lấy được và gửi đến request trên
    - Response trả về
        
        ![image.png](NoSQL%20injection/image%2025.png)
        
- Thực hiện reset password, login bằng password mới. Hoàn thành giải lab
    
    ![image.png](NoSQL%20injection/image%2026.png)