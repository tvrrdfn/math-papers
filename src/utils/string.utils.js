String.prototype.supplant = function(o) {
	return this.replace(/{([^{}]*)}/g,
		function(a, b) {
			var r = o[b];
			return typeof r === 'string' || typeof r === 'number' || typeof r === 'boolean' ? r : a;
		}
	);
};

String.prototype.byteLength = function() {
	let b = 0,
		l = this.length;
	if (l) {
		for (var i = 0; i < l; i++) {
			if (this.charCodeAt(i) > 255)
				b += 2;
			else
				b++;
		}
		return b;
	} else {
		return 0;
	}
};

//获取最大字节数，超出添加省略号
export function getMaxByte(val, max) {
	let byteLength = val.byteLength(),
		newVal = val;

	if (byteLength > max) {
		let d = byteLength - max,
			l = val.length,
			b = 0,
			m = '...',
			ml = m.byteLength() + d;

		for (let i = (l - 1); i >= 0; i--) {
			b += val.charAt(i).byteLength();

			if ((ml >= byteLength && b >= d) || (ml < byteLength && b >= ml)) {
				newVal = (val.slice(0, i) || val.charAt(0)) + m;
				break;
			}
		}
	}

	return newVal;
}
