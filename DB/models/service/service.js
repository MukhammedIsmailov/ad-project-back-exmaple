const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const serviceFields = require('./serviceFields');

const Service = new Schema(serviceFields);
const service = mongoose.model('Service', Service);

module.exports = service;

