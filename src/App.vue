<template lang="pug">
    #app
        router-view
</template>

<script>
    export default {
        name: 'app',
    }
</script>

<style lang="sass">
@import './styles/index.scss';

#app
    display: flex
    height: 100%
    width: 100%
    position: relative

@media print
    .main-aside, 
    .main-body__header,
    .main-body__body-header,
    .test-paper__box-settings
        display: none !important
    .test-paper
        border: none !important
    body,
    .main-body__body-body
        overflow: inherit !important
</style>
