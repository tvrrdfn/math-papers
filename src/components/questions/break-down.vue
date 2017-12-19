<template lang="pug">
    .break-down.questions-settings
        .questions-settings__header
            span 分解设置（X + Y = Z）
            pt-button(@click="go") 生成试题
        .questions-settings__content
            .questions-settings__content-box
                dl
                    dt
                        span 题目数量：
                    dd
                        pt-input(v-model="len")
                dl
                    dt
                        span (Z)最大值：
                    dd
                        pt-input(v-model="zMax")
                dl
                    dt
                        span (Z)最小值：
                    dd
                        pt-input(v-model="zMin")
                dl.break-down__box
                    dt
                        span 是否混排
                    dd
                        pt-checkbox(v-model="isMixed") 应用
</template>

<script>
import CommonUtils from '@/utils/common.utils';
import QuestionsServices from '@/services/questions.services';

export default {
	name: "breakDown",

    data() {
        return {
            operator: '+',
            len: 20,
            zMax: 20,
            zMin: 10,
            isMixed: true,
            questionsMax: [],
            questions: []
        }
    },

    methods: {
        go() {
            let settings = [{
                operator: this.operator,
                len: +this.len,
                zMax: +this.zMax,
                zMin: +this.zMin,
                isMixed: this.isMixed
            }]

            // 根据设置信息生成试题
            this.questions = [];
            settings.forEach(setting => {
                let currQuestions = QuestionsServices.getQuestions(setting);
                setting['questions'] = currQuestions;
                this.questions.push(...currQuestions);
            });

            let HTML = QuestionsServices.getHtml(this.questions);

            this.$emit('set', HTML, this.$el.getAttribute('uuid'));
        }
    }
}
</script>

<style lang="sass">
    @import '../../styles/imports';

    .break-down
        .questions-settings__content-box
            border: none
            display: flex
</style>