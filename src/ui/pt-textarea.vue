<template>
	<div class="pt-textarea" :class="classes">
		<textarea></textarea>
	</div>

</template>

<script>
    export default {
        name: 'ptTextarea',
        props: {
            classes: null,
            name: String,
            type: String,
            value: {
                type: [Number, String],
                required: true
            },
            max: [Number, String],
            min: [Number, String]
        }
    };
</script>

<style lang="scss">
	@import './styles/imports';

    $pt-textarea-height: 70px;
    $pt-textarea-border-radius: 6px;

    .pt-textarea{
        width: 100%;
        height: $pt-textarea-height;
        display: inline-block;
        position: relative;
        color: #666;
        background-color: $dd-white;
        border: 1px solid $dd-tundora;
        border-radius: $pt-textarea-border-radius;
        overflow: hidden;
        margin: 0;
        padding: 0;
        font-size: 12px;
        transition: border .2s ease;

        textarea {
            width: 100%;
            padding: 6px;
            border: 0;
            height: 100%;
            line-height: 1.2;
            transition: all 0.3s linear;
        	resize: none;
        }
    }

</style>
