<!--
组件说明：

@param {String} theme: 模板样式
@param {String} value: 默认为keys中的value字段，例如：codeXXX
@param {Array}  options: 下拉列表，格式：[{name: nameXXX, code: codeXXX}]
@param {Object} keys: 字段说明，格式：{label: 'name', value: 'code'}

@return         字符串，返回所选对象中 Obj[keys['value']] 字段, 例如：codeXXX
-->
<template>
    <div class="pt-select"
    	:class="[
    		theme ? 'pt-select__theme-' + theme : '',
            size ? 'pt-select__size-' + size : ''
    	]"
    	v-clickoutside="handleClickOutSide">

        <pt-tooltip 
            ref="tooltip"
            :open-delay="500" 
            :checkTextOverflow="true" 
            :content="current[keys.label]"
        >
            <div class="pt-select__input" @click="toggleDropdown">
                <div class="pt-select__inner" tooltip-target>
                    {{current[keys.label]}}
                </div>
                <pt-svg use-id="icon-arrow-down" class="pt-select__icon"></pt-svg>
            </div>
        </pt-tooltip>

    	<transition name="pt-select--transition-fade" @after-enter="afterEnter">
	    	<div
                class="pt-select__dropdown"
                tabindex="-1"
                ref="dropdown"
                v-if="showDropdown"
            >
                <div class="pt-select__dropdown-wrap">
                    <pt-scrollbar :suppressScrollX="true" :autoUpdate="false">
                        <ul class="pt-select__dropdown-list">
                            <li class="pt-select__dropdown-item"
                                :class="{'is-selected': current[keys.value] == option[keys.value]}"
                                @click="selectOption(option)"
                                v-for="(option, index) in options"
                            >
                                <pt-tooltip
                                    :placement="tooltipPlacement"
                                    :offset="tooltipOffset"
                                    :openDelay="500"
                                    :content="getOptionTooltip(option)"
                                    :checkTextOverflow="!showTooltip"
                                >
                                    <span @mouseenter="showCustomTip($event,option)"
                                        @click="hideCustomTip"
                                        @mouseout="hideCustomTip">{{option[keys.label]}}</span>
                                </pt-tooltip>
                            </li>
                        </ul>
                    </pt-scrollbar>
                </div>
	    	</div>
    	</transition>
    </div>
</template>

<script>

export default {
    name: 'ptSelect',

    props: {
        theme: String,
    	size: String,
    	value: {
            type: [String, Number],
            required: true
        },
        // 是否默认选中第一项
        default: {
            type: Boolean,
            default() {
                return true;
            }
        },
    	options: {
            type: Array,
            default() {
                return [];
            }
        },
        keys: {
            type: Object,
            default() {
                return {
                    label: 'name',
                    value: 'code',
                    tip: 'tip'
                }
            }
        },
        showTooltip: {
            type: Boolean,
            default: false
        },
        tooltipPlacement: {
            type: String,
            defaule: 'top-start'
        },
        tooltipOffset: {
            type: Number,
            default: 0
        },

        //是否需要重新计算下拉菜单的位置
        resetPosition: {
            type: Boolean,
            default: false
        },
        //重新计算下拉菜单的相对高度临界值
        resetPositionLimitHeight: {
            type: Number,
            default() {
                return window.innerHeight;
            }
        },
        needChangeOption: {
            type: Boolean,
            default: false
        },
        changeOption:{
            type: Object,
            default: null
        },
        needCustomTip:{ //有些时候需要不同于tooltip的提示，个性话的，目前是只有批量邀请用户的时候需要
            type:Boolean
        },
        special:{//有些时候需要不同于tooltip的提示，个性话的，目前是只有批量邀请用户的时候需要
            type: Boolean
        }
    },

    created() {
        console.log('create pt select', this.value)
    },

	data(){
		return {
		    current: this.getCurrent(),
            showDropdown: false,
            showTime:null
        }
	},

    methods: {
        getCurrent() {
            if(this.options == null || this.options.length === 0) return null;

            let current = this.options.find(o => o[this.keys.value] == this.value);

            // 没找到,则设置为第一个为默认值
            if(current == undefined && this.default){
                current = this.options[0];
                this.notify(current);
            }

            return current;
        },

        getOptionTooltip(option) {
            return this.showTooltip ? option[this.keys.tip] : option[this.keys.label];
        },

    	selectOption(option) {
            this.closeDropdown();

            if(this.current[this.keys.value] != option[this.keys.value]) {
                this.current = option;
                this.notify(option);

                this.$nextTick(() => {
                    this.$refs.tooltip.checkText();
                })
            }
        },

        notify(option) {
            this.$emit('input', option[this.keys.value]);
            this.$emit('change', option);
        },

    	toggleDropdown() {
            this.showDropdown = !this.showDropdown;
        },

        //当下拉菜单显示出来以后，有可能会超出窗口，需要重新定位下拉菜单位置
        afterEnter(){
            if(this.showDropdown){
                if(this.resetPosition){
                    var content = this.$refs.dropdown,
                        contentPositionBottom = content.getBoundingClientRect().bottom,
                        elHeight = this.$el.getBoundingClientRect().bottom;

                    if(contentPositionBottom >= this.resetPositionLimitHeight){ //如果下拉菜单过长，溢出窗口底部，需要重新调整下拉菜单位置，距离底部10像素
                        content.style.top = -(contentPositionBottom - this.resetPositionLimitHeight + 20) + 'px';
                    }
                }
            }
        },

        openDropdown() {
            this.showDropdown = true;
        },

        closeDropdown() {
            this.showDropdown = false;
        },

        handleClickOutSide () {
            if (this.showDropdown) this.closeDropdown();
	    },
        //展示自定义提示
        showCustomTip(event,option){
            if(this.showTime)clearTimeout(this.showTime);
            this.showTime = setTimeout(() => {
                if(option['customTip'] && (this.needCustomTip || this.special)){
                    if(document.querySelector('.pt-custom-tip')) return;
                    var customTip = document.createElement('div');
                    customTip.classList.add('pt-custom-tip');
                    var customTipConent = '<span>'+option['customTip']+'</span>';
                    customTip.innerHTML += customTipConent ;
                    if(event.target && event.target.nodeName.toLowerCase() == 'li'){
                        var fatherPosition = event.target.getBoundingClientRect();
                    }else if(event.target && event.target.nodeName.toLowerCase() == 'span'){
                        var fatherPosition = event.target.parentNode.getBoundingClientRect();
                    }
                    customTip.style.width = '300px';
                    var locale = localStorage.getItem('DATADECK_LANG_SETTING');
                    var height = '';
                    var childTop= '';
                    if(locale && locale === 'en_US'){
                        height = 'height: 46px;'
                        childTop = fatherPosition.top - 10;
                    }else{
                        height = 'height: 28px; line-height: 20px;'
                        childTop = fatherPosition.top + 8;
                    }
                    customTip.style.cssText="max-width: 300px; position: absolute; background-color: #000; color: #fff;box-shadow: 0 2px 0 0 rgba(0,0,0,0.1);border-radius: 4px;z-index: 9999; padding: 4px 10px; font-size: 12px; font-family: 'Myriad Pro';" + height +
                        ' top:'+ childTop + 'px;' +
                        ' left:' + (fatherPosition.left + fatherPosition.width + 12) + 'px;';
                    document.body.appendChild(customTip);
                }
            },500)
        },
        hideCustomTip(){
            if(this.showTime)clearTimeout(this.showTime);
            var customTip = document.querySelector('.pt-custom-tip');
            if(customTip){
                document.body.removeChild(customTip);
            }
        }
    },

    watch: {
        options() {
            this.current = this.getCurrent();
        },
        value() {
            this.current = this.getCurrent();
        },
        needChangeOption(n){//有可能需要不点击，但是修改默认展示的需求
            if(n){
                this.selectOption(this.changeOption);
            }
        }
    }
};
</script>


<style lang="scss">
@import "./styles/imports";

$selectWidth: 180px;
$input-height: 26px;
$input-large-height: 30px;
$input-small-height: 24px;
$input-font: 13px;
$input-large-font: 13px;
$input-small-font: 12px;
$dropdownScale: 10px;
$dropdownMaxHeight: 224px;

.pt-select {
	width: 100%;
	display: inline-block;
	position: relative;
	max-width: 100%;
}

.pt-select__input {
	width: 100%;
	position: relative;
    display: flex;
    align-items: center;
    height: 26px;
    font-size: 13px;
    cursor: pointer;
    background-color: $dd-larioja;
    border-radius: 4px;
    color: $dd-nightrider;
    justify-content: space-between;
}

.pt-select__inner {
    @extend %text-ellipsis;
    margin: 0 4px 0 10px;
}

.pt-select__icon {
    @include size(10px);
    margin-right: 10px;
    fill: rgba(130, 150, 25, 0.6);
}

.pt-select__dropdown {
	@include abs-pos(-$dropdownScale, (-$dropdownScale/2), auto, (-$dropdownScale/2));
	z-index: $z-index-select-dropdown;
	background-color: $dd-wildsand;
	box-shadow: 0 2px 0 0 rgba(0,0,0,0.2);
	border-radius: 4px;
	transform-origin: left top 0px;
    transition: top ease .2s .2s;
}

.pt-select__dropdown-wrap {
    margin: 10px 0;
    max-height: $dropdownMaxHeight;
    .ps-scrollbar-y {
        right: 4px !important;
    }
}

.pt-select__dropdown-list {
	list-style: none;
    margin: 0 10px;
    box-sizing: border-box;
    position: relative;
}

.pt-select__dropdown-item {
	height: 26px;
	font-size: $font-default;
    position: relative;
    color: $dd-nobel;
    cursor: pointer;
    padding: 6px 0 0 6px;
    margin-bottom:2px;
    text-align: left;
    &:hover {
       color: $dd-charcoal;
    }
    &.is-selected {
    	color: $dd-larioja;
    }

    span {
        @extend %text-ellipsis;
    }
    &:last-child{
        margin-bottom: 0;
    }
}

.pt-select__theme-light {
    .pt-select__dropdown{
        background-color: $dd-nightrider;
    }
    .pt-select__dropdown-item:hover{
        color: $dd-white;
        &.is-selected{
            color: $dd-larioja;
        }
    }
	.pt-select__input {
		color: $dd-white;
	}
}
.pt-select__theme-dark-transparent{
    .pt-select__dropdown{
        background-color: $dd-nightrider;
    }
    .pt-select__dropdown-item:hover{
        color: $dd-white;
        &.is-selected{
            color: $dd-larioja;
        }
    }
    .pt-select__input {
        color: $dd-silver;
        background-color: transparent;
    }
    .pt-select__icon{
        fill: rgba(153,153,153,.6);
    }
}
.pt-select__theme-dark {
    .pt-select__dropdown{
        background-color: $dd-wildsand;
    }
    .pt-select__dropdown-item:hover{
        color: $dd-charcoal;
        &.is-selected{
            color: $dd-larioja;
        }
    }
    .pt-select__input {
        color: $dd-nightrider;
    }
}

.pt-select__size-large {

    .pt-select__input {
        height: $input-large-height;
        font-size: $input-large-font;
    }
    .pt-select__icon {
        fill: rgba(130, 150, 25, .6);
    }
}
.pt-select__size-small {

    .pt-select__input {
        height: $input-small-height;
        font-size: $input-small-font;
    }
}

// ================================================
// Transitions
// ================================================

.pt-select--transition-fade-enter-active,
.pt-select--transition-fade-leave-active {
    transform-origin: left top 0px;
    transition: transform ease .2s, opacity ease .2s;
}

.pt-select--transition-fade-enter,
.pt-select--transition-fade-leave-active {
    opacity: 0;
    transform: scaleY(0);
}
</style>
