import mongoose from "mongoose";

export class Mongo {

    constructor(url?: string) {
        if (!url) {
            throw new Error("MongoDB URI is missing");
        }

        this.connect(url)
    }

    private connect = async (url: string) => {
        try {
            await mongoose.connect(url);
            console.log('[MongoDB] Connection established');
        } catch (error) {
            console.error('[MongoDB] Connection failed:', error);
            throw error;
        }
    }
}
