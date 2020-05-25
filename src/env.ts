if (process.env.NODE_ENV !== "production") {
  require("dotenv")
  .config()
}

export default {
  paystack_secret: process.env.PAYSTACK_SECRET_KEY,
  referral_service: process.env.REFERRAL_SERVICE,
  port: {
    development: process.env.PORT,
    test: process.env.TEST_PORT,
    production: process.env.PORT
  },
  db: {
    development: process.env.MONGO_URI,
    test: process.env.TEST_MONGO_URI,
    production: process.env.MONGO_URI
  },
  cloudConfig: {
    endpoint: process.env.CLOUD_URI,
    profiles: process.env.NODE_ENV,
    app: process.env.CLOUD_NAME
  }
};
