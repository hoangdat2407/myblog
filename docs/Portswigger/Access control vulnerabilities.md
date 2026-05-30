# Access control vulnerabilities

# **Lab: Unprotected admin functionality**

[Lab: Unprotected admin functionality | Web Security Academy](https://portswigger.net/web-security/access-control/lab-unprotected-admin-functionality)

- Trước hết, thử kiểm tra path `robots.txt`. Quan sát thấy có path `/administrator-panel`
    
    ![image.png](Access%20control%20vulnerabilities/image.png)
    
- Sau đó, thực hiện truy cập vào đường dẫn trên. Quan sát truy cập được vào giao diện của role admin
    
    ![image.png](Access%20control%20vulnerabilities/image%201.png)
    
- Thực hiện xóa user `carlos`. Nhận thấy xóa users thành công. Hoàn thành giải lab
    
    ![image.png](Access%20control%20vulnerabilities/image%202.png)
    

# **Lab: Unprotected admin functionality with unpredictable URL**

[Lab: Unprotected admin functionality with unpredictable URL | Web Security Academy](https://portswigger.net/web-security/access-control/lab-unprotected-admin-functionality-with-unpredictable-url)

- Thực hiện kiểm tra mã nguồn có lộ lọt thông tin (sử dụng `Ctrl+U`). Tại đây, nhận thấy trong js có chứa path ẩn `/admin-p00sr7`
    
    ![image.png](Access%20control%20vulnerabilities/image%203.png)
    
- Thực hiện truy cập vào path trên. Nhận thấy path trên là giao diện của role admin
    
    ![image.png](Access%20control%20vulnerabilities/image%204.png)
    
- Thực hiện xóa user. Quan sát thấy xóa thành công. Hoàn thành việc giải lab
    
    ![image.png](Access%20control%20vulnerabilities/image%205.png)
    

# **Lab: User role controlled by request parameter**

[Lab: User role controlled by request parameter | Web Security Academy](https://portswigger.net/web-security/access-control/lab-user-role-controlled-by-request-parameter)

- Trước hết thực hiện login bằng account `wiener:peter`. Sau khi đăng nhập thành công, quan sát thấy trong cookie có 1 trường là `Admin` đang đặt là `false` → có thể là cơ chế kiểm tra role trên browser
    
    ![image.png](Access%20control%20vulnerabilities/image%206.png)
    
- Trong lab đã cho sẵn chúng ta path admin panel `/admin`. Thực hiện truy cập thì không vào được bằng account `wiener`
    
    ![image.png](Access%20control%20vulnerabilities/image%207.png)
    
- Thực hiện thay đổi trường `Admin` này thành `true`.  Quan sát thấy có thể truy cập vào admin panel thành công
    
    ![image.png](Access%20control%20vulnerabilities/image%208.png)
    
- Thực hiện xóa `carlos` thành công. Hoàn thành việc giải lab
    
    ![image.png](Access%20control%20vulnerabilities/image%209.png)
    

# **Lab: User role can be modified in user profile**

[Lab: User role can be modified in user profile | Web Security Academy](https://portswigger.net/web-security/access-control/lab-user-role-can-be-modified-in-user-profile)

- Thực hiện login vào account `wiener:peter`.
- Thực hiện truy cập vào admin panel
    
    ![image.png](Access%20control%20vulnerabilities/image%2010.png)
    
- Tại trang `my-account`, thực hiện update email. Trong phần mềm burpsuite, thực hiện quan sát response của request gửi tới API `POST /my-account/change-email`. Trong response có chứa trường `roleid`. Như vậy, chúng ta cần kiểm tra xem có mass assignment ở đây không.
    
    ![image.png](Access%20control%20vulnerabilities/image%2011.png)
    
- Thực hiện chuyển request trên sang tab Repeater. Thực hiện thêm trường `roleid` và thay đổi giá trị thành 2 (vì trong lab có nói roleid bằng 2 sẽ vào được admin panel).
    
    ![image.png](Access%20control%20vulnerabilities/image%2012.png)
    
- Thực hiện quay lại giao diện và truy cập admin panel. Nhận thấy truy cập thành công
    
    ![image.png](Access%20control%20vulnerabilities/image%2013.png)
    
- Thực hiện xóa user `carlos`. Hoàn thành giải lab
    
    ![image.png](Access%20control%20vulnerabilities/image%2014.png)
    

# **Lab: User ID controlled by request parameter**

[Lab: User ID controlled by request parameter | Web Security Academy](https://portswigger.net/web-security/access-control/lab-user-id-controlled-by-request-parameter)

- Thực hiện login vào account `wiener:peter`. Quan sát trên url có query `id=wiener`. Thử thực hiện thay đổi trường này liệu có thể xem được API key user khác (carlos) hay không
    
    ![image.png](Access%20control%20vulnerabilities/image%2015.png)
    
- Sau khi thay đổi id, lấy được API key của `carlos`. Thực hiện submit và giải lab thành công
    
    ![image.png](Access%20control%20vulnerabilities/image%2016.png)
    

# **Lab: User ID controlled by request parameter, with unpredictable user IDs**

[Lab: User ID controlled by request parameter, with unpredictable user IDs | Web Security Academy](https://portswigger.net/web-security/access-control/lab-user-id-controlled-by-request-parameter-with-unpredictable-user-ids)

- Thực hiện login vào account của `wiener:peter`. Tại trang my-account quan sát thấy API key của `wiener`. Tuy nhiên thì tại query `id` là một giá trị không thể đoán được.
    
    ![image.png](Access%20control%20vulnerabilities/image%2017.png)
    
- Trang web có 1 số blog. Và khi xem blog thì có tên người dùng trong đó có userid người dùng đó
    
    ![image.png](Access%20control%20vulnerabilities/image%2018.png)
    
- Thực hiện lấy uid kia và quan sát thấy lấy API key của `carlos` thành công
    
    ![image.png](Access%20control%20vulnerabilities/image%2019.png)
    
- Thực hiện submit và hoàn thành lab
    
    ![image.png](Access%20control%20vulnerabilities/image%2020.png)
    

# **Lab: User ID controlled by request parameter with data leakage in redirect**

[Lab: User ID controlled by request parameter with data leakage in redirect | Web Security Academy](https://portswigger.net/web-security/access-control/lab-user-id-controlled-by-request-parameter-with-data-leakage-in-redirect)

- Thực hiện đăng nhập vào tài khoản `wiener:peter`. Tại trang account, thực hiện quan sát thấy query id là wiener và xem được API key của wiener.
- Thử thực hiện thay id bằng id user khác (carlos). Quan sát thấy trang web bị chuyển hướng về trang `/login`
    
    ![image.png](Access%20control%20vulnerabilities/image%2021.png)
    
- Tuy nhiên, thông thường với response 302 redirect thì chỉ có phần header mà ít khi có body → liệu response có chứa thông tin như API key. Quan sát thấy có API key của `carlos`\
    
    ![image.png](Access%20control%20vulnerabilities/image%2022.png)
    
- Thực hiện submit API key và hoàn thành lab
    
    ![image.png](Access%20control%20vulnerabilities/image%2023.png)
    

# **Lab: Insecure direct object references**

[Lab: Insecure direct object references | Web Security Academy](https://portswigger.net/web-security/access-control/lab-insecure-direct-object-references)

- Thực hiện truy cập vào chức năng live chat. Tại đây, quan sát thấy có chức năng `View transcript`. Thực hiện chức năng
    
    ![image.png](Access%20control%20vulnerabilities/image%2024.png)
    
- Khi thực hiện chức năng `View transcipt`, quan sát trong phần mềm burpsuite thấy request gửi đến API `GET /download-transcript/3.txt` có tên file dễ đoán → thực hiện đọc các file khác
    
    ![image.png](Access%20control%20vulnerabilities/image%2025.png)
    
- Thực hiển chuyển request gửi đến API `GET /download-transcript/3.txt` sang tab intruder, thực hiện kiểm tra file 1→100. Quan sát thấy có file `1.txt` có password
    
    ![image.png](Access%20control%20vulnerabilities/image%2026.png)
    
- Thực hiện đăng nhập account `carlos` với password `vwi8fwxcel8w34op0rv2` thành công
    
    ![image.png](Access%20control%20vulnerabilities/image%2027.png)
    
- Thành công giải lab
    
    ![image.png](Access%20control%20vulnerabilities/image%2028.png)
    

# **Lab: URL-based access control can be circumvented**

[Lab: URL-based access control can be circumvented | Web Security Academy](https://portswigger.net/web-security/access-control/lab-url-based-access-control-can-be-circumvented)

- Thực hiện truy cập vào trang admin panel. Nhận thấy người dùng đã bị chặn
    
    ![image.png](Access%20control%20vulnerabilities/image%2029.png)
    
- Tuy nhiên đề bài có cho biết backend sử dụng header `X-Original-URL` . Ở đây là bài viết về header này có thể sẽ rewrite path ([URL rewrite vulnerability - Vulnerabilities - Acunetix](https://www.acunetix.com/vulnerabilities/web/url-rewrite-vulnerability/))
- Thực hiện bắt một request mà người dùng thường có thể truy cập vào (ví dụ request tới API `/product`). Thêm header `X-Original-URL` như sau và quan sát thấy giao diện admin được trả về
    
    ![image.png](Access%20control%20vulnerabilities/image%2030.png)
    
- Thưc hiện thay đổi `X-Original-URL` với path là path xóa user như sau. Quan sát thấy response báo thiếu param → có lẽ là cơ chế chỉ rewrite path nên sẽ bỏ query nên chúng ta có thể truyển query trên path của request như sau và thực hiện gửi request. Quan sát response trả về xóa user thành công.
    
    ![image.png](Access%20control%20vulnerabilities/image%2031.png)
    
- Mô hình lab có thể như sau
    
    ![image.png](Access%20control%20vulnerabilities/image%2032.png)
    

# **Lab: Multi-step process with no access control on one step**

[Lab: Multi-step process with no access control on one step | Web Security Academy](https://portswigger.net/web-security/access-control/lab-multi-step-process-with-no-access-control-on-one-step)

- Thực hiện vào account của admin. Thực hiện chức năng upgrade người dùng. Quan sát thấy sẽ có 2 request để thực hiện chức năng này
    
    ![image.png](Access%20control%20vulnerabilities/image%2033.png)
    
    ![image.png](Access%20control%20vulnerabilities/image%2034.png)
    
- Tuy nhiên, khi chỉ cần gửi request thứ 2 là có thể thành công upgrade user. Ngoài ra, phía backend không kiểm tra phân quyền nên user thường khi gửi request thứ 2 cũng có thể upgrade thành công
- Thực hiện login với acc `wiener:peter` . Giữ lại session trả về
    
    ![image.png](Access%20control%20vulnerabilities/image%2035.png)
    
- Thưc hiện sử dụng session đã lưu ở bước trên, thay thế vào request upgrade như sau. Quan sát upgrade thành công và hoàn thành lab
    
    ![image.png](Access%20control%20vulnerabilities/image%2036.png)
    
    ![image.png](Access%20control%20vulnerabilities/image%2037.png)
    

# **Lab: Referer-based access control**

[Lab: Referer-based access control | Web Security Academy](https://portswigger.net/web-security/access-control/lab-referer-based-access-control)

- Thực hiện truy cập vào admin panel. Tại đây thực upgrade user bất kỳ.
    
    ![image.png](Access%20control%20vulnerabilities/image%2038.png)
    
- Trong phần mềm burpsuite, bắt và chuyển request gửi tới API `GET /admin-roles?username=wiener&action=upgrade` .
- Thực hiện đăng nhập với account `wiener:peter`.  Lưu lại session của user wiener
    
    ![image.png](Access%20control%20vulnerabilities/image%2039.png)
    
- Thực hiện thay đổi request gửi tới API `GET /admin-roles?username=wiener&action=upgrade` bằng cách thay session đã lưu ở bước trước như sau:
    
    ![image.png](Access%20control%20vulnerabilities/image%2040.png)
    
- Quan sát thấy leo quyền thành công. Lab đã được giải
    
    ![image.png](Access%20control%20vulnerabilities/image%2041.png)