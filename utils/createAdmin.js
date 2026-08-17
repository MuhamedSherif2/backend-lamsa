const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const existingAdmin = await User.findOne({
            email: "mohammedsherif675@gmail.com"
        });

        if (existingAdmin) {
            console.log("Admin already exists");
            process.exit();
        }

        await User.create({
            name: "Mohammed Sherif",
            email: "mohammedsherif675@gmail.com",
            phoneNumber: "01152247559",
            password: "mohammed26122003",
            role: "admin",
            isVerified: true
        });

        console.log("Admin created successfully");

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

createAdmin();