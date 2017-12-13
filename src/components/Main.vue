<template lang="pug">
    .main
    	main-aside
    	main-body

</template>

<script>
	import mainAside from '@/components/main-aside/main-aside';
	import mainBody from '@/components/main-body/main-body';

    export default {
        name: "main",

        components: {
        	mainAside,
        	mainBody
        }
    }
</script>

<style lang="sass">
@import "../styles/imports";

.main
    display: flex
    width: 100%
</style>