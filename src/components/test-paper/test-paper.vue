<template lang="pug">
    .test-paper
        .test-paper__box(
            v-if="questions"
            v-for="(item, index) in questions"
            :key="item.key"
        )
            header 
                span {{getName(item, index)}}
                button(@click="toggleSetting(item)")
                    pt-svg(use-id="icon-setting")

            .test-paper__box-settings(v-if="item.showSettings") settings

            .test-paper__box-content {{item.code}}
</template>

<script>
    import { mapState, mapActions } from 'vuex';
    import numberUtils from '@/utils/number.utils';
    import QuestionTyps from '@/components/configs/question-type.configs';

    export default {
        name: "testPaper",

        props: {

        },

        data() {
            return {
                isShowSetting: true
            }
        },

        computed: mapState('main', ['questions']),

        methods: {
            getName(item, index) {
                return numberUtils.NumberToChinese(index + 1) + '、' + item.name + '。(' + item.score + '分)';
            },

            toggleSetting(item) {
                item.showSettings = !item.showSettings;
            }
        }
    }
</script>

<style lang="sass">
    @import "../../styles/imports";
    
    .test-paper
        &__box
            margin: 20px

            &:hover
                & > header button
                    opacity: 1

            & > header 
                display: flex
                justify-content: space-between
                align-items: center

                span
                    color: $dd-charcoal
                    font-weight: bold
                    font-size: $f-lg
                button
                    @include size(28px)
                    @extend %flex-center
                    border: 1px solid $dd-alto
                    border-radius: 50%
                    background-color: $dd-white
                    opacity: 0
                    transition: opacity ease .2s

                    &:hover svg
                        fill: $dd-charcoal

                    svg
                        @include size(16px)
                        fill: $dd-nobel

            &-settings
                margin: 10px 0
                padding: 10px
                border-radius: 4px
                background-color: $dd-mercury


</style>