import express from "express";
import { createUsers, deleteUsers, getUsers, updateUsers } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", getUsers);

router.post("/", createUsers);

router.put("/:id", updateUsers);

router.delete(":id", deleteUsers);

export default router;