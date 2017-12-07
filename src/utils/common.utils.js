export default {
	/**
	 * 生成递增数字的数组(默认从0开始)
	 */
	initArray(len, start = 0) {
		return Array.from(new Array(len), (val, index) => index + start);
	},

	/**
	 * 获取n至m随机整数
	 */
	rd(n = 0, m) {
	    var c = m - n + 1;  
	    return Math.floor(Math.random() * c + n);
	},

	/**
	 * 打乱数组排序
	 */
	randomArray(arr) {
		return arr.sort(function(){ return 0.5 - Math.random() })
	}
}