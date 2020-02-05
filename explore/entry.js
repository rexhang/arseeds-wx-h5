/*导入jQuery*/
import $ from 'jquery';
window.jq = $;
window.$ = $;
window.jQuery = $;
$.noConflict(); // 注销jQuery的$别名防止和其他带$的库产生冲突jQuery语法一律使用jQuery代替$

require('./lib/sys/sys.js'); // 引入我的工具库

import './css/core.css'; // 引入核心css模块
import './scss/core.scss'; // 引入核心scss模块

require('./lib/layer-v3.0.3/layer/layer.js'); // 引入弹窗插件

/*各项控制器的引入*/
require('./template/about/about.Controller.js');
require('./template/shop/shop.Controller.js');
require('./template/editor/editor.Controller.js');
require('./template/fileupload/fileupload.Controller.js');
require('./template/fileupload2/fileupload2.Controller.js');
require('./template/login/login.Controller.js');
require('./template/setting/setting.Controller.js');
require('./template/tuwenyin/tuwenyin.Controller.js');
require('./template/list/list.Controller.js');
require('./template/edit/edit.Controller.js');
require('./template/share/share.Controller.js');
require('./template/jdActivity/jdActivity.Controller.js');
require('./template/lucky/lucky.Controller.js');
require('./template/timelineMap/timelineMap.Controller.js');
require('./template/createTimeLine/createTimeLine.Controller.js');
require('./template/mapPunchCard/mapPunchCard.Controller.js');
require('./template/activityInfo/activityInfo.Controller.js');
require('./template/jdActivity_huadong/jdActivity_huadong.Controller.js');
require('./template/activityInfo_huadong/activityInfo_huadong.Controller.js');
require('./template/lucky_huadong/lucky_huadong.Controller.js');
require('./template/mapPunchCard_huadong/mapPunchCard_huadong.Controller.js');
require('./template/jiangpin_huadong/jiangpin_huadong.Controller.js');
require('./template/hexiao/hexiao.Controller.js');

