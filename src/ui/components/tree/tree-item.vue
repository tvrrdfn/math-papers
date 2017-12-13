<template>
    <li
        :class="wrapClasses"
    >
        <pt-tooltip
            v-if="isFolder"
            :content="model.name"
            :openDelay="500"
            :checkTextOverflow="true"
            :isNeedAddTextOverflowClass="true"
            :placement="tooltipPlacement"
            :offset="tooltipOffset"
        >
            <div class="pt-ui__tree-folder" @click.stop="toggle">
                <pt-svg use-id='icon-arrow-right'></pt-svg>
                <span tooltip-target="true">{{model.name}}</span>
            </div>
        </pt-tooltip>

        <pt-tooltip
            v-else-if="isDrag"
            :content="model.name"
            :openDelay="500"
            :checkTextOverflow="true"
            :isNeedAddTextOverflowClass="true"
            :placement="tooltipPlacement"
            :offset="tooltipOffset"
        >
            <div
                class="pt-ui__tree-item"
                dk-draggable="true"
                :data-dk-node-info="getDKNodeJSON(model)"
            >
                <div class="column-svg">
                    <pt-svg :useId='svgId(model.dataType, model.dataFormat)'></pt-svg>
                </div>

                <span tooltip-target="true" class="column-text">{{model.name}}</span>
            </div>
        </pt-tooltip>

        <div
            v-else
            class="pt-ui__tree-item"
            @click="onSelcet(model)"
        >
            <div class="column-svg">
                <pt-svg :useId='svgId(model.dataType, model.dataFormat)'></pt-svg>
            </div>

            <pt-tooltip
                :content="model.name"
                :openDelay="500"
                :checkTextOverflow="true"
                :isNeedAddTextOverflowClass="true"
            >
                <span class="column-text">{{model.name}}</span>
            </pt-tooltip>
        </div>

        <ul
            class="pt-ui__tree-sub-ul"
            v-if="showFolder"
        >
            <tree-item
                v-for="item of model.child"
                :model="item"
                :searchKey="searchKey"
                :name="name"
                :eventType="eventType"
                :tooltipPlacement="tooltipPlacement"
                :tooltipOffset="tooltipOffset"
                v-model="value"
                @select="onSelcet"
            ></tree-item>
        </ul>
    </li>
</template>

<script>
import {
    getMaxByte
} from '@/utils/string.utils';

export default {
    name: 'treeItem',
    props: ['model', 'searchKey', 'name', 'value', 'eventType', 'tooltipPlacement', 'tooltipOffset'],
    computed: {
        wrapClasses() {
            return [
                'pt-ui__tree-li',
                {
                    'pt-ui__tree-li-item': !this.isFolder,
                    'onOpen': this.isOpen,
                    'current': this.model.id == this.value
                }
            ];
        },

        isFolder() {
            return !!this.model.child && this.model.child.length > 0;
        },

        isDrag() {
            return this.eventType == 'drag'
        },

        showFolder() {
            return this.isFolder && this.isOpen;
        }
    },
    data() {
        return {
            isOpen: this.model.expand || this.searchKey,
            isOverflow: false
        };
    },
    methods: {
        toggle() {
            if(this.isFolder) {
                this.isOpen = !this.isOpen;
            }
        },
        displayName(name) {
            if(!this.searchKey) return name;
            return name.replace(new RegExp(this.searchKey, 'gi'), function (val) {
                return '<i>' + val + '</i>';
            });
        },
        getDKNodeJSON(model) {
            return JSON.stringify(model);
        },
        getCustomId(model){
            return [this.name, model.id].join("::");
        },
        svgId(dataType, format) {
            if(dataType){
                if(format == '$##') {
                    return 'icon-ds-' + dataType.toLowerCase() + '-usd';
                }
                return 'icon-ds-' + this.getCorrectDataType(dataType).toLowerCase();
            }
            return '';
        },
        getCorrectDataType(dataType) {
            if(['DOUBLE', 'FLOAT', 'INTEGER', 'LONG', "NUMBER"].indexOf(dataType) != -1) {
                return "NUMBER";
            }
            return dataType;
        },
        onSelcet(model) {
            this.$emit('select', model);
        }
    },
    watch: {
        searchKey() {
            this.isOpen = !!this.searchKey;
        }
    }
};
</script>

<style lang="scss">
@import '../../styles/imports';

.dk-item-content {

    .dk-item-content-tooltip {
        position: absolute;
        border-radius: 4px;
        padding: rem-calc(5px 10px);
        z-index: $z-index-tooltip;
        font-size: $f-sm;
        line-height: 1.5;
        display: none;
        background-color: $dd-white;
        left: 0;
        bottom: 100%;
        margin-bottom: 4px;
    }

    &:hover {
        .dk-item-content-tooltip{
            display: block;
        }
    }
}
</style>
