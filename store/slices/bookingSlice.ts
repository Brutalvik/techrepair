import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface BookingState {
  customerName: string;
  email: string;
  phone: string;
  deviceType: string;
  location: string;
  issueDescription: string;
  date: string;
  time: string;
  images: string[]; // Base64 strings
  trackingId?: string | null; // To store the ID returned from backend
}

// 2. Define the Initial State
const initialState: BookingState = {
  customerName: "",
  email: "",
  phone: "",
  deviceType: "",
  location: "",
  issueDescription: "",
  date: "", // Will be set dynamically in UI if empty
  time: "",
  images: [],
  trackingId: null,
};

// 3. Create the Slice
const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    // Action to update specific fields (e.g., typing in name)
    updateBookingField: (
      state,
      action: PayloadAction<Partial<BookingState>>
    ) => {
      return { ...state, ...action.payload };
    },
    setTrackingId: (state, action: PayloadAction<string>) => {
      state.trackingId = action.payload;
    },
    resetBooking: () => initialState,
  },
});

export const { updateBookingField, setTrackingId, resetBooking } =
  bookingSlice.actions;
export default bookingSlice.reducer;
