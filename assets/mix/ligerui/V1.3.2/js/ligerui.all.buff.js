/*
 * @Author : leaf.fly
 * @Create : 2019-03-13
 * @Desc : this is class named IndexController for do IndexController
 * @Version : v1.0.0.20190313
 * @Github : http://github.com/sherlock-help
 * @Blog : http://sherlock.help; http://laiyefei.com
 * @WebSite : http://bakerstreet.club
 */
;(function () {
    $.ligeruiBuff = {
        authentication: function (data) {
            if ("string" == typeof data) {
                data = eval("(" + data + ")");
            }
            var ok = false;
            if (data != undefined) {
                ok = data["ok"];
                if (ok && data["result"] && data["result"]["loginAbout"] && data["result"]["loginAbout"]["url"]) {
                    location.href = data["result"]["loginAbout"]["url"];
                    ok = false;
                }
            }
            return {
                ok: ok
            };
        },
        format: function (data) {

            if ("string" == typeof data) {
                data = eval("(" + data + ")");
            }

            if (!data["result"]) {
                console.error("sorry, this object can not have [result] node.");
                return data;
            }
            if ("string" == typeof data["result"]) {
                return eval("(" + data["result"] + ")");
            }
            return data["result"];
        }
    };
})();