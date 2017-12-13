export default {
	max: function(arr, fn) {
		if (arr == null) return undefined;

		if (fn == null) {
			return Array.max(arr);
		}

		var lastComputed = -Infinity,
			computed, result;
		arr.forEach(function(o, index) {
			computed = fn(o, index, arr);
			if (computed > lastComputed) {
				lastComputed = computed;
				result = o;
			}
		});

		return result;
	},

	indexOf: function(arr, fun) {
		if (arr == null || typeof fun != 'function') return -1;

		for (var i = 0; i < arr.length; i++) {
			if (fun(arr[i], i, arr)) {
				return i;
			}
		}

		return -1;
	},

	isEmpty: function(arr) {
		if (arr == null) return true;
		return arr.length === 0;
	},

	isNotEmpty: function(arr) {
		return !this.isEmpty(arr);
	},

	nth: function(arr, num, fn) {
		if (arr == null || typeof fn != 'function') return undefined;

		var result, count = 0;

		for (var i = 0; i < arr.length; i++) {
			var exeRs = fn.call(null, arr[i], i, arr);
			var num = typeof num == 'function' ? num.call(null, arr[i], i, arr) : num;
			if (exeRs) {
				count++;
				if (count == num) {
					result = arr[i];
					break;
				}
			}
		}

		return result;
	},

	slice: function(arr, fun, num) {

	},

	isArrayFn: function(val) {
		return Object.prototype.toString.call(val) === "[object Array]";
	},

	equals: function(arr1, arr2) {
	    if (!arr1 || !arr2)
	        return false;

	    if (arr1.length != arr2.length)
	        return false;

	    for (let i = 0, max = arr1.length; i < max; i++) {
	        if (arr1[i] instanceof Array && arr2[i] instanceof Array) {
	            if (!arr1[i].equals(arr2[i]))
	                return false;       
	        }           
	        else if (arr1[i] != arr2[i]) { 
	            return false;   
	        }           
	    }       
	    return true;
	}
}