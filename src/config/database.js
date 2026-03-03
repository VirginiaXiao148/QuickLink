const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/quicklink';
  await mongoose.connect(uri);
};

module.exports = connectDB;
