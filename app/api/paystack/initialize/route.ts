import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { generateReference } from "../utils/reference";

import defaults from "@/config/default";

const paystackSecretKey = defaults["paystackSecretKey"];
const paystackBaseURL = defaults["paystackBaseURL"];

const paystackInitializationIurl = `${paystackBaseURL}initialize`;
const verifyUrl = "/api/paystack/transaction/verify";
const config = {
  headers: {
    Authorization: `Bearer ${paystackSecretKey}`,
    "Content-Type": "application/json",
  },
};

export async function POST(request: NextRequest) {
  const body = await request.json();
  const host = request.headers.get("host");
  const callback_url = `${host}${verifyUrl}`;
  console.log({ callback_url });

  const { email, amount } = body;

  try {
    const response = await axios.post(
      paystackInitializationIurl,
      {
        email,
        amount,
        body,
        reference: generateReference(),
        callback_url,
      },
      config
    );

    return NextResponse.json(
      { success: true, data: response.data.data },
      { status: 200 }
    );
  } catch (error: any) {
    console.error({ error });
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
