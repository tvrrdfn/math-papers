<template lang="pug">
.break-down
    header 分解设置（X + Y = Z）
    dl.break-down__box
        dt
            span 题目数量：
        dd
            input(type="Number", v-model="len")
    dl.break-down__box
        dt
            span (Z)最大值：
        dd
            input(type="Number", v-model="zMax")
    dl.break-down__box
        dt
            span (Z)最小值：
        dd
            input(type="Number", v-model="zMin")
    dl.break-down__box
        dt
            span 是否混排：
        dd
            input(type="checkbox", v-model="isMixed")
    footer
        button(@click="go") 生成试题

    h3 分解运算试题

    .page(ref="page")
</template>

<script>
import CommonUtils from '@/utils/common.utils';
import QuestionsServices from '@/services/questions.services';

export default {
	name: "breakDown",

    data() {
        return {
            operator: '+',
            len: 50,
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

            this.$refs.page.innerHTML = QuestionsServices.getHtml(this.questions);
        }
    }
}
</script>

<style lang="sass">
.break-down
    text-align: left

    header
        border-bottom: 1px solid #ccc

    dl
        display: flex
        line-height: 30px

        dt
            width: 110px
            text-align: right
        dd
            margin: 0
            display: flex
            align-items: center

    .list
        display: flex;
        flex-wrap: wrap;

        &:nth-child(odd):not(:last-child),
        &:not(:last-child)
            padding-bottom: 20px;
            border-bottom: 1px dashed #000;
            margin-bottom: 20px;

        .item
            width: 90px;
            height: 100px;
            padding: 4px;
            position: relative;
            border: 1px dashed #ddd;
            margin: 2px 4px;

            .id
                color: #999;
                line-height: 1em;
                position: absolute;
                top: 5px;
                left: 5px;
                font-size: 12px;

            span
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                text-align: center;
                justify-content: center;

                &.branch
                    width: 30px;
                    height: 30px;
                    border-left: 1px solid #ccc;
                    border-top: 1px solid #ccc;
                    transform: rotate(45deg);
                    margin: 10px auto 0;

                &.x,
                &.y
                    position: absolute;
                    bottom: 4px;
                    left: 10px;
                &.y
                    left: auto;
                    right: 10px;

                &.z
                    margin: 0 auto;

                &.box
                    border: 1px solid #ccc;
</style>