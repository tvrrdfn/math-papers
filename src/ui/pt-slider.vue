<template>
    <div
        class="pt-ui-slider"
    >
    	<div
            class="pt-ui-slider-track"
            ref="track"
            @mousedown="onDragStart"
        >
            <div class="pt-ui-slider-track-bg"></div>
            <div class="pt-ui-slider-track-fill" :style="fillStyle"></div>
            <div class="pt-ui-slider-trumb" ref="thumb" :style="thumbStyle" ></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ptSlider',
        props: {
            value: {
                type: Number,
                required: true
            },
            max: {
                type: Number,
                default: 100
            },
            disabled: {
                type: Boolean,
                default: false
            }
        },

        mounted() {
            this.initializeSlider();
        },

        data() {
            return {
                initialValue: this.value,
                isDragging: false,
                isActive: false,
                trackLength: 0,
                trackOffset: 0,
                thumbSize: 0,
                localValue: this.value
            };
        },

        computed: {
            fillStyle() {
                return { transform: 'scaleX(' + (this.localValue / this.max) + ')' };
            },

            thumbStyle() {
                return {
                    transform: 'translateX(' + (
                        ((this.localValue / this.max) * this.trackLength) - (this.thumbSize / 2)
                    ) + 'px)'
                };
            }
        },

        watch: {
            value() {
                this.setValue(this.value);
            },
            isDragging() {
                const operation = this.isDragging ? 'add' : 'remove';
                document.body.classList[operation]('ui-slider--is-dragging');
            }
        },

        methods: {
            getTrackOffset() {
                let el = this.$refs.track;
                let offset = el.offsetLeft;

                while (el.offsetParent) {
                    el = el.offsetParent;
                    offset += el.offsetLeft;
                }

                return offset;
            },

            setValue(value) {
                if (value > this.max) {
                    value = this.max;
                } else if (value < 0) {
                    value = 0;
                }

                if (value === this.localValue) {
                    return;
                }

                this.localValue = value;
                this.$emit('input', value);
                this.$emit('change', value);
            },

            initializeSlider() {
                this.thumbSize = this.$refs.thumb.offsetWidth;
                this.trackLength = this.$refs.track.offsetWidth;
                this.trackOffset = this.getTrackOffset(this.$refs.track);
            },

            onDragStart(e) {
                if(this.disabled){
                    return;
                }

                this.isDragging = true;
                this.dragUpdate(e);

                document.addEventListener('mousemove', this.onDragMove);
                document.addEventListener('mouseup', this.onDragStop);
                document.addEventListener('contextmenu', this.onDragStop);
            },

            onDragMove(e) {
                this.dragUpdate(e);
            },

            dragUpdate(e) {
                const position = e.touches ? e.touches[0].pageX : e.pageX;
                const value = this.getEdge(
                    ((position - this.trackOffset) / this.trackLength) * this.max, 0, this.max
                );

                if (this.isDragging) {
                    this.setValue(Math.round(value));
                }
            },

            onDragStop(e) {
                this.isDragging = false;

                document.removeEventListener('mousemove', this.onDragMove);
                document.removeEventListener('mouseup', this.onDragStop);
                document.removeEventListener('contextmenu', this.onDragStop);

                this.$emit('dragend', this.localValue, e);
            },

            getEdge(a, b, c) {
                if (a < b) {
                    return b;
                }

                if (a > c) {
                    return c;
                }

                return a;
            }
        }
    };
</script>

<style lang="scss">
    @import "./styles/imports";

    .pt-ui-slider{
        display: flex;
        align-items: center;
        outline: none;

        .pt-ui-slider-track {
            display: flex;
            position: relative;
            width: 100%;
            height: 1.125rem;
            margin: 0 auto;
            cursor: pointer;
            align-items: center;

            .pt-ui-slider-track-bg, .pt-ui-slider-track-fill{
                content: "";
                display: block;
                height: 2px;
                position: absolute;
                top: .46875rem;
                left: 0;
            }

            .pt-ui-slider-track-bg{
                background-color: $dd-tundora;
                width: 100%;
            }

            .pt-ui-slider-track-fill{
                background-color: $dd-larioja;
                transform-origin: left;
                width: 100%;
            }

            .pt-ui-slider-trumb{
                background-color: $dd-larioja;
                cursor: inherit;
                display: block;
                width: 22px;
                height: 22px;
                left: 0;
                position: relative;
                z-index: 1;
                @include border-radius(100%);

                &:before{
                    content: "1";
                    color:$dd-nightrider;
                    display: inline-block;
                    position: absolute;
                    top:2px;
                    left:7px;
                }
            }

        }
    }

    .ui-slider--is-dragging {
        user-select: none;
    }

</style>
