 import Api from '../Api/api'
 const checkMobile = function(sMobile) {
   if (!(/^1[0-9][0-9]\d{4,8}$/.test(sMobile))) {
     return false;
   }
   return true;
 }
 const checkPassword = function(sPassword) {
   if (!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(sPassword))) {
     return false;
   }
   return true;
 }
 const checkCName = function(sName) {
   if (!(/^[\u4e00-\u9fa5]+(·[\u4e00-\u9fa5]+)*$/).test(sName)) {
     return false;
   }
   return true;
 }
 const checkIdNum = function(sIdNum) {
   if (!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/).test(sIdNum)) {
     return false;
   }
   return true;
 }
 const sendSms = function(mobileNumber, type) {
   Api.sendSMS({
     Phone: mobileNumber,
     SmsType: type
   })
 }

 const formatBankAcount = function(BankAcount) {
   var reg = /^(\d{4})\d+(\d{4})$/;
   return BankAcount.replace(reg, "$1****$2");
 }

 const getCurrentMonthFirst = function() {
   var date = new Date();
   date.setDate(1);
   return date;
 };

 const getCurrentMonthLast = function() {
   var date = new Date();
   var currentMonth = date.getMonth();
   var nextMonth = ++currentMonth;
   var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
   var oneDay = 1000 * 60 * 60 * 24;
   return new Date(nextMonthFirstDay - oneDay);
 };

 // 深度克隆
 const deepClone = function(p,c) {
   var c = c || {};
　　　　for (var i in p) {
　　　　　　if (typeof p[i] === 'object') {
　　　　　　　　c[i] = (p[i].constructor === Array) ? [] : {};
　　　　　　　　deepClone(p[i], c[i]);
　　　　　　} else {
　　　　　　　　　c[i] = p[i];
　　　　　　}
　　　　}
　　　　return c;
 };
 /*比较两对象属性是否相等*/
 const isObjectValueEqual = function(a, b) {

   var aProps = Object.getOwnPropertyNames(a);
   var bProps = Object.getOwnPropertyNames(b);


   if (aProps.length != bProps.length) {
     return false;
   }

   for (var i = 0; i < aProps.length; i++) {
     var propName = aProps[i];

     if (a[propName] !== b[propName]) {
       return false;
     }
   }
   return true;
 };

 const formatString = function(num, digits, showDigits) {
  showDigits = 0;
   if (typeof(num) != "number") {
     return num
   }
   num = num.toString().replace(/\$|\,/g, '');
   if (isNaN(num))
     num = "0";
   var sign = (num == (num = Math.abs(num)));

   var pow = Math.pow(10, digits);
   num = Math.floor(num * pow + 0.50000000001);
   var cents = num % pow;
   cents = cents + pow;

   num = Math.floor(num / pow).toString();
   for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
     num = num.substring(0, num.length - (4 * i + 3)) + ',' +
     num.substring(num.length - (4 * i + 3));

   if (digits > 0) {
     if (cents < 10)
       cents = "0" + cents;
     if (cents.toString().length > 1)
       cents = cents.toString().substring(1, cents.length);
     else
       cents = "";
     cents = "." + cents;
   }

   let result = (((sign) ? '' : '-') + num + cents);
   return formatShow(result, digits, showDigits);
 }

 function formatShow(num, digits, showDigits) {
   if (showDigits == 0 || num.length <= showDigits)
     return num;
   var k = 1000;
   var million = k * 1000;
   var billion = million * 1000;

   var f = parseFloat(num.replace(/,+/g, ""));
   if (f >= billion) {
     f = (f / billion).toFixed(2) + " B";
     return f;
   } else if (f >= million) {
     f = (f / million).toFixed(2) + " M";
     return f;
   } else if (f >= k) {
     f = (f / k).toFixed(2) + " K";
     return f;
   }
   return num;
 }

/**
 * 
 * 判断当前客户端是否为ios
*/
function isiOS () {
  let u = navigator.userAgent;
  console.log('navigator', navigator.userAgent)
  return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
}

function getRect(el) {
  if (el instanceof window.SVGElement) {
    let rect = el.getBoundingClientRect()
    return {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height
    }
  } else {
    return {
      top: el.offsetTop,
      left: el.offsetLeft,
      width: el.offsetWidth,
      height: el.offsetHeight
    }
  }
}
 export {
   checkMobile,
   checkPassword,
   checkCName,
   checkIdNum,
   sendSms,
   formatBankAcount,
   getCurrentMonthFirst,
   getCurrentMonthLast,
   changeRoute,
   deepClone,
   isObjectValueEqual,
   formatString,
   isiOS,
   getRect
 }
