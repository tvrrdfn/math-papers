<template lang="pug">
.break-down
    header 分解设置（X + Y = Z）
    dl.break-down__box
        dt
            span 题目数量：
        dd
            input(type="Number",name="len",value="50")
    dl.break-down__box
        dt
            span (Z)最大值：
        dd
            input(type="Number",name="zMax",value="20")
    dl.break-down__box
        dt
            span (Z)最小值：
        dd
            input(type="Number",name="zMin",value="10")
    dl.break-down__box
        dt
            span 是否混排：
        dd
            input(type="checkbox",name="isMixed",checked)
    footer
        button(@click="go") 生成试题
</template>

<script>
import CommonUtils from '@/utils/common.utils';

export default {
	name: "breakDown",

    methods: {
        go() {
            console.log(1);
        }
    }
}
</script>

<style lang="sass">
.break-down
    text-align: left

    header
        border-bottom: 1px solid #ccc

    dl
        display: flex
        line-height: 30px

        dt
            width: 110px
            text-align: right
        dd
            margin: 0
            display: flex
            align-items: center
</style>