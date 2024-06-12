import Vue from 'vue';
import Router from 'vue-router';
import index from '@/views/index';
import componentView from "@/views/componentView"

Vue.use(Router);

// 导出路由
export default new Router({
  routes: [{
    path: '/',
    name: '',
    component: index,
    hidden: true,
    meta: {
      requireAuth: false
    },
    children: [{
      path: '/components/:id/:index',
      component: componentView,
    }]
  }]
})
