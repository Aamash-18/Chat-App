import express from "express";
import { createGroup,getUserGroups,addMember,removeMember,renameGroup,getGroupDetails} from "../controllers/groupController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

// create group
router.post("/create", isAuthenticated, createGroup);
router.get("/my-groups", isAuthenticated, getUserGroups);
router.post("/add-member", isAuthenticated, addMember);
router.put("/remove-member", isAuthenticated, removeMember);
router.put("/rename", isAuthenticated, renameGroup);
router.get("/:groupId", isAuthenticated, getGroupDetails);
export default router;

