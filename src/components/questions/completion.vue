<template lang="pug">
.break-down
    .break-down__header 
        span 分解设置（X + Y = Z）
        pt-button(@click="go") 生成试题
    .break-down__body
        dl.break-down__box
            dt
                span 题目数量：
            dd
                pt-input(v-model="len")
        dl.break-down__box
            dt
                span (Z)最大值：
            dd
                pt-input(v-model="zMax")
        dl.break-down__box
            dt
                span (Z)最小值：
            dd
                pt-input(v-model="zMin")
        dl.break-down__box
            dt
            dd
                pt-checkbox(v-model="isMixed") 是否混排

    .page(ref="page")
</template>

<script>
import QuestionsServices from '@/services/questions.services';

export default {
    name: "completion",

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
            let setting = {
                len: +this.len,
                zMax: +this.zMax,
                zMin: +this.zMin,
                isMixed: this.isMixed
            }

            // 最大试题库
            this.questionsMax = QuestionsServices.getQuestionsMax(this.operator, setting); 

            // 提取相应的题目数量
            let questionsLen = QuestionsServices.getQuestionsLen(this.questionsMax, this.len);

            // 混排处理，并添加操作符熟悉
            this.questions = QuestionsServices.mixedQuestions(questionsLen, this.isMixed);
            console.log(this.questions)

            // this.$refs.page.innerHTML = QuestionsServices.getHtml(this.questions);
            let HTML = QuestionsServices.getHtml(this.questions);

            this.$emit('set', HTML);
        }
    }
}
</script>

<style lang="sass">
@import '../../styles/imports';

.break-down
    color: $dd-charcoal

    &__header
        height: 50px;
        border-bottom: 1px solid $dd-gainsboro
        display: flex;
        align-items: center;
        justify-content: space-between;

    &__body
        display: flex
        flex-direction: column;

        dl
            display: flex
            line-height: 30px
            margin-top: 10px

            dt
                width: 110px
                text-align: right
            dd
                margin: 0
                display: flex
                align-items: center
</style>