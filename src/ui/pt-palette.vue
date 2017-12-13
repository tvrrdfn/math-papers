<template>
	<div class="pt-palette">
		<span class="pt-palette__title">
			<pt-svg class="pt-ui-button__icon " :use-id="icon"></pt-svg>
		</span>
		<button class="pt-palette__btn" :style="{'background-color': color}"></button>
	</div>
</template>

<script type="text/javascript">
	export default {
		name: "pt-palette",

		props: {
			color: {
				type: String,
				required: true
			},
			icon: String
		}
	}
</script>

<style lang="scss">
@import "./styles/imports";

.pt-palette {

}
.pt-palette__title{
	width: 35px;
	height: 20px;
	display: inline-block;
	background-color:$dd-white;
	vertical-align: top;
	@include border-radius(3px);
	svg{
		width: 16px;
		height: 16px;
		vertical-align: middle;
		fill: gray;
		margin-left: 5px;
	}
}
.pt-palette__btn {
	width: 22px;
	height: 22px;
	border: none;
	box-shadow: inset 0 3px 0 0 rgba(0,0,0,0.2),0 0 0 2px rgb(255,255,255);
	border-radius: 50%;
	margin-left: -16px;
	vertical-align: top;
}
</style>