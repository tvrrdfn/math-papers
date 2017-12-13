
// 取不到就按数字类型比较
var numberReg = /^(\-|\+)?\d+(\.\d+)?$/,
	directionMapper = {'asc': 1, 'desc': -1},
	comparators = {
		number: function(a, b, direction){
			if(a === b) return 0;
			return direction > 0 ? a - b : b - a;
		},

		string: function(a, b, direction){
			if(a === b) return 0;
			var comparison = direction > 0 ? a > b : a < b;
			return comparison === false ? -1 : (comparison - 0);
		}
	};

/**
 * 排序
 * @param {Array} data 要排序的二维数组
 * @param {Array} orders 默认的排序规则
 * @param {Array} comparators 比较器数组
 * @param {Function} 排序后的回调函数，参数为index,direction
 */
function Sorter(data, orders, comparators, dataTypes){
	this.data = data;
	this.orders = orders;
	this.comparators = comparators || [];
	this.dataTypes = dataTypes;
	this.init();
}

Sorter.prototype = {
	constructor: Sorter,

	init: function(){
		if(!this.orders) return;
		this.orders.forEach((order) => {
			let index = order[0], direction = order[1];
			if(index != -1){
				this.sort(index, direction);
			}
		});
	},

	//direction为asc或者desc
	sort: function(index, direction){
		this.data.sort((a, b) => {
			let dataType = this.dataTypes[index].toLowerCase();
			let comparator = this.comparators[index] || comparators[dataType] || comparators.string;
			return comparator.call(null, a[index], b[index], directionMapper[direction]);
		});
	}
};

export default Sorter;
