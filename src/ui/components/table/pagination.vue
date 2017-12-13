<template>
    <div class="pagination">
        <a @click="prev" :class="{disable: current <= 1}"> < </a>
        <span>
            <a v-for="item of getPagination()" :class="{active: item == current}" @click="go(item)">{{item}}</a>
        </span>
        <a @click="next" :class="{disable: current >= pageCount}"> > </a>
    </div>
</template>

<script>
    const PAGINATION_LENGTH = 7,
        PAGINATION_PLACEHOLDER = '...';

    function range(start, end){
        var result = [];
        for(var i=start; i<=end; i++){
            result.push(i);
        }
        return result;
    }

    export default {
        name: 'pagination',
        props: {
            data: {
                type: Array,
                required: true,
                default() {return [];}
            },
            currentPage: Number,
            pageLength: Number
        },

        created() {
            this.$emit('change', this.getData());
        },

        computed: {
            totalCount() {
                return this.data.length;
            },

            pageCount() {
                return Math.ceil(this.totalCount / this.pageLength); // 总页数
            }
        },

        data() {
            return {
                current: this.currentPage
            };
        },

        methods: {
            paginationNavCls(item){
                if(item == this.current) return 'active';
            },

            getPagination() {
                if (this.totalCount <= 0) return null;

                if (this.pageCount <= PAGINATION_LENGTH) {
                    return range(1, this.pageCount);
                }

                var continueLen = PAGINATION_LENGTH - 2; // 2表示有两个...占位符

                if (this.current < continueLen) {
                    return range(1, continueLen).concat([PAGINATION_PLACEHOLDER, this.pageCount]);
                }

                if (this.current > this.pageCount - continueLen + 1) {
                    return [1, PAGINATION_PLACEHOLDER].concat(range(this.pageCount - continueLen + 1, this.pageCount));
                }

                return [1, PAGINATION_PLACEHOLDER].concat(range(this.current - 1, this.current + 1)).concat([PAGINATION_PLACEHOLDER, this.pageCount]);
            },

            getData() {
                var start = (this.current - 1) * this.pageLength,
                    end = start + this.pageLength;
                return this.data.slice(start, end);
            },

            prev() {
                this.go(this.current - 1);
            },

            next() {
                this.go(this.current + 1);
            },

            go(page, reload) {
                if (page == PAGINATION_PLACEHOLDER) return;
                if (page < 1 || page > this.pageCount) return;

                if (this.current == page && !reload) return;

                this.current = page;

                this.$emit('change', this.getData());
            }
        },

        watch:{
            // 数据发生变化, 则需要重新分页
            data() {
                this.go(1, true);
            },

            pageLength() {
                this.go(1, true);
            }
        }
    };
</script>
