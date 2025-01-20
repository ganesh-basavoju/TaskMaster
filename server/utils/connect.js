import mongoose from "mongoose";

const connection = { isConnected: null };

export const connectToDB = async () => {
  try {
    // Check if already connected
    if (connection.isConnected === 1) {
      console.log("Already connected to MongoDB.");
      return;
    }

    // Connect to the database
    const db = await mongoose.connect(process.env.MONGO_URI);

    // Update connection state
    connection.isConnected = db.connection.readyState; // 1 means connected

    console.log("MongoDB successfully connected.");
  } catch (error) {
    console.error("Couldn't connect with the database: ", error.message);
    throw error; // Rethrow the error to handle it in the calling function
  }
};
