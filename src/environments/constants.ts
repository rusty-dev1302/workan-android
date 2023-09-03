export const constants = {
  API_SERVER: "http://localhost:8081",
  SUCCESS_STATE: "SUCCESS",
  ERROR_STATE: "ERROR",
  DEFAULT_CUSTOMER: {
    id: 0,
    firstName: "",
    gender: "",
    mobile: 0,
    lastName: "",
    email: "",
    languages: [],
    state: "",
    message: "",
    enabled: false,
    professional: false
  },
  DEFAULT_LISTING: {
    id: 0,
    charges: 0,
    chargesType: "",
    professionalEmail: "",
    professionalId: 0,
    subCategoryName: "",
    subCategory: {
      subCategoryName: ""
    },
    location: "",
  },
  DEFAULT_CONTACT_DETAIL: {
    customerId: 0,
    email: "",
    mobile: 0,
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
    city: "",
    pincode: 0,
    state: "",
    message: ""
  }
};