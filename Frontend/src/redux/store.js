import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // uses localStorage
import authReducer from "./slices/authSlice";
import modalReducer from "./slices/modalSlice";
import registerReducer from "./slices/registerSlice";

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  modal: modalReducer,
  register: registerReducer,
});

// Persist config
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // Only persist the auth slice
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // 👈 required for redux-persist
    }),
});

// Create persistor
export const persistor = persistStore(store);
export default store;
