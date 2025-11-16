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

// import * as uFunctions from '@/uni_modules/uview-ui/libs/function/index.js';
// Vue.prototype.$u = uFunctions.default;

const app = new Vue({
    ...App,
});
app.$mount();
