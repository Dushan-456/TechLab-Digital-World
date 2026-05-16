import mongoose from "mongoose";
import dotenv from "dotenv";
import { Invitation } from "../src/models/Invitation.mjs";

dotenv.config();

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const invitations = await Invitation.find({});
        console.log("Invitations in DB:", JSON.stringify(invitations, null, 2));
        await mongoose.disconnect();
    } catch (error) {
        console.error(error);
    }
};

checkDB();
