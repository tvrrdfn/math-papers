<template lang="pug">
    .questions-settings
        .questions-settings__header
            span 四则运算设置
            pt-checkbox(v-model="mixing") 题型是否相互混合
            pt-button(@click="go") 生成试题
        .questions-settings__content
            .questions-settings__content-box(
                v-for="(item, $itemIndex) in configs"
                :key="$itemIndex"
                )
                header {{item.title}}
                    pt-checkbox(v-model="item.value") 应用
                template(v-for="(box, $boxIndex) in item.renderOptions")
                    dl(v-if="box.type === 'number'")
                        dt
                            span {{box.name}}
                        dd
                            pt-input-number(
                                :value="box.value"
                                @change="onChange($event, $boxIndex, $itemIndex)"
                                )
                    dl(v-if="box.type === 'boolean'")
                        dd
                            pt-checkbox(
                                :value="box.value"
                                @change="onChange($event, $boxIndex, $itemIndex)"
                                ) {{box.name}}
</template>

<script>
import CommonUtils from '@/utils/common.utils';
import QuestionsServices from '@/services/questions.services';
import CompletionConfigs from '@/components/configs/completion.config';

export default {
    name: "completion",

    data() {
        return {
            mixing: false,
            configs: [],
            questions: []
        }
    },

    mounted() {
        this.init();
    },

    methods: {
        init() {
            this.configs = CompletionConfigs.getConfigs();
        },

        onChange(value, boxIndex, itemIndex) {
            this.$set(this.configs[itemIndex].renderOptions[boxIndex], 'value', +value)  
        },

        go() {
            let settings = CompletionConfigs.getSettings(this.configs);

            // 根据设置信息生成试题
            this.questions = [];
            settings.forEach(setting => {
                let currQuestions = QuestionsServices.getQuestions(setting);
                setting['questions'] = currQuestions;
                this.questions.push(...currQuestions);
            });

            // 混合试题
            if(this.mixing){
                this.questions = CommonUtils.randomArray(this.questions);
            }

            console.log(this.questions);

            let HTML = QuestionsServices.getHtml(this.questions);
            this.$emit('set', HTML, this.$el.getAttribute('uuid'));
        }
    }
}
</script>

<style lang="sass">
@import '../../styles/imports';

</style>