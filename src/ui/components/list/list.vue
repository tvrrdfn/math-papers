<template>
    <div class="pt-dropdown__dropdown pt-dropdown__list">
        <div v-if="data && data.length > 0" class="pt-dropdown__dropdown-wrapall">
            <!--搜索按钮-->
            <pt-search
                class="pt-dropdown__dropdown-wrap-search"
                :theme="theme ? (theme === 'black' ? 'light' : 'black') : 'black'"
                :name="name"
                :list="data"
                @change="onSearch"
            ></pt-search>

            <div v-if="renderData.length" class="pt-dropdown__dropdown-wrap-body">
                <!--List 组件-->
                <div class="pt-dropdown__dropdown-list">
                    <!--all 按钮-->
                    <div
                        v-if="multiple"
                        class="pt-dropdown__dropdown-item pt-dropdown__dropdown-item-all"
                    >
                        <pt-checkbox
                            looking="all"
                            :theme="theme ? (theme === 'black' ? 'light' : 'black') : 'light'"
                            v-model="all"
                            v-if="showAllCheckbox"
                            @change="onAllChange"
                        >
                            {{allDisplayName}}
                        </pt-checkbox>
                        <span v-else>
                            {{allText}}
                        </span>
                    </div>

                    <pt-scrollbar :suppressScrollX="true">
                        <ul>
                            <li
                                class="pt-dropdown__dropdown-item"
                                v-for="(item,index) of renderData"
                            >
                                <!-- 带复选框 -->
                                <pt-checkbox
                                    v-if="multiple"
                                    :tooltipPlacement="tooltipPlacement"
                                    :tooltipOffset="tooltipOffset"
                                    :name="item[attrVal]"
                                    :theme="theme ? (theme === 'black' ? 'light' : 'black') : 'light'"
                                    :trueValue="item[attrVal]"
                                    falseValue=""
                                    :value="checkedModel[item[attrVal]]"
                                    @change="onCheckboxChange"
                                >
                                    {{item.name}}
                                </pt-checkbox>

                                <span v-else>{{item.name}}</span>
                            </li>
                        </ul>
                    </pt-scrollbar>
                </div>
            </div>

            <!--搜索结果没有数据的提示文案-->
            <div v-else class="no-data">
                <p>{{ $t("common.no_search_data")}}</p>
            </div>
        </div>

        <!--整个列表请求结果就没有数据-->
        <div v-else class="no-data">
            <p>{{ $t("common.no_data")}}</p>
        </div>
    </div>
</template>

<script>
    import cloneUtils from '@/utils/clone.utils';
    import treeUtils  from '@/utils/tree.utils';
    import arrayUtils   from '@/utils/array.utils';
    import treeItem from './tree-item.vue';

    export default {
        name: 'ptList',

        props: {
            name: {
                type: String
            },

            // 组件类型
            type: {
                type: String,
                default: 'list'
            },

            theme: String,

            currentId: {
                type: [String, Number, Array]
            },

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

            multiple: Boolean,

            selectedText: {
                type: String,
                default: " selected"
            },

            allText: {
                type: String,
                default: "All"
            },

            tooltipPlacement: {
                type: String,
                defaule: 'top'
            },
            tooltipOffset: {
                type: Number,
                default: 0
            },
        },

        data(){
            return {
                current: null,                          // 当前选中
                data: cloneUtils.deep(this.options),
                searchData: null,                       // 搜索结果
                searchKey: "",
                all: false,
                checkedItems: this.currentId,
                checkedModel: {}
            }
        },

        created() {
            this.initCheckedModel();
            // 设置默认选中
            this.all = this.selectedLength != 0;
        },

        computed: {
            /**
             * 要渲染的数据(搜索使用的是searchData,正常下使用的是data)
             */
            renderData() {
                return this.searchKey ? this.searchData : this.data;
            },

            /**
             * 已选择个数
             */
            selectedLength() {
                return Object.keys(this.checkedModel).length;
            },

            showAllCheckbox() {
                return this.data && this.data.length && this.selectedLength;
            },

            /**
             * all复选框展示文案
             */
            allDisplayName() {
                let name = this.allText;
                if (this.data == null || this.data.length === 0) return name;

                if (this.selectedLength) {
                    name = this.selectedLength + this.selectedText;
                }
                return name;
            }
        },

        methods: {
            initCheckedModel() {
                if(this.currentId) {
                    this.currentId.forEach(id => {
                        if(id !== "") {
                            this.$set(this.checkedModel, id, id);
                        }
                    });
                }
            },
            /**
             * 搜索回调
             */
            onSearch(options, searchKey){
                this.searchData = options;
                this.searchKey = searchKey;

                if (this.type == 'tree') {
                    treeUtils.setExpand({id: -1, child: this.data}, this.currentId);
                }
            },

            /**
             * all按钮change
             */
            onAllChange() {
                if(this.all) {
                    this.data.forEach(o => {
                        this.$set(this.checkedModel, o[this.attrVal], o[this.attrVal]);
                    });
                }else{
                    this.checkedModel = {};
                }

                this.$emit('change', Object.keys(this.checkedModel));
            },

            /**
             * 多选复选框change
             */
            onCheckboxChange(value, name){
                if(value === "") {
                    this.$delete(this.checkedModel, name);
                }else{
                    this.$set(this.checkedModel, name, value);
                }

                this.$emit('change', Object.keys(this.checkedModel));
            }
        },

        watch: {
            selectedLength() {
                // 只要有已选择的,则就要勾选all
                this.all = this.selectedLength != 0;
            }
        },

        components: {
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
    $dropdownMaxHeight: 325px;
    $listHieght: 250px;
    $scrollbarMargin: 8px;

    .pt-dropdown {
        width: $selectWidth;
        display: inline-block;
        position: relative;
        & .no-data p {
            height: 36px;
            line-height: 36px;
            text-align: center;
            margin: 0;
            color: $dd-nobel;
            display: block;
        }
        &__input {
            width: $selectWidth;
            position: relative;
        }
        &__icon {
            @include size($inputHeight, 100%);
            cursor: pointer;
            position: absolute;
            top: 5px;
            right: 20px;
            svg {
                width: 10px;
                height: 10px;
                fill: rgba(0, 0, 0, .16);
            }
        }
        // &__add {
        //     display: inline-flex;
        //     float: right;
        //     width: 30px;
        //     height: 30px;
        //     line-height: 30px;
        //     text-align: center;
        //     border-radius: 0 4px 4px 0;
        //     position: relative;
        //     cursor: pointer;
        //     transition: all .2s ease;
        //     background-color: $dd-white;
        //     border: 1px solid $dd-gainsboro;
        //     box-shadow: inset 0 -2px 0 0 $dd-co;

        //     svg {
        //         width: 14px;
        //         height: 14px;
        //         fill: $dd-dimgray;
        //         vertical-align: -3px;
        //     }
        //     &:hover {
        //         border: 1px solid $dd-pizazz;
        //         background-color: $dd-pizazz;
        //     }
        // }
    }
    .pt-dropdown__dropdown.pt-dropdown__list {
        @include abs-pos(-$dropdownScale, (-$dropdownScale/2), auto, (-$dropdownScale/2));
        z-index: $z-index-select-dropdown;
        background-color: $dd-nightrider;
        // box-shadow: 0 2px 0 0 rgba(0, 0, 0, 0.2);
        border-radius: 4px;
        max-height: $dropdownMaxHeight;
        transform: scaleY(1);
        opacity: 1;
        transform-origin: left top 0px;
        padding-bottom: 10px;
        .pt-dropdown__dropdown-wrapall{
            position: relative;
            .pt-dropdown__dropdown-wrap-search{
                width: 100%;
            }

        }
        .pt-ui-search {
            margin: 10px 10px 0;
        }
        .pt-dropdown__dropdown-body {
            margin: 10px 10px 0;
        }
        .pt-dropdown__dropdown-list {
            list-style: none;
            padding: 5px 0 0;
            margin: 0 -$scrollbarMargin 0 0;
            box-sizing: border-box;
            position: static;
            .cascade {
                & > span{
                    svg{
                        &.close{
                            display: inline-block;
                        }
                        &.open{
                            display: none;
                        }
                    }
                }
                span {
                    svg {
                        width: 16px;
                        height: 16px;
                        vertical-align: middle;
                        fill: $dd-dimgray;
                        display: none;
                    }
                    color: $dd-dimgray;
                    font-size: $font-default;
                    cursor: pointer;
                    height: 26px;
                    line-height: 26px;
                    &:hover {
                        color: $dd-larioja;
                        svg {
                            fill: $dd-larioja;
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
                    &>span{
                        svg{
                            &.close{
                                display: none;
                            }
                            &.open{
                                display: inline-block;
                            }
                        }
                    }
                }
            }

            .pt-dropdown__dropdown-item-all{
                margin-right: $scrollbarMargin;
                border-bottom: 1px solid $dd-charcoallight;
                height: 30px;

                & > span {
                    font-size: $f;
                    color: $dd-larioja;
                    margin-left: 20px;
                    cursor: default;
                }
            }

            ul {
                margin-right: $scrollbarMargin;
                height: $listHieght;
            }
        }
        .pt-dropdown__dropdown-item {
            height: 26px;
            font-size: 0;
            position: relative;
            color: $dd-nobel;
            line-height: 26px;
            cursor: pointer;
            padding-left: 16px;
            margin-bottom: 2px;
            @extend %text-ellipsis;

            &:hover {
                color: $dd-white;
            }
            &.is-selected {
                color: $dd-larioja;
            }
        }
    }



    // ================================================
    // Transitions
    // ================================================

    .pt-dropdown--transition-fade-enter-active,
    .pt-dropdown--transition-fade-leave-active {
        transition: opacity 0.2s ease;
    }

    .pt-dropdown--transition-fade-enter,
    .pt-dropdown--transition-fade-leave-active {
        opacity: 0;
    }

    // loadding

    .loading {
        .pt-dropdown__icon {
            top: 6px;
            right: 40px;
            &:after {
                height: 16px;
                width: 16px;
                border-radius: 100%;
                margin: 2px;
                border: 2px solid #999999;
                border-bottom-color: transparent;
                -webkit-animation: rotate 0.75s 0s linear infinite;
                animation: rotate 0.75s 0s linear infinite;
            }
        }
    }

    @-webkit-keyframes rotate {
        0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
        }

        50% {
            -webkit-transform: rotate(180deg);
            transform: rotate(180deg);
        }

        100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }

    @keyframes rotate {
        0% {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
        }

        50% {
            -webkit-transform: rotate(180deg);
            transform: rotate(180deg);
        }

        100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }
</style>
