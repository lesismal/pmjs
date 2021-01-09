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
