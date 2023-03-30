const mongoose = require('mongoose');

const connectDB = async () => {
    /**
   * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
   * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
   */
    const uri = "mongodb+srv://root:%40Bc123456789@cluster0.p9sxy93.mongodb.net/test";

    try {
        // Connect to the MongoDB cluster
        const con = await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("connected");
    } catch (e) {
        console.error(e);
    }
}

module.exports = { connectDB };