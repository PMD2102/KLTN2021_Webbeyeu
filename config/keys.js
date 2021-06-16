module.exports = {
  ROLE: {
    USER: 0,
    ADMIN: 1,
  },
  GENDER: {
    OTHER: 0,
    MALE: 1,
    FEMALE: 2,
  },
  POST_STATUS: {
    PENDING: 0,
    APPROVE: 1,
    REJECT: 2,
  },
  PROVIDER: {
    LOCAL: 0,
    FACEBOOK: 1,
  },
  EMAIL_TYPE: {
    VERIFY_USER: "VERIFY_USER",
    RESET_PASS: "RESET_PASS",
  },
  ROOM_TYPE: {
    PRIVATE: 0,
    GROUP: 1,
  },
  REPORT_TYPE: {
    USER: 0,
    POST: 1,
    COMMENT: 2,
  },
  USER_TAG: {
    doctor: {
      name: "setIsShowModal",
      value: "doctor",
    },
  },
  NOTIFY_TYPE: {
    post: 0,
    comment: 1,
  },
  MONGO_URI:
    process.env.MONGO_URI || "mongodb://localhost:27017/mern_boilerplate",
  FRONTEND_URI: process.env.FRONTEND_URI || "http://localhost:3000",
  SECRET_KEY_JWT: "some thing secret",
  VERIFY_USER_PREFIX: "VERIFY_USER_PREFIX",
  FORGOT_PASSWORD_PREFIX: "FORGOT_PASSWORD_PREFIX",
  SOCKET_PREFIX: "SOCKET_PREFIX",
  REDIS_HOST: process.env.REDIS_HOST,
  REDIS_PORT: process.env.REDIS_PORT,
  REDIS_PASS: process.env.REDIS_PASS,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
};
