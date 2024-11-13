import express from "express";
import { createUsers, deleteUsers, getUsers, updateUsers, archiveUser, unarchiveUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", getUsers);

router.post("/", createUsers);

router.put("/:id", updateUsers);

router.delete("/:id", deleteUsers);

router.patch("/archive/:id", archiveUser);

router.patch("/unarchive/:id", unarchiveUser);


export default router;