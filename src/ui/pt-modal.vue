<template>
	<transition :name="toggleTransition" @after-enter="onEnter" @after-leave="onLeave">
        <div
            class="pt-modal pt-modal__mask"

            :class="classes"
            :role="role"

            v-show="isOpen"
        >
            <div
                class="pt-modal__wrapper"
                ref="backdrop"

                :class="{ 'has-dummy-scrollbar': preventShift }"

                @click="dismissOnBackdrop && closeModal($event)"
            >
                <div
                    class="pt-modal__container"
                    ref="container"
                    tabindex="-1"

                    @keydown.esc="dismissOnEsc && closeModal($event)"
                >
                    <div class="pt-modal__header" v-if="!removeHeader">
                        <slot name="header">
                            <h1 class="pt-modal__header-text">{{ title }}</h1>
                        </slot>

                        <div class="pt-modal__close-button">
                            <pt-button
                                @click="closeModal"
                                v-if="dismissOnCloseButton && !removeCloseButton && dismissible"
                            ></pt-button>
                        </div>
                    </div>

                    <div class="pt-modal__body">
                        <slot></slot>
                    </div>

                    <div class="pt-modal__footer" v-if="hasFooter">
                        <slot name="footer"></slot>
                    </div>

                    <div
                        class="pt-modal__focus-redirect"
                        tabindex="0"

                        @focus.stop="redirectFocus"
                    ></div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import ptButton 	from './pt-button.vue';
import classlist 	from './utils/classlist';

export default {
    name: 'pt-modal',

    props: {
        title: {
            type: String,
            default: 'UiModal title'
        },
        size: {
            type: String,
            default: 'normal' // 'small', 'normal', or 'large'
        },
        role: {
            type: String,
            default: 'dialog' // 'dialog' or 'alertdialog'
        },
        transition: {
            type: String,
            default: 'scale' // 'scale', or 'fade'
        },
        removeHeader: {
            type: Boolean,
            default: false
        },
        removeCloseButton: {
            type: Boolean,
            default: false
        },
        preventShift: {
            type: Boolean,
            default: false
        },
        dismissible: {
            type: Boolean,
            default: true
        },
        dismissOn: {
            type: String,
            default: 'backdrop esc close-button'
        }
    },

    data() {
        return {
            isOpen: false,
            lastfocusedElement: null
        };
    },

    computed: {
        classes() {
            return [
                `pt-modal--size-${this.size}`,
                { 'has-footer': this.hasFooter },
                { 'is-open': this.isOpen }
            ];
        },

        hasFooter() {
            return Boolean(this.$slots.footer);
        },

        toggleTransition() {
            return `pt-modal--transition-${this.transition}`;
        },

        dismissOnBackdrop() {
            return this.dismissOn.indexOf('backdrop') > -1;
        },

        dismissOnCloseButton() {
            return this.dismissOn.indexOf('close-button') > -1;
        },

        dismissOnEsc() {
            return this.dismissOn.indexOf('esc') > -1;
        }
    },

    watch: {
        isOpen() {
            this.$nextTick(() => {
                this[this.isOpen ? 'onOpen' : 'onClose']();
            });
        }
    },

    beforeDestroy() {
        if (this.isOpen) {
            this.teardownModal();
        }
    },

    methods: {
        open() {
            this.isOpen = true;
        },

        close() {
            this.isOpen = false;
        },

        closeModal(e) {
            if (!this.dismissible) {
                return;
            }

            // Make sure the element clicked was the backdrop and not a child whose click
            // event has bubbled up
            if (e.currentTarget === this.$refs.backdrop && e.target !== e.currentTarget) {
                return;
            }

            this.isOpen = false;
        },

        onOpen() {
            this.lastfocusedElement = document.activeElement;
            this.$refs.container.focus();

            classlist.add(document.body, 'pt-modal--is-open');
            document.addEventListener('focus', this.restrictFocus, true);

            this.$emit('open');
        },

        onClose() {
            this.teardownModal();
            this.$emit('close');
        },

        redirectFocus() {
            this.$refs.container.focus();
        },

        restrictFocus(e) {
            if (!this.$refs.container.contains(e.target)) {
                e.stopPropagation();
                this.$refs.container.focus();
            }
        },

        teardownModal() {
            document.removeEventListener('focus', this.restrictFocus, true);

            if (this.lastfocusedElement) {
                this.lastfocusedElement.focus();
            }
        },

        onEnter() {
            this.$emit('reveal');
        },

        onLeave() {
            this.$emit('hide');

            classlist.remove(document.body, 'pt-modal--is-open');
        }
    },

    components: {
        ptButton
    }
};
</script>

<style lang="scss">
@import "./styles/imports";

$pt-modal-transition-duration   : 0.3s !default;
$pt-modal-mask-background       : rgba(black, 0.5) !default;
$pt-modal-header-height         : rem-calc(56px);
$pt-modal-footer-height         : rem-calc(70px);

$pt-modal-font-size             : rem-calc(14px);
$pt-modal-header-font-size      : rem-calc(18px);

.pt-modal {
    font-size: 13px;

    &.has-footer {
        .pt-modal__body {
            max-height: calc(100vh - #{$pt-modal-header-height + $pt-modal-footer-height});
        }
    }

    &:not(.has-footer) {
        .pt-modal__body {
            padding: rem-calc(16px 24px 24px);
        }
    }
}

.pt-modal--is-open {
    overflow: hidden;
}

.pt-modal__mask {
    background-color: $pt-modal-mask-background;
    display: table;
    height: 100%;
    left: 0;
    position: fixed;
    top: 0;
    transition: opacity $pt-modal-transition-duration ease;
    width: 100%;
    z-index: $z-index-modal;
}

.pt-modal__wrapper {
    display: table-cell;
    vertical-align: middle;
    overflow-x: hidden;

    &.has-dummy-scrollbar {
        overflow-y: scroll;
    }
}

.pt-modal__container {
    background-color: white;
    border-radius: 2px;
    box-shadow: 0 2px 8px rgba(black, 0.33);
    margin: 0 auto;
    max-height: 100vh;
    max-width: 100vw;
    outline: none;
    overflow: hidden;
    padding: 0;
    transition: all $pt-modal-transition-duration ease;
    width: rem-calc(528px);
}

.pt-modal__header {
    align-items: center;
    background-color: #F5F5F5;
    box-shadow: 0 1px 1px rgba(black, 0.16);
    display: flex;
    height: $pt-modal-header-height;
    padding: rem-calc(0 24px);
    position: relative;
    z-index: 1;
}

.pt-modal__header-text {
    align-items: center;
    display: flex;
    flex-grow: 1;
    font-size: $pt-modal-header-font-size;
    font-weight: normal;
    margin: 0;
}

.pt-modal__close-button {
    margin-left: auto;
    margin-right: rem-calc(-8px);
}

.pt-modal__body {
    max-height: calc(100vh - #{$pt-modal-header-height});
    overflow-y: auto;
    padding: rem-calc(16px 24px);
}

.pt-modal__footer {
    align-items: center;
    display: flex;
    height: $pt-modal-footer-height;
    justify-content: flex-end;
    padding: rem-calc(0 24px);

    .ui-button {
        margin-left: rem-calc(8px);

        &:first-child {
            margin-left: 0;
        }
    }
}

// ================================================
// Sizes
// ================================================

.pt-modal--size-large {
    .pt-modal__container {
        width: rem-calc(848px);
    }
}

.pt-modal--size-small {
    .pt-modal__container {
        width: rem-calc(320px);
    }
}

// ================================================
// Transitions
// ================================================

.pt-modal--transition-fade-enter,
.pt-modal--transition-fade-leave-active {
    opacity: 0;
}

.pt-modal--transition-scale-enter,
.pt-modal--transition-scale-leave-active {
    opacity: 0;

    .pt-modal__container {
        transform: scale(1.1);
    }
}
</style>