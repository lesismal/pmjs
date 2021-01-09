let pages = [
    {
        // src element id, when the element.onclick is called, or $pm.select(src), this dst element will be display, and other pages's dst element will be hide.
        src: "page_1_src",
        // dst element id/page element id
        dst: "page_1_dst",
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
        // bind children
        children: [],
    },
    {
        src: "page_2_src",
        dst: "page_2_dst",
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
        }
    },
    // many pages ...
];
$pm.ready(function () {
    $pm.bindPages(pages);
});

let i = 0;
setInterval(function () {
    i++;
    // change a page to display, and hide others
    let nextDisplay = pages[i % pages.length].src;
    // or
    // let nextDisplay = pages[i % pages.length].dst;
    $pm.select(nextDisplay);
}, 5000);