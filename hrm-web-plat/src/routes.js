import Login from './views/Login.vue'
import Register from './views/Register.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Table from './views/nav1/Table.vue'
import echarts from './views/charts/echarts.vue'
import CourseType from './views/course/CourseType.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/register',
        component: Register,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-address-card',
        leaf: true,//只有一个节点
        children: [
            { path: '/main', component: echarts, name: '首页' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '课程管理',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/courseType', component: CourseType, name: '课程类型' },
            { path: '/course', component: Table, name: '课程信息' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '职位管理',
        iconCls: 'fa fa-superpowers',//图标样式class
        children: [
            { path: '/jobType', component: Main, name: '职位类型' },
            { path: '/job', component: Table, name: '职位信息' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '系统管理',
        iconCls: 'el-icon-message',//图标样式class
        children: [
            { path: '/tenantType', component: Main, name: '租户类型' },
            { path: '/tenant', component: Table, name: '租户信息' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;