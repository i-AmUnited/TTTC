import { showErrorMessage } from "../constants";
import { apiClient, apiClientWithToken } from "./apiClient";

export class apiEndPoints {
  static extractError(error) {
    let extracted = [];
    if (error.isAxiosError) {
      if (error.response) {
        if (error.response.data && error.response.message) {
          extracted.push(error.response.message);
        } else {
          extracted.push("An unexpected Error occurred");
        }
      } else if (error.request) {
        extracted.push("Network Error Occurred");
      } else {
        extracted.push("An Unexpected Error Occurred");
      }
    } else {
      extracted.push(error.message || "An unexpected Error occurred");
    }
    extracted.forEach((errorMsg) => showErrorMessage(errorMsg));
  }

  
  static async checkout(data) {
    try {
      return apiClient.post("/pin-vend/check-out", data);
    } catch (error) {
      apiEndPoints.extractError(error);
      throw error;
    }
  }

  static async couponCode(data) {
    try {
      return apiClient.post("/pin-vend/validate-promo-code", data);
    } catch (error) {
      apiEndPoints.extractError(error);
      throw error;
    }
  }

  static async paymentCard(data) {
    try {
      return apiClientWithToken.post("/pin-vend/payment/card", data);
    } catch (error) {
      apiEndPoints.extractError(error);
      throw error;
    }
  }

  static async confirmCardPayment(data) {
    try {
      return apiClientWithToken.post("/pin-vend/confirm-card-payment", data);
    } catch (error) {
      apiEndPoints.extractError(error);
      throw error;
    }
  }

}