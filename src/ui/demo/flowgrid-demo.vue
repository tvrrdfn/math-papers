<template>
    <div class="flowgrid-demo" >
        <button class="add" @click="add">添加</button>
        <ptFlowGrid ref="flowgrid" :nodes="nodes" name="test" :setting="setting">
            <template scope="props">
                <div>{{props.node.id}}</div>
            </template>
        </ptFlowGrid>
    </div>
</template>

<script>
    export default {
        name: 'flowGridDemo',

        data() {
            return {
                setting: {
                    nodeMinW: 3,                                       // 节点块的最小宽度, 默认占2格
                    nodeMinH: 4,
                    containerW: 1200      // @fix 这个必须指定
                },
                nodes: [
                    {id: '1x', x: 0, y: 0, w: 3, h: 3},
                    {id: '2x', x: 0, y: 3, w: 3, h: 6},
//                    {id: '3', x: 6, y: 10, w: 10, h: 16},
//                    {id: '4', x: 0, y: 2, w: 4, h: 2, minW: 2, minH: 2},
//                    {id: '5', x: 4, y: 2, w: 3, h: 2, minW: 2, minH: 2}
                ]
            };
        },

        methods: {
            add() {
                this.$refs.flowgrid.add();
            }
        }
    }
</script>

<style >
    .flowgrid-demo{
        border:1px solid #3c3c3c;
        margin: 0 auto;
        /*padding-left: 5px;*/
        width: 1200px;
        height: 100%;
    }

    .flowgrid-demo .add {
        position: absolute;
        top: 5px;
        left: 5px;
        margin: 10px;
        padding: 10px;
    }

    .flowgrid-demo .fg-container{
        margin: 20px 0px;
    }
</style>
