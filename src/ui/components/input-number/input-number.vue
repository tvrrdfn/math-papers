<template>
    <div :class="wrapClasses">
        <div :class="handlerClasses">
            <a
                @click="up"
                @mouse.down="preventDefault"
                :class="upClasses"
            >
                <pt-svg 
                    useId="icon-arrow-up" 
                    :class="innerUpClasses"
                    @click="preventDefault"
                ></pt-svg>
            </a>
            <a
                @click="down"
                @mouse.down="preventDefault"
                :class="downClasses"
            >
                <pt-svg 
                    useId="icon-arrow-down"
                    :class="innerDownClasses"
                    @click="preventDefault"
                ></pt-svg>
            </a>
        </div>
        <div :class="inputWrapClasses">
            <input
                type="text"
                autocomplete="off"
                class="pt-ui-input__number_inner"
                :class="inputClasses"
                :disabled="disabled"
                :placeholder="placeholder"
                v-model="modelVal"
                @focus="focus"
                @blur="blur"
                @keydown.38.stop="up"
                @keydown.40.stop="down"
                @input="input"
            >
        </div>
    </div>
</template>
<script>
const prefixCls = 'pt-ui-input__number';
const iconPrefixCls = 'ivu-icon';

function isInteger (obj) {
    return typeof obj === 'number' && obj%1 === 0;
}

function addNum (num1, num2) {
    let sq1, sq2, m;
    try {
        sq1 = num1.toString().split('.')[1].length;
    }
    catch (e) {
        sq1 = 0;
    }
    try {
        sq2 = num2.toString().split('.')[1].length;
    }
    catch (e) {
        sq2 = 0;
    }

    m = Math.pow(10, Math.max(sq1, sq2));
    return (num1 * m + num2 * m) / m;
}

export default {
    name: "ptInputNumber",
    props: {
        max: {
            type: Number,
            default: Infinity
        },
        min: {
            type: Number,
            default: -Infinity
        },
        step: {
            type: Number,
            default: 1
        },
        value: {
            type: [Number, String],
            default: 1
        },
        size: {
            validator (value) {
                return ['small', 'large'].indexOf(value) >= 0 ? true : false;
            }
        },
        disabled: {
            type: Boolean,
            default: false
        },
        placeholder: [String, Number],

        //是否允许为空
        isEmpty: {
            type: Boolean,
            default: true
        },

        //是否允许小数
        isDecimal: {
            type: Boolean,
            default: false
        },

        //是否允许负数
        isNegative: {
            type: Boolean,
            default: true
        },

        //当value为空时，是否需要校验极限值(特殊情况对应Y轴多个组件之间的比较)
        isCheckEmptyValue: {
            type: Boolean,
            default: true
        },

        theme:{
            type:String,
            default:'light'
        }
    },
    data () {
        return {
            focused: false,
            upDisabled: false,
            downDisabled: false,
            modelVal: null, //input model
            prevVal: null, //上一次有效值
            lastInputVal: null, //上一次有效输入值
            isError: false
        };
    },
    computed: {
        wrapClasses () {
            return [
                `${prefixCls}`,
                `${prefixCls}-theme-${this.theme}`,
                {
                    [`${prefixCls}-${this.size}`]: !!this.size,
                    [`${prefixCls}-disabled`]: this.disabled,
                    [`${prefixCls}-focused`]: this.focused,
                    [`${prefixCls}-error`]: this.isError,
                    [`${prefixCls}-no-blank`]: this.modelVal !== '' && !this.focused
                }
            ];
        },
        handlerClasses () {
            return `${prefixCls}-handler-wrapper`;
        },
        upClasses () {
            return `${prefixCls}-handler`
        },
        innerUpClasses () {
            return [
                `${prefixCls}-handler-inner ${prefixCls}-handler-inner-up`,
                {
                    [`${prefixCls}-handler-disabled`]: this.upDisabled,
                }
            ];
        },
        downClasses () {
            return `${prefixCls}-handler`;
        },
        innerDownClasses () {
            return [
                `${prefixCls}-handler-inner ${prefixCls}-handler-inner-down`,
                {
                    [`${prefixCls}-handler-disabled`]: this.downDisabled,
                }
            ];
        },
        inputWrapClasses () {
            return `${prefixCls}-input-wrapper`;
        },
        inputClasses () {
            return `${prefixCls}-input`;
        }
    },
    methods: {
        init(){
            this.modelVal = this.value;
            this.prevVal = this.value;
            this.lastInputVal = this.value;
        },
        preventDefault (e) {
            e.preventDefault();
        },
        up (e) {
            const targetVal = Number(e.target.value);
            if (this.upDisabled && isNaN(targetVal)) {
                return false;
            }
            this.changeStep('up', e);
        },
        down (e) {
            const targetVal = Number(e.target.value);
            if (this.downDisabled && isNaN(targetVal)) {
                return false;
            }
            this.changeStep('down', e);
        },
        changeStep (type, e) {
            if (this.disabled) {
                return false;
            }

            const targetVal = Number(e.target.value);
            let val = Number(this.modelVal);
            const step = Number(this.step);
            if (isNaN(val)) {
                return false;
            }

            // input a number, and key up or down
            if (!isNaN(targetVal)) {
                if (type === 'up') {
                    if (addNum(targetVal, step) <= this.max) {
                        val = targetVal;
                    } else {
                        return false;
                    }
                } else if (type === 'down') {
                    if (addNum(targetVal, -step) >= this.min) {
                        val = targetVal;
                    } else {
                        return false;
                    }
                }
            }

            if (type === 'up') {
                let o = isInteger(val) ? val : parseInt(val);
                val = Math.max(addNum(o, step), this.min);
            } else if (type === 'down') {
                let o = isInteger(val) ? val : parseInt(val)+1;
                val = Math.min(addNum(o, -step), this.max);
            }

            if( !this.valIsError(val) ){
                this.modelVal = val;
                this.setValue(val);
            }
        },
        setValue (val) {
            this.prevVal = val;
            this.$emit('change', val);
            console.log('setValue', this.prevVal, this.modelVal);
        },
        focus () {
            this.focused = true;
        },
        blur (e) {
            this.focused = false;
            this.resetTargetVal(e);
        },
        keyDown (e) {
            if (e.keyCode === 38) {
                e.preventDefault();
                this.up(e);
            } else if (e.keyCode === 40) {
                e.preventDefault();
                this.down(e);
            }
        },
        input (e) {
            let val = e.target.value.trim(),
                formated = parseFloat(val);

            if(this.isInputPass(val)){
                this.lastInputVal = val;
            } else {
                this.lastInputVal = this.isValueNumber(formated) ? formated : this.lastInputVal;
            }

            this.modelVal = this.lastInputVal;
            this.isError = this.valIsError(this.modelVal);
            if(!this.isError) this.setValue(this.modelVal);
        },
        valIsError(val){
            if(val === '')
                return !this.isEmpty || this.isCheckEmptyValue;
            else
                return !this.isValueNumber(val) || (val > this.max || val < this.min);
        },
        changeVal (val) {
            if (this.isValueNumber(val) || val === 0) {
                val = Number(val);
                const step = this.step;

                this.upDisabled = val + step > this.max;
                this.downDisabled = val - step < this.min;
            } else {
                if(val === '' && this.isEmpty){
                    this.upDisabled = false;
                    this.downDisabled = false; 
                } else {
                    this.upDisabled = true;
                    this.downDisabled = true; 
                }
            }
        },
        //设置输入框内容
        resetTargetVal () {
            if(this.isError) {
                this.modelVal = this.prevVal;
                this.isError = false;
            } else {
                this.modelVal = this.modelVal === '' ? '' : parseFloat(this.modelVal);
            }
        },
        //是否为数字
        isValueNumber (val) {
            let reg =  /^\d+$/;

            if(this.isDecimal && this.isNegative){
                reg = /(^-?\d+?(\.)?(\d+)$)|(^-?\d+$)/;
            } else if(this.isDecimal){
                reg = /(^\d+(\.)?(\d+)$)|(^\d+$)/;
            } else if(this.isNegative){
                reg = /^-?\d+$/;
            }
            return reg.test(val + '');
        },
        //输入校验
        isInputPass (val) {
            let reg =  /^\d*$/;

            if(this.isDecimal && this.isNegative){
                reg = /^-?(\d+)?(\.)?(\d+)?$/;
            } else if(this.isDecimal){
                reg = /^(\d*)?(\.)?(\d*)?$/;
            } else if(this.isNegative){
                reg = /^-?\d*$/;
            }
            return reg.test(val + '');
        }
    },
    mounted () {
        this.init();
        this.changeVal(this.modelVal);
    },
    watch: {
        value(val) {
            this.init();
            this.changeVal(val);
        },

        modelVal (val) {
            this.changeVal(val);
        },

        max() {
            this.changeVal(this.modelVal);
        },

        min() {
            this.changeVal(this.modelVal);
        }
    }
};
</script>


<style lang="scss">
@import "../../styles/imports";
@import '../../styles/imports';
@import '../../styles/framework/font';

$ui-input-height: 26px;
$ui-input-inner-height: 16px;
$ui-input-border-radius: 4px;
$ui-input-handler-width: 8px;

.pt-ui-input__number{
    display: inline-block;
    width: 100%;
    border-radius: $ui-input-border-radius;
    overflow: hidden;
    margin: 0;
    padding: 0;
    font-size: $font-default;
    height: $ui-input-height;
    transition: background-color .2s ease, border .2s ease;
    position: relative;

    &:hover{
        .pt-ui-input__number-handler-wrapper {
            visibility: visible;
        }
    }

    //上下箭头
    &-handler-wrapper {
        width: $ui-input-handler-width;
        height: 100%;
        position: absolute;
        right: 6px;
        visibility: hidden;
        display: inline-block;
        font-size: 0;
        padding-top: 3px;
        .pt-ui-input__number-handler {
            width: 8px;
            height: 8px;
            display: inline-block;
            cursor: pointer;
            &:first-child{
                margin-bottom: 2px;
            }
            &:hover .pt-ui-input__number-handler-inner{
                fill: $dd-nobel;
            }
            &-inner {
                @include size(8px, 8px);
                fill: $dd-ao;
            }
        }
    }

    //输入框
    &-input-wrapper {
        height: 100%;
        padding-right: $ui-input-handler-width;

        .pt-ui-input__number-input {
            width: 100%;
            height: 100%;
            padding: 6px 0 5px 10px;
            border: 0;
            line-height: $ui-input-height - 2;
            transition: all 0.3s linear;
            background-color: transparent;

            &::-moz-placeholder {
              color: $dd-silver;
              opacity: 1;
            }
            &:-ms-input-placeholder {
              color: $dd-silver;
            }
            &::-webkit-input-placeholder {
              color: $dd-silver;
            }
        }
    }
    
    //白色模板
    &-theme-light {
        border: 1px solid $dd-gainsboro;
        background-color: $dd-white;
        color: $dd-charcoal;

        .pt-ui-input__number-handler {
            &:hover .pt-ui-input__number-handler-inner {
                fill: $dd-nobel;
            }
            
            &-inner {
                fill: $dd-ao;
            }
        }

        &.pt-ui-input__number-focused {
            border: 1px solid $dd-larioja;
            background-color: $dd-white;
            color: $dd-charcoal;

            .pt-ui-input__number_handler-wrapper{
                visibility: visible;
            }

            .pt-ui-input__number-handler {
                &:hover .pt-ui-input__number-handler-inner {
                    fill: $dd-nobel;
                }

                &-inner {
                    fill: $dd-ao;
                }
            }
        }

        &.pt-ui-input__number-no-blank {
            background-color: $dd-larioja;
            border: 1px solid $dd-larioja;
            color: $dd-white;

            .pt-ui-input__number-handler {
                &:hover .pt-ui-input__number-handler-inner {
                    fill: $dd-white;
                }

                &-inner {
                    fill: $dd-bo;
                }
            }
        }
    }

    //黑色模板
    &-theme-dark {
        border: 1px solid $dd-tundora;
        background-color: transparent;
        color: $dd-white;

        .pt-ui-input__number-handler {
            &:hover .pt-ui-input__number-handler-inner {
                fill: $dd-nobel;
            }

            &-inner {
                fill: $dd-ao;
            }
        }

        &.pt-ui-input__number-focused {
            border: 1px solid $dd-larioja;
            background-color: transparent;
            color: $dd-white;

            .pt-ui-input__number_handler-wrapper{
                visibility: visible;
            }

            .pt-ui-input__number-handler {
                &:hover .pt-ui-input__number-handler-inner {
                    fill: $dd-nobel;
                }

                &-inner {
                    fill: $dd-ao;
                }
            }
        }

        &.pt-ui-input__number-no-blank {
            background-color: $dd-larioja;
            border: 1px solid $dd-larioja;
            color: $dd-nightrider;

            .pt-ui-input__number-handler {
                &:hover .pt-ui-input__number-handler-inner {
                    fill: $dd-white;
                }

                &-inner {
                    fill: $dd-bo;
                }
            }
        }
    }

    //错误提示
    &-error {
        border: 1px solid $dd-bittersweet !important;
    }
}
</style>
