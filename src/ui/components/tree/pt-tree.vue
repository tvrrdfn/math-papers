<template>
    <div class="pt-ui__tree" ref="container">
        <pt-search :autofocus="autofocus" :list="list" @change="onSearch" :theme="searchTheme"></pt-search>

        <div class="pt-ui__tree-body">
            <pt-scrollbar v-if="model && model.length">
                <ul class="pt-ui__tree-ul" v-for="item of model">
                    <tree-item
                        :model="item"
                        :searchKey="searchKey"
                        :name="name"
                        :eventType="eventType"
                        :tooltipPlacement="tooltipPlacement"
                        :tooltipOffset="tooltipOffset"
                        v-model="value"
                        @select="onSelect"
                    >
                    </tree-item>
                </ul>
            </pt-scrollbar>
            <div v-else  class="no-data">
                {{ $t(searchKey ? "common.no_search_data" : "common.no_data")}}
            </div>
        </div>
    </div>
</template>

<script>
    import cloneUtils from '@/utils/clone.utils';
    import treeUtils  from '@/utils/tree.utils';
    import treeItem from './tree-item.vue';
    import ptSearch from '../search/pt-search.vue';

    const THRESH_HOLD = 100;

    export default {
        name: 'ptTree',

        props: {
            list: {
                type: Array,
                required: true
            },
            name: String,
            value: [String, Number],

            //交互事件[drag, click]
            eventType: {
                type: String,
                default: () => 'drag'
            },
            autofocus: {
                type: Boolean,
                default: true
            },
            tooltipPlacement: {
                type: String,
                default: "top"
            },
            tooltipOffset: {
                type: Number,
                default: 0
            },
            searchTheme: {
                type: String,
                default: 'black'
            }
        },

        data() {
            return {
                model: null,
                searchKey: ""
            };
        },

        mounted(){
            this.model = cloneUtils.deep(this.list);
            this.setCurrent();
        },

        methods: {
            setCurrent() {
                let node = {id: -1, child: this.model};
                treeUtils.setExpand(node, this.value);
            },

            onSearch(data, value, escapeVal) {
                this.searchKey = escapeVal;
                this.model = data;
            },

            onSelect(val){
                this.$emit('input', val);
                this.$emit('change', val);
            }
        },

        components: {
            treeItem,
            ptSearch
        }
    }
</script>

<style lang="scss">
@import '../../styles/imports';
$btnBorderRadius: 13px;

.pt-ui__tree {
    box-sizing: border-box;
    background-color: $dd-nightrider;
}

.pt-ui__tree-body {
    // margin-top: 10px;
    min-height: 160px;
    padding: 10px 0 0 10px;
    font-size: $font-default;
    .no-data{
        text-align: center;
        padding-right: 10px;
        color: $dd-nobel;
        padding-top: 30px;
    }
}

.pt-ui__tree-ul {
    line-height: 26px;
    list-style: none;
    margin-bottom: 6px;
    padding: 0;
}

.pt-ui__tree-li {
    width: 100%;
    line-height: 26px;
    margin-bottom: 6px;

    &.onOpen {
        > .pt-ui__tree-ul {
            display: block;
            margin-top: 8px;
        }

        .current {
            span {
                color: $dd-larioja;
            }

            .column-svg svg {
                fill: $dd-larioja !important;
            }
        }

        .pt-ui__tree-folder {
            svg {
                transform: rotate(90deg);
                -moz-transform: rotate(45deg);
                transform-origin: center;
            }
        }
    }

    &.pt-ui__tree-li-item {
        vertical-align: middle;
        padding: 0;
        height: 26px;
        line-height: 26px;
        font-size: 0;

        &.current {
            color: $dd-larioja;

            &:hover {
                color: $dd-larioja;
            }

            & > .pt-ui__tree-item {
                color: $dd-larioja !important;
            }
        }
    }
}

.pt-ui__tree-folder {
    @extend %text-ellipsis;
    padding-left: 10px;
    position: relative;
    cursor: pointer;
    margin-bottom: 6px;
    
    span {
        @extend %text-ellipsis;
        padding-left:9px;
        color: $dd-dimgray;
        user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
    }

    & > svg {
        @include size(12px);
        position: absolute;
        left: 2px;
        top: 6px;
        transition: all .2s ease;
        fill: $dd-silver;
    }

    &:hover{
        span{
            color: $dd-white;
        }
        > svg{
            fill: $dd-white;
        }
    }
}

.pt-ui__tree-item {
    @extend %clearfix;
    @extend %user-select-none;
    color: $dd-nightrider;
    display: inline-block;
    height: 26px;
    line-height: 26px;
    background-color: $dd-dimgray;
    border-radius: $btnBorderRadius;
    max-width: 184px;
    font-size: $font-default;
    cursor: move;
    padding: 0 14px;
    user-select:none;
    -moz-user-select: none;
    .column-svg {
        float: left;
        user-select:none;
        -moz-user-select: none;
        svg {
            @include size(14px);
            display: block;
            margin: 6px 2px 0 -4px;
            vertical-align: middle;
            fill: rgba(0, 0, 0, .16);
        }
    }

    .column-text {
        margin-right: 4px;
        user-select:none;
        -moz-user-select: none;
        display: block;
        overflow: hidden;
        white-space: nowrap;
    }
}

.pt-ui__tree-sub-ul {
    li {
        padding-left:24px;

        li {
            padding-left:46px;
        }
    }
}

</style>
