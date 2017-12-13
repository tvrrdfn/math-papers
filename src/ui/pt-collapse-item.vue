<template>
	<div class="pt-ui-collapse-item" :class="{'is-active': isActive}">
		<div class="pt-ui-collapse-item__header" @click="handleHeaderClick">
			<pt-svg use-id="icon-chevron-small-left"></pt-svg>
			<span>
				<slot name="title">{{title}}</slot>
			</span>
		</div>
		<transition
			@before-enter="beforeEnter"
			@enter="enter"
			@after-enter="afterEnter"
			@before-leave="beforeLeave"
			@leave="leave"
			@after-leave="afterLeave"
			>
			<div class="pt-ui-collapse-item__body-wrap" v-show="isActive">
				<div class="pt-ui-collapse-item__body-content">
					<slot></slot>
				</div>
			</div>
		</transition>
	</div>
</template>
<script>
	import { addClass, removeClass } from './utils/dom';
	function broadcast(componentName, eventName, params){
		this.$children.forEach(child => {
			var name = child.$options.componentName;
			if(name === componentName){
				child.$emit.apply(child, [eventName].concat(params));
			}else{
				broadcast.apply(child, [componentName, eventName].concat([params]));
			}
		});
	}

	export default {
		name: 'ptCollapseItem',
		componentName: 'ptCollapseItem',
		data(){
			return {
				contentWrapStyle: {
					height: 'auto',
					display: 'block'
				},
				contentHeight: 0
			}
		},
		props:{
			title: String,
			name:{
				type:[String, Number],
				default(){
					return this._uid;
				}
			}
		},
		computed:{
			isActive(){
				return this.$parent.activeNames.indexOf(this.name) > -1;
			}
		},
		watch:{
			'isActive'(value){

			}
		},
		methods:{
			dispatch(componentName, eventName, params){
				var parent = this.$parent || this.$root;
				var name = parent.$options.componentName;

				while(parent && (!name || name !== componentName)){
					parent = parent.$parent;

					if(parent){
						name = parent.$options.componentName;
					}
				}

				if(parent){
					parent.$emit.apply(parent,[eventName].concat(params));
				}
			},
			broadcast(componentName, eventName, params){
				broadcast.call(this, componentName, eventName, params);
			},
			handleHeaderClick(){
				this.dispatch('ptCollapse','item-click',this);
			},
			beforeEnter(el){
				console.log(111);
				addClass(el, 'collapse-transition');
			    if (!el.dataset) el.dataset = {};

			    el.dataset.oldPaddingTop = el.style.paddingTop;
			    el.dataset.oldPaddingBottom = el.style.paddingBottom;

			    el.style.height = '0';
			    el.style.paddingTop = 0;
			    el.style.paddingBottom = 0;
			},
			enter(el){
				console.log(222);
				el.dataset.oldOverflow = el.style.overflow;
			    if (el.scrollHeight !== 0) {
			      el.style.height = el.scrollHeight + 'px';
			      el.style.paddingTop = el.dataset.oldPaddingTop;
			      el.style.paddingBottom = el.dataset.oldPaddingBottom;
			    } else {
			      el.style.height = '';
			      el.style.paddingTop = el.dataset.oldPaddingTop;
			      el.style.paddingBottom = el.dataset.oldPaddingBottom;
			    }

			    el.style.overflow = 'hidden';
			},
			afterEnter(el){
				console.log(333);
				removeClass(el, 'collapse-transition');
			    el.style.height = '';
			    el.style.overflow = el.dataset.oldOverflow;
			},
			beforeLeave(el){
				console.log(555);
				if (!el.dataset) el.dataset = {};
			    el.dataset.oldPaddingTop = el.style.paddingTop;
			    el.dataset.oldPaddingBottom = el.style.paddingBottom;
			    el.dataset.oldOverflow = el.style.overflow;

			    el.style.height = el.scrollHeight + 'px';
			    el.style.overflow = 'hidden';
			},
			leave(el){
				console.log(666);
				if (el.scrollHeight !== 0) {
					// for safari: add class after set height, or it will jump to zero height suddenly, weired
					addClass(el, 'collapse-transition');
					el.style.height = 0;
					el.style.paddingTop = 0;
					el.style.paddingBottom = 0;
			    }
			},
			afterLeave(el){
				console.log(777);
				removeClass(el, 'collapse-transition');
			    el.style.height = '';
			    el.style.overflow = el.dataset.oldOverflow;
			    el.style.paddingTop = el.dataset.oldPaddingTop;
			    el.style.paddingBottom = el.dataset.oldPaddingBottom;
			}
		}
	}
</script>
<style lang="scss">
	@import './styles/imports';
    @import './styles/framework/font';
    .collapse-transition {
	    transition: 0.3s height ease-in-out, 0.3s padding-top ease-in-out, 0.3s padding-bottom ease-in-out;
	}
	
    .pt-ui-collapse-item{
		&.is-active{
			& > .pt-ui-collapse-item__header svg{
				transform: rotate(270deg);
			}
		}
    }
	.pt-ui-collapse-item__header{
		height: 24px;
		line-height: 24px;
		cursor: pointer;
		svg{
			width: 16px;
			height: 16px;
			fill: $dd-nobel;
			vertical-align: middle;
			transform: rotate(180deg);
			transition: all .3s;
		}
		span{
			display: inline-block;
			vertical-align: middle;
		}

	}
	</style>