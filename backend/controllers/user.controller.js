import User from '../models/user.model.js';
import mongoose from "mongoose";

export const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.log("error in fetching user", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const createUsers = async (req, res) => {
    const user = req.body; // user send data

    if (!user.name || !user.designation || !user.email || !user.image) {
        return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    const newUser = new User(user);

    try {
        await newUser.save();
        res.status(201).json({ success: true, data: newUser });
    } catch (error) {
        console.error("Error in Create user:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const updateUsers = async (req, res) => {
    const { id } = req.params;

    const user = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid User Id" });
    }

    try {
        const updatedUsers = await Product.findByIdAndUpdate(id, user, { new: true });
        res.status(200).json({ success: true, data: updatedUsers });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const deleteUsers = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid User Id" });
    }

    try {
        await User.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "User deleted" });
    } catch (error) {
        console.error("Error in Deleting User", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};