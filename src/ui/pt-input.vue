<template>
    <div :class="[
        prefix ? 'has-prefix' : '',
        hasContent ? 'has-content' :'',
        type == 'textarea' ? 'pt-textarea' : 'pt-input',
        round ? 'pt-input__theme-' + round : '',
        theme ? 'pt-input__' + theme :'',
        size ? 'pt-input--' + size : '',
        warning ? 'warning' : '',
        {
            'is-disabled': disabled
        }
    ]">
        <span v-if="prefix" class="pt-input__prefix">{{prefixText}}</span>
        <input
            v-if="type !== 'textarea'"
            v-autofocus="autofocus"
            class="pt-input__inner"
            :class="{
            'hasContent': hasContent
            }"

            :type="type"
            :name="name"
            :placeholder="placeholder"
            :disabled="disabled"
            :readonly="readonly"
            :maxlength="maxlength"
            :minlength="minlength"
            :autocomplete="autoComplete"
            :min="min"
            :max="max"
            :value="currentValue"
            ref="input"
            @keydown="handleEnter"
            @input="handleInput"
            @focus="handleFocus"
            @blur="handleBlur">

        <textarea
            v-else
            v-autofocus="autofocus"
            class="pt-textarea__inner"
            :class="{'hasContent': hasContent}"
            :value="currentValue"
            ref="textarea"
            :name="name"
            :rows="rows"
            :placeholder="placeholder"
            :disabled="disabled"
            :readonly="readonly"
            :maxlength="maxlength"
            :minlength="minlength"
            @input="handleInput"
            @focus="handleFocus"
            @blur="handleBlur">
        </textarea>
    </div>
</template>

<script>

export default {
    name: 'ptInput',
    data() {
        return {
            currentValue: this.value,
            hasContent: this.value ? true : false
        };
    },

    props: {
        value: [String, Number],
        placeholder: String,
        size: String,
        readonly: Boolean,
        autofocus: {
            type: Boolean,
            default: false
        },
        disabled: Boolean,
        type: {
            type: String,
            default: 'text'
        },
        round: String,
        theme: {
            type:String,
            default:'light'
        },
        name: String,
        rows: {
            type: Number,
            default: () => 2
        },
        autoComplete: {
            type: String,
            default: 'off'
        },
        maxlength: Number,
        minlength: Number,
        max: {},
        min: {},
        warning: Boolean,  //错误样式
        prefix:{
            type: Boolean,
            default: false
        },
        prefixText: String
    },

    watch: {
        'value'(val, oldValue) {
            this.setCurrentValue(val, 'watch');
        }
    },

    methods: {
        handleEnter(event) {
            var keycode = window.event ? event.keyCode : event.which;
            if (keycode == 13) {
                event.target.blur();
                this.$emit('enter', event);
            }
        },

        handleFocus(event) {
            this.checkHasConten(event.target.value, 'focus');
            this.$emit('focus', event);
        },

        handleInput(event) {
            this.setCurrentValue(event.target.value, 'input');
        },

        handleBlur(event) {
            this.checkHasConten(event.target.value, 'blur');
            this.$emit('blur', event);
        },

        checkHasConten(value, type) {
            this.hasContent = (!value) ? false : true;
        },

        setCurrentValue(value, type) {
            if (value === this.currentValue) return;
            if (type == 'watch') this.checkHasConten(value, type);
            this.currentValue = value;
            this.$emit('input', value);
            this.$emit('change', value);
        }
    }
};
</script>

<style lang="scss">
@import './styles/imports';

$input-height: 26px;
$input-large-height: 30px;
$input-small-height: 24px;
$input-font: 13px;
$input-large-font: 14px;
$input-small-font: 12px;

%disabled {
    background-color: rgb(238, 241, 246);
    border-color: rgb(209, 219, 229);
    color: #bbb;
    cursor: not-allowed;
}

// ==== input ====
.pt-input {
    position: relative;
    font-size: 13px;
    display: inline-block;
    width: 100%;

    &.is-disabled .pt-input__inner {
         @extend %disabled;
    }
    &.warning{
        .pt-input__inner {
             border: 1px solid $dd-bittersweet !important;
             background-color: transparent !important;
             color: $dd-charcoal !important;
        }
    }
    &.has-prefix{
        border: 1px solid $dd-gainsboro;
        border-radius: 4px;
        transition: all .2s cubic-bezier(.645,.045,.355,1);
        &.has-content{
            color: $dd-white;
            background-color: $dd-larioja;
            border-color: $dd-larioja;
            .pt-input__prefix{
                color: $dd-trendygreen;
            }
        }
        .pt-input__prefix{
            display: inline-block;
            padding-left: 10px;
            color: $dd-nobel;
        }
        .pt-input__inner{
            display: inline-block;
            width: auto;
            border: none;
            border-radius: 0;
            padding-left: 0;
            width: 60%;
        }
        &.warning{
            border: 1px solid $dd-bittersweet !important;
            background-color: transparent !important;
            .pt-input__inner{
                border: none !important;
            }
            .pt-input__prefix{
                color: $dd-nobel !important;
            }
        }
    }
}

.pt-input__inner {
    appearance: none;
    background-color: transparent;
    background-image: none;
    border-radius: 4px;
    border: 1px solid $dd-gainsboro;
    color: $dd-charcoal;
    display: block;
    height: $input-height;
    box-sizing: border-box;
    line-height: 1;
    outline: none;
    padding: 0 10px;
    transition: all .2s cubic-bezier(.645,.045,.355,1);
    width: 100%;

    &::-moz-placeholder { color: $dd-silver; }
    &::-webkit-input-placeholder { color: $dd-silver; }
    &:-ms-input-placeholder { color: $dd-silver; }

    &:focus {
        color: $dd-charcoal;
        border-color: $dd-larioja;
        background-color: transparent !important;
    }

    &.hasContent {
        color: $dd-white;
        background-color: $dd-larioja;
        border-color: $dd-larioja;
    }
}

.pt-input--large {
    font-size: $input-large-font;

    .pt-input__inner {
        height: $input-large-height;
        line-height: $input-large-height;
    }
}

.pt-input--small {
    font-size: $input-small-font;

    .pt-input__inner {
        height: input-small-height;
    }
}

.pt-input__theme-round {
    @extend .pt-input;

    &.pt-input--large .pt-input__inner {
        border-radius: $input-large-height/2;
    }

    &.pt-input--small .pt-input__inner {
        border-radius: $input-small-height/2;
    }


}

.pt-input__dark{
    .pt-input__inner {
        color: $dd-white;
        border-color: $dd-tundora;
        &:focus {
            color: $dd-white !important;
            border-color:$dd-larioja;
            background-color: transparent !important;
        }
        &.hasContent {
            color: $dd-nightrider;
            background-color: $dd-larioja;
            border-color: $dd-larioja;
        }
    }
}
.pt-input__light{
    .pt-input__inner {
        background-color: $dd-white;
        border: 1px solid $dd-gainsboro;

        &:focus {
            color: $dd-charcoal !important;
            border-color: $dd-larioja;
            background-color: transparent !important;
        }

        &.hasContent {
            color: $dd-white;
            background-color: $dd-larioja;
            border-color: $dd-larioja;
        }
    }
}

// ==== textarea ====
.pt-textarea {
    @extend .pt-input;
    vertical-align: bottom;

    &.is-disabled .pt-textarea__inner {
        @extend %disabled;
    }
}

.pt-textarea__inner {
    @extend .pt-input__inner;
    height: 100%;
    resize: none;
    padding: 5px 7px;
    line-height: 1.5;
}
</style>
