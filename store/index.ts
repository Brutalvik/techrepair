import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storageSession from "redux-persist/lib/storage/session";
import bookingReducer from "@/store/slices/bookingSlice";
import chatReducer from "@/store/slices/chatSlice";

// 1. Persist Configuration
const persistConfig = {
  key: "root",
  version: 1,
  storage: storageSession, // sessionStorage
};

const persistedReducer = persistReducer(persistConfig, bookingReducer);

// 3. Configure the Store
export const store = configureStore({
  reducer: {
    booking: persistedReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these specific Redux Persist action types
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
