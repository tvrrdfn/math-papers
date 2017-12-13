/**
 * 日期格式化
 * see http://blog.stevenlevithan.com/archives/date-time-format
 */
var dateFormat = function () {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};

	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = dateFormat;

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date;
		if (isNaN(date)) throw SyntaxError("invalid date");

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var	_ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(L > 99 ? Math.round(L / 10) : L),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();

// Some common format strings
dateFormat.masks = {
	"default":      "ddd mmm dd yyyy HH:MM:ss",
	shortDate:      "m/d/yy",
	mediumDate:     "mmm d, yyyy",
	longDate:       "mmmm d, yyyy",
	fullDate:       "dddd, mmmm d, yyyy",
	shortTime:      "h:MM TT",
	mediumTime:     "h:MM:ss TT",
	longTime:       "h:MM:ss TT Z",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
	dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
	monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
};

/**
 * 不污染Date及prototype对象为原则
 * @type {{add: module.exports.add}}
 */
module.exports = {
	/**
	 * 是否是日期类型
	 * @param obj
	 * @returns {boolean}
	 */
	isDate: function (obj) {
		return Object.prototype.toString(obj) == '[object Date]';
	},

	/**
	 * 将字符串解析为日期对象
	 * @param str
	 * @returns {Date}
	 */
	parse: function (str) {
		// var parts = str.split('/');
		// return new Date(parts[0], parts[1] - 1, parts[2]);
		return new Date(str);
	},

	format: dateFormat,

	/**
	 * 获取该日期所在月份的第一天
	 * @param date
	 * @returns {*}
	 */
	getFirstDayOfDate: function (date) {
		var cloned = this.clone(date);
		cloned.setDate(1);
		return cloned;
	},

	/**
	 * 清除时分秒和毫秒
	 * @param date
	 */
	clearTime: function (date) {
		date.setHours(0);
		date.setMinutes(0);
		date.setSeconds(0);
		date.setMilliseconds(0);
		return date;
	},

	/**
	 * 克隆日期对象
	 * @param date
	 * @returns {Date}
	 */
	clone: function (date) {
		return new Date(date.getTime());
	},

	/**
	 * 增加(减少)天数
	 * @param date
	 * @param num
	 * @returns {*}
	 */
	addDays: function (date, num) {
		date.setDate(date.getDate() + num);
		return date;
	},

	/**
	 * 月份操作
	 * @param date
	 * @param num
	 * @returns {*}
	 */
	addMonths: function (date, num) {
		date.setMonth(date.getMonth() + num);
		return date;
	},

	/**
	 * 年份操作
	 * @param date
	 * @param num
     */
	addYears: function (date, num) {
		date.setFullYear(date.getFullYear() + num);
		return date;
	},

	/**
	 * 比较两个日期,如果第一个大于第二个则返回1, 小于则返回-1, 相等则返回0
	 * @param date1
	 * @param date2
	 * @returns {number}
	 */
	compare: function (date1, date2) {
		if(date1.valueOf() < date2.valueOf()){
			return -1;
		}else if(date1.valueOf() > date2.valueOf()){
			return 1;
		}
		return 0;
	}

};
