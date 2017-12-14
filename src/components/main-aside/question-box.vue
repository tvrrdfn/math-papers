<template lang="pug">
    dl.question-box
        dl
            dt 选择题型:
            dd
                pt-select(
                    :options="questionTyps"
                    :value="1"
                    @change="onTypeChange"
                )
        dl
            dt 题目名称:
            dd
                pt-input(theme="dark")



</template>

<script>
	import QuestionTyps from '@/components/configs/question-type.configs';

	export default {
		name: "questionBox",

		data() {
			return {
                currOption: QuestionTyps.getFirstCode(),
				questionTyps: QuestionTyps.types
			}
		},

        methods: {
            onTypeChange(val) {
                console.log(val)
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