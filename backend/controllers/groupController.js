import { Group } from "../models/groupModel.js";


//Create Group 

export const createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;

    // logged-in user (admin)
    const adminId = req.id;

    // basic validation
    if (!name || !members || members.length === 0) {
      return res.status(400).json({
        message: "Group name and members are required"
      });
    }

    // include admin also in members
    const allMembers = [...new Set([...members, adminId.toString()])];
    const groupPhoto = `https://api.dicebear.com/7.x/identicon/svg?seed=${name}`;
    const group = await Group.create({
      name,
      members: allMembers,
      admin: adminId,
      groupPhoto
    });

    return res.status(201).json(group);
  } catch (error) {
    console.log("Error in createGroup:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
export const getUserGroups = async (req, res) => {
  try {
    const userId = req.id;

    const groups = await Group.find({
      members: userId
    })
    .populate("members", "fullname username profilePhoto")
    .populate("admin", "fullname username");

    return res.status(200).json(groups);
  } catch (error) {
    console.log("Error in getUserGroups:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


//Add Member

export const addMember = async (req, res) => {
  try {
    const { groupId, userId } = req.body;
    const loggedInUserId = req.id;

    if (!groupId || !userId) {
      return res.status(400).json({
        message: "groupId and userId are required"
      });
    }

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        message: "Group not found"
      });
    }

    // 🔥 Only admin can add members
    if (group.admin.toString() !== loggedInUserId) {
      return res.status(403).json({
        message: "Only admin can add members"
      });
    }

    // ❌ Prevent duplicate member
    if (group.members.includes(userId)) {
      return res.status(400).json({
        message: "User already in group"
      });
    }

    // ✅ Add member
    group.members.push(userId);
    await group.save();

    return res.status(200).json({
      message: "Member added successfully",
      group
    });

  } catch (error) {
    console.log("Error in addMember:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

//Remove Member

export const removeMember = async (req, res) => {
  try {
    const { groupId, userId } = req.body;
    const loggedInUserId = req.id;

    if (!groupId || !userId) {
      return res.status(400).json({
        message: "groupId and userId are required"
      });
    }

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        message: "Group not found"
      });
    }

    // 🔥 Only admin can remove
    if (group.admin.toString() !== loggedInUserId) {
      return res.status(403).json({
        message: "Only admin can remove members"
      });
    }

    // ❌ Cannot remove admin
    if (group.admin.toString() === userId) {
      return res.status(400).json({
        message: "Admin cannot be removed"
      });
    }

    // ✅ Remove member
    group.members = group.members.filter(
      (member) => member.toString() !== userId
    );

    await group.save();

    return res.status(200).json({
      message: "Member removed successfully",
      group
    });

  } catch (error) {
    console.log("Error in removeMember:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


//Rename Group 

export const renameGroup = async (req, res) => {
  try {
    const { groupId, name } = req.body;
    const loggedInUserId = req.id;

    if (!groupId || !name) {
      return res.status(400).json({
        message: "groupId and new name are required"
      });
    }

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        message: "Group not found"
      });
    }

    // 🔥 Only admin can rename
    if (group.admin.toString() !== loggedInUserId) {
      return res.status(403).json({
        message: "Only admin can rename group"
      });
    }

    group.name = name;
    await group.save();

    return res.status(200).json({
      message: "Group renamed successfully",
      group
    });

  } catch (error) {
    console.log("Error in renameGroup:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


//Get Group Info

export const getGroupDetails = async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId)
      .populate("members", "fullname username profilePhoto")
      .populate("admin", "fullname username profilePhoto");

    if (!group) {
      return res.status(404).json({
        message: "Group not found"
      });
    }

    return res.status(200).json(group);

  } catch (error) {
    console.log("Error in getGroupDetails:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};