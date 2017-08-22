//// ==UserScript==
// @name         NetIDHelper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  帮助学弟学妹激活NetID
// @author       Evans Mike
// @match        https://cas.sysu.edu.cn/pwm/public/ActivateUser
// @grant        none
// ==/UserScript==


function load(url, onLoad, onError) {
    e = document.createElement("script");
    e.setAttribute("src", url);

    if (onLoad !== null) { e.addEventListener("load", onLoad); }
    if (onError !== null) { e.addEventListener("error", onError); }

    document.body.appendChild(e);

    return e;
}

function execute(functionOrCode) {
    if (typeof functionOrCode === "function") {
        code = "(" + functionOrCode + ")();";
    } else {
        code = functionOrCode;
    }

    e = document.createElement("script");
    e.textContent = code;

    document.body.appendChild(e);

    return e;
}

function loadAndExecute(url, functionOrCode) {
    load(url, function() { execute(functionOrCode); });
}



(function() {
    'use strict';

    // Your code here...
    loadAndExecute("//cdn.bootcss.com/jquery/3.2.1/jquery.min.js", function() {
        // Cookie 操作类

        function setCookie(c_name, value, expiredays) {
            var exdate = new Date();
            exdate.setDate(exdate.getDate() + expiredays);
            document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
        }

        function getCookie(c_name) {
            if (document.cookie.length > 0) {
                c_start = document.cookie.indexOf(c_name + "=");
                if (c_start != -1) {
                    c_start = c_start + c_name.length + 1;
                    c_end = document.cookie.indexOf(";", c_start);
                    if (c_end == -1) c_end = document.cookie.length;
                    return unescape(document.cookie.substring(c_start, c_end));
                }
            }
            return "";
        }

        String.prototype.firstUpperCase = function() {
            //将字符串转化为消协，并拆分成单词
            var str = this.toLowerCase().split(" ");
            //循环将每个单词的首字母大写
            for (var i = 0; i < str.length; i++) {
                //选取首个字符
                var char = str[i].charAt(0);
                //将单子首字符替换为大写
                str[i] = str[i].replace(char, function(s) { return s.toUpperCase(); });
            }
            //拼合数组
            str = str.join(" ");
            return str;
        };

        // 排列组合函数
        function doExchange(arr) {
            var len = arr.length;
            // 当数组大于等于2个的时候
            if (len >= 2) {
                // 第一个数组的长度
                var len1 = arr[0].length;
                // 第二个数组的长度
                var len2 = arr[1].length;
                // 2个数组产生的组合数
                var lenBoth = len1 * len2;
                //  申明一个新数组
                var items = new Array(lenBoth);
                // 申明新数组的索引
                var index = 0;
                for (var i = 0; i < len1; i++) {
                    for (var j = 0; j < len2; j++) {
                        if (arr[0][i] instanceof Array) {
                            items[index] = arr[0][i].concat(arr[1][j]);
                        } else {
                            items[index] = [arr[0][i]].concat(arr[1][j]);
                        }
                        index++;
                    }
                }
                var newArr = new Array(len - 1);
                for (var i = 2; i < arr.length; i++) {
                    newArr[i - 1] = arr[i];
                }
                newArr[0] = items;
                return doExchange(newArr);
            } else {
                return arr[0];
            }
        }

        // 模拟激活函数
        function tryActivate(arrOnce, commentOnce, tryCount) {
            var sysuFullNameArr = arrOnce[0].split(' ');
            var sysuSN = sysuFullNameArr.shift();
            var sysuGivenName = sysuFullNameArr.join(' ');
            switch (arrOnce[1]) {
                case 0:
                    break;
                case 1:
                    sysuSN = sysuSN.toUpperCase();
                    break;
                case 2:
                    sysuSN = sysuSN.toLowerCase();
                    break;
                case 3:
                    sysuSN = sysuSN.toLowerCase().firstUpperCase();
                    break;
                case 4:
                    sysuGivenName = sysuGivenName.toUpperCase();
                    break;
                case 5:
                    sysuGivenName = sysuGivenName.toLowerCase();
                    break;
                case 6:
                    sysuGivenName = sysuGivenName.toLowerCase().firstUpperCase();
                    break;
                case 7:
                    sysuSN = sysuSN.toUpperCase();
                    sysuGivenName = sysuGivenName.toUpperCase();
                    break;
                case 8:
                    sysuSN = sysuSN.toLowerCase();
                    sysuGivenName = sysuGivenName.toLowerCase();
                    break;
                case 9:
                    sysuSN = sysuSN.toLowerCase().firstUpperCase();
                    sysuGivenName = sysuGivenName.toLowerCase().firstUpperCase();
                    break;
                default:
                    break;
            }
            if (arrOnce[2] !== 0) {
                sysuGivenName = sysuGivenName.replace(/\s+/g,"");
            }
            var sysuIdentityNumber = arrOnce[3];
            var sysuCampusIdentityNumber = arrOnce[4];
            var sysuPWMActivationCode = arrOnce[5];

            // 调试专用
            console.log("--------------");
            console.log("【尝试次数】：" + tryCount);
            console.log("姓氏拼音:" + sysuSN);
            console.log("名字拼音:" + sysuGivenName);
            console.log("身份证件号码:" + sysuIdentityNumber);
            console.log("学号:" + sysuCampusIdentityNumber);
            console.log("校园卡号码:" + sysuPWMActivationCode);
            // 显示Tips
            $(".tryingTips").html("第" + (tryCount + 1) + "次尝试：" + commentOnce.join("，"));
            $(".tryingTips").show();
            // 模拟填充
            $("#sysuSN").val(sysuSN);
            $("#sysuGivenName").val(sysuGivenName);
            $("#sysuIdentityNumber").val(sysuIdentityNumber);
            $("#sysuCampusIdentityNumber").val(sysuCampusIdentityNumber);
            $("#sysuPWMActivationCode").val(sysuPWMActivationCode);
            // 变更次数
            setCookie("tryCount", tryCount + 1);
            // 模拟点击提交按钮
            $("#submitBtn").trigger("click");
        }


        var wholeForm = $("form"); // 获取表单
        if (wholeForm) {

            // 插入关于信息
            var about = `
                <p style="color:blue">本辅助插件只需填写上边表格的内容，下方表格内容会自动填充。填充完毕后请点击”尝试激活“按钮，全程无需人工干预。</p>
                <p style="color:blue">Version: 1.0 beta</p>
                <p style="color:blue">Powered by Evans Mike @ SysuHTM</p>
            `;

            $(about).insertBefore("form[name='activateUser']");

            var hackForm = `
    <form action="javascript:;" id="hackForm">
        <span style="display:none" id="message" class="message">&nbsp;</span>
        <div id="capslockwarning" style="display:none;" class="tryingTips">尝试中</div>
        <table id ="hackForm">
            <tr>
                <td class="key">
                    <label for="wtmPinyin">身份证上姓名的拼音（格式如： Yi Er san）</label>
                </td>
                <td>
                    <input style="border:0; width: 100%; text-align: left;" id="wtmPinyin" type="text" name="wtmPinyin" value="" required="true" maxlength="40"/>
                </td>
            </tr>
            <tr>
                <td class="key">
                    <label for="hansPinyin">姓名的汉语拼音（格式如： Yat Yi saam）</label>
                </td>
                <td>
                    <input style="border:0; width: 100%; text-align: left;" id="hansPinyin" type="text" name="hansPinyin" value="" required="true" maxlength="40"/>
                </td>
            </tr>
            <tr>
                <td class="key">
                    <label for="idType">姓名的汉语拼音（请每个字空格，不区分大小写）</label>
                </td>
                <td>
                    <select id="idType">
                        <option value="1">港澳</option>
                        <option value="2">台湾</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td class="key">
                    <label for="passcardCode" id="passcardCodeLabel">您的回乡证号码</label>
                </td>
                <td>
                    <input style="border:0; width: 100%; text-align: left;" id="passcardCode" type="text" name="passcardCode" value="" required="true" maxlength="40"/>
                </td>
            </tr>
            <tr>
                <td class="key">
                    <label for="passcardTNum" id="passcardTNumLabel">您的回乡证换证次数</label>
                </td>
                <td>
                    <input style="border:0; width: 100%; text-align: left;" id="passcardTNum" type="text" name="passcardTNum" value="" required="true" maxlength="40"/>
                </td>
            </tr>
            <tr>
                <td class="key">
                    <label for="identityCode" id="identityCodeLabel">您的身份证号码</label>
                </td>
                <td>
                    <input style="border:0; width: 100%; text-align: left;" id="identityCode" type="text" name="identityCode" value="" required="true" maxlength="40"/>
                </td>
            </tr>
            <tr>
                <td class="key">
                    <label for="studentCode">您的学号</label>
                </td>
                <td>
                    <input style="border:0; width: 100%; text-align: left;" id="studentCode" type="text" name="studentCode" value="" required="true" maxlength="40"/>
                </td>
            </tr>
            <tr>
                <td class="key">
                    <label for="campusCode">您的校园卡号</label>
                </td>
                <td>
                    <input style="border:0; width: 100%; text-align: left;" id="campusCode" type="text" name="campusCode" value="" required="true" maxlength="40"/>
                </td>
            </tr>
        </table>
        <div id="buttonbar">
            <input type="submit" name="button" class="btn" value="尝试激活" id="tryBtn"/>
            <input type="reset" name="reset" class="btn" value="清除"/>
        </div>
    </form>
        `;
            $(hackForm).insertBefore("form[name='activateUser']");
            // 禁用原有表单
            // $("#sysuSN, #sysuGivenName, #sysuIdentityNumber, #sysuCampusIdentityNumber, #sysuPWMActivationCode ").attr("readonly", true);

            // 隐藏原有表单
            // $("#form").hide();
            // $("#buttonbar").hide();
            $("form[name='activateUser']").attr("novalidate");
            //$("form[name='activateUser']").hide();

            // 恢复表单数据
            $("#wtmPinyin").val(getCookie('wtmPinyin'));
            $("#hansPinyin").val(getCookie('hansPinyin'));
            $("#idType").val(getCookie('idType'));
            $("#passcardCode").val(getCookie('passcardCode'));
            $("#passcardTNum").val(getCookie('passcardTNum'));
            $("#identityCode").val(getCookie('identityCode'));
            $("#studentCode").val(getCookie('studentCode'));
            $("#campusCode").val(getCookie('campusCode'));

            var tryCount = parseInt(getCookie("tryCount"));
            var tryLimit = parseInt(getCookie("tryLimit"));
            var ipLimit = parseInt(getCookie("ipLimit"));
            if (tryCount == 0) { // 有测试次数但是没有数组设置
                // tryActivate(tryCount);

                //读取指定变量
                var wtmPinyin = getCookie("wtmPinyin");
                var hansPinyin = getCookie("hansPinyin");
                var idType = getCookie("idType");
                var passcardCode = getCookie("passcardCode");
                var passcardTNum = getCookie("passcardTNum");
                var identityCode = getCookie("identityCode");
                var studentCode = getCookie("studentCode");
                var campusCode = getCookie("campusCode");
                var sysuSN, sysuGivenName, sysuIdentityNumber, sysuCampusIdentityNumber, sysuPWMActivationCode;

                // 姓名分割
                var wtmPinyinArr = wtmPinyin.split(' ');
                var hansPinyinArr = hansPinyin.split(' ');
                var wtmSN = wtmPinyinArr.shift();
                var wtmGivenName = wtmPinyinArr.join(' ');
                var hansSN = hansPinyinArr.shift();
                var hansGivenName = hansPinyinArr.join(' ');

                // 排列组合各数组操作
                // var arrSysuSN = [hansSN, hansSN.toUpperCase(), hansSN.toLowerCase(), hansSN.toLowerCase().firstUpperCase(), wtmSN, wtmSN.toUpperCase(), wtmSN.toLowerCase(), wtmSN.toLowerCase().firstUpperCase()];
                // var commentSysuSN = ["汉语拼音", "汉语拼音大写", "汉语拼音小写", "汉语拼音首字大写", "身份证上拼音", "身份证上拼音大写", "身份证上拼音小写", "身份证上拼音首字母大写"];
                // var arrSysuGivenName = [hansGivenName, hansGivenName.toUpperCase(), hansGivenName.toLowerCase(), hansGivenName.toLowerCase().firstUpperCase(), wtmGivenName, wtmGivenName.toUpperCase(), wtmGivenName.toLowerCase(), wtmGivenName.toLowerCase().firstUpperCase()];
                // var commentSysuGivenName = ["汉语拼音", "汉语拼音大写", "汉语拼音小写", "汉语拼音首字大写", "身份证上拼音", "身份证上拼音大写", "身份证上拼音小写", "身份证上拼音首字母大写"];
                var arrSysuFullName = [hansPinyin, wtmPinyin];
                var commentSysuFullName = ["汉语拼音", "身份证上拼音"];
                var arrSysuFullNameArg = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
                var commentSysuFullNameArg = ["维持原样", "姓氏大写", "姓氏小写", "姓氏首字母大写", "名字大写", "名字小写", "名字首字母大写", "姓名大写", "姓名小写", "姓名首字母大写"];
                var arrNameConcatArg = [0, 1];
                var commentNameConcatArg = ["名字不合并", "名字合并"];
                var arrSysuIdentityNumber = [identityCode, passcardCode, passcardCode.concat(passcardTNum)];
                var commentSysuIdentityNumber = ["身份证号", "通行证/台胞证号", "通行证号/台胞证号包括换证次数"];
                var arrSysuCampusIdentityNumber = [studentCode];
                var commentSysuCampusIdentityNumber = ["学号"];
                var arrSysuPWMActivationCode = [campusCode];
                var commentSysuPWMActivationCode = ["校园卡号"];

                // 排列组合操作
                var arrAll = doExchange([arrSysuFullName, arrSysuFullNameArg, arrNameConcatArg, arrSysuIdentityNumber, arrSysuCampusIdentityNumber, arrSysuPWMActivationCode]);
                var commentAll = doExchange([commentSysuFullName, commentSysuFullNameArg, commentNameConcatArg, commentSysuIdentityNumber, commentSysuCampusIdentityNumber, commentSysuPWMActivationCode]);
                var cookieAll = JSON.stringify(arrAll);
                var cookieComment = JSON.stringify(commentAll);

                // 存储操作
                sessionStorage.setItem("arrAll", cookieAll);
                sessionStorage.setItem("commentAll", cookieComment);
                //setCookie("arrAll", cookieAll, 1);
                // setCookie("commentAll", cookieComment, 1);
                setCookie("tryLimit", arrAll.length, 1);
                setCookie("ipLimit", 30, 1);
                // alert(sessionStorage.getItem("arrAll"));
                // alert(sessionStorage.getItem("commentAll"));
                // alert(getCookie("tryLimit"));

                // 进行第一次尝试
                tryActivate(arrAll[0], commentAll[0], 0);

            } else if (tryCount < tryLimit && tryCount < ipLimit) {
                var arrAll = JSON.parse(sessionStorage.getItem("arrAll"));
                var commentAll = JSON.parse(sessionStorage.getItem("commentAll"));
                tryActivate(arrAll[tryCount], commentAll[tryCount], tryCount);
            } else if (tryCount < tryLimit && tryCount >= ipLimit) {
                var arrAll = JSON.parse(sessionStorage.getItem("arrAll"));
                var commentAll = JSON.parse(sessionStorage.getItem("commentAll"));
                var intervalTime = 1000 * 60 * 5; //五分钟 
                // alert("请等待五分钟");
                $(".tryingTips").html("为防止系统屏蔽，延时五分钟再进行尝试。重试将会自动进行，无需干预。");
                $(".tryingTips").show();
                setCookie("ipLimit", tryCount + 30, 1);
                setTimeout(function(){
                    tryActivate(arrAll[tryCount], commentAll[tryCount], tryCount);
                }, intervalTime); // 延时5分钟继续执行

            } else if (tryCount >= tryLimit) {
                alert('啊哦！尝试了' + tryLimit + 1 + "次都没有成功呢，也许是你太高贵啦系统没有录入。可能需要打电话解决一下咯！");
                //setCookie("arrAll", 0, -1);
                //setCookie("commentAll", 0, -1);
                setCookie("tryCount", 0, -1);
                setCookie("tryLimit", 0, -1);
                setCookie("ipLimit", 0, -1);
            }

            //监听身份类别变化
            $("#centerbody").on("change", "#idType", function(event) {
                if ($("#idType").val() == 1) {
                    $("#passcardCodeLabel").html("您的回乡证号码");
                    $("#passcardTNumLabel").html("您的回乡证换证次数");
                } else {
                    $("#passcardCodeLabel").html("您的台胞证号码");
                    $("#passcardTNumLabel").html("您的台胞证换证次数");
                }
            });

            $("#centerbody").on("submit", "#hackForm", function(event) {
                event.preventDefault();

                // 储存Cookies
                setCookie("wtmPinyin", $("#wtmPinyin").val(), 1);
                setCookie("hansPinyin", $("#hansPinyin").val(), 1);
                setCookie("idType", $("#idType").val(), 1);
                setCookie("passcardCode", $("#passcardCode").val(), 1);
                setCookie("passcardTNum", $("#passcardTNum").val(), 1);
                setCookie("identityCode", $("#identityCode").val(), 1);
                setCookie("studentCode", $("#studentCode").val(), 1);
                setCookie("campusCode", $("#campusCode").val(), 1);
                var confirmScript = confirm("即将进行自动化尝试，大概时间为15~20分钟（包括防止屏蔽延时），将尝试所有可能的组合。中途不会暂停，请耐心等待操作结束。");
                if (confirmScript) {
                    setCookie("tryCount", 0, 1);
                    // tryActivate(0);
                    location.reload(true);
                } else {
                    setCookie("tryCount", 0, -1);
                    alert("操作已取消");
                }



            });
        } else {
            alert("页面载入失败，请刷新页面。");
        }

    });

})();