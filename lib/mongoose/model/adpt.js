'use strict';

module.exports = mongoose => {

  const AdptSchema = new mongoose.Schema({
    name: { type: String },
    alias: { type: String },
    values: { type: String }
  }, { timestamps: true })

  return mongoose.model('Adpt', AdptSchema)
};

 