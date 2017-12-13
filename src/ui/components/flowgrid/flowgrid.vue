<template>
    <div class="fg-container" :name="name" @scroll="onScroll">
        <div class="fg-layout"
             :style="{height: containerHeight + 'px', width: containerWidth + 'px', minWidth: opt.minWidth + 'px'}"
             :class="{'dragging': isDrag}"
        >
            <div
                class="fg-item fg-item-animate"
                :class="{'fg-item-placeholder': index == currentIndex}"
                :style="itemStyle(item, index)"
                :fg-id="item.id"
                :fg-index="index"
                :data-top="(item.y * opt.cellH)"
                :data-left="(item.x * opt.cellW)"
                v-for="(item,index) in items"
                :key="item.id"
            >
                <div class="fg-item-content">
                    <slot
                        :node="item"
                        :index="index"
                        :isDrag="isDrag"
                        :size="{w: item.w * opt.cellW, h: item.h * opt.cellH}"
                    ></slot>

                    <!--拖拽句柄-->
                    <div v-if="opt.draggable" class="fg-item-drag-bar" :fg-id="item.id" :fg-index="index">
                        <pt-svg useId="icon-moveto"></pt-svg>
                    </div>

                    <!--缩放句柄-->
                    <div v-if="opt.resizable" class="fg-item-zoom-bar" :fg-id="item.id" :fg-index="index">
                        <pt-svg useId="icon-resize"></pt-svg>
                    </div>
                </div>

            </div>

            <!-- 跟随鼠标移动的拖拽节点 -->
            <div class="fg-item-dragdrop" v-show="isDrag"></div>
        </div>
    </div>
</template>

<script>
    import {globalConfig} from './config';

    import event from './event';
    import cache from './cache';
    import utils from './utils';
    import service from './service';

    export default {
        name: 'ptFlowGrid',
        props: {
            name: {
                type: String,
                required: true
            },
            setting: Object,
            nodes: {
                type: Array,
                required: true,
                default: () => []
            }
        },

        created() {
            console.log('flowgrid created')

            event.init(true);
            cache.set(this.name, this);
            this.init();
        },

        beforeDestroy() {
            event.destroy();
        },

        beforeUpdate() {
//            console.log('before update')
//            this.load();
        },

        data() {
            return {
                currentIndex: -1,
                isDrag: false,
                items: null,
                area: []
            };
        },

        computed: {
            current() {
                if (this.currentIndex == -1) return null;
                return this.items[this.currentIndex];
            },

            opt: function () {
                let options = Object.assign({}, globalConfig, this.setting || {});
                this.computeCell(options);
                return options;
            },

            containerHeight() {
                let node = this.getBottomNode();
                if (node == null) return 0;
                return this.opt.cellH * (node.y + node.h);
            },

            containerWidth() {
//                return this.setting.containerW;
            }
        },

        watch: {
            items() {
//                console.log("items changed");
                this.load();
            }
        },

        methods: {
            init() {
                this.initItems();
                this.load();
            },

            initItems() {
                let items = [];
                this.nodes.forEach(node => {
                    items.push(Object.assign({}, {minW: this.opt.minW, minH: this.opt.minH}, node));
                });

                // 需要校验x,y坐标
                this.fixCoordinates(items);

                this.items = items;
            },

            onScroll(event) {
                this.$emit('scroll', event);
            },

            load() {
                this.buildArea();
                this.layout();
            },

            callback(type) {
                const nodes = this.items.map(o => Object.assign({}, o));
                this.$emit(type, nodes, this.current);
            },

            /**
             * 修正x.y坐标有问题的节点（1. 没有坐标; 2.会有重叠）
             * @param nodes
             */
            fixCoordinates(nodes) {
                if(nodes.length === 0) return;

                let isNeedSync2Server = false;

                // 所有节点坐标都为undefined情况,将第一个节点设置为坐标原点
                const isAllUndefined = nodes.every(node => node.x === undefined && node.y === undefined);
                if(isAllUndefined) {
                    nodes[0].x = 0;
                    nodes[0].y = 0;
                }

                // 查找重叠的节点, 如果有重叠,则将坐标值都设置为undefined
                let area = service.buildArea(nodes);
                nodes.forEach(node => {
                    if(service.collision(area,node)) {
                        node.x = undefined;
                        node.y = undefined;
                    }
                });

                // 重排坐标为undefined的节点
                nodes.forEach(node => {
                    if(node.x === undefined || node.y === undefined) {
                        isNeedSync2Server = true;
                        let newNode = service.getNodeCoord(node, nodes);
                        node.x = newNode.x;
                        node.y = newNode.y;
                    }
                });

                // 向服务器端发送请求同步最新节点
                if(isNeedSync2Server){
                    const data = nodes.map(o => Object.assign({}, o));
                    this.$emit("change", data);
                }
            },

            // 自动扫描空位添加节点
            add(node) {
                node = service.getNodeCoord(node, this.items, this.area);
                this.items.push(node);
                this.buildArea();
                this.callback('change');
            },

            // 删除节点
            deleteNode(id) {
                this.items = this.items.filter(node => node.id != id);
                this.callback('change');
            },

            buildArea() {
                this.area = service.buildArea(this.items);
            },

            layout() {
                this.items.forEach((node, index) => {
                    let y = this.findEmptyLine(node);
                    if (node.y > y) {
                        this.moveUp(node, y, index);
                    }
                });
            },

            moveUp(node, newRow, index) {
                let area = this.area;
                node.y = newRow;
                this.updateNode(node, index);
            },

            updateNode(node, index = this.currentIndex) {
                this.$set(this.items, index, node);
            },

            findEmptyLine(node) {
                let r, c, area = this.area;

                for (r = node.y - 1; r >= 0; r--) {
                    for (c = node.x; c < node.x + node.w; c++) {
                        if (area[r][c] !== undefined) {
                            return r + 1;
                        }
                    }
                }

                return 0;
            },

            // 计算单元格
            computeCell: function (opt) {
                const renderWidth = Math.max(opt.containerW, opt.minWidth);
                opt.cellW = renderWidth / opt.col;
//                opt.cellW = (opt.containerW - (opt.col / opt.nodeMinW - 1) * (opt.padding.left + opt.padding.right))/ opt.col;
                opt.cellH = opt.cellScale.h / opt.cellScale.w * opt.cellW;
//                opt.cellW_Int = Math.floor(opt.cellW);
//                opt.cellH_Int = Math.floor(opt.cellH);
            },

            // 查找最低位置node
            getBottomNode() {
                if (this.items.length === 0) return null;
                let node = this.items[0];
                for (let i = 1; i < this.items.length; i++) {
                    let curr = this.items[i];
                    if (curr.y + curr.h > node.y + node.h) {
                        node = curr;
                    }
                }
                return node;
            },

            // 将数据铺进网格
//            putNodes(area) {
//                let r, rlen, c, clen;
//
//                for (let node of this.items) {
//                    for (r = node.y, rlen = node.y + node.h; r < rlen; r++) {
//                        for (c = node.x, clen = node.x + node.w; c < clen; c++) {
//                            this.area[r][c] = node.id;
//                        }
//                    }
//                }
//            },

            itemStyle(node, index) {
                let opt = this.opt;
                if (opt.isCss3) {
                    return {
                        width: (node.w * opt.cellW - opt.padding.left - opt.padding.right) + 'px',
                        height: (node.h * opt.cellH - opt.padding.top - opt.padding.bottom) + 'px',
                        transform: "translate(" + (node.x * opt.cellW) + "px," + (node.y * opt.cellH) + "px)",
//                        transform: "translate(" + (node.x * opt.cellW + (opt.padding.left + opt.padding.right) * (node.x / opt.nodeMinW)) + "px, " +
//                        (node.y * opt.cellH + (opt.padding.top + opt.padding.bottom) * (node.y / opt.nodeMinH)) + "px)"
                    };
                }
                return {
                    width: (node.w * opt.cellW - opt.padding.left - opt.padding.right) + 'px',
                    height: (node.h * opt.cellH - opt.padding.top - opt.padding.bottom) + 'px',
                    top: (node.y * opt.cellH) + 'px',
                    left: (node.x * opt.cellW) + 'px'
//                    transform: "translate(" + (node.x * opt.cellW) + "px," + (node.y * opt.cellH) + "px)",
//                    transform: "translate(" + (node.x * opt.cellW + (opt.padding.left + opt.padding.right) * (node.x / opt.nodeMinW)) + "px, " +
//                        (node.y * opt.cellH + (opt.padding.top + opt.padding.bottom) * (node.y / opt.nodeMinH)) + "px)"
                };
            },

            // 是否发生碰撞
            checkHit(n, node) {
                var result = false;
                if ((n.x + n.w > node.x) && (n.x < node.x + node.w) &&
                    (n.y + n.h > node.y) && (n.y < node.y + node.h)) {
                    result = true;
                }
                return result;
            },

            overlap(node, dx, dy, isResize) {
                this.updateNode(node);

                let nodes = this.items,
                    offsetUnderY = 0,
                    offsetUpY = 0,
                    offsetNode = null,  // 要进行偏移node
                    checkHit = this.checkHit;

//                if (!isResize) {
//
//                    // 查找一起碰撞多个节点中，位置最靠下的节点
//                    for(let n of nodes) {
//                        if (n !== node && checkHit(n, node)) {
//                            var val = n.y + n.h - node.y;
//                            if (val > offsetUnderY) {
//                                offsetUnderY = val;
//                                offsetNode = n;
//                            }
//                        }
//                    }
//                    if (offsetNode && offsetNode.y + offsetNode.h > node.y) {
//                        // 判断插入点应该上移还是下移, 通过重叠点的中间值h/2来判断
//                        var median = offsetNode.h / 2 < 1 ? 1 : Math.floor(offsetNode.h / 2);
//                        // 计算差值, 与中间值比较, dy > 2 下移(2是优化, 防止平移上下震动), 拿y+h来和中间值比较
////                        var difference = (dy >= 2 && dy >= dx) ? node.y + node.h - offsetNode.y : node.y - offsetNode.y;
//                        var difference = (dy >= 0) ? node.y + node.h - offsetNode.y : node.y - offsetNode.y;
//                        // 大于中间值, 求出下面那部分截断的偏移量, 等于是怕上下顺序连续的块,会错过互换位置
//
//                        console.log(`dy: ${dy}, offsetUnderY:${offsetUnderY}, diffrence:${difference}, median: ${median}`)
////                        if (difference >= median) {
////                            node.y = node.y + offsetUnderY;
////                            console.log(JSON.stringify(node))
////                            this.updateNode(node);
////                        }
////
////                        // 上移
////                        if(dy < 0 && node.y + node.h - offsetNode.y >= median) {
////                            node.y = node.y + offsetUnderY;
////                            this.updateNode(node);
////                        }
//
//                        if (node.y + node.h - offsetNode.y >= median) {
//                            node.y = node.y + offsetUnderY;
//                            console.log(JSON.stringify(node))
//                            this.updateNode(node);
//                        }
//                    }
//                }

                // 缩放
                for (let n of nodes) {
                    if (n !== node && checkHit(n, node)) {
                        let val = node.y - n.y;
                        offsetUpY = val > offsetUpY ? val : offsetUpY;
                    }
                }

                // 重新计算y值
                nodes.forEach((n, index) => {
                    if (n !== node) {
//                        if (n.y + n.h > node.y) {
                        if ((n.y < node.y && n.y + n.h > node.y) || node.y <= n.y) {
                            n.y = n.y + node.h + offsetUpY;
                            this.updateNode(n, index);
                        }
                    }
                });
            }
        }
    }
</script>

<style lang="scss">
    /* 插件外容器的样式 */
    .fg-container {
        position: relative;
        z-index: 1;
        width: 100%;
        height: 100%;
        overflow: auto;
        padding-bottom: 70px;
    }

    /* 网络布局的外容器 */

    /* 节点块的样式 */
    .fg-item {
        // cursor: pointer;
        position: absolute;
        z-index: 10;
        padding: 5px;

        &:hover {
            z-index: 20;
        }
    }

    /* 节点块的内容区 */
    .fg-item-content {
        position: relative;
        width: 100%;
        height: 100%;
        /*top: 5px;*/
        /*left: 5px;*/
        /*right: 5px;*/
        /*bottom: 5px;*/
    }

    /* 节点块的动画样式 */
    .fg-layout .fg-item-animate {
        -webkit-transform: translate3d(0, 0, 0);
        -webkit-backface-visibility: hidden;
        -webkit-transform-style: preserve-3d;
        transition: transform 0.2s;
        /*transition: top .2s, left .2s;*/
    }

    /* 拖拽过程中, 被拖拽的当前节点块补充占位样式 */
    .fg-item-placeholder {
        z-index: 1;

        & > * {
            overflow: hidden;
        }
    }

    .fg-item-placeholder::before {
        content: "";
        position: absolute;
        top: 5px;
        left: 5px;
        right: 5px;
        bottom: 5px;
        background: #e0e0e0;
        border-radius: 4px;
        z-index: 2;
    }

    /* 拖拽过程中, 被拖拽的节点 */
    .fg-item-dragdrop {
        padding: 5px;
        position: absolute;
        z-index: 100;
        /*box-shadow: 2px 2px 2px rgba(144, 142, 142, 0.6);*/
        /*opacity: 0.8;*/
        /*background-color: #fff;*/

        &::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }

        & > * {
            overflow: hidden;
        }
    }

    /* 节点块的拖拽句柄 */
    .fg-item-drag-bar {
        position: absolute;
        overflow: hidden;
        z-index: 30;
        cursor: move;
        opacity: 0;
        text-align: center;
        svg{
            width: 14px;
            height: 14px;
            vertical-align: bottom;
            margin-bottom: 2px;
            fill: #fff;
        }
        &:before{
            content: '';
            position: absolute;
            z-index: 100;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: transparent;
        }
    }

    /*.fg-item-drag-bar:before {*/
    /*content: "";*/
    /*position: absolute;*/
    /*z-index: 100;*/
    /*top: 0;*/
    /*left: 0;*/
    /*bottom: 0;*/
    /*right: 0;*/
    /*background-color: #C3E88D;*/
    /*}*/

    /* 节点块的缩放句柄 */
    .fg-item-zoom-bar {
        position: absolute;
        bottom: 0px;
        right: 0px;
        z-index: 1;
        cursor: se-resize;
        opacity: 0;
        svg{
            width: 16px;
            height: 16px;
            fill:#bbb;
            vertical-align: bottom;
        }
        &::after {
            content: '';
            position: absolute;
            z-index: 100;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: transparent;
        }
    }

    .fg-item:hover {
        .fg-item-zoom-bar, .fg-item-drag-bar {
            opacity: 1;
        }
    }

    /*.fg-item-zoom-bar:before {*/
    /*content: "";*/
    /*position: absolute;*/
    /*z-index: 100;*/
    /*top: 0;*/
    /*left: 0;*/
    /*bottom: 0;*/
    /*right: 0;*/
    /*background-color: aqua;*/
    /*}*/
</style>
