<template>
    <div>
        <h1>Test</h1>

        <ul v-if="config">
            <li v-for="s in config.steps">
                {{s.name}}

                <ul>
                    <li v-for="o1 in list">{{o1.name}}</li>
                </ul>

                <ul>
                    <li v-for="o2 in rs.list">{{o2.name}}</li>
                </ul>
            </li>
        </ul>

    </div>
</template>

<script>
    export default {
        name: 'test',

        data() {
            return {
                list: null,
                steps: null,
                config: null,
                rs: {}
            };
        },

        created() {
            this.init();
        },

        methods: {
            init() {
                setTimeout(() => {
                    let steps = [{name: 'step01'}, {name: 'step02'}];
                    this.config = {steps: steps};
//                    this.$set(this.config, "steps", steps);
//                    this.steps = steps;

                    setTimeout(() => {
                        let list = [{name: 'list'}, {name: 'table'}];
                        this.list = list;
                        this.rs.list = list;
                    });

                },2000);
            }
        }
    };

</script>
