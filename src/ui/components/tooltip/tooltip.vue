<script>
import Popper from './vue-popper';
import debounce from 'throttle-debounce/debounce';
import Vue from 'vue';

/**
 * placement: [
    top,
    top-start,
    top-end,
    bottom,
    bottom-start,
    bottom-end,
    left,
    left-start,
    left-end,
    right,
    right-start,
    right-end
    ]
 */
export default {
  name: 'pt-tooltip',

  mixins: [Popper],

  props: {
    name: String,
    openDelay: {
      type: Number,
      default: 0
    },
    //点击触发时自定关闭的时间
    autoCloseDelay: {
      type: Number,
      default: 1000
    },
    disabled: Boolean,
    manual: Boolean,
    effect: {
      type: String,
      default: 'dark'
    },
    popperClass: String,
    content: [String, Number],
    visibleArrow: {
      default: false
    },
    transition: {
      type: String,
      default: 'fade-in-linear'
    },
    popperOptions: {
      default() {
        return {
          boundariesPadding: 10,
          gpuAcceleration: false
        };
      }
    },
    openOn: {
        type: String,
        default: 'mouseenter' //hover || click
    },
    checkTextOverflow: { //是否校验文字溢出，true：不溢出则会disabled
        type: Boolean,
        default: false
    },
    isNeedAddTextOverflowClass: { //是否要在判断溢出后，添加溢出样式。
        type: Boolean,
        default: false
    },
    offset: { //提示框出现的边距
        type: Number,
        default: 0
    }
  },

  data(){
    return {
        currentDisabled: this.disabled
    }
  },

  beforeCreate() {
    this.popperVM = new Vue({
        data: { node: '' },
        render(h) {
            return this.node;
        }
    }).$mount();

    this.debounceClose = debounce(0, () => this.handleClosePopperOnLeave());
  },

  render(h) {
    var _self = this;
    this.popperVM.node = h(
        'transition',
        {
          attrs: {
            name: this.transition
          },
          on: {
            'afterLeave': this.doDestroy
          }
        },
        [h(
          'div',
            {
                on: {
                  'click': this.togglePreventClose,
                  'mouseenter': this.togglePreventClose,
                  'mouseleave': () => {
                    // _self.debounceClose();
                    _self.handleClosePopperOnLeave();
                    _self.togglePreventClose();
                  }
                },

                ref: 'popper',
                directives: [{
                  name: 'show',
                  value: !this.currentDisabled && this.showPopper
                  // value: !this.disabled && this.showPopper && this.content
                }],

                'class': ['pt-tooltip__popper', 'is-' + this.effect, this.popperClass]
            },
          [this.$slots.content || this.content]
        )]
    );

    if (!this.$slots.default) return this.$slots.default;

    const vnode = this.$slots.default[0];
    const data = vnode.data = vnode.data || {};
    const on = vnode.data.on = vnode.data.on || {};

    if(!_self.disabled){
        on.click = this.addEventHandle(on.click, this.handleShowPopper);
        on.mouseenter = this.addEventHandle(on.mouseenter, this.handleShowPopper);
        on.mouseleave = this.addEventHandle(on.mouseleave, this.handleClosePopperOnLeave);
        data.staticClass = this.concatClass(data.staticClass, 'pt-tooltip');
    }

    return vnode;
  },

  mounted() {
    this.referenceElm = this.$el;
    this.checkText();
  },

  methods: {
    addEventHandle(old, fn) {
        return old ? Array.isArray(old) ? old.concat(fn) : [old, fn] : fn;
    },

    concatClass(a, b) {
        if (a && a.indexOf(b) > -1) return a;
        return a ? b ? (a + ' ' + b) : a : (b || '');
    },

    //监测是否文字溢出
    checkText() {
        if(this.checkTextOverflow) {
            let contentDom = this.$el.querySelector('[tooltip-target]'),
                // contentWrapWidth = contentDom ? jQuery(contentDom).width() : jQuery(this.$el).width(),
                contentWrapWidth = contentDom ? contentDom.offsetWidth : this.$el.offsetWidth,
                contentWidth = contentDom ? contentDom.scrollWidth : this.$el.scrollWidth;

            this.currentDisabled = contentWrapWidth >= contentWidth;

            //如果溢出，则添加溢出文字样式
            if(this.isNeedAddTextOverflowClass){
                let dom = contentDom || this.$el;
                !this.currentDisabled && dom.classList.add('text-ellipsis');
            }
        }
    },

    handleShowPopper(e) {
        if (this.currentDisabled || this.manual || this.openOn != e.type) return;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.showPopper = true;
        }, this.openDelay);

        if(this.openOn == 'click') this.handleClosePopperOnClick();
    },

    handleClosePopperOnLeave(e) {
        if (this.preventClose || this.manual || this.openOn == 'click') return;
        clearTimeout(this.timeout);
        this.showPopper = false;
    },

    togglePreventClose() {
        this.preventClose = !this.preventClose;
    },

    handleClosePopperOnClick(){
        this.closeTimeout = setTimeout(() => {
            clearTimeout(this.closeTimeout);
            this.showPopper = false;
        }, this.autoCloseDelay);
    }
  },
  watch: {
    disabled(newVal) {
        this.currentDisabled = newVal;
    }
  }
};
</script>

<style lang="scss">
@import "../../styles/imports";
$tooltip-content-margin: rem-calc(2px) !default;

.pt-tooltip {}
.pt-tooltip__popper {
    position: absolute;
    left: 0;
    border-radius: 4px;
    padding: rem-calc(5px 10px);
    z-index: $z-index-tooltip;
    font-size: $f-sm;
    line-height: 1.5;
    max-width: 300px;
    word-wrap: break-word;

    .popper__arrow {
        position: absolute;
        display: block;
        width: 0;
        height: 0;
        border-color: transparent;
        border-style: solid;
        border-width: 6px;

        &::after {
            @extend .popper__arrow;
            content: " ";
            border-width: 5px;
        }
    }

    &[x-placement^="top"] {
        margin-bottom: $tooltip-content-margin;

        .popper__arrow {
            bottom: -$tooltip-content-margin;
            border-top-color: rgb(31, 45, 61);
            border-bottom-width: 0;

            &::after {
                bottom: 1px;
                margin-left: -5px;
                border-top-color: rgb(31, 45, 61);
                border-bottom-width: 0;
            }
        }
    }
    &[x-placement^="bottom"] {
        margin-top: $tooltip-content-margin;

        .popper__arrow {
            top: -$tooltip-content-margin;
            border-top-width: 0;
            border-bottom-color: rgb(31, 45, 61);

            &::after {
                top: 1px;
                margin-left: -5px;
                border-top-width: 0;
                border-bottom-color: rgb(31, 45, 61);
            }
        }
    }
    &[x-placement^="right"] {
        margin-left: $tooltip-content-margin;

        .popper__arrow {
            left: -$tooltip-content-margin;
            border-right-color: rgb(31, 45, 61);
            border-left-width: 0;

            &::after {
                bottom: -5px;
                left: 1px;
                border-right-color: rgb(31, 45, 61);
                border-left-width: 0;
            }
        }
    }
    &[x-placement^="left"] {
        margin-right: $tooltip-content-margin;

        .popper__arrow {
            right: -$tooltip-content-margin;
            border-right-width: 0;
            border-left-color: rgb(31, 45, 61);

            &::after {
                right: 1px;
                bottom: -5px;
                margin-left: -5px;
                border-right-width: 0;
                border-left-color: rgb(31, 45, 61);
            }
        }
    }

    &.is-light {
        background: $dd-white;
        border: 1px solid rgb(31, 45, 61);

        &[x-placement^="top"] .popper__arrow {
            border-top-color: rgb(31, 45, 61);

            &::after {
                border-top-color: #fff;
            }
        }
        &[x-placement^="bottom"] .popper__arrow {
            border-bottom-color: rgb(31, 45, 61);

            &::after {
                border-bottom-color: #fff;
            }
        }
        &[x-placement^="left"] .popper__arrow {
            border-left-color: rgb(31, 45, 61);

            &::after {
                border-left-color: #fff;
            }
        }
        &[x-placement^="right"] .popper__arrow {
            border-right-color: rgb(31, 45, 61);

            &::after {
                border-right-color: #fff;
            }
        }
    }
    &.is-warning {
        color: $dd-white;
        background: $dd-bittersweet;

        &[x-placement^="top"] {
            margin-bottom: $tooltip-content-margin;

            .popper__arrow {
                border-top-color: rgb(31, 45, 61);

                &::after {
                    border-top-color: #fff;
                }
            }
        }
        &[x-placement^="bottom"] {
            margin-bottom: $tooltip-content-margin;

            .popper__arrow {
                border-bottom-color: rgb(31, 45, 61);

                &::after {
                    border-bottom-color: #fff;
                }
            }
        }
        &[x-placement^="left"] {
            margin-bottom: $tooltip-content-margin;

            .popper__arrow {
                border-left-color: rgb(31, 45, 61);

                &::after {
                    border-left-color: #fff;
                }
            }
        }
        &[x-placement^="right"] {
            margin-bottom: $tooltip-content-margin;

            .popper__arrow {
                border-right-color: rgb(31, 45, 61);

                &::after {
                    border-right-color: #fff;
                }
            }
        }
    }
    &.is-dark {
        background: $dd-black;
        color: $dd-white;
    }
    &.is-blue {
        background: $dd-malibu;
        color: $dd-white;
    }
}
</style>
