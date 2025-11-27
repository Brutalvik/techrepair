import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Message = {
  role: "user" | "bot";
  text: string;
  isCTA?: boolean; // To identify if this message is the special "Book Repair" prompt
};

interface ChatState {
  messages: Message[];
  messageCount: number; // To track the limit of 10
  isLoading: boolean;
  isOpen: boolean; // Persist open state if you want
}

const initialState: ChatState = {
  messages: [
    {
      role: "bot",
      text: "Hi there! 👋 I'm your Infinite Tech assistant. How can I help you with your device today?",
    },
  ],
  messageCount: 0,
  isLoading: false,
  isOpen: false,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    toggleChat: (state) => {
      state.isOpen = !state.isOpen;
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
      if (action.payload.role === "user") {
        state.messageCount += 1;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    resetChat: (state) => {
      // Optional: Logic to reset if they book a repair
      state.messages = initialState.messages;
      state.messageCount = 0;
    },
  },
});

export const { toggleChat, addMessage, setLoading, resetChat } =
  chatSlice.actions;
export default chatSlice.reducer;
