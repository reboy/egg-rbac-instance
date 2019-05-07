'use strict';

const assert = require('assert');
/**
 * @class Role
 */
module.exports = exports = class Role {

  /**
   * @constructs Role
   * @param {string} roleName - role name
   * @param {object} permissionItems - singleton rbac object
   * @param {object} adpts
   */
  constructor(roleName, permissionItems, adptItems, isSelf) {
    /**
     * @property {object} _permisstion
     * @private
     * @example
     * {
     *   'create_user': {
     *     _id: '12387389173248'
     *     name: 'create_user'
     *     alias: '创建用户'
     *   }
     * }
     */
    assert(permissionItems, 'Role constructor parameter permissionItems is undefined');
    //this._permissions = Role._createPermisstion(permissionItems);
    this._permissions = permissionItems;
    assert(roleName && typeof roleName === 'string', 'Role constructor parameter roleName is undefined');
    this._name = roleName;
    this._isself = isSelf;
    assert(adptItems, 'Role constructor parameter adptItems is undefined');
    this._adpts = adptItems;
  }

  /**
   * @static
   * @param {object[]} permissionItems - permission item array
   * @param {string} permissionItems[]._id - ObjectId
   * @param {string} permissionItems[].name - permission name
   * @param {string} permissionItems[].alias - permission alias
   * @return {object} - structure same to this._permission
   */
  static _createPermisstion(permissionItems) {
    const result = {};
    permissionItems.forEach(item => {
      result[item.name] = item;
    });
    return result;
  }

  /**
   * @member {string}
   */
  get roleName() {
    return this._name;
  }

  /**
   * @method Role#can
   * @param {string} permissionName - permisston name
   * @return {boolen} can or not
   */
  cani (req_url, req_method) {
    req_url = req_url.split()
  }
  // request url + method
 // can(permissionName, permissionMethod) {

  can (req_url, req_method) {
      const grants = this._permissions
      const adpt = this._adpts
      req_url = req_url.split('/')
      return grants.some(url => {
        const grants_method = url.methods
        url = url.name.split('/')

        if (url.length === req_url.length 
          && grants_method.toLowerCase() === req_method.toLowerCase()){
          return url.every((item, index) => {
            if (item === req_url[index]) {
              return true // continue
            }
            // 通配符 如{any} 要么是null 要么是["{any}", "{", "any", "}"]
            let wc = /^(\{{1})(\w+)(\}{1})$/.exec(item)
            if (wc) {
              wc = wc[2] // 取花括号里面的
              // console.log(adpt[wc],req_url)
              if (wc === 'any') return true
              if (!adpt[wc]) return false
              return adpt[wc].some(x => x.toLowerCase() === req_url[index].toLowerCase()) // 适配器匹配
            }
          })
        }
      })
    }


  /**
   * check the role grant all permission or not
   * @method Role#canAll
   * @param {string} permissionNames - permisston name
   * @return {boolen} can or not
   */
  canAll(permissionNames) {
    return permissionNames.every(item => !!this._permissions[item]);
  }
};
