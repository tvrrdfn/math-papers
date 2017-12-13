<template>
	<svg :class="iconSet">
		<use :xlink:href="'#'+lowerCase(useId)"></use>
	</svg>
</template>

<script type="text/javascript">
	export default {
		name: 'ptSvg',

		props: {
	        iconSet: String,
			useId: {
				type: [Number, String],
				required: true
			}
		},
		methods: {
	        lowerCase(id) {
	            return id.toLowerCase();
	        }
	    }
	}
		
</script>
