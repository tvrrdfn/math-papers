<template>
    <div
        v-if="data && data.length > 0"
        class="pt-dropdown__dropdown-wrapall pt-tree-panel"
        :class="{'pt-dropdown__dropdown-wrapall-no-search': !isNeedSearch}"
    >
        <pt-search
            v-if="isNeedSearch"
            :theme="theme ? (theme === 'black' ? 'light' : 'black') : 'black'"
            :name="name"
            :list="data"
            @change="onSearch"
            :attrName="attrName"
            :attrChild="attrChild"
            class="pt-dropdown__dropdown-wrap-search"
        ></pt-search>

        <div v-if="renderData.length" class="pt-dropdown__dropdown-wrap-body">
            <div class="pt-dropdown__dropdown-body" :class="{'has-folder': hasFolder}">
                <!--Tree 结构组件 -->
                <pt-scrollbar :suppressScrollX="true">
                    <ul class="pt-dropdown__dropdown-list" v-for="item of renderData">
                        <tree-item
                            :model="item"
                            :searchKey="searchKey"
                            :name="name"
                            :folderIcon="folderIcon"
                            v-model="value"
                            @change="selectOption"
                            :attrChild="attrChild"
                            :attrVal="attrVal"
                            :attrName="attrName"
                        >
                        </tree-item>
                    </ul>
                </pt-scrollbar>
            </div>
        </div>

        <div v-else class="no-data">
            <p>{{ $t("common.no_search_data")}}</p>
        </div>
    </div>
</template>

<script>
    import cloneUtils from '@/utils/clone.utils';
    import treeUtils  from '@/utils/tree.utils';
    import arrayUtils   from '@/utils/array.utils';
    import treeItem from './tree-item.vue';

    export default {
        name: 'ptTreePanel',

        props: {
            name: String,

            value: [String, Number],

            // 是否显示搜索
            isNeedSearch: {
                type: Boolean,
                default: () => true
            },

            // 样式控制
            theme: String,

            folderIcon: {
                type: String,
                default: 'folder'
            },

            // 数据
            options: {
                type: Array,
                default: () => []
            },

            attrVal: {
                type: String,
                default: "id"
            },

            attrName: {
                type: String,
                default: "name"
            },

            attrChild: {
                type: String,
                default: "child"
            },

            beforeChange: {
                type: Function,
                default() {
                    return function () {
                        return true;
                    };
                }
            }
        },

        created() {
            this.setCurrent();
        },

        data() {
            return {
                data: cloneUtils.deep(this.options),
                current: null,                          // 当前选中
                searchData: null,                       // 搜索结果
                searchKey: "",
            };
        },

        computed: {
            renderData() {
                return this.searchKey ? this.searchData : this.data;
            },

            hasFolder(){
                return this.renderData && this.renderData.length && this.renderData[0][this.attrChild] && this.renderData[0][this.attrChild].length;
            }
        },

        methods: {
            selectOption(option) {
                if (this.current == null || option[this.attrVal] != this.current[this.attrVal]) {
                    if (!this.beforeChange.call(this, option)) return;

                    this.current = option;
                    this.searchKey = ""; // 清空搜索
                    this.$emit('input', this.current[this.attrVal]);
                    this.$emit('change', option, this.name);
                }

                this.close();
            },

            getChoosenCls(option) {
                if (!this.current) return '';
                if (option[this.attrVal] == this.current[this.attrVal]) return 'is-selected';
            },

            setCurrent() {
                if (this.value == null || this.data == null) {
                    this.current = null;
                } else {
                    let node = {[this.attrVal]: -1, [this.attrChild]: this.data};
                    this.current = treeUtils.search(node, this.value, this.attrChild, this.attrVal);
                    treeUtils.setExpand(node, this.value, this.attrChild, this.attrVal);
                }
            },

            onSearch(options, searchKey){
                this.searchData = options;
                this.searchKey = searchKey;
                // 搜索后也需要将当前的展开
                treeUtils.setExpand({id: -1, [this.attrChild]: this.data}, this.value, this.attrChild);
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
            },
            
            // 重新渲染组件
            reset(){
                this.data = [];
                this.$nextTick(() => {
                    this.data = cloneUtils.deep(this.options);
                    this.setCurrent();
                })
            }
        },

        watch: {
            options(){
                this.reset();
            }
        },

        components: {
            treeItem
        }
    };
</script>

<style lang="scss">
@import '../../styles/imports';

.pt-tree-panel {
    width: 100%;
    overflow: hidden;
    flex: 1;
    display: flex;

    .pt-dropdown__dropdown-wrap-body {
        flex: 1;
        display: flex;
    }
    .pt-dropdown__dropdown-body {
        width: 100%;
        flex: 1;
    }
    .pt-dropdown__dropdown-item.current{
        color: $dd-white;
        background: $dd-larioja;
    }
}
</style>
