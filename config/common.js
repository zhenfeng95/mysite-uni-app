import * as db from './db.js'; //引入common

//操作成功后，的提示信息
function successToShow(msg = '保存成功', callback = function () {}) {
    uni.showToast({
        title: msg,
        icon: 'success',
        duration: 1000
    });
    setTimeout(function () {
        callback();
    }, 500);
}

//操作失败的提示信息
function errorToShow(msg = '操作失败', callback = function () {}) {
    uni.showToast({
        title: msg,
        icon: 'none',
        duration: 1500
    });
    setTimeout(function () {
        callback();
    }, 1500);
}

//加载显示
function loadToShow(msg = '加载中') {
    uni.showToast({
        title: msg,
        icon: 'loading'
    });
}

//加载隐藏
function loadToHide() {
    uni.hideToast();
}

// 提示框
function modelShow(
    title = '提示',
    content = '确认执行此操作吗?',
    callback = () => {},
    showCancel = true,
    cancelText = '取消',
    confirmText = '确定'
) {
    uni.showModal({
        title: title,
        content: content,
        showCancel: showCancel,
        cancelText: cancelText,
        confirmText: confirmText,
        cancelText: cancelText,
        success: function (res) {
            if (res.confirm) {
                // 用户点击确定操作
                setTimeout(() => {
                    callback(true);
                }, 500);
            } else if (res.cancel) {
                // 用户取消操作
                callback(false);
            }
        }
    });
}

// 时间戳转化
function formatMsgTime(timespan) {
    var dateTime = new Date(timespan * 1000); // 将传进来的字符串或者毫秒转为标准时间
    var year = dateTime.getFullYear();
    var month = dateTime.getMonth() + 1;
    var day = dateTime.getDate();
    var hour = dateTime.getHours();
    var minute = dateTime.getMinutes();
    var second = dateTime.getSeconds();
    var millisecond = dateTime.getTime(); // 将当前编辑的时间转换为毫秒
    var now = new Date(); // 获取本机当前的时间
    var nowNew = now.getTime(); // 将本机的时间转换为毫秒
    var milliseconds = 0;
    var timeSpanStr = '';
    milliseconds = nowNew - millisecond;
    if (milliseconds <= 1000 * 60 * 1) {
        // 小于一分钟展示为刚刚
        timeSpanStr = '刚刚';
    } else if (1000 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60) {
        // 大于一分钟小于一小时展示为分钟
        timeSpanStr = Math.round(milliseconds / (1000 * 60)) + '分钟前';
    } else if (1000 * 60 * 60 * 1 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24) {
        // 大于一小时小于一天展示为小时
        timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60)) + '小时前';
    } else if (1000 * 60 * 60 * 24 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24 * 15) {
        // 大于一天小于十五天展示位天
        timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60 * 24)) + '天前';
    } else if (milliseconds > 1000 * 60 * 60 * 24 * 15 && year === now.getFullYear()) {
        timeSpanStr = month + '-' + day + ' ' + hour + ':' + minute;
    } else {
        timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute;
    }
    return timeSpanStr;
}

//验证是否是手机号
function isPhoneNumber(str) {
    var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (!myreg.test(str)) {
        return false;
    } else {
        return true;
    }
}

/**
 *
 * 对象参数转为url参数
 *
 */
function builderUrlParams(url, data) {
    if (typeof url == 'undefined' || url == null || url == '') {
        return '';
    }
    if (typeof data == 'undefined' || data == null || typeof data != 'object') {
        return '';
    }
    url += url.indexOf('?') != -1 ? '' : '?';
    for (var k in data) {
        url += (url.indexOf('=') != -1 ? '&' : '') + k + '=' + encodeURI(data[k]);
    }
    return url;
}

/**
 * 统一跳转
 */
function navigateTo(url) {
    uni.navigateTo({
        url: url,
        animationType: 'pop-in',
        animationDuration: 300
    });
}

/**
 * @param {Object} url
 */
function switchTabTo(url) {
    uni.switchTab({
        url: url,
        animationType: 'pop-in',
        animationDuration: 300
    });
}

/**
 *  关闭当前页面并跳转
 */
function redirectTo(url) {
    uni.redirectTo({
        url: url,
        animationType: 'pop-in',
        animationDuration: 300
    });
}

/**
 * 获取url参数
 *
 * @param {*} name
 * @param {*} [url=window.location.serach]
 * @returns
 */
function getQueryString(name, url) {
    var url = url || window.location.href;
    var reg = new RegExp('(^|&|/?)' + name + '=([^&|/?]*)(&|/?|$)', 'i');
    var r = url.substr(1).match(reg);
    if (r != null) {
        return r[2];
    }
    return null;
}

/**
 *
 *  判断是否在微信浏览器 true是
 */
function isWeiXinBrowser() {
    // #ifdef H5
    // window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
    let ua = window.navigator.userAgent.toLowerCase();
    // 通过正则表达式匹配ua中是否含有MicroMessenger字符串
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true;
    } else {
        return false;
    }
    // #endif

    return false;
}

/**
 * 金额相加
 * @param {Object} value1
 * @param {Object} value2
 */
function moneySum(value1, value2) {
    return (parseFloat(value1) + parseFloat(value2)).toFixed(2);
}
/**
 * 金额相减
 * @param {Object} value1
 * @param {Object} value2
 */
function moneySub(value1, value2) {
    let res = (parseFloat(value1) - parseFloat(value2)).toFixed(2);
    return res > 0 ? res : 0;
}

/**
 * 打电话
 * @param phone
 */
function callPhone(phone) {
    uni.makePhoneCall({
        phoneNumber: phone
    });
}

export {
    successToShow,
    errorToShow,
    isPhoneNumber,
    loadToShow,
    loadToHide,
    navigateTo,
    redirectTo,
    modelShow,
    builderUrlParams,
    isWeiXinBrowser,
    getQueryString,
    moneySum,
    moneySub,
    switchTabTo,
    callPhone,
    formatMsgTime
};
