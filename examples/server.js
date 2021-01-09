const fs = require("fs");
const http = require("http");

function serveDir(dir) {
    return function (req, res) {
        let url = req.url;
        if (url == "/") {
            url = "index.html"
        }
        fs.createReadStream(dir + url).pipe(res);
    }
}

http.createServer(serveDir("./bind_dst/")).listen(8080);
http.createServer(serveDir("./bind_src_dst/")).listen(8081);