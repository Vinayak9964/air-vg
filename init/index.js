const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../model/listing.js");
mong_url = "mongodb://127.0.0.1:27017/airvg";
 

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(mong_url);
}

const initDB = async () => {
  await Listing.deleteMany({});
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();