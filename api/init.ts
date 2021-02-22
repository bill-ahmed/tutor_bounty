import mongoose from 'mongoose';
import Logger from './Logger';

// Import all models
import './models';

/** Setup db connections, models, etc.  */
export default async function init() {
    const url = process.env.MONGO_CONNECTION;
    const options = { useNewUrlParser: true, useUnifiedTopology: true };

    Logger.info('Connecting to MongoDB...');
    await mongoose.connect(url, options);
}