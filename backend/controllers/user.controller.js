import User from '../models/user.model.js';
import mongoose from "mongoose";

export const getUsers = async (req, res) => {
    try {
        // Exclude users with role: 'admin'
        const users = await User.find({ role: { $ne: 'admin' } });
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error("Error in fetching users:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};



export const createUsers = async (req, res) => {
    const user = req.body;

    console.log("Received user data:", user); // Log incoming data

    if (!user.name || !user.email) {
        return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    const newUser = new User(user);

    try {
        await newUser.save();
        res.status(201).json({ success: true, data: newUser });
    } catch (error) {
        console.error("Error in Create user:", error.message); // Log detailed error message
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


export const updateUsers = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid User Id" });
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        console.error("Error updating user:", error.message);
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

export const archiveUser = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid User ID" });
    }

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.archived = !user.archived; // Toggle archived status
        await user.save();

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error("Error archiving user:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const unarchiveUser = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ success: false, message: "Invalid User ID" });
    }

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Explicitly unarchive
        user.archived = false;
        await user.save();

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error("Error unarchiving user:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};