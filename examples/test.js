const pm = require("../js/pm");

pm.sub("aaa", "e", function (e) {
    console.log("--- aaa:", e.tag, e.name, e.data);
});

pm.sub("bbb", "e", function (e) {
    console.log("--- bbb:", e.tag, e.name, e.data);
});

pm.pub("e", "xxx");
pm.pub("e", "yyy");
pm.pub("e", "zzz");