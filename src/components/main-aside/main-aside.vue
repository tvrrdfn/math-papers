<template lang="pug">
    .main-aside(:class="{'packup': mainAsideIsPackup}")
        .main-aside__header
            span.logo
                pt-svg(use-id="icon-space")
            span.title 试题生成
        .main-aside__body
            h2
                pt-svg(use-id="icon-dashboard")
                span 试题配置
                .add(@click="add")
                    pt-svg(use-id="icon-plus")
            pt-scrollbar(ref="scrollbar")
                .main-aside__body-box-wrap
                    dl.main-aside__body-box(
                        v-for="(item, index) in items"
                        key="item.code"
                    )
                        dt 第 {{index + 1}} 题
                            button.delete(@click="del(item.code)")
                                pt-svg(use-id="icon-delete")
                        dd
                            question-box(
                                :item="item"
                                @itemChange="onItemChange"
                            )
        .main-aside__footer
</template>

<script>
    import { mapState, mapActions } from 'vuex';
	import questionBox from './question-box';
    import uuidUtils from '@/utils/uuid.utils';
    import QuestionTyps from '@/components/configs/question-type.configs';

	export default {
		name: "mainAside",

        props: {
           
        },

		data() {
			return {
				items: []
			}
		},

        computed: mapState('main', ['mainAsideIsPackup']),

		methods: {
            ...mapActions('main', ['setQuestions']),

			add() {
                this.items.push(QuestionTyps.getDefaultType());
                this.scrollbarUpdate();
		    },

		    del(itemCode) {
                let index = this.items.findIndex(item => item.code === itemCode);
                if(index !== -1){
                    this.items.splice(index, 1);
                    this.scrollbarUpdate();
                }
		    },

            scrollbarUpdate() {
                this.$nextTick(() => {
                    this.$refs.scrollbar.update();
                })
            },

            onItemChange(item) {
                console.log(item);
            }
		},

        watch: {
            items: {
                handler: function(newVal) {
                    console.log(newVal)
                    this.setQuestions(this.items);
                },
                deep: true
            }
        },

		components: {
			questionBox
		}
	}
</script>

<style lang="sass">
    @import "../../styles/imports";

    .main-aside
        display: flex;
        flex-direction: column;
        flex: 0 0 $mian-aside-width
        background-color: $dd-nightrider
        transition: flex .2s linear

        &.packup
            flex: 0 1 $mian-aside-packup-width;

            .main-aside__header
                justify-content: center

                span.logo
                    display: block

                span.title
                    display: none

            .main-aside__body
                h2 span,
                h2 .add,
                .main-aside__body-box-wrap
                    display: none

        &__header
            flex: 0 0 $main-aside-header-height
            display: flex
            color: $dd-white
            align-items: center

            span.logo
                display: none

                &:hover
                    svg
                        fil: $dd-white
                svg
                    @include size(22px)
                    fill: $dd-ao

            span.title
                margin-left: 10px
                font-size: $f-lg

        &__body
            flex: 1
            display: flex
            flex-direction: column

            h2
                height: 50px
                padding: 0 0 0 14px
                background: $dd-larioja
                color: $dd-white
                font-size: $f-lg
                white-space: nowrap
                position: relative
                display: flex
                align-items: center

                & > svg
                    @include size(22px)
                    fill:  $dd-white
                    margin: 0 10px 0 0

                .add
                    position: absolute
                    right: 10px
                    cursor: pointer

                    svg
                        @include size(18px)
                        fill: $dd-white

            .scrollbar__holder
                margin: 10px 0

            &-box-wrap
                flex: 1

            &-box
                flex: 1
                background-color: $dd-nero
                padding: 5px 10px 10px
                color: $dd-nobel

                &:not(:last-child) 
                    margin-bottom: 10px

                &:hover
                    button.delete 
                        opacity: 1

                & > dt
                    height: 30px
                    display: flex
                    justify-content: space-between
                    align-items: center
                    border-bottom: 1px solid $dd-nightrider
                    margin-bottom: 10px
                    color: $dd-white

                button.delete
                    @include size(18px)
                    @extend %flex-center
                    opacity: 0;
                    border: none
                    border-radius: 50%
                    padding: 0
                    background-color: transparent
                    transition: all 0.2s ease

                    &:hover
                        svg
                            fill: $dd-bittersweet

                    svg
                        @include size(100%)
                        fill: $dd-silver

        &__footer
</style>