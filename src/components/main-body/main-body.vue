<template lang="pug">
    .main-body
        .main-body__header
            .main-body__header-packup(
                :class="{'collapse': mainAsideIsPackup}"
                @click="setMainAsidePackup"
            )
                pt-svg(use-id="icon-nav")
        .main-body__body
            .main-body__body-header 试卷预览
            .main-body__body-body
                test-paper
        .main-body__footer
</template>

<script>
    import { mapState, mapActions } from 'vuex';
    import testPaper from '@/components/test-paper/test-paper';

    export default {
        name: "mainBody",

        props: {
            
        },

        data() {
            return {
                
            }
        },

        computed: mapState('main', ['mainAsideIsPackup']),

        methods: {
            ...mapActions('main', ['setMainAsidePackup'])
            
        },

        components: {
            testPaper
        }
    }
</script>

<style lang="sass">
    @import "../../styles/imports";

    .main-body
        flex: 1
        display: flex
        flex-direction: column
        background-color: $dd-alabaster

        &__header
            display: flex
            height: $main-body-header-height
            border-bottom: 1px solid $dd-mercury

            &-packup
                @extend %flex-center
                cursor: pointer
                padding: 0 15px
                border-right: 1px solid $dd-mercury
                &:hover
                    svg
                        fill: $dd-charcoal
                &.collapse
                    svg
                        transform-origin: center
                        transform: rotate(180deg)
                svg
                    @include size(20px)
                    fill: $dd-silver
                    transition: transform .3s ease

        &__body
            flex: 1
            display: flex;
            flex-direction: column;

            &-header
                @extend %flex-center
                color: $dd-charcoal
                flex: 0 0 62px
                font-size: $f-lg

            &-body
                flex: 1
                border: 1px solid $dd-mercury
                margin: 0 20px 20px;
                background-color: $dd-white
</style>