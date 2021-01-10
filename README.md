# PM - Page Manager, Make Native Fastest!

- **Help To Build Single-Page App**

## Features
- [x] Manage Multi-HTML-Sub-Pages In One HTML-Page
- [x] Changing Page Without Changing Routers
- [x] Async Loading HTML/JS
- [x] Event Management, Pub/Sub
- [x] JS/TS Supported

## Implementation

1. '$pm.bindPages' from a config.
2. get an HTML-SUB-PAGE immediately if it is not lazy, else get it when selected, and then set the dst element.innerHTML by the content.
3. control page display or hide by setting the dst element.style.display="block"/"none", then '$pm.select(src/dst id)' to change page, without change routers.

## Examples

- [bind pages](https://github.com/lesismal/pm/tree/master/examples/bind_dst)

- [bind pages and click](https://github.com/lesismal/pm/tree/master/examples/bind_src_dst)

- [pub/sub - bind element and event](https://github.com/lesismal/pm/blob/master/examples/element.html)

## Quic Start

> js

>> pm.js

> page

>> page_1.html

>> page_2.html

> index.html

```html
<!-- index.html -->
<!DOCTYPE html>
<html>

<head>
    <title>PM JS</title>
    <script src="js/pm.js" type="text/javascript"></script>
    <style>
        .pm_hide {
            display: none;
        }
    </style>
</head>

<body>
    <!-- dst element page_1, default page to show -->
    <div id="page_1"></div>

    <!-- dst element page_2, default to hide this page -->
    <div id="page_2" class="pm_hide"></div>

    <script>
        let pages = [
            {
                // dst element id/page element id
                dst: "page_1",
                // sub-html-page, which would be loaded to dst element.innerHTML
                url: "page/page_1.html",
                // init will be called when the page is loaded, if there's not an url, it will be called immediately
                init: function (page) {
                    console.log("page_1 init");
                },
                // onshow will be called every time when this page is displayed
                onshow: function (page) {
                    console.log("page_1 onshow");
                },
                // onshow will be called every time when this page is hided
                onhide: function (page) {
                    console.log("page_1 onhide");
                },
            },
            {
                dst: "page_2",
                url: "page/page_2.html",
                lazy: true,
                init: function (page) {
                    console.log("page_2 init");
                },
                onshow: function (page) {
                    console.log("page_2 onshow");
                },
                onhide: function (page) {
                    console.log("page_2 onhide");
                    // release this page when hided, then reload this page every time
                    $pm.release(page);
                }
            },
            // many pages ...
        ];
        $pm.bindPages(pages);

        let i = 0;
        setInterval(function () {
            i++;
            // change a page to display, and hide others
            let nextDisplay = pages[i % pages.length].dst;
            $pm.select(nextDisplay);
        }, 1000);
    </script>
</body>

</html>
```