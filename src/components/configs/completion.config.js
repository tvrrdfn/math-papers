export default {
    add: {
        code: '+',
        name: '+',
        value: 'false',
        title: "加法设置（X + Y = Z）",
        renderOptions: [{
            code: 'len',
            name: '题目数量：',
            value: 20,
            type: 'number'
        }, {
            code: 'zMax',
            name: '(Z)最大值：',
            value: 20,
            type: 'number'
        }, {
            code: 'zMin',
            name: '(Z)最小值：',
            value: 10,
            type: 'number'
        }, {
            code: 'isMixed',
            name: '是否混排：',
            value: false,
            type: 'boolean'
        }]
    },
    sub: {
        code: '-',
        name: '-',
        value: 'false',
        title: "减法设置（X - Y = Z）",
        renderOptions: [{
            code: 'len',
            name: '题目数量：',
            value: 20,
            type: 'number'
        }, {
            code: 'xMax',
            name: '(X)最大值：',
            value: 20,
            type: 'number'
        }, {
            code: 'xMin',
            name: '(X)最小值：',
            value: 10,
            type: 'number'
        }, {
            code: 'isMixed',
            name: '是否混排：',
            value: false,
            type: 'boolean'
        }]
    },
    mcl: {
        code: '*',
        name: '×',
        value: 'false',
        title: "乘法设置（X × Y = Z）",
        renderOptions: [{
            code: 'len',
            name: '题目数量：',
            value: 20,
            type: 'number'
        }, {
            code: 'xMax',
            name: '(X)最大值：',
            value: 20,
            type: 'number'
        }, {
            code: 'xMin',
            name: '(X)最小值：',
            value: 10,
            type: 'number'
        }, {
            code: 'yMax',
            name: '(Y)最大值：',
            value: 20,
            type: 'number'
        }, {
            code: 'yMin',
            name: '(Y)最小值：',
            value: 10,
            type: 'number'
        }, {
            code: 'isMixed',
            name: '是否混排：',
            value: false,
            type: 'boolean'
        }]
    },
    division: {
        code: '/',
        name: '÷',
        value: 'false',
        title: "除法设置（X ÷ Y = Z）",
        renderOptions: [{
            code: 'len',
            name: '题目数量：',
            value: 20,
            type: 'number'
        }, {
            code: 'yMax',
            name: '(Y)最大值：',
            value: 20,
            type: 'number'
        }, {
            code: 'yMin',
            name: '(Y)最小值：',
            value: 10,
            type: 'number'
        }, {
            code: 'yMultiple',
            name: '(Y)最大倍数：',
            value: 10,
            type: 'number'
        }, {
            code: 'isDivisible',
            name: '是否整除：',
            value: true,
            type: 'boolean'
        }, {
            code: 'isMixed',
            name: '是否混排：',
            value: false,
            type: 'boolean'
        }]
    },

    /**
     * 获取配置信息
     * @param {Array} type
     * @return {Array}
     */
    getConfigs(type = ['add', 'sub', 'mcl', 'division']) {
        let configs = type.reduce((prev, curr) => {
            let item = this[curr];
            if(item){
                prev.push(item);
            }
            return prev;
        }, []);

        return configs;
    },

    /**
     * 生成具体的设置信息
     * @param {Array} configs
     * @return {Array}
     */
    getSettings(configs) {
        return configs.reduce((prev, curr) => {
            if(curr.value) {
                prev.push(Object.assign({operator: curr.code}, this.getAllCode(curr.renderOptions)));
            }
            return prev;
        }, []);
    },

    /**
     * 获取所有选项的code值
     * @param {Array} options
     * @return {Object}
     */
    getAllCode(options) {
        let valus = {};
        options.forEach(o => {
            valus[o.code] = o.value;
        })
        return valus;
    }
}