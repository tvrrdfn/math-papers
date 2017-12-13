<template lang="pug">
	.main-aside
		pt-select(
			:options="questionTyps"
		)
</template>

<script>
	import QuestionTyps from '@/components/configs/question-type.configs';

	export default {
		name: "mainAside",

		data() {
			return {
				questionTyps: QuestionTyps.types
			}
		}
	}
</script>

<style lang="sass">
@import "../../styles/imports";

.main-aside
    flex: 0 0 $mian-aside-width
</style>