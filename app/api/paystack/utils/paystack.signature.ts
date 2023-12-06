import { createHmac } from "crypto";

const secret = "";

export const paystackSignature = (request: Request) => {
  const hash = createHmac("sha512", secret)
    .update(JSON.stringify(request.body))
    .digest("hex");
};
