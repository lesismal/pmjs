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
        // onload will be called every time when this page url is loaded
        onload: function (page) {
            console.log("page_1 onload");
        },
         // onshow will be called every time when this page is displayed
        onshow: function (page) {
            console.log("page_1 onshow");
        },
        // onshow will be called every time when this page is hided
        onhide: function (page) {
            console.log("page_1 onhide");
        },
        // bind children
        children: [],
    },
    {
        dst: "page_2",
        url: "page/page_2.html",
        lazy: true,
        init: function (page) {
            console.log("page_2 init");
        },
        // onload will be called every time when this page url is loaded
        onload: function (page) {
            console.log("page_2 onload");
        },
        onshow: function (page) {
            console.log("page_2 onshow");
        },
        onhide: function (page) {
            console.log("page_2 onhide");
        }
    },
    // many pages ...
];
$pm.bindPages(pages);
// $pm.select("page_1");
$pm.listenRouter();

let i = 0;
setInterval(function () {
    i++;
    // change a page to display, and hide others
    let nextDisplay = pages[i % pages.length].src;
    // or
    // let nextDisplay = pages[i % pages.length].dst;
    $pm.select(nextDisplay);
}, 5000);