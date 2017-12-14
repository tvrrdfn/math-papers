<template lang="pug">
    dl.question-box
        dl
            dt 选择题型:
            dd
                pt-select(
                    :options="questionTyps"
                    v-model="currCode"
                    @change="onTypeChange"
                )
        dl
            dt 题目名称:
            dd
                pt-input(
                    theme="dark"
                    v-model="currName"
                    @change="onNameChange"
                )
        dl
            dt 本题分值:
            dd
                pt-input-number(
                    theme="dark"
                    :min="1"
                    :value="currScore"
                    @change="onScoreChange"
                )



</template>

<script>
	import QuestionTyps from '@/components/configs/question-type.configs';

	export default {
		name: "questionBox",

        props: {
            item: Object
        },

		data() {
			return {
                currCode: this.item.code,
                currName: this.item.name,
                currScore: this.item.score,
				questionTyps: QuestionTyps.types
			}
		},

        methods: {
            onTypeChange(code) {
                this.notice();
            },

            onNameChange(name) {
                this.notice();
            },

            onScoreChange(val) {
                this.currScore = val;
                this.notice();
            },

            notice() {
                let currItem = Object.assign(this.item, {
                    code: this.currCode,
                    name: this.currName,
                    score: this.currScore
                })
                this.$emit('itemChange', currItem);
            }
        }
	}
</script>

<style lang="sass">
    @import "../../styles/imports";

    .question-box
        & > dl
            display: flex

            &:not(:last-child)
                margin-bottom: 10px

            dt 
                flex: 0 0 60px
                display: flex
                align-items: center
                justify-content: right

            dd
                flex: 1

</style>