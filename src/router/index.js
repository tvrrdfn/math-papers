import Vue from 'vue'
import Router from 'vue-router'

import Main from '@/components/Main';
import Papers from '@/components/Papers'
import Ui from '@/ui/demo/uiDemo'

Vue.use(Router)

export default new Router({
    routes: [{
        path: '/',
        name: 'Main',
        component: Main
    }, {
        path: '/papers',
        name: 'Papers',
        component: Papers
    }, {
    	path: '/ui',
    	name: 'Ui',
    	component: Ui
    }]
})