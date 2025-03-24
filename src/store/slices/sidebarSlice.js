import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showSidebar: true,
  themeStyle: "balanced",
  responseData: [],
  sidebarLoading: false,
  callHistory: false,
  closeButton: false,
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setSidebarLoading: (state, action) => {
      state.sidebarLoading = action.payload;
    },

    setCallHistory: (state, action) => {
      state.callHistory = action.payload;
    }, 

    setShowSidebar: (state, action) => {
      state.showSidebar = action.payload;
    },
    setTheme: (state, action) => {
      state.themeStyle = action.payload;
    },
    storeResponseData: (state, action) => {
      state.responseData = action.payload;
    },
    setCloseButton: (state, action) => {
      state.closeButton = action.payload
    },
    addDataToPinnedChat: (state, action) => {
      const chatId = action.payload;
      const pinnedArrayIndex = state.responseData.findIndex(
        (item) => item?.duration === "Pinned"
      );

      if (pinnedArrayIndex !== 0) {
        // Create "Pinned" array at the 0 index if it doesn't exist
        const newPinnedChat = {
          duration: "Pinned",
          conversations: [],
        };
        state.responseData.unshift(newPinnedChat);
      }

      const arrayIndex = state.responseData.findIndex((item) =>
        item?.conversations.some((conv) => conv?.conversationId === chatId)
      );

      const conversationIndex = state.responseData[
        arrayIndex
      ].conversations.findIndex((conv) => conv?.conversationId === chatId);

      if (conversationIndex !== -1) {
        const movedConversation = state.responseData[
          arrayIndex
        ].conversations.splice(conversationIndex, 1)[0];
        state.responseData[0].conversations.unshift(movedConversation);
      } else {
        console.error("Conversation not found in the 'Pinned' array.");
      }
    },

    addNewDataToToday: (state, action) => {
      const newData = action?.payload;
      // console.log(newData);
      const todayIndex = state?.responseData?.findIndex(
        (item) => item?.duration === "Today"
      );
      if (Array.isArray(state?.responseData) && state.responseData.length > 0) {
        if (todayIndex !== -1) {
          state?.responseData[todayIndex]?.conversations?.unshift(newData);
        } else {
          state.responseData?.unshift({
            duration: "Today",
            conversations: [newData],
          });
        }
      } else {
        state.responseData = [{ duration: "Today", conversations: [newData] }];
      }
    },

    deleteConversationById: (state, action) => {
      const conversationIdToDelete = action.payload;
      const conversationIndex = state.responseData.findIndex((item) =>
        item.conversations.some(
          (conversation) =>
            conversation.conversationId === conversationIdToDelete
        )
      );
      if (conversationIndex !== -1) {
        state.responseData[conversationIndex].conversations =
          state.responseData[conversationIndex].conversations.filter(
            (conversation) =>
              conversation.conversationId !== conversationIdToDelete
          );
        if (state.responseData[conversationIndex].conversations.length === 0) {
          state.responseData.splice(conversationIndex, 1);
        }
      }
    },
  },
});

export const {
  setSidebarLoading,
  setShowSidebar,
  setTheme,
  storeResponseData,
  addNewDataToToday,
  deleteConversationById,
  addDataToPinnedChat,
  setCallHistory,
  setCloseButton
} = sidebarSlice.actions;

export default sidebarSlice.reducer;
