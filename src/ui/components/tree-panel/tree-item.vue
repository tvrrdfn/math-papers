<template>
    <li
        :class="[
            isFolder ? 'cascade' : 'pt-dropdown__dropdown-item',
            isOpen ? 'on' : '',
            !isFolder && model[attrVal] == value ? 'current' : ''
        ]"
        @click.stop="chooseItem"
    >
        <pt-tooltip
            :content="model[attrName]"
            :openDelay="500"
            :checkTextOverflow="true"
        >
            <span class="tree-item__info">
                <pt-svg v-if="isFolder" :useId="folderSvg" :class="folderClass"></pt-svg>
                <pt-svg v-else use-id="icon-file-new" :class="folderClass"></pt-svg>
                <pt-svg class="icon-cooperation" v-if="cooperationSvg" use-id="icon-cooperation"></pt-svg>
                {{model[attrName]}}
            </span>
        </pt-tooltip>

        <ul v-if="isFolder && isOpen">
            <tree-item
                v-for="item of model[attrChild]"
                :model="item"
                :searchKey="searchKey"
                :name="name"
                :folderIcon="folderIcon"
                v-model="value"
                @change="onChange"
                :attrChild="attrChild"
                :attrVal="attrVal"
                :attrName="attrName"
            >
                {{$scopedSlots}}
            </tree-item>
        </ul>
    </li>
</template>

<script>
    export default {
        name: 'treeItem',
        props: [
            'model',
            'searchKey',
            'name',
            'value',
            'folderIcon',
            'attrChild',
            'attrVal',
            'attrName'
        ],
        computed: {
            isFolder() {
                return !!this.model[this.attrChild] && this.model[this.attrChild].length > 0;
            },
            folderSvg() {
                return this.folderIcon == 'folder' ? (this.isOpen ? 'icon-folder-open' : 'icon-folder-close') : 'icon-arrow-right';
            },
            folderClass() {
                return this.folderIcon;
            },
            cooperationSvg() {
                return this.model.shareToOther;
            }
        },

        data() {
            return {
                isOpen: this.model.expand || this.searchKey
            };
        },

        methods: {
            chooseItem(e) {
                if (this.isFolder)
                    this.isOpen = !this.isOpen;
                else
                    this.$emit('change', this.model);
            },

            onChange(model){
                this.$emit('change', model);
            }
        },
        watch: {
            searchKey(newVal) {
                this.isOpen = newVal;
            }
        }
    };
</script>

<style lang="scss">
    @import '../../styles/imports';

    .tree-item__info {
        display: flex !important;
        align-items: center;
        line-height: 1 !important;

        & > svg {
            margin-right: 6px;
        }

        .icon-cooperation {
            width: 14px !important;
            height: 14px !important;
            margin-right: 2px;
        }
    }
</style>