import { createAsyncThunk, createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  showErrorMessage,
  showSuccessMessage,
  APP_SECRET_KEY,
  retrieveFromLocalStorage,
} from "../constants";
import CryptoJS from "crypto-js";
// import { apiEndPoints } from "../remote/apiEndpoints";
import {apiEndPoints} from "../remote/apiEndPoints"

const initialState = {
  users: null,
  loading: false,
  error: null,
  ...retrieveFromLocalStorage(["token"]),
};

const saveToLocalStorage = (key, data) => {
  const encryptedData = CryptoJS.AES.encrypt(data, APP_SECRET_KEY).toString();
  localStorage.setItem(key, encryptedData);
};

export const userCheckout = createAsyncThunk(
  "user/checkout",
  async (values) => {
    try {
      const checkoutEndPoint = await apiEndPoints.checkout(values);
      const response = await checkoutEndPoint.data;
      //   saveToLocalStorage("userSession", JSON.stringify(response.data.customerData));
      saveToLocalStorage("token", response.data.jwt);
      return response;
    } catch (error) {
      return error.response.data;
    }
  }
);

export const validateCode = createAsyncThunk(
  "user/couponCode",
  async (values) => {
    try {
      const couponCodeEndPoint = await apiEndPoints.couponCode(values);
      const response = await couponCodeEndPoint.data;
      return response;
    } catch (error) {
      return error.response.data;
    }
  }
);

export const cardPayment = createAsyncThunk(
  "user/paymentCard",
  async (values) => {
    try {
      const cardPaymentEndPoint = await apiEndPoints.paymentCard(values);
      const response = await cardPaymentEndPoint.data;
      return response;
    } catch (error) {
      return error.response.data;
    }
  }
);

export const confirmPayment = createAsyncThunk(
  "user/confirmPaymentCard",
  async (values) => {
    try {
      const confirmCardPaymentEndPoint = await apiEndPoints.confirmCardPayment(values);
      const response = await confirmCardPaymentEndPoint.data;
      return response;
    } catch (error) {
      return error.response.data;
    }
  }
);

const slice = createSlice({
  name: "user",
  initialState: initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addMatcher(
        isAnyOf(userCheckout.fulfilled, validateCode.fulfilled, cardPayment.fulfilled, confirmPayment.fulfilled),
        (state, action) => {
          state.loading = false;
          if (action.payload.statusCode === 200) {
            state.users = action.payload;
            showSuccessMessage(action.payload.description);
          } else {
            state.error = action.payload.description;
            showErrorMessage(action.payload.description);
          }
        }
      )

      .addMatcher(
        isAnyOf(userCheckout.pending, validateCode.pending, cardPayment.pending, confirmPayment.pending),
        (state) => {
          state.loading = true;
          state.error = null;
          state.users = null;
        }
      )

      .addMatcher(
        isAnyOf(userCheckout.rejected, validateCode.rejected, cardPayment.rejected, confirmPayment.rejected),
        (state, action) => {
          state.loading = false;
          state.users = null;
          state.error = showErrorMessage(action?.error?.error);
        }
      );
  },
});

export const userReducer = slice.reducer;
