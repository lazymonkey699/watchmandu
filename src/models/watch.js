// models/watch.js
const mongoose = require('mongoose');

const watchSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Watch = mongoose.model('Watch', watchSchema);

module.exports = Watch;
