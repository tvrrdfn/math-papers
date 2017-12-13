<template>
    <label class="pt-radio" :class="[
        classes ? classes : '',
        theme ? 'pt-radio__theme-' + theme : '',
        isChecked ? 'pt-radio__checked' : ''
    ]">
        <div class="pt-radio__wrapper">
            <input
                type="radio"
                :name="name"
                :value="val"
                :disabled="disabled"
                :checked="isChecked"
                @change="onChange"
            />
            <span class="pt-radio_outer"></span>
            <span class="pt-radio_inner"></span>
        </div>
        <pt-svg class="pt-radio__svg" :use-id="icon" v-if="icon"></pt-svg>
        <div class="pt-radio__text" v-if="label || $slots.default">
            <slot>{{label}}</slot>
        </div>
    </label>
</template>

<script>
    export default {
        name: 'ptRadio',
        props: {
            classes: null,
            theme: String,
            name: String,
            label: String,
            value: {
                type: [Number, String],
                required: true
            },
            val: {
                type: [Number, String],
                required: true
            },
            icon: [Number, String],
            checked: {
                type: Boolean,
                default: false
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },
        computed: {
            isChecked() {
                return this.val == this.value || this.checked;
            }
        },
        created() {
            if(this.checked){
                this.$emit('input', this.val);
            }
        },
        methods: {
            onChange(e) {
                this.$emit('input', this.val);
                this.$emit('change', this.val, this.name);
            }
        }
    };
</script>

<style lang="scss">
    @import './styles/imports';

    $radio-size: 16px;
    $radio-unchecked-color: #ccc;
    $radio-border-width: 1px;

    .pt-radio{
        display: flex;
        align-items: center;
        height: 26px;
        margin: 0;

        &__wrapper{
            position: relative;
            width: $radio-size;
            height: $radio-size;
            cursor: pointer;

            input[type=radio]{
                position: absolute;
                visibility: hidden;
                &:checked ~ .pt-radio_outer{
                    background-color: $dd-larioja;
                    border-color: $dd-larioja;
                }
                &:checked ~ .pt-radio_inner{
                    opacity: 1;
                    background-color: $dd-tundora;
                    transform: scale(0.25);
                }
            }
        }
        &_outer{
                position: absolute;
                top: 0;
                left: 0;
                width: $radio-size;
                height: $radio-size;
                border: $radio-border-width solid $dd-tundora;
                @include border-radius(100%);
                @include transition(border .25s linear)
        }
        &_inner{
            position: absolute;
            width: $radio-size;
            height: $radio-size;
            top: 0;
            left: 0;
            background-color: $dd-larioja;
            opacity: 0;
            transform: scale(1);
            transition-duration: .25s;
            transition-property: transform, opacity, background-color;
            @include border-radius(100%);
        }
        &__svg{
            @include size(14px);
            margin: 0 3px 0 5px;
            fill: $dd-nobel;
        }
        &__text{
            padding-left: 4px;
            cursor: pointer;
            font-size:$font-default;
            color:$dd-nobel;
            font-weight: 400;
        }
        &__theme{
            &-dark{
                .pt-radio_outer{
                    border-color:$dd-tundora;
                }
                .pt-radio__text{
                    color: $dd-nobel
                }
                &.pt-radio__checked{
                    .pt-radio__text,
                    &:hover .pt-radio__text{
                        color: $dd-larioja;
                    }
                    .pt-radio__svg,
                    &:hover .pt-radio__svg{
                        fill: $dd-larioja;
                    }
                }
                &:hover{
                    .pt-radio__text {
                        color: $dd-white;
                    }
                    .pt-radio__svg {
                        fill: $dd-white;
                    }
                }
                input[type=radio]{
                    &:checked ~ .pt-radio_inner{
                        background-color: $dd-nightrider;
                    }
                }
            }
            &-light{
                .pt-radio_outer{
                    border-color:$dd-gainsboro;
                }
                &.pt-radio__checked{
                    .pt-radio__text,
                    &:hover .pt-radio__text{
                        color: $dd-larioja;
                    }
                    .pt-radio__svg,
                    &:hover .pt-radio__svg{
                        fill: $dd-larioja;
                    }
                }
                &:hover{
                    .pt-radio__text{
                        color: $dd-charcoal;
                    }
                    .pt-radio__svg {
                        fill: $dd-charcoal;
                    }
                }

                input[type=radio]{
                    &:checked ~ .pt-radio_inner{
                        background-color: $dd-white;
                    }
                }

            }
        }
    }
</style>
