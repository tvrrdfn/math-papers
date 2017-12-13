<template>
    <div>
        <ui-radio name="sex" v-model="sex" true-value="male" @change="onChange">男</ui-radio>
        <ui-radio name="sex" v-model="sex" true-value="female" @change="onChange">女</ui-radio>
        {{sex}}
        <input name="hh" type="radio" v-model="level" @change="changeRadio"/> 1
        <input name="hh" type="radio" v-model="level" @change="changeRadio"/> 2

        <input name="language" type="checkbox" v-model="languages"  /> java
        result {{languages}}
    </div>
</template>

<script>
    export default {
        data() {
            return {
                languages: "",
                sex: "male",
                level: ""
            };
        },
        methods: {
            onChange(arg) {
                console.log(arg);
            },
            changeRadio(arg) {
                console.log(arg);
            }
        }
    };
</script>

<style scoped>
    *,
    *::before,
    *::after {
        box-sizing: border-box;
    }

    html {
        font-size: 100%;
    }

</style>
