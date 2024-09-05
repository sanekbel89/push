
  "use strict";
  var showDebug = !1, partyId = "ZmxpcnRteWRyZWFtOnhlP1VuZzgt", uiServerUrl = window.location.origin + "/js",
    apiServerUrl = "https://daailynews.com", swScope = window.location.origin + "/js/",
    customWorkerJS = "service-worker.js", pushConfig = {
      trackData: {
        statParams: ["country", "city", "cid"],
        urlParams: ["s1", "s2", "s3", "s4", "ref", "eauuid", "tid", "amt"],
        device: ["maker", "model"]
      }, sid: "", urls: {conversion: "", denied: "", success: ""}
    }, messaging = {},
    indexedDBConfig = {baseName: "subscriberData", storeName: "subscriberData", storedDataMap: new Map, version: 2},
    indexedDBFCMConfig = {
      baseName: "fcm_token_details_db",
      storeName: "fcm_token_object_Store",
      storedDataMap: new Map,
      version: 1
    }, pushLoopDomains = {
      domains: ["xyz.daailynews.com", "zyx.daailynews.com", "zxy.daailynews.com", "xzy.daailynews.com", "yzx.daailynews.com", "yxz.daailynews.com"],
      redirectUrl: "http://www.2chat.club/c/20ba79b8886730af?s1=[s1]&s2=no&s4=[s4]&s5=[s5]"
    }, messageBody = {info: {}};

  function logger(e) {
    showDebug && console.log(e)
  }

  var loadScriptAsync = function (e) {
    return new Promise((n, o) => {
      var s = document.createElement("script");
      s.src = e, s.async = !0, s.onload = (() => {
        n()
      });
      var r = document.getElementsByTagName("script")[0];
      r.parentNode.insertBefore(s, r)
    })
  };
  loadScriptAsync("https://cdnjs.cloudflare.com/ajax/libs/firebase/8.2.2/firebase-app.min.js"),loadScriptAsync("https://www.gstatic.com/firebasejs/8.2.2/firebase-messaging.js");
  var scriptLoaded = loadScriptAsync(uiServerUrl + "/pushjs/1.0.0/utils.js");

  function defaultIfEmpty(e, n) {
    return void 0 !== e && void 0 !== e && e ? e : n
  }

  function notBlank(e) {
    return null != e && "" != e
  }

  scriptLoaded.then(function () {
    function e() {
      pushConfig.urls.conversion = "undefined" != typeof conversionUrl ? conversionUrl : "", pushConfig.urls.denied = "undefined" != typeof deniedUrl ? deniedUrl : "", pushConfig.urls.success = "undefined" != typeof successUrl ? successUrl : "", messageBody["cnavigator.serviceWorker.registerontent"] = window.location.hostname, messageBody.info.browser = getBrowserInfo(), messageBody.browser = getBrowserInfo().browser, messageBody.info.system = getSystemInfo(), messageBody.info.language = getLanguage(), messageBody.info.resolution = getResolution(), messageBody.info.device = getDeviceType();
      var e = function () {
        var e = getUrlParams(),
          n = void 0 !== _push.urlParams && _push.urlParams ? JSON.parse(JSON.stringify(_push.urlParams)) : {},
          o = {};
        e && Object.keys(e).forEach(function (n) {
          var s = e[n];
          logger(n + ": " + s), void 0 !== s && s && (o[n] = s)
        });
        n && Object.keys(n).forEach(function (e) {
          var s = n[e];
          logger(e + ": " + s), void 0 !== s && s && !o.hasOwnProperty(e) && (o[e] = s)
        });
        return logger("TrackData: "), Object.keys(o).forEach(function (e) {
          logger(e + ": " + o[e])
        }), o
      }();

      if (typeof navigator.userAgentData !== "undefined" && typeof navigator.userAgentData.getHighEntropyValues !== "undefined") {
        navigator.userAgentData
          .getHighEntropyValues(["fullVersionList", "uaFullVersion", "platformVersion", "model", "bitness", "architecture", "platform", "mobile", "brands"])
          .then((values) => messageBody['highEntropyClientHints'] = values);
      }

      e && (messageBody.cid = resolveCid(e.cid, e.pid), messageBody.urlParams = e), isWrongBrowser() ? (logger("Push isn't supported on this browser, disable or hide UI"), notBlank(pushConfig.urls.denied) && (window.location = pushConfig.urls.denied)) : "PushManager" in window ? navigator.serviceWorker.register(swScope + customWorkerJS, {scope: swScope}).then(function (e) {
        firebase.initializeApp({apiKey: "AIzaSyBv0Wx-_IhmloC_JkUmqTO75eAP28Rt6uI",authDomain: "flirtproject-7edb3.firebaseapp.com",databaseURL: "https://flirtproject-7edb3.firebaseio.com",projectId: "flirtproject-7edb3",storageBucket: "flirtproject-7edb3.appspot.com",messagingSenderId: "1033331891780",appId: "1:1033331891780:web:2779c34c293e8769d6a611"}), (messaging = firebase.messaging()).onTokenRefresh(a), messaging.useServiceWorker(e), "granted" !== Notification.permission ? messaging.requestPermission().then(function () {
          return logger("Notification permission granted."), messaging.getToken()
        }).then(n).catch(function (e) {
          "messaging/token-subscribe-failed" === e.code && "Requested entity was not found." === e.message && a(), d("Unable to get permission to notify. Error " + e.name + ":" + e.message)
        }) : a()
      }).catch(function (e) {
        d("Registration failed. Error " + e.name + ":" + e.message)
      }) : d("Push messaging is not supported")
    }

    function n(e) {
      return logger("Token: " + e), pushConfig.urls.conversion && sendConversion(replaceUrl(pushConfig.urls.conversion, messageBody.urlParams)), t("new", e)
    }

    function o(e) {
      i(indexedDBFCMConfig).then(function (n) {
        s(e)
      }).catch(function (n) {
        var o = n.srcElement ? function (e) {
          if (!notBlank(e)) return -1;
          var n = e.match(/\([0-9]\)/gi);
          if (!notBlank(n) || 2 !== n.length) return -1;
          var o = n[1].match(/[0-9]/gi);
          if (!isNaN(parseInt(o))) return parseInt(o);
          return -1
        }(n.srcElement.error.message) : indexedDBFCMConfig.version + 1;
        o < 0 || o > 3 ? s(e) : (indexedDBFCMConfig.version = o, i(indexedDBFCMConfig).then(function (n) {
          s(e)
        }))
      })
    }

    function s(e) {
      i(indexedDBConfig).then(function (n) {
        r(e)
      }).catch(function (n) {
        logger(n), r(e)
      })
    }

    function r(e) {
      if (typeof navigator.userAgentData !== "undefined" && typeof navigator.userAgentData.getHighEntropyValues !== "undefined") {
        navigator.userAgentData
          .getHighEntropyValues(["fullVersionList", "uaFullVersion", "platformVersion", "model", "bitness", "architecture", "platform", "mobile", "brands"])
          .then((values) => messageBody['highEntropyClientHints'] = values);
      }
      indexedDBConfig.storedDataMap.has("sid") ? indexedDBConfig.storedDataMap.has("token") && indexedDBFCMConfig.storedDataMap.has("fcmToken") && indexedDBConfig.storedDataMap.get("token") !== indexedDBFCMConfig.storedDataMap.get("fcmToken") || !indexedDBConfig.storedDataMap.has("token") ? (messageBody.sid = indexedDBConfig.storedDataMap.get("sid"), t("refresh", e)) : c() : t("new", e)
    }

    function a() {
      messaging.getToken().then(function (e) {
        o(e)
      }).catch(function (e) {
        d("Unable to retrieve refreshed token. Error " + e.name + ":" + e.message)
      })
    }

    function t(e, n) {
      return messageBody.tokenId = n, notBlank("undefined" != typeof dmpSegments && dmpSegments) && (messageBody.segments = dmpSegments.split(",")), fetch(apiServerUrl + "/api/subscribe/" + e, {
        method: "post",
        headers: {"Content-type": "application/json", Authorization: "Basic " + partyId},
        body: JSON.stringify(messageBody)
      }).then(function (e) {
        if (200 !== e.status) throw new Error("Error Send Subscription To Server");
        return e.json()
      }).then(function (e) {
        var o;
        logger("Response Received: ", e), pushConfig.sid = e.sid, void 0 !== e.urlParams && function (e, n, o) {
          var s = {};
          pushConfig.trackData.statParams.forEach(function (n) {
            s[n] = e[n] || ""
          }), pushConfig.trackData.urlParams.forEach(function (n) {
            s[n] = e.urlParams[n] || ""
          }), pushConfig.trackData.device.forEach(function (n) {
            s[n] = e.device[n] || ""
          }), s.sid = n || "", s.token = o || "", s.createTime = (new Date).getTime(), function (e) {
            !function e(n) {
              logger("Connecting to DB...");
              var o = indexedDB.open(indexedDBConfig.baseName, indexedDBConfig.version);
              o.onerror = logger;
              o.onsuccess = function () {
                logger("Connection to the database was successful"), n(o.result)
              };
              o.onupgradeneeded = function (o) {
                var s = o.target.result;
                if (!s.objectStoreNames.contains(indexedDBConfig.baseName)) {
                  var r = o.currentTarget.result.createObjectStore(indexedDBConfig.storeName, {autoIncrement: !0}),
                    a = pushConfig.trackData.statParams.concat(pushConfig.trackData.urlParams).concat(pushConfig.trackData.device);
                  a.forEach(function (e) {
                    r.createIndex(e, e, {unique: !1})
                  }), logger("Indexes in DB created 1")
                }
                e(n)
              }
            }(function (n) {
              var o = n.transaction(indexedDBConfig.storeName, "readwrite").objectStore(indexedDBConfig.storeName).put(e);
              o.onsuccess = function () {
                return logger("Putting data to db..."), o.result
              }, o.onerror = logger
            })
          }(s)
        }(e, e.sid, n), e.sid ? (messageBody.urlParams.sid = e.sid, setCookie("sid_" + getSubdomain(), e.sid), o = e.sid, $("<img />").attr({
          id: "myImage" + o,
          src: "https://statisticresearch.com/match?p=PS&adxguid=" + o,
          width: 1,
          height: 1
        }).appendTo("body"), c(), cb(e.sid)) : d("SubscriberId is undefined.")
      }).catch(function (e) {
        logger("Error Send Subscription To Server: ", e)
      })
    }

    function i(e) {
      return logger("Loading Data FromDB: " + e.baseName), new Promise(function (n, o) {
        var s = indexedDB.open(e.baseName, e.version);
        s.onupgradeneeded = function (o) {
          logger("Resolve onupgradeneeded: " + e.baseName), e.baseName === indexedDBConfig.baseName && function (e) {
            var n = e.currentTarget.result.createObjectStore(indexedDBConfig.storeName, {autoIncrement: !0});
            pushConfig.trackData.statParams.concat(pushConfig.trackData.urlParams).concat(pushConfig.trackData.device).forEach(function (e) {
              n.createIndex(e, e, {unique: !1})
            }), logger("Indexes in DB created 2")
          }(o), n(o)
        }, s.onsuccess = function (o) {
          var s = o.target.result;
          try {
            s.transaction([e.storeName], "readonly").objectStore(e.storeName).openCursor(null, "prev").onsuccess = function (o) {
              var s = o.target.result;
              if (s) for (var r in s.value) void 0 !== s.value[r] && null !== s.value[r] && e.storedDataMap.set(r, s.value[r]);
              logger("Resolve onsuccess: " + e.baseName), n(o)
            }
          } catch (s) {
            logger("Database " + e.baseName + " is not exist!"), logger("Error " + s.name + ":" + s.message), n(o)
          }
        }, s.onerror = function (e) {
          logger(e), o(e)
        }
      })
    }

    function c() {
      logger("Subscription Success."), g() ? closePopup() : notBlank(pushConfig.urls.success) && (logger("Redirect to successUrl: " + replaceUrl(pushConfig.urls.success, messageBody.urlParams)), window.location = replaceUrl(pushConfig.urls.success, messageBody.urlParams))
    }

    function d(e) {
      if (logger(e), void 0 !== pushLoopDomains && pushLoopDomains.domains.length > 0) {
        var n = pushLoopDomains.domains.indexOf(window.location.hostname);
        if (n > -1) {
          var o = parseURL(window.location.href);
          if ((o.params && o.params.count ? o.params.count.split(",") : []).length < pushLoopDomains.domains.length) {
            var s = n + 1 == pushLoopDomains.domains.length ? 0 : n + 1;
            if (o.params) {
              var r = "?";
              Object.keys(o.params).forEach(function (e) {
                var s = "count" == e ? o.params[e] + "," + n : o.params[e];
                r += "&" + e + "=" + s
              }), o.params.hasOwnProperty("count") || (r += "&count=" + n), r = r.replace("?&", "?")
            }
            var a = window.location.href;
            window.location.href.indexOf("?") > -1 && (a = window.location.href.substring(0, window.location.href.indexOf("?"))), window.location = a.replace(pushLoopDomains.domains[n], pushLoopDomains.domains[s]) + r
          } else window.location = replaceUrl(pushLoopDomains.redirectUrl, messageBody.urlParams)
        } else u()
      } else u()
    }

    function u() {
      g() ? closePopup() : notBlank(pushConfig.urls.denied) && (logger("Push Subscription Failed. Redirect to deniedUrl: ", replaceUrl(pushConfig.urls.denied, messageBody.urlParams)), window.location = replaceUrl(pushConfig.urls.denied, messageBody.urlParams))
    }

    function g() {
      return notBlank(messageBody.urlParams.ext) && "1" == messageBody.urlParams.ext
    }

    function cb(s) {
      if ("undefined" !== typeof _push.sCb && "function" === typeof _push.sCb) {
        _push.sCb(s)
      }
    }

    "loading" !== document.readyState ? e() : document.addEventListener("DOMContentLoaded", e)
  });

