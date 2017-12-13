<template>
    <button class="pt-ui-button"
        @click="handleClick"
        :type="nativeType"
        :class="[
            type ? 'pt-ui-button__' + type : '',
            size ? 'pt-ui-button__' + size : '',
            theme ? 'pt-ui-button__' + theme : '',
            {
                'is-disabled': disabled,
                'is-loading': loading,
                'is-plain': plain,
                'is-block': block,
                'is-little-radius':square
            }
        ]"
    >
        <pt-svg class="pt-ui-button__icon " :useId="icon" v-if="icon&&iconleft ? true : false" :class="iconsize ? 'pt-ui-button__icon-' + iconsize : ''"></pt-svg>
        <span v-if="$slots.default"><slot></slot></span>
        <pt-svg class="pt-ui-button__icon " :useId="icon" v-if="icon&&iconright ? true : false" :class="iconsize ? 'pt-ui-button__icon-' + iconsize : ''"></pt-svg>
    </button>
</template>

<script>
    export default {
        name: 'ptButton',
        props:{
            type:{
                type: String,
                default: 'default'
            },
            size: String,
            icon:{
                type: String
            },
            nativeType:{
                type: String,
                default: 'button'
            },
            loading: Boolean,
            disabled: Boolean,
            plain: Boolean,
            block: Boolean,
            square: Boolean,
            theme:String,
            iconleft: {
                type: Boolean,
                default: true
            },
            iconright: {
                type: Boolean,
                default: false
            },
            iconsize:{
                type: String,
                default: ''
            }
        },
        methods:{
            handleClick(e){
                this.$emit('click',e);
            }
        }
    };
</script>

<style lang="scss">
    @import './styles/imports';

    $btnDefault: 26px;
    $btnBig: 30px;
    $iconSmall: 12px;
    $iconDefault: 14px;
    $iconBig: 16px;
    $iconLarge: 18px;

    .pt-ui-button{
        font-size: $font-default;
        text-align: center;
        cursor: pointer;
        border: none;
        padding: 0 8px;
        height: $btnDefault;
        line-height: $btnDefault;
        font-family: Arial;
        white-space: nowrap;
        @include border-radius($defaultBorderRadius);
        &.active{
            box-shadow: inset 0 2px 0 0 rgba(0, 0, 0, 0.1);
        }
        &:active{
            // box-shadow: inset 0 2px 0 0 rgba(0, 0, 0, 0.1);
        }
        &__big{
            height: $btnBig;
            line-height: $btnBig;
        }
        &__default{
            background-color: $dd-larioja;
            color: $dd-white;
        }
        &__primary{
            background-color: $dd-pizazz;
            box-shadow: inset 0 -2px 0 0 rgba(0,0,0,0.1);
            color: $dd-white;
        }
        &__main{
            background-color: $dd-pizazz;
            color: $dd-white;
        }
        &__add{
            background-color: $dd-alto;
            color: $dd-white;
        }
        &__error{
            background-color: $dd-bittersweet;
            color: $dd-white;
        }
        &__delete {
            width: 18px;
            height: 18px;
            border-radius: 50%;
            background-color: $dd-alto;
            padding:0;
            line-height: 0;
            transition:background-color 0.2s ease;
            &:hover {
                background-color: $dd-bittersweet;
            }
        }
        &__warn {
            background-color: transparent;
            padding:0;
            transition:all 0.2s ease;
            border: 1px solid $dd-mercury;
            &:hover {
                background-color: $dd-bittersweet;
                color: $dd-white;
                border: 1px solid $dd-bittersweet;
            }
        }
        &__change{
            background-color: $dd-alto;
            &:hover {
                background-color: $dd-pizazz;
            }
        }
        &__icon {
            width: $iconDefault;
            height: $iconDefault;
            fill: $dd-white;
            vertical-align: middle;
            margin-top: -1px;
            &.pt-ui-button__icon-small{
                width: $iconSmall;
                height: $iconSmall;
            }
            &.pt-ui-button__icon-big{
                width: $iconBig;
                height: $iconBig;
            }
            &.pt-ui-button__icon-large{
                width: $iconLarge;
                height: $iconLarge;
            }
        }
        &.is-little-radius{
            @include border-radius($smallBorderRadius);
        }
        &.pt-ui-button__dark{
            color:$dd-nightrider;
        }
        &.is-block{
            display: block;
            width: 100%;
        }
        &.is-plain{
            background: transparent !important;
            color: $dd-black;
            border: 1px solid currentColor;
            &.pt-ui-button__cancel-dark{
                background-color: transparent;
                color: $dd-dimgray;
                border: 1px solid $dd-tundora;
            }
            &.pt-ui-button__cancel-light{
                background-color: transparent;
                color: $dd-nobel;
                border: 1px solid $dd-mercury;
            }
        }
    }


</style>
