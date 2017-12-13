<template>
    <div
        class="pt-ui-tag-input"
        @click="focus"
        v-clickoutside="handleClickOutSide"
        :data-placeholder="placeholder"
        :class="[
            theme ? 'pt-ui-tag-input__' + theme :'',
            size ? 'pt-ui-tag-input__' + size : '',
            items.length || tag ? 'has-items' : '',
            onfocus ? 'onfocus' : ''
        ]"
    >
        <pt-scrollbar ref="scrollbar" :suppressScrollX="true">
            <div class="inner">
                    <span v-for="(tag, index) in items" class="tag-input">
                        <pt-tooltip
                            :openDelay="500"
                            :content="tag"
                            :checkTextOverflow="true"
                        >
                            <span>{{tag}}</span>
                        </pt-tooltip>
                        <a @click.prevent.stop="remove(index)" class="remove">
                            <pt-svg use-id="icon-delete"></pt-svg>
                        </a>
                    </span>
                    <input
                        ref="tagInput"
                        class="tag"
                        type="text"
                        v-model.trim="tag"
                        :size="inputSize"
                        @keydown.delete.stop="removeLast"
                        @keydown.enter.stop="add(tag)"
                    />
            </div>
        </pt-scrollbar>
    </div>
</template>

<script>
    export default {
        name: 'ptTagInput',

        props: {
            placeholder: String,
            theme:String,
            size: String,
            tags: {
                type: Array,
                default: () => []
            }
        },

        data() {
            return {
                items: this.tags.slice(),
                tag: '',
                onfocus: false
            };
        },

        computed: {
            inputSize() {
                return !this.tag ? 1 : this.tag.length + 1;
            }
        },

        methods: {
            focus() {
                this.$refs.tagInput.focus();
                this.onfocus = true;
            },

            add(tag) {
                if(tag === '') return;
                if(this.items.indexOf(tag) == -1){
                    this.items.push(tag);
                }
                this.tag = '';
                this.$nextTick(() => {
                    this.$refs.scrollbar.scrollToPos('bottom');//添加后滚动至底部
                })
            },

            validate(tag) {

            },

            remove(index) {
                this.items.splice(index, 1);
            },

            removeLast(){
                if(this.tag) return;
                this.items.pop();
            },

            handleClickOutSide(){
                this.onfocus = false;
                this.add(this.tag);
            }
        },
        watch: {
            items() {
                this.$emit('change', this.items);
            }
        }
    };
</script>

<style lang="scss">
    @import './styles/imports';
    $input-height: 20px;
    .pt-ui-tag-input {
        background-color: transparent;
        background-image: none;
        border-radius: 4px;
        border: 1px solid $dd-larioja;
        outline: none;
        transition: all .2s cubic-bezier(.645,.045,.355,1);
        width: 100%;
        min-height: 30px;
        padding-bottom: 5px;
        overflow: hidden;
        position: relative;
        cursor: pointer;
        .scrollbar__holder{
            margin-top: 2px;
        }
        .ps-scrollbar-y-rail {
            right: 4px;
        }
        .inner{
            max-height: 299px;
            font-size: 0;
        }
        &__small{
            min-height: 26px;
            padding-bottom: 0px !important;

            .scrollbar__holder{
                margin: 1.5px !important;
            }
            .tag-input{
                margin: 1.5px !important;
            }
            input{
                margin-left: 3px !important;
                margin-top: 3px !important;
            }
            &:before{
                top: 3px !important;
            }
        }
        &:before{
            content: attr(data-placeholder);
            font-size: 13px;
            color: $dd-dimgray;
            position: absolute;
            top: 4px;
            left: 10px;
        }
        input{
            border: none;
            outline: none;
            background-color: transparent;
            color: $dd-charcoal;
            height: $input-height;
            line-height: 1;
            // padding-left: 10px;
            margin: 4px 0 0 3px;
            width: auto;
            max-width: 100%;
            vertical-align: top;
            font-size: $font_13;
            &::-moz-placeholder { color: $dd-silver; }
            &::-webkit-input-placeholder { color: $dd-silver; }
            &:-ms-input-placeholder { color: $dd-silver; }

            &:focus {
                color: $dd-charcoal;
                border-color: $dd-larioja;
            }
        }
        .tag-input{
            display: inline-block;
            height: $input-height;
            line-height: $input-height;
            border-radius: 10px;
            padding: 0 7px;
            background-color: $dd-larioja;
            margin-left: 5px;
            margin-top: 4px;
            position: relative;
            cursor: pointer;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            vertical-align: top;
            max-width: 95%;
            overflow: visible;
            font-size: $font_13;
            span{
                color:$dd-nightrider;
                display: block;
            }
            &:hover{
                overflow: visible;
                a.remove{
                    opacity: 1;
                }
            }
            &.last-tag{
                margin-bottom: 5px;
            }
        }
        a.remove{
            cursor: pointer;
            opacity: 0;
            transition: all .2s cubic-bezier(.645,.045,.355,1);
            position: absolute;
            right: -2px;
            top: -2px;
            z-index: 1;
            svg{
                width: 12px;
                height: 12px;
                fill: $dd-silver;
                background-color: $dd-white;
                border-radius: 50%;
                box-shadow: 0 0 0 1px $dd-white;
            }
            &:hover{
                svg{
                    fill: $dd-bittersweet;
                }
            }
        }
        a.remove:hover{
            text-decoration: none;
        }

        &.has-items{
            &:before{
                display: none;
            }
            input{
                // padding-left: 5px;
            }
        }
    }
    .pt-ui-tag-input__light{
        background-color: transparent;
        border-color: $dd-gainsboro;
        &.has-items{
            border-color: $dd-larioja;
            background-color: $dd-larioja;
        }
        &:before{
            color: $dd-silver;
        }
        &.onfocus{
            border-color: $dd-larioja !important;
            background-color: transparent;
            .tag-input{
                background-color: $dd-larioja;
                span{
                    color:$dd-white;
                }
            }
        }
        .tag-input{
            background-color: $dd-white;
            span{
                color:$dd-larioja;
            }
        }
        input{
            position: absolute;
            border:none;
            background-color: transparent;
            color: $dd-charcoal;
            height: $input-height;
            line-height: 1;
            &::-moz-placeholder { color: $dd-silver; }
            &::-webkit-input-placeholder { color: $dd-silver; }
            &:-ms-input-placeholder { color: $dd-silver; }

            &:focus {
                color: $dd-charcoal;
                border-color: $dd-larioja;
            }
        }
    }
    .pt-ui-tag-input__dark{
        background-color: transparent;
        border-color: $dd-tundora;
        &.has-items{
            border-color: $dd-larioja;
            background-color: $dd-larioja;
        }
        &.onfocus{
            border-color: $dd-larioja !important;
            background-color: transparent;
            .tag-input{
                background-color: $dd-larioja;
                span{
                    color:$dd-nightrider;
                }
            }
        }
        .tag-input{
            background-color: $dd-nightrider;
            span{
                color:$dd-larioja;
            }
        }
        input {
            color: $dd-white;
            border-color: $dd-tundora;
            &:focus {
                color: $dd-white;
                border-color:$dd-larioja;
            }
        }
    }
</style>
