window.__DVC = window.__DVC || {};
// 全局transform方法
(function(DVC) {

    var browser = (function() {
        var userAgent, browser, reg;
        return userAgent = navigator.userAgent.toLowerCase(), (reg = userAgent.match(/rv:([\d.]+)\) like gecko/)) && (browser = ["ie", reg[1]]), (reg = userAgent.match(/msie ([\d.]+)/)) && (browser = ["ie", reg[1]]), (reg = userAgent.match(/chrome\/([\d.]+)/)) && (browser = ["chrome", reg[1]]), (reg = userAgent.match(/firefox\/([\d.]+)/)) && (browser = ["firefox", reg[1]]), (reg = userAgent.match(/opera.([\d.]+)/)) && (browser = ["opera", reg[1]]), (reg = userAgent.match(/version\/([\d.]+).*safari/)) && (browser = ["safari", reg[1]]), (reg = userAgent.match(/micromessenger\/([\d.]+)/)) && (browser = ["weixin", reg[1]]),
            browser;
    })();
    if (!browser) {
        browser = ["ie", "10.0"];
    }
    browserType = browser[0];
    DVC.transform = {
        enableAnimation: function(elem, during, aniamteFnName) {
            var aniamteFnName = aniamteFnName || "ease";
            elem.style.webkitBackfaceisibility = "hidden";
            elem.style.webkitPerspective = "1000";
            elem.style.webkitTransition = "all " + during + "s " + aniamteFnName;
        },
        disableAnimation: function(ele) {
            ele.style.webkitTransition = "";
            ele.style.transition = "";
            ele.style.webkitAnimation = "";
            ele.style.animation = "";
        },
        css: function(ele, options) {
            var value, results = [];
            ele.style.webkitTransformOrigin = ele.style.transformOrigin = '';

            for (var key in options) {
                value = options[key];
                if ("x" === key ||
                    "y" === key ||
                    "z" === key ||
                    "rotateX" === key ||
                    "rotateY" === key ||
                    "rotateZ" === key ||
                    "skewY" === key ||
                    "skewX" === key ||
                    "scaleX" === key ||
                    "scaleY" === key ||
                    "scaleZ" === key) {
                    results.push(setTransformStyle(ele, key, value));
                } else {
                    key = getStyleName(key);
                    if (key in ele.style) {
                        ele.style[key] = value;
                        results.push(value);
                    } else {
                        results.push(void 0);
                    }
                }
            }
            return results;
        },
        getScaleX: function(ele) {
            var styleTransform, scaleX;
            styleTransform = getStyleTransform(ele);
            scaleX = 0;
            if (styleTransform && styleTransform.match(/scaleX\(.*?\)/)) {
                scaleX = styleTransform.match(/scaleX\(.*?\)/)[0].replace(/(scaleX\()|\)/, "") || scaleX;
            }
            return parseFloat(scaleX);
        },
        getScaleY: function(ele) {
            var styleTransform, scaleY;
            styleTransform = getStyleTransform(ele);
            scaleY = 0;
            if (styleTransform && styleTransform.match(/scaleY\(.*?\)/)) {
                scaleY = styleTransform.match(/scaleY\(.*?\)/)[0].replace(/(scaleY\()|\)/, "") || scaleY;
            }
            return parseFloat(scaleY);
        },
        getX: function(ele) {
            var styleTransform, translateX;
            styleTransform = getStyleTransform(ele);
            translateX = 0;
            if (styleTransform && styleTransform.match(/translateX\(.*?\)/)) {
                translateX = styleTransform.match(/translateX\(.*?\)/)[0].replace(/(translateX\()|\)/, "") || translateX;
            }
            return parseFloat(translateX);
        },
        getY: function(ele) {
            var styleTransform, translateY;
            styleTransform = getStyleTransform(ele);
            translateY = 0;
            if (styleTransform && styleTransform.match(/translateY\(.*?\)/)) {
                translateY = styleTransform.match(/translateY\(.*?\)/)[0].replace(/(translateY\()|\)/, "") || translateY;
            }
            return parseFloat(translateY);
        },
        rmKeyFrames: function(elem) {
            return elem.style["-webkit-animation"] ? elem.style["-webkit-animation"] = null : void 0;
        },
        setKeyFrames: function(name, animateStyle) {
            var keyframesReg, headElem, styleCode, styleElem, styleElemHtml;
            headElem = document.getElementsByTagName("head")[0];
            keyframesReg = new RegExp("@keyframes " + name);
            if (headElem.getElementsByTagName("style")[0]) {
                //f
                styleElem = headElem.getElementsByTagName("style")[0];
                styleElemHtml = styleElem.innerHTML;
                if (keyframesReg.test(styleElemHtml)) {

                } else {
                    styleCode = "@keyframes " + name + animateStyle +
                        "@-moz-keyframes " + name + animateStyle +
                        "@-o-keyframes " + name + animateStyle +
                        "@-webkit-keyframes " + name + animateStyle;
                    if (styleElem.styleSheet) {
                        styleElem.styleSheet.cssText = styleCode;
                    } else {
                        styleElem.appendChild(document.createTextNode(styleCode));
                    }
                }
            } else {
                styleElem = document.createElement("style");
                styleElem.type = "text/css";
                styleCode = "@keyframes " + name + animateStyle +
                    "@-moz-keyframes " + name + animateStyle +
                    "@-o-keyframes " + name + animateStyle +
                    "@-webkit-keyframes " + name + animateStyle;
                if (styleElem.styleSheet) {
                    styleElem.styleSheet.cssText = styleCode;
                } else {
                    styleElem.appendChild(document.createTextNode(styleCode));
                    headElem.appendChild(styleElem);
                }
            }
        },
        getStyleTransform: getStyleTransform
    };

    /**
     * 获取无前缀样式名称
     * @param  {Obj} ele
     */
    function getStyleName(ele) {
        return ele.replace(/-+(.)?/g, function(a, b) {
            return b ? b.toUpperCase() : "";
        });
    }

    /**
     * 设置元素transform样式
     * @param {Obj} a: ele
     * @param {String} b: key
     * @param {Type} c: velue
     */
    function setTransformStyle(ele, key, value) {
        var styleTransform, reg, fullValue;
        styleTransform = getStyleTransform(ele);
        switch (key) {
            case 'x':
                reg = /translateX\(.+?\)/;
                fullValue = "translateX(" + value + "px)";
                _setStyle(ele, styleTransform, reg, fullValue);
                if (!reg.test(styleTransform)) {
                    void(ele.style.left && (ele.style.left = "0px"));
                }
                break;
            case 'y':
                reg = /translateY\(.+?\)/;
                fullValue = "translateY(" + value + "px)";
                _setStyle(ele, styleTransform, reg, fullValue);
                if (!reg.test(styleTransform)) {
                    void(ele.style.top && (ele.style.top = "0px"));
                }
                break;
            case 'z':
                reg = /translateZ\(.+?\)/;
                fullValue = "translateZ(" + value + "px)";
                _setStyle(ele, styleTransform, reg, fullValue);
                break;
            case 'rotateX':
                reg = /rotateX\(.+?\)/;
                fullValue = "rotateX(" + value + "deg)";
                _setStyle(ele, styleTransform, reg, fullValue);
                break;
            case 'rotateY':
                reg = /rotateY\(.+?\)/;
                fullValue = "rotateY(" + value + "deg)";
                _setStyle(ele, styleTransform, reg, fullValue);
                break;
            case 'rotateZ':
                reg = /rotateZ\(.+?\)/;
                fullValue = "rotateZ(" + value + "deg)";
                _setStyle(ele, styleTransform, reg, fullValue);
                break;
            case 'scaleX':
                reg = /scaleX\(.+?\)/;
                fullValue = "scaleX(" + value + ")";
                _setStyle(ele, styleTransform, reg, fullValue);
                break;
            case 'scaleY':
                reg = /scaleY\(.+?\)/;
                fullValue = "scaleY(" + value + ")";
                _setStyle(ele, styleTransform, reg, fullValue);
                break;
            case 'scaleZ':
                reg = /scaleZ\(.+?\)/;
                fullValue = "scaleZ(" + value + ")";
                _setStyle(ele, styleTransform, reg, fullValue);
                break;
            case 'skewX':
                reg = /skewX\(.+?\)/;
                fullValue = "skewX(" + value + "deg)";
                _setStyle(ele, styleTransform, reg, fullValue);
                break;
            case 'skewY':
                reg = /skewY\(.+?\)/;
                fullValue = "skewY(" + value + "deg)";
                _setStyle(ele, styleTransform, reg, fullValue);
                break;
        }
    }

    function _setStyle(ele, styleTransform, reg, fullValue) {
        if (reg.test(styleTransform)) {
            ele.style.transform = styleTransform.replace(reg, fullValue);
            ele.style.webkitTransform = styleTransform.replace(reg, fullValue);
        } else {
            //正常
            ele.style.transform += (" " + fullValue);
            if (ele.style.transform === ele.style.webkitTransform) {
                return;
            }
            ele.style.webkitTransform += (" " + fullValue);
        }
        ele.style.transform = ele.style.transform.replace('undefined', '');
        ele.style.webkitTransform = ele.style.webkitTransform.replace('undefined', '');
    }

    /**
     * 获取元素在相应浏览器下的 transform 样式对象
     * @param  {Obj} ele
     * @return {Obj} transform
     */
    function getStyleTransform(ele) {
        if (ele.style.transform && ele.style.transform !== 'undefined') {
            return ele.style.transform;
        } else {
            return ele.style.webkitTransform;
        }

        // switch (browserType) {
        //     case 'ie':
        //     case 'firefox':
        //         return ele.style.transform;
        //     default:
        //         return ele.style.webkitTransform;
        // }
    }
}(window.__DVC));