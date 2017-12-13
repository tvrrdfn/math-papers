<template>
    <label class="pt-checkbox"
        :class="[
            looking ? 'pt-checkbox__theme-' + looking : '',
            theme ? 'pt-checkbox__theme-' + theme : ''
        ]"
        >
        <input
            type="checkbox" class="pt-checkbox__input"
            :value="val"
            :checked.prop="isChecked"
            :disabled="disabled"
            @change="onChange"
        />

        <span class="pt-checkbox__marker">
            <pt-svg use-id="icon-save" v-if="!looking"></pt-svg>
            <pt-svg use-id="icon-minus" v-if="looking"></pt-svg>
        </span>
        <pt-tooltip
            :content="tooltipContent"
            :checkTextOverflow="!tooltip"
            :openDelay="500"
            :placement="tooltipPlacement"
            :offset="tooltipOffset"
        >
            <span class="pt-checkbox__label" v-if="label || $slots.default">
                <slot>{{label}}</slot>
            </span>
        </pt-tooltip>
    </label>
</template>

<script>
    function isObject(obj) {
        return obj !== null && typeof obj === 'object';
    }

    function looseEqual(a, b) {
        // eslint-disable-next-line eqeqeq
        return a == b || (
                isObject(a) && isObject(b) ? JSON.stringify(a) === JSON.stringify(b) : false
            );
    }

    export default {
        name: 'ptCheckbox',
        props: {
            name: String,
            label: String,
            theme: String,
            looking: String,
            tooltip: String, //提示内容
            value: {required: true},
            trueValue: {
                default: true
            },
            falseValue: {
                default: false
            },
            checked: {
                type: Boolean,
                default: false
            },
            disabled: {
                type: Boolean,
                default: false
            },
            tooltipPlacement: {
                type: String,
                defaule: 'top'
            },
            tooltipOffset: {
                type: Number,
                default: 0
            }
        },

        created() {
            this.$emit('input', this.val);
        },

        data() {
            return {
                isChecked: this.checked || looseEqual(this.value, this.trueValue)
            };
        },

        computed: {
            val() {
                return this.isChecked ? this.trueValue : this.falseValue;
            },
            tooltipContent() {
                return this.tooltip || this.label || this.$slots.default[0].text;
            }
        },

        methods: {
            onChange(e) {
                this.isChecked = e.target.checked;
                this.$emit('input',this.val);
                this.$emit('change', this.val, this.name, e);
            }
        },

        watch: {
            value() {
                this.isChecked = looseEqual(this.value, this.trueValue);
            }
        }
    };
</script>

<style lang="scss">
@import "./styles/imports";
$checkbox-size: 16px;
$checkbox-border-width: 2px;
$checkbox-checkmarker-width: 2px;

.pt-checkbox{
    display: inline-block;
    margin: 0;
    height: $checkbox-size;
    line-height: $checkbox-size;
    position: relative;
    cursor: pointer;
    -webkit-user-select: none;
    font-size: 0;
}

.pt-checkbox__input{
    position: absolute;
    visibility: hidden;

    &:checked ~ .pt-checkbox__marker{
        border-color: $dd-larioja;
        background-color: $dd-larioja;
        svg{
            opacity: 1;
            fill: $dd-white;
        }
    }
    &:checked ~ .pt-checkbox__label{
        color: $dd-larioja;
    }
}

.pt-checkbox__label{
    font-weight: normal;
    color: $dd-nobel;
    font-size: $font-default;
    vertical-align: middle;
    &:hover {
        color: $dd-charcoal;
    }
}

.pt-checkbox__marker{
    margin-right: 4px;
    display: inline-block;
    vertical-align: middle;
    background-color: $dd-white;
    width: $checkbox-size;
    height: $checkbox-size;
    border: 1px solid $dd-gainsboro;
    @include border-radius(0.2rem);
    transition: background-color .1s ease;
    svg{
        width: 14px;
        height: 14px;
        opacity: 0;
        fill: $dd-nightrider;
    }
}

.pt-checkbox__theme-black {
    .pt-checkbox__input {
        &:checked ~ .pt-checkbox__marker {
            svg{
                fill: $dd-nightrider;
            }
        }
        &:checked ~ .pt-checkbox__label {
            &:hover {
                color: $dd-larioja;
            }
        }
    }
    .pt-checkbox__marker {
        background-color: $dd-nightrider;
        border-color: $dd-tundora;
    }
    .pt-checkbox__label {
        color: $dd-nobel;
        &:hover {
            color:$dd-white;
        }
    }
}
</style>
