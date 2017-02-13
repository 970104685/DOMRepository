/**
 * Created by minamikaze on 16/10/8.
 */
var utils = (function () {
    var flg = 'getComputedStyle' in window;

    /**
     * 类数组转数组
     * @param arg
     * @returns {*}
     */
    function makeArray(arg) {
        var ary = [];
        if (flg) {
            return Array.prototype.slice.call(arg);
        } else {
            for (var i = 0; i < arg.length; i++) {
                ary.push(arg[i])
            }
        }
        return ary;
    }

    /**
     * json对象转化为json字符串
     * @param jsonStr
     * @returns {Object}
     */
    function jsonParse(jsonStr) {
        return 'JSON' in window ? JSON.parse(jsonStr) : eval('(' + jsonStr + ')')
    }

    /**
     * 获取和设置浏览器的宽高
     * @param attr 获取宽或高
     * @param value value值传入表示可以设置宽或高
     * @returns {*}
     */
    function win(attr, value) {
        if (typeof value === 'undefined') {
            return document.documentElement[attr] || document.body[attr];
        }
        document.documentElement[attr] = document.body[attr] = value;
    }

    /**
     * 元素距离浏览器边缘的计算
     * @param curEle
     * @returns {{left: (Number|number), top: (number|Number)}}
     */
    function offset(curEle) {
        var l = curEle.offsetLeft;
        var t = curEle.offsetTop;
        var par = curEle.offsetParent;
        while (par) {
            if (window.navigator.userAgent.indexOf('MSIE 8.0') === -1) {
                l += par.clientLeft;
                t += par.clientTop;
            }
            l += par.offsetLeft;
            t += par.offsetTop;
            par = par.offsetParent;
        }
        return {left: l, top: t};
    }

    /**
     *
     * @param n
     * @param m
     * @returns {number}
     */
    function rnd(n, m) {
        //1.看来传的参数不是数字，返回一个0-1之间的随机小数，代表传参错误；
        n = Number(n);
        m = Number(m);
        if (isNaN(n) || isNaN(m)) {
            return Math.random();//0-1之间随机小数，代表传参错误
        }
        //2.如果n>m,需要交互他们的位置
        if (n > m) {
            var tmp = m;
            m = n;
            n = tmp;
        }
        return Math.round(Math.random() * (m - n) + n);


    }

    /**
     * 获取classname
     * @param strClass
     * @param curEle
     * @returns {ary}
     */
    function getByClass(strClass, curEle) {
        curEle = curEle || document;
        if (flg) {
            return this.makeArray(curEle.getElementsByClassName(strClass));
        }
        var aryClass = strClass.replace(/(^ +)|( +$)/g, '').split(/\s+/g);
        var nodeList = curEle.getElementsByTagName('*');
        var ary = [];
        for (var i = 0; i < nodeList.length; i++) {
            var curNode = nodeList[i];
            var bOk = true;
            for (var j = 0; j < aryClass.length; j++) {
                var reg = new RegExp('\\b' + aryClass[j] + '\\b');
                if (!reg.test(curNode.className)) {
                    bOk = false;
                    break;
                }
            }
            if (bOk) {
                ary.push(curNode)
            }
        }
        return ary;
    }

    /**
     * 添加classname
     * @param curEle
     * @param strClass
     */
    function addClass(curEle, strClass) {
        var aryClass = strClass.replace(/(^ +)|( +$)/g, '').split(/\s+/g);
        for (var i = 0; i < aryClass.length; i++) {
            if (!this.hasClass(curEle, aryClass[i])) {
                curEle.className += ' ' + aryClass[i];
            }
        }
    }

    /**
     * 判断是否有这个classname
     * @param curEle
     * @param cName
     */
    function hasClass(curEle, cName) {
        var reg = new RegExp('(^| +)' + cName + '( +|$)');
        return reg.test(curEle.className);
    }

    function removeClass(curEle, strClass) {
        var aryClass = strClass.replace(/(^ +)|( +$)/g, '').split(/\s+/g);
        for (var i = 0; i < aryClass.length; i++) {
            var reg = new RegExp('\\b' + aryClass[i] + '\\b');
            if (reg.test(curEle.className)) {
                curEle.className = curEle.className.replace(reg, ' ').replace(/(^ +)|( +$)/g, '').replace(/\s+/g, ' ');
            }
        }
    }

    function getCss(curEle, attr) {
        var val = null;
        var reg = null;
        if (flg) {
            val = getComputedStyle(curEle, false)[attr]
        } else {
            if (attr === 'opacity') {
                val = curEle.currentStyle.filter; //'alpha(opacity=30)'
                reg = /^alpha\(opacity[=:](\d+)\)$/gi;
                return reg.test(val) ? RegExp.$1 / 100 : 1;
            }
            val = curEle.currentStyle[attr];
        }
        reg = /^([+-])?(\d+(\.\d+)?(px|pt|rem|em))$/i;
        return reg.test(val) ? parseFloat(val) : val;
    }

    function setCss(curEle, attr, value) {
        if (attr === 'float') {
            curEle.style.cssFloat = value;
            curEle.style.styleFloat = value;
            return;
        }
        if (attr === 'opacity') {
            curEle.style.opacity = value;
            curEle.style.filter = 'alpha(opacity=' + (value * 100) + ')';
            return;
        }
        var reg = /^(width|height|left|top|right|bottom|((margin|padding)(left|top|right|bottom)?))$/ig;
        if (reg.test(attr) && value.toString().indexOf('%') === -1) {
            value = parseFloat(value) + 'px';
        }
        curEle.style[attr] = value;
    }

    function setGroupCss(curEle, opt) {
        if (opt.toString() !== '[object Object]') return;
        for (var attr in opt) {
            this.setCss(curEle, attr, opt[attr])
        }
    }

    function css(curEle) {
        var arg2 = arguments[1];
        if (typeof arg2 === 'string') {
            var arg3 = arguments[2];
            if (typeof arg3 === 'undefined') {
                return this.getCss(curEle, arg2)
            } else {
                this.setCss(curEle, arg2, arg3)
            }
        }
        if (arg2.toString() === '[object Object]') {
            this.setGroupCss(curEle, arg2)
        }
    }

    function getChildren(curEle, ele) {
        var nodeList = curEle.childNodes;
        var ary = [];
        for (var i = 0; i < nodeList.length; i++) {
            var curNode = nodeList[i];
            if (curNode.nodeType === 1) {
                if (typeof ele !== 'undefined') {
                    if (ele.toUpperCase() === curNode.nodeName) {
                        ary.push(curNode)
                    }
                } else {
                    ary.push(curNode)
                }
            }
        }
        return ary;
    }

    function prev(curEle) {
        if (flg) {
            return curEle.previousElementSibling;
        }
        var pre = curEle.previousSibling;
        while (pre && pre.nodeType !== 1) {
            pre = pre.previousSibling;
        }
        return pre;
    }

    function next(curEle) {
        if (flg) {
            return curEle.nextElementSibling;
        }
        var nex = curEle.nextSibling;
        while (nex && nex.nodeType !== 1) {
            nex = nex.nextSibling;
        }
        return nex;
    }

    function prevAll(curEle) {
        var pre = this.prev(curEle);
        var ary = [];
        while (pre) {
            ary.push(pre);
            pre = this.prev(pre);
        }
        return ary;
    }

    function nextAll(curEle) {
        var nex = this.next(curEle);
        var ary = [];
        while (nex) {
            ary.push(nex);
            nex = this.next(nex);
        }
        return ary;
    }

    function sibling(curEle) {
        var ary = [];
        var pre = this.prev(curEle);
        var nex = this.next(curEle);
        if (pre) ary.push(pre);
        if (nex) ary.push(nex);
        return ary;
    }

    function siblings(curEle) {
        var prevAll = this.prevAll(curEle);
        var nextAll = this.nextAll(curEle);
        return prevAll.concat(nextAll);
    }

    function index(curEle) {
        return this.prevAll(curEle).length;
    }

    function firstChild(curEle) {
        var ary = this.getChildren(curEle);
        return ary[0];
    }

    function lastChild(curEle) {
        var ary = this.getChildren(curEle);
        return ary[ary.length - 1];
    }

    function appendChild(parent, newEle) {
        parent.appendChild(newEle);
    }

    function prependChild(parent, newEle) {
        var first = this.firstChild(parent);
        if (first) {
            parent.insertBefore(newEle, first);
        } else {
            parent.appendChild(newEle);
        }

    }

    function insertBefore(newEle, oldEle) {
        oldEle.parentNode.insertBefore(newEle, oldEle);
    }

    function insertAfter(newEle, oldEle) {
        var nex = this.next(oldEle);
        if (nex) {
            oldEle.parentNode.insertBefore(newEle, nex);
        } else {
            oldEle.parentNode.appendChild(newEle);
        }
    }

    return {
        //makeArray:类数组转数组
        makeArray: makeArray,
        //jsonParse:把JSON格式的字符串转为JSON格式的数据（对象）
        jsonParse: jsonParse,
        //win:处理浏览器盒子模型的兼容性
        win: win,
        //offset:求盒子模型到body的偏移量
        offset: offset,
        //rnd:求[n,m]之间的随机整数
        rnd: rnd,
        //getByClass:限定范围 的通过 class 来 获取元素
        getByClass: getByClass,
        //hasClass:判断 元素的className上 是否包含 某个class名'box1'；
        hasClass: hasClass,
        //addClass:如果元素的className上没有某个class名，才会添加该class名；
        //'box1 box2 box3'
        addClass: addClass,
        //removeClass:判断一个元素的class上是否有某个class名，如果有干掉他；
        removeClass: removeClass,
        //getCss:获取元素的非行间样式；
        getCss: getCss,
        //setCss:给元素的某个属性，设置一个样式
        setCss: setCss,
        //setGroupCss:给元素设置一组样式 {width:xxx,height:xxx}
        setGroupCss: setGroupCss,
        //css:getCss(curEle,attr)  setCss(curEle,attr,value) setGroupCss(curEle,opt)
        css: css,
        //getChildren:获取当前元素下的所有子元素，帅选出某个标签的元素集合；
        getChildren: getChildren,
        //prev:获取当前元素的上一个哥哥元素；
        prev: prev,
        next: next,
        //prevAll:获取当前元素所有的哥哥元素
        prevAll: prevAll,
        //nextAll:获取当前元素的所有弟弟元素
        nextAll: nextAll,
        //sibling:当前元素的相邻元素 prev+next
        sibling: sibling,
        //siblings:所有的兄弟元素 prevAll+nextAll;
        siblings: siblings,
        //index:求当前元素的索引
        index: index,
        //firstChild:求当前容器下第一个子元素
        firstChild: firstChild,
        //lastChild:求当前容器下最后一个子元素
        lastChild: lastChild,
        appendChild: appendChild,
        //prependChild:如果有第一个子元素，插入到第一个子元素的前面，否则，直接插入容器的末尾；
        prependChild: prependChild,
        insertBefore: insertBefore,
        //insertAfter:如果指定元素的弟弟元素存在的话，插入到弟弟元素的前面，否则，直接插入到容器的末尾；
        insertAfter: insertAfter

    }
})();









