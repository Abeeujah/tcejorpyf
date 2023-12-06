import dotenv from "dotenv";

dotenv.config();

const config = {
  paystackPublicKey: process.env.PAYSTACK_PUBLIC_KEY,
  paystackSecretKey: process.env.PAYSTACK_SECRET_KEY,
  paystackBaseURL: process.env.PAYSTACK_BASE_URL,
};

export default config;
