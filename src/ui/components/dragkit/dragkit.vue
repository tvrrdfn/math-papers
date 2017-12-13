<template>
    <div
        :name="name"
        dk-container="true"
        v-if="role == 'pull'"
    >
        <slot></slot>
    </div>
    <div
        v-else
        class="dk-container-wrapper"
        :class="{
            'dk-start-container': isStartContainer,
            'dk-current-container': isCurrentContainer,
            'dk-same-group': isSameGroup,
            'dk-empty': !value || value.length == 0
        }"
    >
        <div
            class="dk-container"
            dk-container="true"
            :name="name"
            :style="{height: totalHeight + 'px'}"
            v-if="data"
        >
            <transition-group name="flip-list" tag="div">
                <div
                    dk-draggable="true"
                    class="dk-item dk-animate-item"
                    v-for="(item, index) in data"
                    :class="{
                        'dk-placeholder-item': item.isPlaceholder,
                        'dk-cover-item': coverMode && index == toIndex
                    }"
                    :style="getNodeStyle(index)"
                    :data-dk-id="item.__id"
                    :key="item.__id"
                >
                    <slot :node="item" :index="index"></slot>
                </div>
            </transition-group>

            <div class="dk-item-prompt-text" v-show="isShowDragTip">
                <!--{{ $t("widget_editor.aside.drag_drop") }}-->
                {{tipText}}
            </div>
        </div>
    </div>
</template>

<script>
    import event from './event';
    import utils from './utils';
    import cache from './cache';

    let options = {
        nodeH: 26,
        padding: 6,
        hitScale: 0.6,
        coverNodeScale: 0.7,
        maxNodeNum: 999,
        isCoverNode: true,
        clone: true
    };

    export default {
        name: 'ptDragkit',

        props: {
            name: [String, Number],
            role: String,
            group: String,
            maxNodeNum: {
                type: [String, Number],
                default: 999
            },
            value: {
                type: Array,
                default: () => []
            },
            options: Object,
            idProp: String,
            showTip: {
                type: Boolean,
                default() {
                    return false
                }
            },
            tipText: String,
            beforeEnter: {
                type: Function,
                default() {
                    return function () {
                        return true;
                    };
                }
            }
        },

        created() {
            console.log("[created dragkit] " + this.name);
            event.init(true, this);
            this.init();
        },

        beforeDestroy() {
            console.log("[destroy dragkit] " + this.name);
            cache.remove(this.name);
        },

        data() {
            return {
                opt: Object.assign({}, options, this.options),
                backupData: null,
                data: null,     // 必须要有唯一id, transition-group中的key需要
                current: null,

                startIndex: -1,         // 起始位置
                fromIndex: -1,          // 排序前位置
                toIndex: -1,            // 排序后位置

                coverMode: false,
                isSameGroup: false,      // 和开始拖拽容器是否在同一组
                isCurrentContainer: false,        // 是否是当前碰撞容器
                isStartContainer: false          // 是否是开始容器
            };
        },

        computed: {
            nodeH() {
                return this.opt.nodeH + this.opt.padding;
            },

            totalHeight() {
                let len = this.data.length;
                len = this.isShowDragTip ? len + 1 : len;
                let height = len * this.nodeH;
                if (height > 0) height -= this.opt.padding;
                return height;
            },

            realLength() {
                return this.value.length;
            },


            // 是否显示可拖拽提示
            isShowDragTip() {
                if (!this.showTip) return false;

                if (!this.isStartContainer) {
                    return !this.isCurrentContainer;
                }

                return true;
            }
        },

        methods: {
            init() {
                this.initNode();
            },

            initStatus() {
                this.startIndex = this.fromIndex = this.toIndex = -1;
                this.isSameGroup = this.isCurrentContainer = this.isStartContainer = false;
            },

            initNode() {
                var data = [];
                if (this.value) {
                    this.value.forEach((node, index) => {
                        data.push(Object.assign({}, node, {
                            __id: node[this.idProp],
                            isPlaceholder: false,
                            isCovered: false
                        }));
                    });
                }
                this.data = data;
            },

            getNodeStyle(index) {
                let top = this.nodeH * index;
                return {top: top + 'px'};
            },

            /**
             * 设置占位
             */
            setPlaceholder(node) {
                node.isPlaceholder = true;
            },

            /**
             * 添加临时占位节点
             * 需要计算合适的index,及innerY
             * @param dragNode
             * @param dragElement
             */
            add(dragNode, innerY) {
                var newIndex = this.getDragNodeIndex(innerY);
                var node = this.cloneNode(dragNode);
                node.isPlaceholder = true;
                this.data.splice(newIndex, 0, node);
            },

            coveredLayout(innerY) {
                this.toIndex = this.getDragNodeIndex(innerY);
                if(this.toIndex > this.data.length - 1) return;
            },

//            cover(coveredNode, dragNode) {
//                let index = this.getIndex(coveredNode.__id);
//                this.toIndex = index;
//                var node = this.cloneNode(dragNode);
//                node.isPlaceholder = false;
//                this.$set(this.data, index, node);
//            },

            cover(dragNode) {
                var node = this.cloneNode(dragNode);
                node.isPlaceholder = false;
                this.$set(this.data, this.toIndex, node);
            },

            deleteNode(index) {
                this.data.splice(index, 1);
            },

            remove(dragNode) {
                this.data = this.data.filter(o => o.__id != dragNode.__id);
            },

            layout (dragNode, innerY) {

                if (innerY < 0) innerY = 0;

                // console.log("fromIndex", this.fromIndex, "toIndex", this.toIndex, "startIndex", this.startIndex)

                // 目标位置
                this.toIndex = this.getDragNodeIndex(innerY);

                if(this.toIndex > this.data.length - 1) return;

                // 第一次进入
                if (this.fromIndex == -1) {
                    this.fromIndex = this.toIndex;
                    return;
                }

                // 快速拖动会出现一次跳跃多个进行换位，限制只能相邻的进行换位
                if (this.toIndex > this.fromIndex + 1) {
                    this.toIndex = this.fromIndex + 1;
                }

                if (this.toIndex < this.fromIndex - 1) {
                    this.toIndex = this.fromIndex - 1;
                }

                if (this.fromIndex == this.toIndex) return;

                // 交换位置
                this.swap(this.fromIndex, this.toIndex);
                this.fromIndex = this.toIndex;
            },

            getDragNodeIndex(innerY) {
//                return Math.round((innerY + this.opt.nodeH/2) / (this.nodeH + this.opt.padding/2));
                return Math.floor((innerY + this.opt.nodeH/2 + this.opt.padding/2) / this.nodeH);
            },

            swap(index01, index02) {
                var tmp = this.data[index01];
                this.$set(this.data, index01, this.data[index02]);
                this.$set(this.data, index02, tmp);
            },

            updatePlaceholder() {
                let node = this.data.find(o => o.isPlaceholder == true);
                if (node) {
                    node.isPlaceholder = false;
                }
            },

            // 备份数据
            clone: function () {
                this.backupData = this.data.slice();
            },

            // 重置数据
            reset: function () {
                setTimeout(() => {
                    this.backupData && (this.data = this.backupData.slice());
                });
            },

            query: function (id) {
                if (!id) return undefined;
                return this.data.find(function (node) {
                    return node.__id == id;
                });
            },

            get(index) {
                return this.data[index];
            },

            getNodeFromEl(nodeEl) {
                let index = this.index(nodeEl);
                return this.data[index];
            },

            index(nodeEl){
                let offsetY = utils.getOffset(nodeEl).top - utils.getOffset(this.$el).top;
                return Math.round(offsetY / this.nodeH);
            },

            getIndex: function (id) {
                if (!id) return -1;

                var index = -1;

                for (var i = 0; i < this.data.length; i++) {
                    if (this.data[i].__id == id) {
                        index = i;
                        break;
                    }
                }

                return index;
            },

            getElements() {
                return this.data.reduce((prev, curr) => {
                    let el = this.$el.querySelector(".dk-item[data-dk-id='" + curr.__id + "']");
                    prev[curr.__id] = el;
                    return prev;
                }, {});
            },

            cloneNode(node) {
                return Object.assign({isPlaceholder: false, isCovered: false}, node);
            },

            callback(eventType, ...args) {
                this.$emit(eventType, this.name, ...args);
            }
        },

        watch: {
            value(val) {
                console.log('watch dragkit');
                if(val) this.init();
            }
        }
    }
</script>

<style lang="scss">
    @import '../../styles/imports';
    .flip-list-move {
        transition: transform 0.015s;
    }
    .flip-list-item {
      /*transition: all 1s;
      display: inline-block;
      margin-right: 10px;*/
    }
    .flip-list-enter, .flip-list-leave-active {
      opacity: 0;
      /*transform: translateY(30px);*/
    }
    .flip-list-leave-active {
      /*position: absolute;*/
    }

    body.dk-user-select {
        user-select: none !important;
        -moz-user-select: none !important;
        -webkit-user-select: none !important;
        -ms-user-select: none !important;
    }

    .dk-container {
        position: relative;
        z-index: 1;
        /*transition: height 0.15s;*/
        width: 100%;
        height: 100%;
    }

    .dk-start-container {
        z-index: 2;
    }

    .dk-item {
        @extend %user-select-none;
        cursor: pointer;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 10;
        user-select: none;
        /*cursor: move;*/
    }

    .dk-show-item {
        display: block;
    }

    .dk-hide-item {
        display: none;
    }

    .dk-delete-item-ico {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        width: 16px;
        height: 16px;
        background: #bbb;
        border-radius: 50%;
        position: absolute;
        right: -4px;
        top: -4px;
        border: 1px solid #fff;
        transition: opacity .2s ease;
        opacity: 0;
        z-index: 10;
    }

    .dk-delete-item-ico svg {
        height: 12px;
        width: 12px;
        fill: #fff;
        border-radius: 50%;
        margin: 0 !important;
    }

    .dk-container .dk-item.dk-delete-item:hover .dk-delete-item-ico,
    .dk-container .dk-item.dk-dragdrop-item:hover .dk-delete-item-ico {
        opacity: 0;
    }

    .dk-container .dk-item:hover .dk-delete-item-ico {
        opacity: 1;

    }


    .dk-container .dk-item:hover .dk-delete-item-ico:hover {
        background: #FF6666;
        cursor: pointer;
    }

    .dk-dragdrop-item {
        opacity: 0.8;
        position: fixed !important;
        z-index: 1000;
        cursor: move;
        color: #fff;
    }

    .dk-add-item {
    }
    body.dk-drag .dk-item.dk-dragdrop-item.dk-add-item,
    body.dk-drag .dk-item.dk-dragdrop-item.dk-add-item .dk-item-content{
        cursor: move;
    }


    .dk-delete-item {
    }

    .dk-delete-item .dk-delete-item-ico {
        opacity: 1;
        background-color: #ff6666;
        position: absolute;
        top: -4px;
        right: -4px;
    }

    .dk-placeholder-item {
        background-color: #6EC5FD;
        color: transparent;
        opacity: 0;
    }

    .dk-item-prompt-text {
        height: 26px;
        line-height: 26px;
        color: #6EC5FD;
        font-size: 12px;
        font-weight: bold;
        text-align: center;
        position: absolute;
        bottom: 0;
        z-index: 9;
        width: 100%;
    }

    .dk-animate-item {
        -webkit-transform: translate3d(0, 0, 0);
        -webkit-backface-visibility: hidden;
        -webkit-transform-style: preserve-3d;
        transition: transform 0.15s, top 0.15s;
    }
    .dk-cover-item {
        border-radius: 13px;
        background-color: $dd-malibu;
        transform: scale(1.04);
    }

    .dk-cover-item .dk-item-content {
        background-color: $dd-malibu;
    }

    /*该样式不能删除,否则拖拽获焦不准*/
    .dk-item-content::after {
         content: '';
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        z-index: 2;
    }

</style>
