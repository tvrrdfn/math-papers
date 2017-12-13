<template>
    <div>
        <h1>
            dragkit vue demo
        </h1>

        <!--<div class="test-a">-->
        <!--&lt;!&ndash; 外层容器 &ndash;&gt;-->
        <!--<div class="dk-container dk-container-a" :style="{height: totalHeight + 'px'}">-->
        <!--<transition-group name="flip-list" tag="div">-->
        <!--<div class="dk-item dk-animate-item"-->
        <!--v-for="(item, index) in data"-->
        <!--:style="getNodeStyle(index)"-->
        <!--:key="item.id"-->
        <!--&gt;-->
        <!--<div class="dk-item-content">{{item.name}}</div>-->
        <!--</div>-->
        <!--</transition-group>-->
        <!--</div>-->
        <!--</div>-->

        <!--<button @click="testAni">动画</button>-->

        <div style="float:right">
            group01 (复制)
            <div class="test-a">
                <pt-dragkit
                    name="name1"
                    v-model="data"
                    :options="opt1"
                >
                </pt-dragkit>
            </div>

            group02
            <div class="test-a">
                <pt-dragkit
                    name="name2"
                    v-model="data2"
                    :options="opt2"
                >
                </pt-dragkit>
                <p>drop can replace</p>
            </div>

            group01 (非复制)
            <div class="test-a">
                <pt-dragkit
                    name="name3"
                    v-model="data3"
                    :options="opt3"
                >
                </pt-dragkit>
            </div>
        </div>


        <div class="field_list">
            <pt-tree
                name="fieldList"
                :list="treeData"
                v-model="treeModel"
            ></pt-tree>
        </div>
        <!--<div>-->
            <!--<ul>-->
                <!--<li v-for="item in data">{{item.name}}</li>-->
            <!--</ul>-->

            <!--<button @click="update">update</button>-->
        <!--</div>-->

    </div>
</template>

<script>
    let opt = {
        nodeH: 30,
        padding: 6
    };

    import treeData from './treeData.json';

    export default {
        name: 'dragkitDemo',

        props: {},

        data() {
            return {
                treeData: treeData,
                treeModel: "",

                data: [{
                    id: '123',
                    name: 'test'
                }, {
                    id: '234',
                    name: 'testBfdafdas'
                }],

                data2: [{
                    id: "1",
                    name: '语文课程选修'
                },{
                    id: '123saa',
                    name: 's'
                }, {
                    id: '234dsds',
                    name: 'testBfdsaf'
                }],

                data3: [{
                    id: "12332",
                    name: 'sdjffjf'
                }],

                opt1: {
                    group: 'group01',
                    clone: true
                },

                opt2: {
                    group: 'group02',
                    clone: true,
                    maxNodeNum: 4
                },

                opt3: {
                    clone: false,
                    group: 'group01'
                }
            }
        },

        computed: {
            totalHeight() {
                return this.data.length * (opt.nodeH + opt.padding);
            }
        },

        methods: {
            onRender01(oldIndex, newIndex) {
                var tmp = this.data[newIndex];
                this.$set(this.data, newIndex, this.data[oldIndex]);
                this.$set(this.data, oldIndex, tmp);
            },

            onRender02(oldIndex, newIndex) {
                console.log(oldIndex, newIndex)
                var tmp = this.data2[newIndex];
                this.$set(this.data2, newIndex, this.data2[oldIndex]);
                this.$set(this.data2, oldIndex, tmp);
            },

            update() {
                let o = this.data[0];
                o.name="updated name";
                this.$set(this.data, 0, o);
            }


        }
    };
</script>

<style lang="sass" rel="stylesheet/scss" scoped>
    .field_list {
        width: 200px;
        float: left;
        margin: 20px;
    }
    .test-a {
        /*float: left;*/
        width: 200px;
        border: 1px solid #c3c3c3;
        margin: 50px;
        /*padding: 10px;*/


    }

    .test-a p{
        display: none;
    }
    /*p{
        display: none;
    }*/

    .test-a .dk-full + p{
        display: block;
    }
</style>
