<template>
    <div class="pt-dropdown"
         :class="[
            size ? 'pt-dropdown__size-' + size : '',
    		theme ? 'pt-dropdown__theme-' + theme : '',
    		loading ? 'loading' : '',
            displayObj.isActive ? 'active' : '',
            hasWarning ? 'warning' :''
    	]"
         v-clickoutside="handleClickOutSide">

        <!--已选内容展示区-->
        <div 
            class="pt-dropdown__input" 
            @click="toggle" 
            :class="{
                'show-add':showAdd,
                'has-icon': inputHasIcon && inputIconValue,
                'not-found': !foundValueForOptions && notFoundValueText
            }"
        >
            <i class="pt-dropdown__icon" v-loading="loading">
                <pt-svg use-id="icon-arrow-down"></pt-svg>
            </i>

            <!--<slot :item="current">-->
            <!--<input type="text"-->
            <!--readonly="readonly"-->
            <!--autocomplete="off"-->
            <!--class="pt-dropdown__inner"-->
            <!--:value="displayObj.name"-->
            <!--&gt;-->
            <!--</slot>-->

            <i class="pt-dropdown__input-icon" v-if="inputIconValue">
                <pt-svg :use-id="inputIconValue"></pt-svg>
            </i>

            <div class="pt-dropdown__inner">
                <!-- v-if对应loading后，文字悬浮提示不会生效-->
                <pt-tooltip 
                    ref="tooltip"
                    :open-delay="500" 
                    :checkTextOverflow="true" 
                    :content="displayObj.name"
                    :offset="5"
                    v-if="!loading"
                >
                    <span tooltip-target>{{displayObj.name}}</span>
                </pt-tooltip>
                <span v-else>{{displayObj.name}}</span>
            </div>
            <!-- <input 
                type="text"
                readonly="readonly"
                autocomplete="off"
                class="pt-dropdown__inner"
                :value="displayObj.name"
            > -->
            <pt-tooltip 
                :open-delay="500" 
                :content="addBtnTooltip"
                :disabled="!addBtnTooltip"
            >
                <span v-if="showAdd" class="pt-dropdown__add" @click.stop="add">
                    <pt-svg use-id="icon-plus"></pt-svg>
                </span>
            </pt-tooltip>
        </div>

        <transition name="pt-dropdown--transition" @after-enter="onAfterEnter">
            <!-- .transparent 默认隐藏，为了在事件(onAfterEnter)进行位置调整时，隐藏位置的变化-->
            <div
                class="pt-dropdown__dropdown"
                :class="{'no-data': !data ||(data && data.length == 0)}"
                tabindex="-1"
                ref="dropdown"
                v-if="showDropdown"
            >
                <div
                    v-if="data && data.length > 0"
                    class="pt-dropdown__dropdown-wrapall"
                    :class="{'pt-dropdown__dropdown-wrapall-no-search': !isNeedSearch}"
                >
                    <pt-search
                        v-if="isNeedSearch"
                        :theme="theme ? (theme === 'black' ? 'light' : 'black') : 'black'"
                        :name="name"
                        :list="data"
                        @change="onSearch"
                        :attrName="attrName"
                        class="pt-dropdown__dropdown-wrap-search"
                    ></pt-search>

                    <div v-if="renderData.length" class="pt-dropdown__dropdown-wrap-body">
                        <div class="pt-dropdown__dropdown-body" :class="{'has-folder': hasFolder}">
                            <!--Tree 结构组件 -->
                            <pt-scrollbar v-if="type == 'tree'" ref="scrollbar">
                                <ul 
                                    class="pt-dropdown__dropdown-list" 
                                    v-for="item of renderData"
                                    :key="item[attrVal]"
                                >
                                    <tree-item
                                        :model="item"
                                        :searchKey="searchKey"
                                        :name="name"
                                        :folderIcon="folderIcon"
                                        :isNeedTooltip="isNeedTooltip"
                                        :tooltipPlacement="tooltipPlacement"
                                        :tooltipOffset="tooltipOffset"
                                        :attrVal="attrVal"
                                        v-model="value"
                                        @change="selectOption"
                                    >
                                    </tree-item>
                                </ul>
                            </pt-scrollbar>

                            <!--List 组件-->
                            <pt-scrollbar v-if="type == 'list'" ref="scrollbar">
                                <ul class="pt-dropdown__dropdown-list">

                                    <li
                                        v-if="multiple"
                                        class="pt-dropdown__dropdown-item"
                                    >
                                        <pt-checkbox
                                            :theme="theme ? (theme === 'black' ? 'light' : 'black') : 'light'"
                                            v-model="all"
                                            @change="onAllChange"
                                        >
                                            {{allDisplayName}}
                                        </pt-checkbox>
                                    </li>
                                        
                                    <li
                                        class="pt-dropdown__dropdown-item"
                                        :class="getChoosenCls(item)"
                                        @click="selectOption(item)"
                                        v-for="item of renderData"
                                    >
                                        <pt-tooltip
                                            :content="item[attrName]"
                                            :openDelay="500"
                                            :checkTextOverflow="true"
                                            :disabled="!isNeedTooltip"
                                            :placement="tooltipPlacement"
                                            :offset="tooltipOffset"
                                        >
                                            <!-- 带复选框 -->
                                            <pt-checkbox
                                                v-if="multiple"
                                                :theme="theme ? (theme === 'black' ? 'light' : 'black') : 'light'"
                                                v-model="item.checked"
                                                @change.stop="onCheckboxChange(item)"
                                            >
                                                {{item[attrName]}}
                                            </pt-checkbox>
                                        
                                            <slot v-else :item="item">
                                                <span class="title" tooltip-target>{{item[attrName]}}</span>
                                            </slot>
                                        </pt-tooltip>
                                    </li>
                                </ul>
                            </pt-scrollbar>
                        </div>
                    </div>

                    <div v-else class="no-data">
                        <p>{{ $t("common.no_search_data")}}</p>
                    </div>
                </div>

                <div v-else class="no-data">
                    <p>{{ noDataText || $t('common.no_data') }}</p>
                </div>
            </div>
        </transition>
        <!--ptlist 列表内容展示区-->
        <!-- <transition name="pt-dropdown--transition-fade">

        </transition> -->
        <p class="pt-dropdown__warning" v-if="hasWarning"><span>{{warningText}}</span></p>
    </div>
</template>

<script>
    import cloneUtils from '@/utils/clone.utils';
    import treeUtils  from '@/utils/tree.utils';
    import arrayUtils   from '@/utils/array.utils';
    import treeItem from './tree-item.vue';

    import ptList from '../list/list.vue';

    export default {
        name: 'ptDropdown',

        props: {
            name: [String, Number],

            value: [String, Number],

            // 组件类型
            type: {
                type: String,
                default: 'list'
            },

            // 是否正在加载
            isLoading: {
                type: Boolean,
                default: () => false
            },

            loadingText: {
                type: String,
                default: () => "Loading..."
            },

            noDataText: {
                type: String,
                default: () => null
            },

            // 提示文案
            placeholder: String,

            theme: String,

            size: String,

            options: {
                type: Array,
                default() {
                    return [];
                }
            },

            attrVal: {
                type: String,
                default: "id"
            },

            attrName: {
                type: String,
                default: "name"
            },

            showAdd: {
                type: Boolean,
                default() {
                    return false;
                }
            },

            multiple: Boolean,

            folderIcon: {
                type: String,
                default: 'folder'
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

            beforeChange: {
                type: Function,
                default() {
                    return function () {
                        return true;
                    };
                }
            },
            inputHasIcon:{
                type: Boolean,
                default: false
            },
            inputIconValue: String,

            inputCurrentValue: String, // 有时选择某项值后，不需在下拉中再显示，此时需指定显示值，否则找不到current

            hasWarning:{
                type: Boolean,
                default: false
            },

            warningText: String,

            notFoundValueText: String, //有value值，但在options内找不到时的提示

            selectedText: {
                type: String,
                default: " selected"
            },

            isNeedSearch: {
                type: Boolean,
                default: true
            },

            isNeedTooltip: {
                type: Boolean,
                default: true
            },
            
            tooltipPlacement: {
                type: String,
                defaule: 'top'
            },

            tooltipOffset: {
                type: Number,
                default: 0
            },

            addBtnTooltip: String
        },

        data(){
            return {
                current: null,                          // 当前选中
                data: null,
                searchData: null,                       // 搜索结果
                searchKey: "",
                loading: this.isLoading,
                showDropdown: false,
                all: false,
                foundValueForOptions: true
            }
        },

        created() {
            console.log('create dropdown')
            // 设置默认选中
            this.data = cloneUtils.deep(this.options);
            this.setCurrent();
            this.$emit('onCreate', this.name);
        },

        computed: {
            renderData() {
                return this.searchKey ? this.searchData : this.data;
            },

            selectedLength() {
                if (!this.multiple || this.data == null || this.data.length === 0) return 0;
                return this.data.filter(o => o.checked).length;
            },

            hasFolder(){
                return this.renderData && this.renderData.length && this.renderData[0].child && this.renderData[0].child.length;
            },

            // TODO 重构该方法
            displayObj() {
                let rs = {
                    isActive: false,
                    name: this.placeholder
                };

                // loading
                if (this.loading) {
                    rs.isActive = false;
                    rs.name = this.loadingText;
                    return rs;
                }

                // 如果有指定显示值，则直接显示
                if (this.inputCurrentValue) {
                    rs.isActive = true;
                    rs.name = this.inputCurrentValue;
                    return rs;
                }

                // 多选()
                if (this.multiple) {
                    if (this.selectedLength > 1) {
                        rs.isActive = true;
                        rs.name = this.selectedLength + this.selectedText;
                    } else if (this.selectedLength == 1) {
                        rs.isActive = true;
                        rs.name = this.data.find(o => o.checked)[this.attrName];
                    } else {
                        rs.isActive = false;
                        rs.name = this.placeholder;
                    }
                    return rs;
                }

                // 单选
                if (!this.current) {
                    rs.isActive = false;
                    rs.name = !this.foundValueForOptions && this.notFoundValueText ? this.notFoundValueText : this.placeholder;
                } else {
                    rs.isActive = true;
                    rs.name = this.current[this.attrName];
                }

                return rs;
            },

            allDisplayName() {
                let name = "All";
                if (this.data == null || this.data.length === 0) return name;

                if (this.selectedLength) {
                    name = this.selectedLength + this.selectedText;
                }
                return name;
            }
        },

        methods: {
            selectOption(option) {
                if (this.multiple) return;

                if (this.current == null || option[this.attrVal] != this.current[this.attrVal]) {
                    if (!this.beforeChange.call(this, option)) return;

                    this.current = option;
                    this.searchKey = ""; // 清空搜索
                    this.$emit('input', this.current[this.attrVal]);
                    this.$emit('change', option, this.name);

                    this.$nextTick(() => {
                        this.$refs.tooltip.checkText();
                    })
                }

                if (!this.multiple) {
                    this.close();
                }
            },

            getChoosenCls(option) {
                if (!this.current) return '';
                if (option[this.attrVal] == this.current[this.attrVal]) return 'is-selected';
            },

            setCurrent() {
                if (this.value == null || this.data == null) {
                    this.current = null;
                } else {
                    if (this.type == 'tree') {
                        let node = {id: -1, child: this.data};
                        this.current = treeUtils.search(node, this.value);
                    } else {
                        this.current = this.data.find(o => o[this.attrVal] == this.value);
                    }
                }
            },

            onSearch(options, searchKey){
                this.searchData = options;
                this.searchKey = searchKey;

                if (this.type == 'tree') {
                    treeUtils.setExpand({id: -1, child: this.data}, this.value);
                }
            },

            /**
             * 多选功能相关方法
             */
            onAllChange() {
                this.data.forEach(o => o.checked = this.all);

                if (this.searchData) {
                    this.searchData.forEach(o => o.checked = this.all);
                }

                this.$emit('change', this.data.filter(o => o.checked == true));
            },

            onCheckboxChange(model){
                // 在搜索模式中
                if (this.searchKey) {
                    let index = arrayUtils.indexOf(this.data, o => o[this.attrValue] == model[this.attrValue]);
                    let newValue = this.data[index];
                    newValue.checked = model.checked;
                    this.$set(this.data, index, newValue);
                }

                this.all = this.data.every(o => o.checked);

                this.$emit('change', this.data.filter(o => o.checked == true));
            },

            //当下拉菜单显示出来以后，有可能会超出窗口，需要重新定位下拉菜单位置
            onAfterEnter(){
                if(this.showDropdown){
                    if(this.resetPosition){
                        var content = this.$refs.dropdown,
                            contentPositionBottom = content.getBoundingClientRect().bottom;

                        if(contentPositionBottom >= this.resetPositionLimitHeight){ //如果下拉菜单过长，溢出窗口底部，需要重新调整下拉菜单位置，距离底部10像素
                            content.style.top = -(contentPositionBottom - this.resetPositionLimitHeight + 20) + 'px';
                        }
                    }
                }
                // this.$nextTick(() => {
                //     this.$refs.dropdown.classList.remove('transparent');
                // })
            },

            toggle() {
                if (this.loading) return;
                this.showDropdown = !this.showDropdown;
                this.$emit('removeWarn');//点击时，去掉warn
            },

            open() {
                this.showDropdown = true;
            },

            close() {
                this.showDropdown = false;
            },

            handleClickOutSide () {
                if (this.showDropdown) {
                    this.searchKey = "";
                    this.close();
                }
            },

            add(e) {
                this.$emit('add', this.name);
            }
        },

        watch: {
            /**
             * 监听异步传递过来的options, 会重新设置current
             */
            options() {
                this.data = cloneUtils.deep(this.options);
                this.setCurrent();

                // 初始化all
                if (this.multiple && this.data) {
                    this.all = this.data.every(o => o.checked);
                }

                //如果有值，则需判断当前是否存在于当前列表中
                if(this.value) this.foundValueForOptions = !!this.current;

                //如果下了展开，则更新滚动条
                if(this.showDropdown){
                    this.$nextTick(() => {
                        this.$refs.scrollbar.update();
                    })
                }
            },

            /**
             * 监听异步传递过来loading
             */
            isLoading() {
                this.loading = this.isLoading;
            },

            /**
             * 当前选中值,也可能是异步传递过来的,需要进行监听
             */
            value() {
                this.setCurrent();
            },

            /**
             * 展开的时候需要重置展开expand状态
             * @param value
             */
            showDropdown(value) {
                if(value) {
                    this.data = cloneUtils.deep(this.options);
                    let node = {id: -1, child: this.data};
                    treeUtils.setExpand(node, this.value);

                    // 处理为空时1500ms后自动关闭
                    if(this.data == null || this.data.length == 0){
                        setTimeout(() => {
                            this.close();
                        }, 1500);
                    }
                }
            }
        },

        components: {
            ptList,
            treeItem
        }
    };
</script>


<style lang="scss">
    @import "../../styles/imports";

    $selectWidth: 360px;
    $inputWidth: 330px;
    $inputHeight: 30px;
    $dropdownScale: 10px;
    $dropdownMaxHeight: 278px;

    .pt-dropdown {
        width: $selectWidth;
        display: inline-block;
        position: relative;
        &.loading {
            .pt-dropdown__icon {
                svg {
                    opacity: 0;
                }
                .loading-dom {
                    margin-top: 12px;
                    margin-left: -10px;
                    img {
                        width: 16px;
                        height: 16px;
                    }
                }
            }
            .show-add{
                .loading-dom{
                    margin-left: 12px !important;
                }
            }
        }

        & .no-data p {
            height: 36px;
            line-height: 36px;
            text-align: center;
            margin: 0;
            color: $dd-nobel;
            display: block;
            font-size: $font-default;
        }
        &.active {
            .pt-dropdown__inner {
                background-color: $dd-larioja;
                border: 1px solid $dd-larioja;
                color: $dd-white;
            }
        }
        &.warning{
            .pt-dropdown__inner{
                border: 1px solid $dd-bittersweet !important;
            }
        }
        &__input {
            width: $selectWidth;
            position: relative;
            &.show-add {
                .pt-dropdown__inner {
                    border-right: none;
                }
            }
            &.has-icon{
                .pt-dropdown__inner{
                    padding-left: 36px;
                }
                .pt-dropdown__input-icon{
                    display: flex;
                }
            }
            &.not-found {
                .pt-dropdown__inner{
                    background-color: $dd-supernova !important;
                    color: $dd-charcoal !important;
                }
                .pt-dropdown__icon svg {
                    fill: $dd-nobel !important;
                    opacity: .6 !important;
                }
            }
            .pt-dropdown__input-icon{
                position: absolute;
                left: 10px;
                top: 5px;
                @include size(20px);
                line-height: 20px;
                text-align: center;
                background-color: $dd-white;
                border-radius: 50%;
                display: none;
                align-items: center;
                justify-content: center;
                svg{
                    @include size(16px);
                }
            }
        }
        &__inner {
            width: $inputWidth;
            height: $inputHeight;
            font-size: $f;
            cursor: pointer;
            appearance: none;
            background-color: $dd-white;
            border: 1px solid $dd-gainsboro;
            border-radius: 4px 0 0 4px;
            box-sizing: border-box;
            color: $dd-silver;
            line-height: 1;
            outline: none;
            padding: 0 20px 0 10px;
            display: flex;
            align-items: center;
            float: left;
            span {
                line-height: 1.4em;
                @extend %text-ellipsis;
            }
        }
        &__icon {
            @include size($inputHeight, 100%);
            cursor: pointer;
            position: absolute;
            top: 5px;
            right: 19px;
            svg {
                opacity: 1;
                width: 10px;
                height: 10px;
                fill: rgba(0, 0, 0, .16);
                vertical-align: -1px;
            }
        }
        &__add {
            display: inline-flex;
            float: right;
            width: 30px;
            height: 30px;
            @extend %flex-center;
            line-height: 30px;
            text-align: center;
            background-color: $dd-white;
            border-radius: 0 4px 4px 0;
            position: relative;
            cursor: pointer;
            transition: all .2s ease;
            background-color: $dd-white;
            border: 1px solid $dd-gainsboro;
            box-shadow: inset 0 -1px 0 0 $dd-co;

            svg {
                width: 16px;
                height: 16px;
                fill: $dd-dimgray;
                vertical-align: -3px;
            }
            &:hover {
                border: 1px solid $dd-pizazz;
                background-color: $dd-pizazz;

                svg {
                    fill: $dd-white;
                }
            }
        }
        &__dropdown {
            @include abs-pos(-$dropdownScale, (-$dropdownScale/2), auto, (-$dropdownScale/2));
            position: absolute;
            top: -10px;
            right: -6px;
            left: -6px;
            z-index: $z-index-select-dropdown;
            background-color: $dd-nightrider;
            box-shadow: 0 2px 0 0 rgba(0, 0, 0, 0.2);
            border-radius: 4px;
            max-height: $dropdownMaxHeight;
            transition: top ease .2s .2s;
            padding-bottom: 10px;
            &.transparent {
                opacity: 0;
            }
            &.no-data{
                padding-top: 10px;
            }
            &.show {
                transform: scaleY(1);
                opacity: 1;
            }
            &-wrapall {
                padding-top: 46px;
                position: relative;
                .pt-dropdown__dropdown-wrap-search {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: calc(100% - 20px);
                }
                .pt-dropdown__dropdown-wrap-body {
                    // overflow-y: auto;
                }
            }
            &-wrapall-no-search {
                padding-top: 10px;

                .pt-dropdown__dropdown-list {
                    margin: 0 10px 0;
                }
            }
            .pt-ui-search {
                margin: 10px 10px 0;
            }
            .pt-dropdown__dropdown-body {
                margin: 0;

                .ps-scrollbar-y-rail {
                    // right: 4px;
                }
            }
            &-list {
                list-style: none;
                padding: 0;
                margin: 0 16px 0;
                box-sizing: border-box;
                position: relative;
                .cascade {
                    & > span {
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        width: 100%;
                    }
                    span {
                        svg {
                            width: 16px;
                            height: 16px;
                            vertical-align: middle;
                            fill: $dd-dimgray;

                            &.arrow {
                                width: 12px;
                                height: 12px;
                                margin-top: -3px;
                                transition: all .2s ease;
                            }
                        }
                        color: $dd-nobel;
                        font-size: $font-default;
                        cursor: pointer;
                        height: 26px;
                        line-height: 26px;
                        // display: inline-block;
                        margin-bottom: 2px;
                        @extend %text-ellipsis;
                        width: 100%;
                        &:hover {
                            color: $dd-white;
                            svg {
                                fill: $dd-white;
                            }
                        }
                    }
                    & > ul {
                        display: none;
                        margin: 0;
                    }
                    &.on {
                        & > ul {
                            display: block;
                            padding-left: 20px;
                        }
                        .current span {
                            color: $dd-larioja;
                        }
                        & > span {
                            svg.arrow {
                                transform: rotate(90deg);
                            }
                        }
                    }
                }
            }
            &-item {
                height: 26px;
                font-size: $font-default;
                position: relative;
                color: $dd-nobel;
                line-height: 26px;
                cursor: pointer;
                padding: 0 6px;
                margin-bottom: 2px;
                text-align: left;
                user-select: none;
                -moz-user-select: none;
                -webkit-user-select: none;
                -ms-user-select: none;
                // @extend %text-ellipsis;

                &:hover {
                    color: $dd-white;
                }
                &.is-selected,
                &.current {
                    color: $dd-larioja !important;
                    &:hover {
                        color: $dd-larioja;
                    }
                }

                span.title {
                    @extend %text-ellipsis;
                }
            }
            .no-data p {
                height: 36px;
                line-height: 36px;
                text-align: center;
                margin: 0;
                color: $dd-nobel;
                display: block;
            }
        }
        &__warning{
            display: inline-block;
            position: absolute;
            left: 100%;
            margin: 0 0 0 2px;
            height: 28px;
            line-height: 28px;
            width: 100%;
            background-color: transparent;
            span{
                border-radius: 4px;
                background-color: $dd-bittersweet;
                color: $dd-white;
                font-size: $font-sm;
                display: inline-block;
                padding: 0 10px;
            }
        }
    }

    .pt-dropdown__theme-black.pt-dropdown {

        &.active {
            .pt-dropdown__inner {
                background-color: $dd-larioja;
                border: 1px solid $dd-larioja;
                color: $dd-nightrider;
            }
            .pt-dropdown__icon {
                svg {
                    fill: rgba(0, 0, 0, .16);
                }
            }
        }
        .pt-dropdown__inner {
            background-color: $dd-larioja;
            border-color: $dd-larioja;
            color: $dd-nightrider;
        }
        .pt-dropdown__add {
            background-color: $dd-dimgray;
            &:hover {
                background-color: $dd-pizazz;
            }
        }
        .pt-dropdown__dropdown {
            background-color: $dd-wildsand;
            &-item {
                color: $dd-nobel;
                &:hover {
                    color: $dd-charcoal;
                }
                &.is-selected, &.current {
                    color: $dd-larioja;
                    &:hover {
                        color: $dd-larioja;
                    }
                }
            }
            &-list{
                .cascade {
                    span {
                        svg {
                            fill: $dd-silver;
                        }
                        color: $dd-silver;
                        &:hover {
                            color: $dd-larioja;
                            svg {
                                fill: $dd-larioja ;
                            }
                        }
                    }
                    &.on {
                        .current span {
                            color: $dd-larioja;
                        }

                    }
                }
            }
        }
    }

    .pt-dropdown__theme-light.pt-dropdown {

        &.active {
            .pt-dropdown__inner {
                background-color: $dd-larioja;
                border: 1px solid $dd-larioja;
                color: $dd-white;
            }
            .pt-dropdown__icon {
                svg {
                    fill: rgba(0, 0, 0, .16);
                }
            }
        }
        .pt-dropdown__inner {
            background-color: $dd-white;
            border-color: $dd-gainsboro;
            color: $dd-silver;
        }
        .pt-dropdown__add {
            // background-color: $dd-gainsboro;
            &:hover {
                background-color: $dd-pizazz;
            }
        }
        .pt-dropdown__dropdown {
            background-color: $dd-nightrider;
            &-item {
                color: $dd-nobel;
                &:hover {
                    color: $dd-white;
                }
                &.is-selected {
                    color: $dd-larioja;
                    &:hover {
                        color: $dd-larioja;
                    }
                }
            }

        }
    }

    .pt-dropdown__size-small.pt-dropdown {
        .pt-dropdown__inner {
            height: 26px;
            line-height: 26px;
        }
    }

    // ================================================
    // Transitions
    // ================================================

    .pt-dropdown--transition-enter-active,
    .pt-dropdown--transition-leave-active {
        transform-origin: left top 0px;
        transition: transform ease .2s, opacity ease .2s;
    }

    .pt-dropdown--transition-enter,
    .pt-dropdown--transition-leave-active {
        opacity: 0;
        transform: scaleY(0);
    }

</style>