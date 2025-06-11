import Vue from 'vue';
import App from './App';

import * as Common from './config/common.js';
import * as Db from './config/db.js';

Vue.config.productionTip = false;

Vue.prototype.$common = Common;
Vue.prototype.$db = Db;

App.mpType = 'app';

// 引入全局uView
import uView from '@/uni_modules/uview-ui';
Vue.use(uView);

// import { $u } from '@/utils/uview-tools';
// Vue.prototype.$u = $u;

const app = new Vue({
    ...App
});
app.$mount();
