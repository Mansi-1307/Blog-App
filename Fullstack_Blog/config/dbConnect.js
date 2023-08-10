const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    // console.log(process.env.MONGO_URL)
    // await mongoose.connect("mongodb+srv://gmansi887:WthDFxtkVhPcNiii@fullstackblogv3.tbqch6m.mongodb.net/fullstack-Blog?retryWrites=true&w=majority");
    await mongoose.connect(process.env.MONGO_URL);
    console.log("DB Connected Successfully");
  } catch (error) {
    console.log("DB Connection failed", error.message);
  }
};

dbConnect();
