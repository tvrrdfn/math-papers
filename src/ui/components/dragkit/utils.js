const THROTTLE_TIME = 14;

var utils = {
	// 属性拷贝
	extend: function (mod, opt) {
		if (!opt) return mod;
		var conf = {};
		for (var attr in mod)
			conf[attr] = typeof opt[attr] !== "undefined" ? opt[attr] : mod[attr];
		return conf;
	},

	// 克隆节点
	clone: function (node) {
		var obj = {};
		for (var attr in node)
			if (node.hasOwnProperty(attr))
				obj[attr] = node[attr];
		return obj;
	},

	searchUp: function(node, arg) {
		if (!node || node === document.body || node === document) return undefined; // 向上递归到顶就停
		if (typeof arg == 'function'){
			if(arg.call(null, node)) return node;
		}else{
			if(node.classList.contains(arg)) return node;
		}
		return this.searchUp(node.parentNode, arg);
	},

	getOffset: function(node, offset, parent) {
		if (!parent)
			return node.getBoundingClientRect();
		offset = offset || {top: 0, left: 0};
		if (node === null || node === parent) return offset;
		offset.top += node.offsetTop;
		offset.left += node.offsetLeft;
		return this.getOffset(node.offsetParent, offset, parent);
	},

	uuid: function () {
		var s = [];
		var hexDigits = "0123456789abcdef";
		for (var i = 0; i < 36; i++) {
			s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
		}
		s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
		s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
		s[8] = s[13] = s[18] = s[23] = "-";
		return s.join("");
	}
};

export default utils;
