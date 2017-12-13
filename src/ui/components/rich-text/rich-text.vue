<template>
    <div>
        <div 
            rich-text
            :class="wrapClasses" 
            v-html="currentContent"
            @dblclick="initialize"
            ref="richText"
        ></div>

        <file-upload
            v-show="false"
            :name="uploadOptions.name"
            :post-action="uploadOptions.postAction"
            :accept="uploadOptions.accept"
            :directory="uploadOptions.directory"
            :size="uploadOptions.size"
            :thread="uploadOptions.thread"
            v-model="uploadOptions.files"
            @input-file="inputFile"
            ref="upload"
        ></file-upload>
</div>

</template>
<script type="text/javascript">
//TODO: tinymce插件在index.html中引入;

import FileUpload from 'vue-upload-component'
import WidgetApi from 'v2/apis/widget';
export default {
    name: "ptRichText",

    props: {
        placeholder: {
            type: String,
            default: "Double click to add rich text"
        },
        originalData: {
            type: Object,
            // required: true
        }
    },

    data() {
        return {
            i18n: "zh_CN",
            defaultContent: this.$t('charts.rich_text.placeholder'),
            sizeErrorTips: this.$t('charts.rich_text.tips_size'),
            formatErrorTips: this.$t('charts.rich_text.tips_format'),
            currentContent: null,
            isPlaceholder: null,
            currentUploadCallback: null,
            uploadOptions: {
                files: [],
                thread: 1,
                auto: true,
                multiple: true,
                directory: false,
                size: 1024 * 300,
                name: 'file',
                accept: 'image/png,image/gif,image/jpeg,image/webp',
                extensions: 'gif,jpg,jpeg,png,webp',
                postAction: 'http://192.168.2.15:9090/pt/file/imgUpload?sid=li.zhang@ptmind.com:01c64d9e-1ca5-4eb8-8142-77596ad7cf96:develop-test'
            }
        }
    },

    computed: {
        wrapClasses() {
            return [
                "chart-richtext",
                {
                    "chart-richtext__placeholder": this.isPlaceholder,
                }
            ]
        }
    },

    mounted() {
        this.init();
    },

    methods: {
        init() {
            this.currentContent = this.originalData ? this.originalData.data : this.defaultContent;
            this.isPlaceholder = !this.originalData || !this.originalData.data;
        },

        initialize() {
            let _self = this;

            tinymce.init({
                target: _self.$el.querySelector('[rich-text]'),
                menubar: false,
                inline: true,
                plugins: [
                    'autolink lists link image charmap hr anchor',
                    'wordcount code contextmenu',
                    'emoticons textcolor colorpicker imagetools'
                ],
                toolbar1: 'formatselect | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify',
                toolbar2: 'forecolor backcolor emoticons | bullist numlist | link image media  | code',
                language: this.i18n,
                default_link_target: "_blank",
                forced_root_block: '',
                init_instance_callback: function(editor) {
                    editor.focus(); 
                },
                file_picker_callback: function(callback, value, meta) {
                    console.log(callback, value, meta)
                    if (meta.filetype == 'image') {
                        _self.uploadImage();
                        _self.currentUploadCallback = callback;
                    }
                },
                file_picker_types: 'image',
                setup: function(editor) {
                    editor.on('focus', function() {
                        _self.onFocus();
                    })
                    editor.on('blur', function() {
                        _self.onBlur(editor);
                    });
                }
            });
        },

        onFocus(editor) {
            if(this.isPlaceholder) {
                this.clearPlaceholder();
            }
        },

        onBlur(editor) {
            this.currentContent = editor.getContent();

            if(!this.currentContent){
                this.innerPlaceholder();
            }
            console.log(editor)

            //销毁
            setTimeout(() => {
                editor.remove()
            })
        },

        clearPlaceholder() {
            this.isPlaceholder = false;
            this.$refs.richText = "";
        },

        innerPlaceholder() {
            this.isPlaceholder = true;
            this.$refs.richText = this.defaultContent;
        },

        imageuploaded(res) {
          if (res.errcode == 0) {
            console.log(res);
            // this.src = res.data.src;
          }
        },


        // 触发添加图片事件
        uploadImage(callback) {
            this.$nextTick(() => {
                this.$refs.upload.$el.querySelector('input').click();
            })
        },

        // File Event
        inputFile(newFile, oldFile) {
            if (newFile && !oldFile) {
                console.log('add', newFile)
                var URL = window.URL || window.webkitURL
                if (URL && URL.createObjectURL) {
                    this.$refs.upload.update(newFile, {blob: URL.createObjectURL(newFile.file)})
                }
            }
            if (newFile && oldFile) {
                console.log('update', newFile, oldFile)

                if (newFile.progress != oldFile.progress) {
                    console.log('progress', newFile.progress)
                }

                if(newFile.success){
                    this.onUploadSuccess(newFile.response.content);
                    this.clearErrorTips();
                } else if(newFile.error){
                    this.addErrorTips(newFile.error)
                }
            }

            if (!newFile && oldFile) {
                console.log('remove', oldFile)
            }

            // 自动上传
            if (this.uploadOptions.auto && !this.$refs.upload.uploaded && !this.$refs.upload.active) {
                this.$refs.upload.active = true
            }
        },

        onUploadSuccess(data) {
            var originalFileName = data.originalFileName,
                title = originalFileName.substring(0, originalFileName.lastIndexOf('.'));

            this.currentUploadCallback(data.imgUrl, {
                // width: 200, 
                // height: 200, 
                title: title,
                alt: title
            })
        },

        addErrorTips(type) {
            let popDom = document.querySelector('.mce-foot').querySelector('.mce-container-body'),
                tipDom = document.createElement('div');

            tipDom.innerText = type == 'size' ? this.sizeErrorTips : this.formatErrorTips;
            tipDom.classList.add('chart-richtext__tip-error');

            popDom.append(tipDom);
        },

        clearErrorTips() {
            let dom = document.querySelector('.chart-richtext__tip-error');
            if(dom){
                dom.remove();
            }
        }
    },

    components: {
        FileUpload
    }
}
</script>
<style type="stylesheet/scss" lang="sass">
@import "../../styles/imports"; 

.chart-richtext {
    font-size: 14px;
    min-height: 100px;
    color: $dd-dimgray;

    &.chart-richtext__placeholder {
        color: $dd-silver;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        font-weight: 200;
        line-height: 1.4em;
        margin: 25px 0 15px
    }

    h1 {
        font-size: 34px
    }

    h2 {
        font-size: 30px
    }

    h3 {
        font-size: 26px
    }

    h4 {
        font-size: 22px
    }

    h5 {
        font-size: 18px
    }

    h6 {
        font-size: 14px
    }

    p {
        margin: 25px 0
    }

    ol,
    ul {
        margin-left: 15px;
        list-style-position: outside;
        margin-bottom: 20px
    }

    ol li,
    ul li {
        margin-left: 10px;
        margin-bottom: 10px;
        color: #626262
    }

    ul li {
        list-style-type: disc
    }

    ol li {
        list-style-type: decimal
    }

    a[href] {
        text-decoration: underline
    }

    table {
        width: 100%;
        border-spacing: 0;
        border-collapse: separate;
        border: 1px solid #aaa
    }

    table tr:nth-child(even) {
        background: #FAFAFA
    }

    table caption,
    table td,
    table th {
        padding: 15px 7px;
        font: inherit
    }

    table th {
        font-weight: 400;
        color: #6E6E6E;
        background-position: 100% 100%;
        background-size: 2px 10px;
        background-repeat: no-repeat
    }

    table th:last-child {
        background: 0 0
    }
}

.mce-container {
    .chart-richtext__tip-error {
        position: absolute;
        top: 10px;
        left: 10px;
        max-width: 180px;
        font-size: $f-sm;
        color: $dd-bittersweet;
        white-space: normal;
        height: 30px;
        display: flex;
        align-items: center;
    }
}
</style>
