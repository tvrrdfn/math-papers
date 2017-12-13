<template>
    <div class="pt-ui-search"
         :class="[
        searchKey || hasInput ? 'has-value' : '',
        size ? 'pt-ui-search--' + size : '',
        theme ? 'pt-search__theme-' + theme : ''
    ]">
        <input class="pt-ui-search__input"
               ref="input"
               type="text"
               :autofocus="autofocus"
               v-model.trim="searchKey"
               @input="onInput"
        />
        <span class="pt-ui-search__search-icon" :data-name="searchText" @click="clickSearchIcon">
            <pt-svg use-id="icon-search"></pt-svg>
        </span>
        <a class="pt-ui-search__clear" v-on:mousedown="clearStart()" v-on:mouseup="clearEnd()">
            <pt-svg use-id="icon-delete"></pt-svg>
        </a>
    </div>
</template>

<script>
    import cloneUtils  from '@/utils/clone.utils';
    import regUtils from '../../utils/reg.utils';

    var THROTTLE_TIME = 200;
    var throttle = function(fn){
        var timer = null;
        return function(){
            var context = this, args = arguments;
            clearTimeout(timer);
            timer = setTimeout(function(){
                fn.apply(context, args);
            }, THROTTLE_TIME);
        };
    };

    export default {
        name: 'ptSearch',
        props: {
            list: {
                type: Array,
                required: true
            },
            name: [String, Number],
            attrName: {
                type: String,
                required: false,
                default: "name"
            },
            attrOtherName: {//解决搜索条件有两个字段的情况
                type: String,
                required: false,
                default: "name"
            },
            attrChild: {
                type: String,
                required: false,
                default: "child"
            },
            size: String,
            //背景 white/black 默认white
            theme: String,
            autofocus: {
                type: Boolean,
                default: () => {return true;}
            }
        },

        mounted() {
            if(this.autofocus) {
                this.$el.querySelector('input').focus();
            }
        },

        data() {
            return {
                hasInput: false,
                model: cloneUtils.deep(this.list),
                searchKey: "",
                searchText: this.$t('common.search')
            };
        },
        computed: {
            // 正则转义
            searchModel() {
                return regUtils.escapeRegExp(this.searchKey);
            }
        },
        methods: {
            onInput(e) {
                this.hasInput = e.target.value !== '';
            },

            clickSearchIcon() {
                this.$el.querySelector('input').focus();
            },

            clearStart(){
                this.$el.classList.add('on-focus');
            },

            clearEnd(){
                this.$el.classList.remove('on-focus');
                this.searchKey = '';
                this.hasInput = false;
                this.clickSearchIcon();
            },

            search(treeList, searchKey) {
                return treeList.reduce((prev, curr, index) => {
                    // 如果有子元素,则继续进行walk
                    let children = curr[this.attrChild];
                    if (children && children.length) {
                        let filterRs = this.search(children, searchKey);
                        if (filterRs.length) {
                            let copy = Object.assign({}, curr);
                            copy[this.attrChild] = filterRs;
                            prev.push(copy);
                            return prev;
                        }
                    }
                    // 否则进行匹配
                    var reg = new RegExp(searchKey, 'gi');
                    var matched = reg.test(curr[this.attrName]) || reg.test(curr[this.attrOtherName]);
                    if (matched) {
                        prev.push(Object.assign({}, curr));
                    }
                    return prev;
                }, []);
            }
        },
        watch: {
            searchKey() {
                var throttleFn = throttle( () => {
                    let data = cloneUtils.deep(this.list);
                    this.model = this.searchModel ? this.search(data, this.searchModel) : data;

                    // 参数分别为过滤后的数据，search原始数据，将search原始数据进行正则转义的数据
                    this.$emit('change', this.model, this.searchKey, this.searchModel);
                });

                throttleFn();
            },

            list() {
                this.model = cloneUtils.deep(this.list);
            },

            autofocus(n,o){
                this.$el.querySelector('input').focus();
            }
        }
    };
</script>

<style lang="scss">
    @import '../../styles/imports';

    .pt-ui-search {
        position: relative;
        color: $dd-silver;
        &__input {
            z-index: 1;
            position: relative;
            border: 1px solid $dd-mercury;
            border-radius: 4px;
            outline: none;
            background-color: $dd-white;
            width: 100%;
            height: 26px;
            line-height: 20px;
            padding: 0 1.6em 0 2em;
            color: $dd-silver;
            transition: background-color ease .2s;
            font-size: $font-default;
            &:focus {
                // text-indent: 2em;
                border: 1px solid $dd-larioja;
                & ~ span {
                    z-index: 0;
                    left: 5px;
                }
                & ~ a {
                    svg {
                        fill: rgba(153, 153, 153, .6);
                    }
                    &:hover {
                        opacity: 1;
                    }
                }
            }
        }

        &__clear {
            display: none;
            z-index:1;
            border-radius: 10px;
            width: 14px;
            height: 14px;
            position: absolute;
            right: 6px;
            top: 5px;
            transition: background-color ease .2s;
            svg {
                width: 16px;
                height: 16px;
                fill: rgba(68, 68, 68, .6);
                border-radius: 50%;
            }
            &:hover {
                svg {
                    fill: $dd-nobel;
                }
            }

        }

        &__search-icon {
            z-index: 1;
            width: 20px;
            height: 20px;
            position: absolute;
            left: calc(50% - 34px);
            top: 5px;
            transition: left .3s cubic-bezier(0.645, 0.045, 0.355, 1);
            svg {
                width: 16px;
                height: 16px;
                position: absolute;
                left: 0;
                top: 0;
                cursor: text;
                fill: rgba(153, 153, 153, .6);
            }
            &:after {
                content: attr(data-name);
                position: absolute;
                left: 22px;
                top: -1px;
                opacity: 1;
                cursor: text;
                color: $dd-dimgray;
                width: 40px;
            }

        }
        &--large {
            .pt-ui-search__input {
                height: 30px;
                line-height: 30px;
            }
            .pt-ui-search__search-icon {
                margin-top: 2px;
            }
            a.pt-ui-search__clear {
                top: 8px;
            }
        }
        &.has-value {
            .pt-ui-search__input {
                background-color: $dd-larioja;
                border: 1px solid $dd-larioja;
                // text-indent: 2em;
                box-shadow: inset 0 0 0 0 rgba(0, 0, 0, 0.5);
                color: $dd-white;

                &:focus {
                    background-color: transparent;
                    color: $dd-charcoal;
                }
                & ~ span {
                    left: 5px;
                    margin-left: 0;
                    &:after {
                        opacity: 0;
                    }
                }
            }
            .pt-ui-search__clear {
                display: inline-block;
            }
        }
    }

    .pt-search__theme-black,
    .pt-search__theme-light {
        &.on-focus {
            .pt-ui-search__input {
                color: $dd-white !important;
                background-color: transparent !important;
            }
        }
    }

    .pt-search__theme-black {
        .pt-ui-search__input {
            border-color: $dd-tundora;
            background-color: transparent;
            color: $dd-dimgray;
            &:focus {
                border-color: $dd-larioja;
                .pt-ui-search__clear {
                    display: none;
                }
            }
            & ~ span {
                &:after {
                    color: $dd-dimgray;
                }
            }
        }
        &.has-value {
            .pt-ui-search__input {
                color: $dd-nightrider;
                border-color: $dd-larioja;
                background-color: $dd-larioja;
                &:focus {
                    color: $dd-white;
                    background-color: transparent;
                    & ~ span {
                        svg {
                            fill: rgba(153, 153, 153, .6);
                        }
                    }
                    & ~ a {
                        display: inline-block;
                        svg {
                            background-color: $dd-nightrider;
                            fill: rgba(153, 153, 153, .6);
                        }
                        &:hover {
                            svg {
                                fill: $dd-nobel;
                            }
                        }
                    }
                }
                & ~ span {
                    svg {
                        fill: rgba(130, 150, 25, .6);
                    }
                    &:before {
                        opacity: 0;
                    }
                }
                & ~ a {
                    svg {
                        fill: rgba(255, 255, 255, .6);
                    }
                    &:hover {
                        svg {
                            fill: $dd-white;
                        }
                    }
                }
            }

        }
    }

    .pt-search__theme-light {
        .pt-ui-search__input {
            border-color: $dd-gainsboro;
            background-color: transparent;
            color: $dd-dimgray;
            &:focus {
                border-color: $dd-larioja;
                .pt-ui-search__clear {
                    display: none;
                }
            }
            & ~ span {
                &:after {
                    color: $dd-silver;
                    font-size: $font-default;
                }
            }
        }
        &.has-value {
            .pt-ui-search__input {
                color: $dd-white;
                border-color: $dd-larioja;
                background-color: $dd-larioja;
                &:focus {
                    color: $dd-charcoal;
                    background-color: transparent;
                    & ~ span {
                        svg {
                            fill: rgba(153, 153, 153, .6);
                        }
                    }
                    & ~ a {
                        display: inline-block;
                        svg {
                            background-color: $dd-white;
                            fill: rgba(153, 153, 153, .6);
                        }
                        &:hover {
                            svg {
                                fill: $dd-nobel;
                            }
                        }
                    }
                }
                & ~ span {
                    svg {
                        fill: rgba(130, 150, 25, .6);
                    }
                    &:before {
                        opacity: 1;
                    }
                }
                & ~ a {
                    svg {
                        // fill: $dd-white;
                    }
                    &:hover {
                        svg {
                            fill: $dd-white;
                        }
                    }
                }
            }

        }
    }

</style>
