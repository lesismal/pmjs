// Copyright 2020 lesismal. All rights reserved.
// Use of this source code is governed by an MIT-style
// license that can be found in the LICENSE file.
class PM {
    constructor() {
        this.evts = {};
        this.elems = {};
        this.elemEvts = {};
        this.selEvtPre = '_$pm$sel$evt$';
        this.jsLoaded = {};
    };

    sub(tag, event, handler) {
        let hMap = this.evts[event];
        if (!hMap) {
            hMap = {};
            this.evts[event] = hMap;
        }
        if (hMap[tag]) {
            throw `[sub error] [${event} - ${tag}] already exists`;
        }
        hMap[tag] = { tag: tag, event: event, handler: handler };
    }

    unsub(tag, event) {
        let hMap = this.evts[event];
        if (!hMap) {
            return;
        }
        if (hMap[tag]) {
            delete hMap[tag];
        }
    }

    pub(event, data) {
        let hMap = this.evts[event];
        for (let k in hMap) {
            let h = hMap[k];
            h && h.handler({ 'tag': h.tag, 'name': event, 'data': data });
        }
    }

    element(id) {
        let ele = this.elems[id];
        if (!ele) {
            ele = document.getElementById(id);
            this.elems[id] = ele;
        }
        return ele;
    }

    bind(id, event, handler) {
        let self = this;
        let evts = self.elemEvts[id];
        if (!evts) {
            evts = {};
            self.elemEvts[id] = evts;
        }
        evts[event] = true;

        self.sub(id, event, function (e) {
            handler({ 'element': self.element(id), 'event': event, 'data': e.data });
        });
    }

    unbind(id, event) {
        let evts = this.elemEvts[id];
        if (evts) {
            this.unsub(id, event);
            if (evts[event]) {
                delete (evts[event]);
                if (Object.getOwnPropertyNames(evts).length == 0) {
                    delete (this.elemEvts[id]);
                }
            }
        }
    }

    unbindAll(id) {
        let self = this;
        let events = this.elemEvts[id];
        if (events) {
            for (let event in events) {
                self.unsub(id, event);
            }
            delete (this.elems[id]);
            delete (this.elemEvts[id]);
        }
    }

    bindPages(pages, parent) {
        if (!(pages instanceof Array)) return;

        let self = this;
        let _selected = false;
        for (let i = 0; i < pages.length; i++) {
            let page = pages[i];
            let src = page.src;
            let dst = page.dst;
            let preOnclick;
            let onselect = function (e) {
                if (_selected == dst) return;
                let pre = _selected;
                let f = (typeof (e.data) == 'function') ? e.data : undefined;
                preOnclick && preOnclick();
                for (let j in pages) {
                    let p = pages[j];
                    let dElem = self.element(p.dst);
                    if (p.dst == dst) {
                        let pid = parent;
                        if (page.parent) {
                            pid = page.parent;
                        }
                        pid && self.select(pid);
                        dElem.style.display = 'block';
                        _selected = p;
                        if (!page.inited) {
                            page.inited = true;
                            if (page.url && !page.urlInited) {
                                page.urlInited = true;
                                self.loadHTML(dst, page.url).then(function () {
                                    page.init && page.init(page);
                                    f && f(page);
                                    page.onshow && page.onshow(page);
                                });
                            } else {
                                page.init && page.init(page);
                                f && f(page);
                                page.onshow && page.onshow(page);
                            }
                        } else {
                            f && f(page);
                            page.onshow && page.onshow(page);
                        }
                    } else {
                        dElem.style.display = 'none';
                        p.onhide && pre == p && p.onhide(pages[j]);
                    }
                }
            }
            if (src) {
                let sElem = self.element(src);
                preOnclick = sElem.onclick;
                sElem.onclick = onselect;
                let selEvt = `${self.selEvtPre}${src}`;
                self.sub(selEvt, selEvt, onselect);
            }
            let selEvt = `${self.selEvtPre}${dst}`;
            self.sub(selEvt, selEvt, onselect);

            if (!page.inited) {
                if (!page.url) {
                    page.inited = true;
                    page.init && page.init(page);
                } else if (!page.urlInited && !page.lazy) {
                    page.inited = true;
                    page.urlInited = true;
                    self.loadHTML(dst, page.url).then(function () {
                        page.init && page.init(page);
                    });
                }
            }
            self.bindPages(page.children, src);
        }
    }

    select(targetID, data) {
        let selEvt = `${this.selEvtPre}${targetID}`;
        this.pub(selEvt, data);
    }

    release(page) {
        if (page && page.dst) {
            this.element(page.dst).innerHTML = "";
            page.inited = false;
            page.urlInited = false;
        }
    }

    ready(f) {
        if (f && (typeof window !== "undefined")) {
            let pre = window.onload;
            window.onload = function () {
                pre && pre();
                f();
            }
        }
    }

    loadHTML(id, url, cb) {
        let self = this;
        return self.request("GET", url, null, function (res) {
            if (res.code == 200) {
                self.element(id).innerHTML = res.data;
            }
            (typeof (cb) == "function") && cb(res);
        })
    };

    loadJS(url, cb) {
        if (this.jsLoaded[url]) {
            return;
        }
        this.jsLoaded[url] = true;
        let jsElem = document.createElement("script");
        jsElem.type = 'text/javascript';
        jsElem.src = url;
        jsElem.async = true;
        jsElem.onload = cb;
        document.getElementsByTagName("body")[0].appendChild(jsElem);
    }

    request(method, url, data, cb) {
        let resolve;
        let p = new Promise(function (res) {
            resolve = res;
            if (typeof (cb) == 'function') {
                resolve = function (ret) {
                    res(ret);
                    cb(ret);
                }
            }
            let r = new XMLHttpRequest();
            r.open(method, url, true);
            r.onreadystatechange = function () {
                if (r.readyState != 4) {
                    return;
                }
                if (r.status != 200) {
                    resolve({ code: r.status, data: null, err: `request "${url}" failed with status code ${r.status}` });
                    return;
                }
                resolve({ code: r.status, data: r.responseText, err: null });
            };
            r.send(data);
        });
        return p;
    }
}

if ((typeof window !== "undefined") && !window["$pm"]) {
    window["$pm"] = new PM();
}

if ((typeof module !== "undefined")) {
    module.exports = new PM();
}
