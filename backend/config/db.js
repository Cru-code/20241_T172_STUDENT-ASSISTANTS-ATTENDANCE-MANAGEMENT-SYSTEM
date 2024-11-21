import mongoose from 'mongoose';

export const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        console.error('MongoDB URI is missing in environment variables.');
        process.exit(1);
    }
    try {
        mongoose.set('strictQuery', false); // To suppress deprecation warnings
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};
