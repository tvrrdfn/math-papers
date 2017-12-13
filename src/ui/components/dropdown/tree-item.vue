<template>
    <li
        :class="[
            isFolder ? 'cascade' : 'pt-dropdown__dropdown-item',
            isOpen ? 'on' : '',
            !isFolder && model.id == value ? 'current' : ''
        ]"
        @click.stop="chooseItem"
    >
        <!-- <span class="svg" v-if="isFolder">
            <pt-svg :useId="folderSvg" :class="folderClass"></pt-svg>
        </span> -->
        <pt-tooltip
            :content="model.name"
            :openDelay="500"
            :checkTextOverflow="true"
            :disabled="!isNeedTooltip"
            :placement="tooltipPlacement"
            :offset="tooltipOffset"
        >
            <span class="title">
                <pt-svg v-if="isFolder" :useId="folderSvg" :class="folderClass"></pt-svg>
                {{model.name}}
            </span>
        </pt-tooltip>

        <ul v-if="isFolder && isOpen">
            <tree-item
                v-for="item of model.child"
                :key="item[attrVal]"
                :model="item"
                :searchKey="searchKey"
                :name="name"
                :folderIcon="folderIcon"
                :isNeedTooltip="isNeedTooltip"
                :tooltipPlacement="tooltipPlacement"
                :tooltipOffset="tooltipOffset"
                v-model="value"
                @change="onChange"
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
            'isNeedTooltip',
            'tooltipPlacement',
            'tooltipOffset',
            'attrVal'
        ],
        computed: {
            isFolder() {
                return !!this.model.child && this.model.child.length > 0;
            },
            folderSvg() {
                return this.folderIcon == 'folder' ? (this.isOpen ? 'icon-folder-open' : 'icon-folder-close') : 'icon-arrow-right';
            },
            folderClass() {
                return this.folderIcon;
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
