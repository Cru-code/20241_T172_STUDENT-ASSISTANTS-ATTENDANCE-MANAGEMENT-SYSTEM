import User from '../models/user.model.js';
import mongoose from "mongoose";


export const getUsers = async (req, res) => {
    console.log("GET /api/user hit"); // Debugging log
    try {
        const users = await User.find({ role: { $ne: 'admin' } });
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error("Error fetching users:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};


export const createUsers = async (req, res) => {
    const { name, email, designation } = req.body;

    // Check if all required fields are provided
    if (!name || !email || !designation) {
        return res.status(400).json({
            success: false,
            message: "Please provide all fields",
        });
    }

    try {
        // Check if the email already exists in the database
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already exists",
            });
        }

        // Create a new user
        const newUser = new User({ name, email, designation });

        // Save the new user to the database
        await newUser.save();

        // Return the created user in the response
        return res.status(201).json({
            success: true,
            data: newUser,
        });
    } catch (error) {
        console.error("Error in Create User:", error.message);

        // Return server error if an exception occurs
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
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