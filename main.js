var webdriverjs = require("webdriverjs");
// var client = webdriverjs.remote({
    // host: "localhost",
    // port:"4444",
    // desiredCapabilities:{
        // browserName:"firefox"
    // }
// });
var client = webdriverjs.remote({
    host: "se.ensighten.com",
    port:"4444",
    desiredCapabilities:{
        browserName:"firefox"
    }
});
// console.log(webdriverjs)
// var client = webdriverjs.remote({host: "xx.xx.xx.xx"}); // to run it on a remote webdriver/selenium server
// var client = webdriverjs.remote({desiredCapabilities:{browserName:"chrome"}}); // to run in chrome
 
client
    .init()
    .url("https://github.com/")
    .getElementSize("id", "header", function(result){ console.log(result);  })
    .getTitle()
    .getElementCssProperty("id", "header", "color", function(result){ console.log(result);  })
    .end();