import Vue from 'vue'
import Router from 'vue-router'
// import Papers from '@/components/Papers'
import HelloWorld from '@/components/HelloWorld'
import Papers from '@/components/Papers'

Vue.use(Router)

export default new Router({
    routes: [
    {
        path: '/papers',
        name: 'Papers',
        component: Papers
    },
    {
        path: '/',
        name: 'HelloWorld',
        component: HelloWorld
    },]
})