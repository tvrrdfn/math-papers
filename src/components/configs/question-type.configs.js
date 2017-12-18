import cloneUtils from '@/utils/clone.utils';

export default {
	types: [{
		type: "数字分解",
		code: 'breakDown',
        score: 20,
		class: 'qusetions__breakDown',
        name: '填一填',
        showSettings: true
	},{
		type: "填空",
		code: 'completion',
        score: 20,
		class: 'qusetions__completion',
        name: '我是计算小能手',
        showSettings: true
	}],

	getDefaultType() {
		return cloneUtils.deep(this.types[0]);
	},

	getTypeForCode(code) {
		return this.types.find(type => type.code === code);
	}
}