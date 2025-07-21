const mongoose = require('mongoose');

const getDBUri = () => {
    switch (process.env.NODE_ENV) {
        case 'development':
            return process.env.DB_URI_DEVELOPMENT;
        case 'test':
            return process.env.DB_URI_TEST;
        case 'production':
            return process.env.DB_URI_PRODUCTION;
        default:
            throw new Error('Invalid NODE_ENV');
    }
};

const connectDB = async () => {
    const dbURI = getDBUri();

    try {
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
        });

        console.log(`✅ Connected to MongoDB: ${dbURI.replace(/:\/\/.*@/, '://*****:*****@')}`);

        if (process.env.NODE_ENV !== 'production') {
            mongoose.set('debug', true);
        }
    } catch (error) {
        console.error(`❌ MongoDB connection failed: ${error.message}`);
        process.exit(1);
    }
};

mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ MongoDB disconnected. Reconnecting...');
    connectDB();
});

module.exports = connectDB;