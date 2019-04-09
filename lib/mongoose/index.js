'use strict';

const role = require('./model/role');
const permission = require('./model/permission');
const debug = require('debug')('egg-rbac');

module.exports = exports = class mongooseStorage {

  constructor(_mongoose) {
    this._mongoose = _mongoose;
    this.Role = role(_mongoose);
    this.Permission = permission(_mongoose);
  }

  newRole({ name, alias, grants }) {
    return this.Role.findOne({ name })
      .then(oldRole => {
        if (oldRole === null) {
          const newRole = new this.Role();
          newRole.name = name;
          newRole.alias = alias;
          newRole.grants = grants;
          return newRole.save();
        }
        return null;
      });
  }

  newPermission({ name, alias, sort, methods }) {
    return this.Permission.findOne({alias}).then(repeat => {
      if (repeat) {
        throw new Error('[egg-rbac] newPermission: alias repeat')
        return null
      }
      return this.Permission.findOne({name, methods}).then(repeat => {
        if (repeat) {
          throw new Error('[egg-rbac] newPermission: methods repeat')
          return null
        }
        return new this.Permission({ name, alias, sort, methods }).save()
      })
    })
  }

  modifyRoleAlias(_id, alias) {
    return this.Role.updateOne({ _id }, { $set: { alias } });
  }

  modifyRoleGrants(_id, grants) {
    return this.Role.updateOne({ _id }, { $set: { grants } });
  }

  modifyPermissionAlias(_id, alias, sort, methods) {
    return this.Permission.updateOne({ _id }, { $set: { alias, sort, methods } });
  }

  removeRole(_id) {
    return this.Role.remove({ _id });
  }

  removePermission(_id) {
    return Promise.all([
      this.Permission.remove({ _id }),
      this.Role.update({}, { $pull: { grants: _id } }),
    ]);
  }

  addPermission(_id, permissionIds) {
    return this.Role.updateOne({ _id }, { $addToSet: { grants: { $each: permissionIds } } });
  }

  removePermissions(_id, permissionIds) {
    return this.Role.updateOne({ _id }, { $pull: { grants: { $in: permissionIds } } });
  }

  insertManyPermission(permissions) {
    return this.Permission.insertMany(permissions)
      .then(result => {
        return result.insertedIds;
      });
  }

  getRole(name) {
    return this.Role.findOne({ name }).populate('grants');
  }

  getAllRoles() {
    return this.Role.find({});
  }

  getPermissions(names) {
    debug('getPermissions names = %O', names);
    return this.Permission.find({ name: { $in: names } });
  }

  getAllPermissions() {
    return this.Permission.find({});
  }

};
