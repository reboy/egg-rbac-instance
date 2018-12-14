'use strict';

const assert = require('assert');

module.exports = app => {
  // console.log('app.config.env =', app.config.env);
  const mongoose = app.mongoose;
  assert(mongoose, 'mongoose instance not exists');
  app.rbac = require('./lib/RBAC')(app);
  //挂到rbac 在项目中去完成实例化角色
  app.rbac.role = require('./lib/role');
  // https://eggjs.org/zh-cn/basics/middleware.html#在框架和插件中使用中间件
  // 将 rbac 中间件放到 coreMiddleware 最后(注释掉不使用这种形式，不使用中间件实例化角色)
  // app.config.coreMiddleware.push('rbac');
};
