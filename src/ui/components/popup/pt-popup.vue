<template>
    <div class="pt-popup" :class="{'short-popup': theme==='short'}">
    	<div class="pt-popup__content"  :style="popupHeight">
    		<a class="pt-popup__close" @click="onClosePopup" v-if="!hideCloseBtn">
	            <pt-svg use-id="icon-close"></pt-svg>
	        </a>
	    	<header class="pt-popup__header">
	    		<h3>
                    <pt-svg v-if="theme==='short' || warn" use-id="icon-warning"></pt-svg>
                    - <span v-html="header"></span> -
                </h3>
	    	</header>
            <div class="pt-popup__main" :style="{height: mainHeight + 'px'}">
                <slot :contentHeight="mainHeight" name="content"></slot>
            </div>
	    	<footer class="pt-popup__footer" :class="{'btn-center':btnCenter}">
                <slot name="footer">
                    <pt-button
                        v-if="otherBtn"
                        size="big"
                        class="pt-btn_other"
                        type="warn"
                        @click="otherHandler"
                    >
                        {{otherBtnText}}
                    </pt-button>
                    <pt-button
                        v-if="leftBtnText && !hideLeftBtn"
                        size="big"
                        class="pt-btn_left"
                        type="cancel-light"
                        :plain="true"
                        :class="{'large': leftBtnSize === 'large'}"
                        @click="onClosePopup"
                    >
                        {{leftBtnText}}
                    </pt-button>

                    <pt-button
                        v-if="rightBtnText && !hideRightBtn"
                        class="pt-btn_right"
                        size="big"
                        type="primary"
                        @click="onSave"
                    >
                        {{ rightBtnText }}
                    </pt-button>
                </slot>
	    	</footer>
    	</div>
    </div>
</template>

<script>
    export default {
        name: 'ptPopup',
        props:{
            header: String,
            theme: {
                default: "default",//short 表示信息提示弹窗
                type:String
            },
            leftBtnText: {
                type: String,
                default: "Cancel"
            },
            rightBtnText: {
                type: String,
                default: "Save"
            },
            otherBtnText:{
                type: String,
                default: "other"
            },
            otherBtn:{
                type: Boolean,
                default: false
            },
            warn:{  //高度不是信息提示弹窗，但是title是信息提示弹窗样式
                type: Boolean,
                default: false
            },
            hideLeftBtn:{ //隐藏左边的按钮（只留下一个按钮）
                type: Boolean,
                default: false
            },
            hideRightBtn:{
                type: Boolean,
                default: false
            },
            hideCloseBtn: {
                type: Boolean,
                default: false
            },
            leftBtnSize: {
                type: String,
                default: 'small'
            },
            customHeight:{ //可以自定义普通窗口高度
                type: [String,Number]
            },
            btnCenter: Boolean
        },
        computed:{
            popupHeight(){
                if(this.theme === 'short') return false;
                if(this.customHeight && !isNaN(+this.customHeight)) return 'height: '+this.customHeight + 'px' + ';min-height:'+this.customHeight + 'px';
                return 'height: '+ (window.innerHeight * 0.6 + 110) + 'px';
            },

            mainHeight(){
                if(this.theme === 'short') return false;
                if( (window.innerHeight * 0.6 + 110) < 530 ){
                    return 393;
                }else{
                    return (window.innerHeight * 0.6 + 110) - 137;
                }
            }
        },
        methods:{
            handleClick(e){
                this.$emit('click',e);
            },
            onClosePopup(e){
                this.$emit('closePopup',e);
            },
            onSave(e){
                this.$emit('savePopup',e);
            },
            otherHandler(e){
                this.$emit('otherHandler',e);
            }
        }
    };
</script>

<style lang="scss">
    @import '../../styles/imports';
	.pt-popup{
		width: 100%;
        height: 100%;
        background-color: rgba(051, 51, 51, .88);
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        overflow-x: hidden;
        overflow-y: auto;
        z-index: 70;
        line-height: 1;
        &.short-popup{
            .pt-popup__content{
                min-height: 50px;
            }
            .pt-popup__main{
                min-height: 80px;
                margin-bottom: 60px;
                display: flex;
                justify-content: center
            }
        }
		&__content {
            opacity: 1;
            width: 720px;
            background-color: $dd-white;
            box-shadow: 0 2px 0 0 rgba(0, 0, 0, 0.2);
            border-radius: 4px;
            // margin:64px auto 0;
            position: relative;
            padding: 30px;
            min-height: 530px;
            margin-left: auto;
            margin-right: auto;
            top: 50%;
            transform: translateY(-50%);
        }
		&__header {
            text-align: center;
            color: $dd-charcoal !important;
            background-color: $dd-white !important;
            h3 {
                font-size: 16px;
                font-family: Arial;
                color: $dd-charcoal;
                margin: 0;
                svg{
                    width: 22px;
                    height: 22px;
                    fill: $dd-supernova;
                    vertical-align: middle;
                }
                em{
                    color: $dd-larioja;
                    font-style: normal;
                }
            }
        }

        &__close {
            position: absolute;
            top: 2px;
            right: -34px;
            width: 24px;
            height: 24px;
            cursor: pointer;
            svg {
                width: 24px;
                height: 24px;
                fill: $dd-silver;
            }
            &:hover {
                svg {
                    fill: $dd-white;
                }
            }
        }
        &__main{
            min-height: 360px;
            max-height: 660px;
            font-size: $font-default;
        }
        &__footer {
            position: absolute;
            left: 30px;
            bottom: 30px;
            width: 660px;
            text-align: center;
            font-size: 0;
            line-height: 15px;
            padding-top: 30px;
            border-top: 1px solid $dd-mercury;
            background-color: $dd-white !important;
            height: auto !important;
            &.btn-center{
                .pt-btn_right{
                    margin-left: 0;
                }
            }
            .pt-btn_left {
                width: 98px;
                padding: 0;
                vertical-align: top;
                &.large{
                    width: 148px;
                    &:hover{
                        background-color: $dd-bittersweet !important;
                        color: $dd-white;
                        border: 1px solid $dd-bittersweet !important;
                    }
                }
            }
            .pt-btn_right {
                margin-left: 30px;
                width: 148px;
                padding: 0;
                vertical-align: top;
            }
            .pt-btn_other{
                width: 98px;
                padding: 0;
                vertical-align: top;
                margin-right: 30px;
            }
        }
        p{
            margin: 0;
        }
	}
</style>
