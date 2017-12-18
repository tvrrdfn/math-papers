import CommonUtils from '@/utils/common.utils';

export default {
    /**
     * 按设置信息生成题目
     * @param {Object} setting
     * @return {Array}
     */
    getQuestions(setting) {
        let questions = [],
            operator = setting.operator,
            len = setting.len,
            max = setting.max,
            min = setting.min,
            divisible = setting.divisible, // 是否整除
            isMixed = setting.isMixed; //是否混排

        // 最大试题库
        let questionsMax = this.getQuestionsMax(operator, setting); 

        // 提取相应的题目数量
        let questionsLen = this.getQuestionsLen(questionsMax, len);

        // 混排处理，并添加操作符熟悉
        questions = this.mixedQuestions(questionsLen, isMixed);

        return questions;
    },


	/**
	 * 获取当前操作符下的最大试题库
	 * @param {String} operator
	 * @param {Number} max
	 * @param {Number} min
	 * @return {Array}
	 */
    getQuestionsMax(operator, setting) {
        let questionsMax = [];

        switch (operator) {
            case "+":
                var zMax = setting.zMax,
                    zMin = setting.zMin,
                    zVaules = CommonUtils.initArray(zMax - zMin + 1, zMin);

                zVaules.forEach(z => {
                    let xValues = CommonUtils.initArray(z);

                    xValues.forEach(x => {
                        questionsMax.push({
                            x: x,
                            y: z - x,
                            z: z,
                            o: operator,
                            oName: '+'
                        })
                    })
                })
                break;
            case "-":
                var xMax = setting.xMax,
                    xMin = setting.xMin,
                    xValues = CommonUtils.initArray(xMax - xMin + 1, xMin);

                xValues.forEach(x => {
                    let yValues = CommonUtils.initArray(x);

                    yValues.forEach(y => {
                        questionsMax.push({
                            x: x,
                            y: y,
                            z: x - y,
                            o: operator,
                            oName: '-'
                        })
                    })
                })
                break;
            case "*":
                var xMax = setting.xMax,
                    xMin = setting.xMin,
                    xValues = CommonUtils.initArray(xMax - xMin + 1, xMin),
                    yMax = setting.yMax,
                    yMin = setting.yMin,
                    yValues = CommonUtils.initArray(yMax - yMin + 1, yMin);

                xValues.forEach(x => {
                    yValues.forEach(y => {
                        questionsMax.push({
                            x: x,
                            y: y,
                            z: x * y,
                            o: operator,
                            oName: '×'
                        })
                    })
                })
                break;
            case "/":
                var yMax = setting.yMax,
                    yMin = setting.yMin,
                    yValues = CommonUtils.initArray(yMax - yMin + 1, yMin),
                    yMultiple = setting.yMultiple,
                    mValues = CommonUtils.initArray(yMultiple, 1);

                console.log(yValues, mValues)
                yValues.forEach(y => {
                    mValues.forEach(m => {
                        questionsMax.push({
                            x: y * m,
                            y: y,
                            z: y * m / y,
                            o: operator,
                            oName: '÷'
                        })
                    })
                })
                break;
        }

        return questionsMax;
    },

    /**
	 * 提取相应的题目数量
	 * @param {Array} questionsMax
	 * @param {Number} len
	 * @return {Array}
	 */
	getQuestionsLen(questionsMax, len) {
		let questions = [];

		if(questionsMax.length > len){
			for(let i = 0; i < len; i++){
				let max = questionsMax.length,
					qIndex = CommonUtils.rd(0, max-1),
					question = questionsMax[qIndex];

				questions.push(question);
				questionsMax.splice(qIndex, 1);
			}
		} else {
			questions = questionsMax;
		}

		return questions;
	},

	/**
	 * 混排处理，并添加操作符属性
	 * @param {Array} questions
	 * @param {Boolean} isMixed
	 * @return {Array}
	 */
	mixedQuestions(questions, isMixed) {
		let param = ['x', 'y', 'z'],
			paramLen = param.length;

		questions.forEach(question => {
			if(question){
				if(isMixed){
					//随机去除(x,y,z)其中一值
					let removeIndex = CommonUtils.rd(0, paramLen - 1);
					question[param[removeIndex]] = null;
				} else {
					question['z'] = null;
				}
			}
		})
		return questions;
	},

	/**
	 * 生成题型的HTML
	 * @param {Array} list: 数据列表
	 *
	 * return {String}
	 */
	getHtml(list) {
		let html = '';

		list.forEach((l,index) => {
			if(!l) return;

			let x = l.x === null ? '' : l.x,
				y = l.y === null ? '' : l.y,
				z = l.z === null ? '' : l.z;

			let spanX = '<span class="x ' + (x === '' ? 'box': '') + '">' + x + '</span>',
				spanY = '<span class="y ' + (y === '' ? 'box': '') + '">' + y + '</span>',
				spanZ = '<span class="z ' + (z === '' ? 'box': '') + '">' + z + '</span>';

			// html += `<div class="item">
			// 		<div class="id">${index + 1}.</div>
			// 		${spanZ}
			// 		<span class="branch"></span>
			// 		${spanX}
			// 		${spanY}
			// 	</div>`;

            html += `<div class="item">
                        <div class="id">${index + 1}.</div>
                        ${spanX}
                        <span class="operator">${l.oName}</span>
                        ${spanY}
                        <span class="equal">=</span>
                        ${spanZ}
                    </div>`;
		})

		return '<div class="list">' + html + '</div>';
	}
}