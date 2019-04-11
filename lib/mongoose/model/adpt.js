'use strict';

module.exports = mongoose => {

  const AdptSchema = new mongoose.Schema({
    name: { type: String },
    alias: { type: String },
    values: { type: String },
    create_at: { type: Date, default: Date.now },
    update_at: { type: Date, default: Date.now },
  });


  
  return mongoose.model('Adpt', AdptSchema);
};


