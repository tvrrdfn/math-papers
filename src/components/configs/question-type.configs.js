export default {
	types: [{
		type: "数字分解",
		code: 'breakDown',
        score: 20,
		class: 'qusetions__breakDown',
        name: '填一填',
        showSettings: true
	},{
		name: "顺序计算",
		key: 'sort',
		code: '02'
	},{
		name: "顺序计算",
		key: 'sort',
		code: '03'
	},{
		name: "顺序计算",
		key: 'sort',
		code: '04'
	},{
		name: "顺序计算",
		key: 'sort',
		code: '05'
	},{
		name: "顺序计算",
		key: 'sort',
		code: '06'
	},{
		name: "顺序计算",
		key: 'sort',
		code: '07'
	},{
		name: "顺序计算",
		key: 'sort',
		code: '08'
	},{
		name: "顺序计算",
		key: 'sort',
		code: '09'
	}],

	getDefaultType() {
		return this.types[0];
	}
}