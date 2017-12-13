export default {
	columns: [{
		name: 'skills',
		width: '50px',
		dataType: 'string'
	},{
		name: 'year',
		style: {
			color: 'red',
			width: '30%'
		},
		formatter: function(value){
			return value+"年";
		},
		dataType: 'number'
	},{
		name: 'method',
		width: '50px',
		sortable: false,
		dataType: 'string'
	},{
		name: 'popularation',
		width: '40%',
		dataType: 'string'
	},{
		name: 'difficulty',
		width: '30%',
		dataType: 'string'
	},{
		name: 'hidden',
		dataType: 'number'
	}],
	orders: [[4, 'desc']],
	rows: [
		['java', '1990', 'fivxvnd', '1', 'normal1', 1],
		['c', '1993', 'fisfndssf', '3', 'hard2', 2],
		['c', '1992', 'a', '3', 'hard3', 3],
		['java', '1990', 'fivxvnd', '1', 'normal1', 1],
		['c', '1993', 'fisfndssf', '3', 'hard2', 2],
		['c', '1992', 'a', '3', 'hard3', 3],
		['java', '1990', 'fivxvnd', '1', 'normal1', 1],
		['c', '1993', 'fisfndssf', '3', 'hard2', 2],
		['c', '1992', 'a', '3', 'hard3', 3],
		['css', '1992', 'a', '4', 'easy4', 4]
	]
};
