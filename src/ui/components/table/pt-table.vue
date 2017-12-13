<template>
    <div class="pt-table-wrapper" ref="tableWrapper">
        <table>
            <thead>
            <tr>
                <th
                    v-for="(c,index) of columns"
                    :title="c.name"
                    @click="onSort(index)"
                    :class="directionCls(index)"
                    :style="c.style"
                >{{c.name}}
                </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="row of paginationData">
                <td :title="column" v-for="(column, index) of row">{{format(column, index)}}</td>
            </tr>
            </tbody>
        </table>
        <pagination
            ref="pagination"
            :data="rows"
            :currentPage="pagination.currentPage"
            :pageLength="pagination.pageLength"
            @change="onPaginationChange"
        ></pagination>
    </div>
</template>

<script>
    import pagination from './pagination.vue';
    import Sorter from './sorter';
    import TableResize from './table-resize';

    function pluck(arr, attr) {
        return arr.map(function (obj) {
            return obj[attr];
        });
    }

    function isEmptyArray(arr) {
        return arr == null || arr.length === 0;
    }

    export default {
        name: 'ptTable',
        props: {
            // 对应tbody中数据
            rows: {
                type: Array,
                required: true
            },

            // 表头及schema描述信息
            columns: {
                type: Array,
                required: true
            },

            // 分页对象
            pagination: {
                type: Object,
                default: function () {
                    return {
                        currentPage: 1,
                        pageLength: 10
                    };
                }
            },

            // 排序参数,是二维数组,支持多列排序
            orders: {
                type: Array,
                default() {
                    return [[0, 'desc']];
                }
            },

            features: {
                type: Object,
                default: () => {
                    sortable: true;
                }
            },
            resizeTableOption:Object, // 拖拽表格列宽的option选项
            isEditor:Boolean
        },

        created() {
            if(this.features.sortable){
                this.initSorter();
            }
        },
        mounted(){
            if(!this.features.sortable && this.isEditor){
                var table = document.querySelectorAll('.editor .pt-chart table')[0];
                new TableResize(table,this.resizeTableOption);
            }
        },
        beforeMount() {
            console.log(this.$refs.tableWrapper)
        },

        data() {
            return {
                sorter: null,               // 用来排序的实例对象
                currentSortingColumn: null, // 当前正在排序的列
                paginationData: null        // 分页后展示数据
            };
        },

        methods: {
            /**
             * 排序操作
             */
            onSort(index) {
                if(!this.features.sortable) return;
                var opp = this.opposites(this.currentSortingColumn[index]);
                this.currentSortingColumn = {[index]: opp};
                this.sorter.sort(index, opp);
            },

            initSorter() {
                this.sorter = new Sorter(this.rows, this.orders,
                    pluck(this.columns, 'comparator'), pluck(this.columns, 'dataType'));

                if (!isEmptyArray(this.orders)) {
                    let last = this.orders[this.orders.length - 1],
                        index = last[0],
                        direction = last[1];
                    this.currentSortingColumn = {[index]: direction};
                }

            },

            /**
             * 接收分页后数据
             */
            onPaginationChange(data) {
                this.paginationData = data;
            },

            directionCls(index) {
                if(!this.features.sortable) return "no_sortable";
                return this.currentSortingColumn[index];
            },

            opposites(direction) {
                var mapper = {'desc': 'asc', 'asc': 'desc'};
                return direction ? mapper[direction] : 'asc';
            },

            /**
             * 格式化数据
             * @param value
             * @param index
             */
            format(value, index) {
                let formatter = this.columns[index].formatter;
                if (typeof formatter === 'function') {
                    return formatter.call(null, value);
                }
                return value;
            }
        },

        components: {
            pagination
        }
    };
</script>

<style>
    .pt-table-wrapper table {
        table-layout: fixed;
        width: 100%;
        box-sizing: content-box;
        border: 1px solid #e0e0e0;
        border-right: none;
        border-bottom: 2px solid #9e9e9e;
        margin: 0 auto;
        clear: both;
        border-collapse: separate;
        border-spacing: 0;
        margin-bottom: 0 !important;
        position: relative;
        clear: both;
        zoom: 1;
    }

    .pt-table-wrapper table thead th {
        font-weight: 700;
    }

    .pt-table-wrapper table thead th, .pt-table-wrapper table thead td {
        cursor: pointer;
        padding: 5px 16px 5px 8px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        border-bottom: 2px solid #9e9e9e;
        border-right: 1px solid #e0e0e0;
        color: #757575;
        box-sizing: content-box;
        background-repeat: no-repeat;
        background-position: 100%;
        position: relative;
    }

    .pt-table-wrapper table thead th.no_sortable {
        cursor: default;
        padding: 5px 0;
    }

    .pt-table-wrapper table thead th.asc, .pt-table-wrapper table thead th.desc {
        color: #9ccc65;
    }

    .pt-table-wrapper table thead th.asc:after {
        background-position: -20px !important;
    }

    .pt-table-wrapper table thead th.desc:after {
        background-position: -10px !important;
    }

    .pt-table-wrapper table thead th:after {
        content: '';
        position: absolute;
        top: 0;
        right: 6px;
        width: 10px;
        height: 100%;
        background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAKCAYAAACjd+4vAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MTAzM0Y3RTg3QkIwMTFFNTg4QzRBQzMxQjgyN0FCMEUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MTAzM0Y3RTk3QkIwMTFFNTg4QzRBQzMxQjgyN0FCMEUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxMDMzRjdFNjdCQjAxMUU1ODhDNEFDMzFCODI3QUIwRSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxMDMzRjdFNzdCQjAxMUU1ODhDNEFDMzFCODI3QUIwRSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pv5DQtgAAABySURBVHjaYnzw4AEDEvgPxIxY2OgALLf1TStBdVnGsxgfPnwIZsvLy8PVMaEZRgygijqmgbAUZjHdLQUBFrT4waeJKHWgOAXR086mYaiDxjVGHNMVsJAQbIzUVEesjxmpqQ6UrZgGwlJifEwTS0EAIMAAvaokzh+9ibIAAAAASUVORK5CYII=') no-repeat 0;
    }

    .pt-table-wrapper table thead th.no_sortable:after {
        content: '';
        background: none;
    }

    .pt-table-wrapper table tbody td, .pt-table-wrapper table tbody th {
        white-space: nowrap;
        padding: 10px 8px 5px;
        overflow: hidden;
        text-overflow: ellipsis;
        border-top: 1px solid #eaeff0;
        border-right: 1px solid #e0e0e0;
        height: 14px;
        line-height: 1em;
        color: #757575 !important;
        box-sizing: content-box;
    }

    .pt-table-wrapper table tbody tr:nth-child(2n) {
        background-color: #fff;
    }

    .pt-table-wrapper table tbody tr:nth-child(2n+1) {
        background-color: #f5f5f5;
    }

    .pt-table-wrapper .pagination {
        margin-top: 6px;
        float: left;
        position: relative;
        left: 50%;
    }

    .pt-table-wrapper .pagination a {
        box-sizing: border-box;
        display: inline-block;
        margin-left: 2px;
        text-align: center;
        text-decoration: none !important;
        cursor: pointer;
        color: #757575 !important;;
        margin: 0 5px;
    }

    .pt-table-wrapper .pagination > span, .pt-table-wrapper .pagination > a {
        position: relative;
        right: 50%;
    }

    .pt-table-wrapper .pagination a.disable {
        cursor: default;
        color: #bdbdbd !important;
        /*border: 1px solid transparent;*/
        background: transparent;
        box-shadow: none;
    }

    .pt-table-wrapper .pagination a.active {
        color: #9ccc65 !important;
    }

    .pt-table-wrapper .empty {
        text-align: center;
    }

    /*表格列宽拖拽样式*/
    .pt-table-wrapper .resize-base {
        position:relative;
        height:100%;
        width:100%;
    }
    .pt-table-wrapper .resize-elem {
        position:absolute;
        height: 30px;
        width: 10px;
        left: calc(100% - 5px);
        margin-left: -5px;
        top: -5px;
        cursor:col-resize;
    }
    .pt-table-wrapper .resize-text {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
</style>
