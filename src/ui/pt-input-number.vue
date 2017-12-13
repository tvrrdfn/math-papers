<template>
	<div class="pt-ui-input__number" :class="{'theme-light':theme === 'light','theme-dark':theme === 'dark','no-blank':value != ''}">
        <div class="pt-ui-input__number_handler-wrapper">
            <span class="pt-ui-input__number_handler-up pt-ui-input__number_handler"  v-on:mousedown="tapEvent('increase', $event)"></span>
            <span class="pt-ui-input__number_handler-down pt-ui-input__number_handler"  v-on:mousedown="tapEvent('decrease', $event)"></span>
        </div>
        <div class="pt-ui-input__number_inner-wrapper">
            <input 
                ref='input'
                :type="type"
                :max="max"
                :min="min"
                :value="value"
                @focus="focus($event)"
                @blur="blur($event)"
                @input="updateValue($event)"
                class="pt-ui-input__number_inner"
            >
        </div>
	</div>
</template>

<script>
    import classList from './utils/classlist';
    export default {
        name: 'ptInputNumber',

        props: {
            name: String,
            type: {
                type: String,
                default: 'text'
            },
            theme:{
                type:String,
                default:'light'
            },
            value: [String, Number],
            max: {
                type: [String, Number],
                default:Infinity
            },
            min: {
                type: [String, Number],
                default:-Infinity
            },
            integer:{
                type:Boolean,
                default:true
            },
            placeholder: String
        },
        data: function(){
            return {
                currentValue: this.value,
                params:{
                    timer: {},
                    element: {},
                    tapStartTime: 0,
                    type: 'increase'
                },
                isFloat: false
            }
        },
        watch:{
            currentValue:function(v){
                this.$emit('change',v);
            }
        },
        computed:{

        },
        methods: {
            clearTapTimer:function(){
                clearTimeout(this.params.timer);
            },
            clearTapHandlers:function(){
                this.clearTapTimer();
                this.params.element.removeEventListener('mouseup', this.clearTapTimer,false);
                this.params.element.removeEventListener('mouseleave', this.clearTapHandlers,false);
            },
            tapEvent:function(aType,aEvent){

                /* 阻止默认事件并解除冒泡 */
                aEvent.preventDefault();
                aEvent.stopPropagation();

                this.params = {
                    element: aEvent.target,
                    startTime: new Date().getTime() / 1000,
                    type: aType
                };

                this.params.element.addEventListener('mouseup', this.clearTapTimer,false)
                this.params.element.addEventListener('mouseleave', this.clearTapHandlers,false);

                this.changeNumber();
            },
            changeNumber:function(){
                var currentDate = new Date().getTime() / 1000;
                var intervalTime = currentDate - this.params.startTime;

                /* 根据长按的时间改变数值变化幅度 */
                if (intervalTime < 1) {
                    intervalTime = 0.5;
                }
                var secondCount = intervalTime * 10;
                if (intervalTime == 3) {
                    secondCount = 50;
                }
                if (intervalTime >= 4) {
                    secondCount = 100;
                }
                var numberElement = this.params.element.parentNode.parentNode.querySelector('input');
                var currentNumber = numberElement.value  === '' ? 0 : parseInt(numberElement.value);
                var error = classList.has(this.params.element.parentNode.parentNode,'error');
                if (this.params.type == 'increase') {
                    if(currentNumber < this.max && !error){
                        this.currentValue = currentNumber += 1;
                    }
                } else if (this.params.type == 'decrease' && !error) {
                    if(currentNumber > this.min){
                        if(this.isFloat){
                            this.currentValu = parseInt(currentNumber);
                            this.isFloat = false;
                        }else{
                            this.currentValue = currentNumber -= 1;
                        }
                    }
                }

                numberElement.value = currentNumber <= 0 ? 0 : currentNumber;

                this.params.timer = setTimeout(this.changeNumber, 1000 / secondCount);
            },
            updateValue:function(e){
                const v = e.target.value,p = e.target.parentNode.parentNode,formated = parseFloat(v);
                var reg = this.integer ? /^[0-9]*$/ : /^\d+(\.)?(\d+)?$/;
                this.isFloat = /\./.test(v);
                if(v === ''){
                    classList.remove(p,'no-blank');
                    return;
                }else{
                    classList.add(p,'no-blank');
                }
                if(!reg.test(v)){
                    this.$refs.input.value = this.currentValue;
                }else{
                    if(formated >= this.min && formated <= this.max){//如果输入的值在最大与最小之间，保存此值
                        this.currentValue = this.$refs.input.value = v;
                    }
                }
                if(formated < this.min || formated > this.max){
                    classList.add(p,'error')
                }else if(formated >= this.min || formated <= this.max){
                    classList.remove(p,'error')
                }
            },
            focus:function(e){
                classList.add(e.target.parentNode.parentNode,'onfocus');
            },
            blur:function(e){
                classList.remove(e.target.parentNode.parentNode,'onfocus');
                if(classList.has(e.target.parentNode.parentNode,'error')){
                    this.$refs.input.value = this.currentValue;
                    classList.remove(e.target.parentNode.parentNode,'error');
                }
            }
        }
    };
</script>
<style lang="sass" rel="stylesheet/scss" scoped>
    @import './styles/imports';
    @import './styles/framework/font';

    $ui-input-height: 26px;
    $ui-input-inner-height: 16px;
    $ui-input-border-radius: 4px;

    .pt-ui-input__number{
        display: inline-block;
        width: 100%;
        color: $dd-mineshaft;
        background-color: transparent;
        border: 1px solid $dd-tundora;
        border-radius: $ui-input-border-radius;
        overflow: hidden;
        margin: 0;
        padding: 0;
        font-size: $font-default;
        height: $ui-input-height;
        line-height: $ui-input-height;
        transition: all .2s ease;
        position: relative;
        &:hover{
            .pt-ui-input__number_handler-wrapper{
                visibility: visible;
            }
        }
        &.onfocus{
            background-color: transparent!important;
            .pt-ui-input__number_handler-wrapper{
                visibility: visible!important;
            }
            &.theme-light{
                border: 1px solid $dd-larioja !important;
                color: $dd-charcoal !important;
            }
            &.theme-dark{
                border: 1px solid $dd-larioja !important;
                color: $dd-white !important;
            }
            .pt-ui-input__number_handler-up{
                border-color: transparent transparent $dd-nobel transparent !important;
            }
            .pt-ui-input__number_handler-down{
                border-color: $dd-nobel transparent transparent transparent !important;
            }
        }
        &.theme-light{
            border: 1px solid $dd-mercury;
            color: $dd-charcoal;
        }
        &.theme-dark{
            border: 1px solid $dd-tundora;
            color: $dd-white;
        }
        &.no-blank{
            background-color: $dd-larioja;
            border: 1px solid $dd-larioja;
            &.theme-light{
                border: 1px solid $dd-larioja;
                color: $dd-white;
            }
            &.theme-dark{
                border: 1px solid $dd-larioja;
                color: $dd-nightrider;
            }
            .pt-ui-input__number_handler-up{
                border-color: transparent transparent $dd-white transparent;
            }
            .pt-ui-input__number_handler-down{
                border-color: $dd-white transparent transparent transparent;
            }
        }
        &.error{
             &.theme-light{
                border: 1px solid $dd-bittersweet !important;
            }
            &.theme-dark{
                border: 1px solid $dd-bittersweet !important;
            }
        }
    }
    .pt-ui-input__number_handler-wrapper{
        width: 8px;
        height: $ui-input-height;
        position: absolute;
        right: 6.3px;
        visibility: hidden;
        .pt-ui-input__number_handler{
            cursor: pointer;
            position: absolute;
            right: 0;
            width: 0;
            height: 0;
            border-style: solid;
        }
        .pt-ui-input__number_handler-up{
            top: 5px;
            border-width: 0 4px 5px 4px;
            border-color: transparent transparent $dd-nobel transparent;
            opacity: 0.6;
            &:hover{
                opacity: 1;
            }
        }
        .pt-ui-input__number_handler-down{
            bottom: 5px;
            border-width: 5px 4px 0 4px;
            border-color: $dd-nobel transparent transparent transparent;
            opacity: 0.6;
            &:hover{
                opacity: 1;
            }
        }
    }
    .pt-ui-input__number_inner-wrapper{
        padding-right: 10px;
        input.pt-ui-input__number_inner{
            width: 100%;
            padding: 0 6px;
            border: 0;
            height: $ui-input-inner-height;
            line-height: $ui-input-inner-height;
            transition: all 0.3s linear;
            background-color: transparent;
        }
    }
</style>
