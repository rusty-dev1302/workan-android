export const constants = {
  API_SERVER: "http://localhost:8081",
  // API_SERVER: "http://workan.ca",
  NOTIFICATION_SERVER: "http://localhost:8082",
  // NOTIFICATION_SERVER: "http://workan.ca",
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
    rating:0.0,
    state: "",
    message: "",
    enabled: false,
    admin: false,
    verified: false,
    certifications: [],
    professional: false,
    contact: {
      customerId: 0,
      email: "",
      mobile: 0,
      addressLine1: "",
      addressLine2: "",
      addressLine3: "",
      geoHash: "",
      state: "",
      message: ""
    },
  },
  DEFAULT_LISTING: {
    id: 0,
    charges: 0,
    chargesType: "Per Visit",
    professionalEmail: "",
    professionalId: 0,
    subCategoryName: "",
    state: "",
    message: "",
    experience: 0,
    subCategory: {
      id:0,
      subCategoryName: "",
      categoryName: ""
    },
    location: "",
    geoHash: "",
    professional: {
      id: 0,
      firstName: "",
      lastName: "",
      languages: [],
      rating:0,
      state: "",
      message: "",
      oneRating: 0,
      twoRating: 0,
      threeRating: 0,
      fourRating: 0,
      fiveRating: 0,
      profilePhoto: {
        id: 0,
        customerId: 0,
        picByte: [],
        state: "",
        message: ""
      },
      enabled: false,
      professional: false
    },
  },
  DEFAULT_CONTACT_DETAIL: {
    customerId: 0,
    email: "",
    mobile: 0,
    addressLine1: "",
    addressLine2: "",
    addressLine3: "",
    geoHash: "",
    state: "",
    message: ""
  },
  TIMESLOTS: [
    "7:00AM", "7:30AM",
    "8:00AM", "8:30AM",
    "9:00AM", "9:30AM",
    "10:00AM", "10:30AM",
    "11:00AM", "11:30AM",
    "12:00PM", "12:30PM",
    "1:00PM", "1:30PM",
    "2:00PM", "2:30PM",
    "3:00PM", "3:30PM",
    "4:00PM", "4:30PM",
    "5:00PM", "5:30PM",
    "6:00PM", "6:30PM",
    "7:00PM", "7:30PM",
    "8:00PM", "8:30PM",
    "9:00PM", "9:30PM",
    "10:00PM", "10:30PM",
    "11:00PM"
  ],
  ORDER_ACTION_START: "START",
  ORDER_ACTION_COMPLETE: "COMPLETE",
  ORDER_ACTION_CANCEL: "CANCEL",
  CONFIRMATION_DIALOG_MESSAGE: "Are you sure you want to",
  WORKAN_LOGO_BASE64: "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",
};