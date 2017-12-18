<template lang="pug">
    dl.question-box(v-if="currItem")
        dl
            dt 选择题型:
            dd
                pt-select(
                    :keys="{label: 'type', value: 'code'}"
                    :options="questionTyps"
                    :value="currItem.code"
                    @change="onTypeChange"
                )
        dl
            dt 题目名称:
            dd
                pt-input(
                    theme="dark"
                    :value="currItem.name"
                    @change="onNameChange"
                )
        dl
            dt 本题分值:
            dd
                pt-input-number(
                    theme="dark"
                    :min="1"
                    :value="currItem.score"
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
                currItem: this.item,
				questionTyps: QuestionTyps.types
			}
		},

        methods: {
            setCurrValue(item) {
                this.currCode = item.code;
                this.currName = item.name;
                this.currScore = item.score;
            },

            onTypeChange(item) {
                this.currItem = item;
                this.notice();
            },

            onNameChange(name) {
                this.currItem.name = name;
                this.notice();
            },

            onScoreChange(score) {
                this.currItem.score = score;
                this.notice();
            },

            notice() {
                this.$emit('itemChange', this.currItem);
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