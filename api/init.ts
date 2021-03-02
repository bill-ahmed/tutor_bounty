import mongoose from 'mongoose';
import Logger from './utils/logger';

// Import all models
import './models';

/** Setup db connections, models, etc.  */
export default async function init() {
    const { MONGO_CONNECTION, MONGO_INITDB_ROOT_USERNAME, MONGO_INITDB_ROOT_PASSWORD } = process.env;

    const url = `mongodb://${MONGO_CONNECTION}`;

    Logger.info('Connecting to MongoDB...');
    try {
        await mongoose.connect(url, {
            user: MONGO_INITDB_ROOT_USERNAME,
            pass: MONGO_INITDB_ROOT_PASSWORD,
            authSource: 'admin',
            useNewUrlParser: true, 
            useUnifiedTopology: true
        });   
    } catch (error) {
        Logger.error('Failed to connect to mongodb, check stdout.');
        Logger.error(error.stack);
    }
}