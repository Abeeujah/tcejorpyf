import { randomBytes } from "crypto";

export const generateReference = () => randomBytes(12).toString("hex");
