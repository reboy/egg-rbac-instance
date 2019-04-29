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
  can(permissionName, permissionMethod) {
    // if(!this._permissions[permissionName]||!this._permissions[permissionName].methods||this._permissions[permissionName].methods !== permissionMethod){
    //   return false
    // }
    permissionName = permissionName.split('/');
    for (let i = 0; i < this._permissions.length; i++) {
      let iurl = this._permissions[i].name.split('/');
      if (iurl.length === permissionName.length && this._permissions[i].methods === permissionMethod && iurl[1] === permissionName[1]) {

        const b = iurl.every((item, key) => {
          if (item === permissionName[key]) {
            return true
          }
          const zz = /^(\{{1})(\w+)(\}{1})$/.exec(item);
          if (zz) {
            if (zz[2] && this._adpts[zz[2]] && this._adpts[zz[2]].some(x => x === permissionName[key])) {
              return true
            }
            return false
          }
          return false
        })

        if (!b) {
          return false
        }

        return true
      }
    }
    return false




    //  return true
    //return !!this._permissions[permissionName];
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
