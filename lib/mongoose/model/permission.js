'use strict';

module.exports = mongoose => {

  const PermissionSchema = new mongoose.Schema({
    name: { type: String },
    alias: { type: String },
    sort: { type: String },
    methods: {type: String },
    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now },
  });

  return mongoose.model('Permission', PermissionSchema);
};
