import { createSlice } from "@reduxjs/toolkit";

const groupSlice = createSlice({
  name: "group",
  initialState: {
    groups: null,
    selectedGroup: null,
  },
  reducers: {
    setGroups: (state, action) => {
      state.groups = action.payload;
    },
    setSelectedGroup: (state, action) => {
      state.selectedGroup = action.payload;
    },
    addGroup: (state, action) => {
      state.groups = [...(state.groups || []), action.payload];
    },
    updateGroupName: (state, action) => {
      const { groupId, name } = action.payload;
      state.groups = state.groups.map((group) =>
        group._id === groupId ? { ...group, name } : group
      );

      if (state.selectedGroup?._id === groupId) {
        state.selectedGroup.name = name;
      }
    },
    clearGroups: (state) => {
      state.groups = null;
      state.selectedGroup = null;
    },
    addMemberToGroup: (state, action) => {
      const { groupId, user } = action.payload;

      state.groups = state.groups.map((group) =>
        group._id === groupId
          ? { ...group, members: [...group.members, user] }
          : group
      );

      if (state.selectedGroup?._id === groupId) {
        state.selectedGroup.members.push(user);
      }
    },
    removeMember: (state, action) => {
      const { groupId, userId } = action.payload;

      state.groups = state.groups.map((group) =>
        group._id === groupId
          ? {
              ...group,
              members: group.members.filter((m) => m._id !== userId),
            }
          : group
      );

      if (state.selectedGroup?._id === groupId) {
        state.selectedGroup.members =
          state.selectedGroup.members.filter((m) => m._id !== userId);
      }
    }
  },
});

export const {
  setGroups,
  setSelectedGroup,
  addGroup,
  clearGroups,
  updateGroupName,
  removeMember,
  addMemberToGroup
} = groupSlice.actions;

export default groupSlice.reducer;