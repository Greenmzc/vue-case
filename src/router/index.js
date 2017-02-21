import Vue from 'vue'
import Router from 'vue-router'
import Hello from 'components/Hello'
import home from '../views/home.vue'
import tree from 'components/tree.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: home
    }, {
      path: '/hello',
      name: 'Hello',
      component: Hello
    }, {
      path: '/tree',
      name: 'tree',
      component: tree
    }
  ]
})
