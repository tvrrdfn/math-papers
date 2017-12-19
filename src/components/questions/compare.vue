<template lang="pug">
    .compare.questions-settings
        .questions-settings__header
            span 数值大小比较设置(X > Y)
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
                        span (X)最大值：
                    dd
                        pt-input(v-model="xMax")
                dl
                    dt
                        span (X)最小值：
                    dd
                        pt-input(v-model="xMin")
                dl
                    dt
                        span (Y)最大值：
                    dd
                        pt-input(v-model="yMax")
                dl
                    dt
                        span (Y)最小值：
                    dd
                        pt-input(v-model="yMin")
</template>

<script>
    import CommonUtils from '@/utils/common.utils';
    import QuestionsServices from '@/services/questions.services';

    export default {
        name: "compare",

        data() {
            return {
                len: 10,
                xMax: 100,
                xMin: 10,
                yMax: 100,
                yMin: 10,

                questions: []
            }
        },

        methods: {

            go() {
                this.questions = [];

                // 最大试题库
                let questionsMax = this.getQuestionsMax(); 

                // 提取相应的题目数量
                let questionsLen = QuestionsServices.getQuestionsLen(questionsMax, this.len);

                let HTML = QuestionsServices.getHtml(questionsLen);

                this.questions = questionsLen;

                this.$emit('set', HTML, this.$el.getAttribute('uuid'));
            },

            getQuestionsMax() {
                let questionsMax = [],
                    xValues = CommonUtils.initArray(this.xMax - this.xMin + 1, this.xMin),
                    yValues = CommonUtils.initArray(this.yMax - this.yMin + 1, this.yMin);

                xValues.forEach(x => {
                    yValues.forEach(y => {
                        questionsMax.push({
                            x: x,
                            y: y
                        })
                    })
                })

                return questionsMax;
            },

            getHtml() {

            }
        }
    }
</script>

<style lang="sass">
    @import '../../styles/imports';

    .compare
        .questions-settings__content-box
            border: none
            display: flex
</style>