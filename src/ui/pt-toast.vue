<template>
	<div class="pt-toast">
		<span>
			<pt-svg :use-id="icon"></pt-svg>
		</span>
		{{content}}
	</div>
</template>

<script type="text/javascript">
export default {
	name: "ptToast",

	props: {
		isOpen: {
			type: Boolean,
			default: false
		},

		content: {
			type: [String, Number],
			default: "save success"
		},

		interval: {
			type: Number,
			default: 1500
		},

		icon: {
			type: String,
			default: 'icon-save'
		}
	},

	mounted() {
        this.toggle();
	},

    beforeDestroy() {
        this.destroy();
    },

	methods: {
		toggle() {
			this.isOpen ? this.show() : this.hide();
		},

		show() {
			this.$el.classList.add('show');
			this.destroy();
		},

		hide() {
			this.$el.classList.remove('show');
		},

		destroy() {
			setTimeout(() => {
				this.hide();
			}, this.interval)
		}
	},

	watch: {
		isOpen(val){
			this.toggle();
		}
	}
}
</script>

<style lang="scss">
    // @import './styles/imports';

	// .pt-toast {
	// 	border-radius: 4px;
	// 	padding: 10px;
	// 	background-color: $dd-malibu;
	// 	box-shadow: 0 2px 0 0 $dd-co;
	// 	display: flex;
	// 	align-items: center;
	// 	font-size: $f-sm;
	// 	position: fixed;
	// 	top: 0;
	// 	left: 50%;
	// 	transform: translateX(-50%);
	// 	opacity: 0;
	// 	color: $dd-white;
	// 	transition: all .2s ease,opacity .3s ease;
	// 	z-index: 9999;

	// 	&.show {
	// 		top: 56px;
	// 		opacity: 1;
	// 	}

	// 	span {
	// 		@include size(16px);
	// 		display: inline-block;
	// 		background-color: $dd-white;
	// 		border-radius: 50%;
	// 		margin-right: 6px;
	// 		padding: 2px;

	// 		svg {
	// 			@include size(12px);
	// 			fill: $dd-malibu;
	// 		}
	// 	}
	// }

</style>
