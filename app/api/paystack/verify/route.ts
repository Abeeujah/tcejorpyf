import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { paystackSignature } from "../utils/paystack.signature";
import defaults from "@/config/default";
const checkPaystackSignature = false;

const secret = defaults["paystackSecretKey"]!;
const config = {
  headers: { Authorization: `Bearer ${secret}` },
};

// GET: Verify Transaction - Confirm the status of a transaction
// If you plan to store or make use of the the transaction ID, you should represent it as a unsigned 64-bit integer. To learn more,
export async function GET(
  req: NextRequest,
  { params }: { params: { reference: string } }
) {
  const isPaystackSignature = paystackSignature(req);
  console.log("isPaystackSignature ", isPaystackSignature);

  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference");
  console.log(searchParams.get("reference"));

  try {
    const paystack_url = `${defaults["paystackBaseURL"]}verify/${reference}`;
    const response = await axios.get(paystack_url, config);

    // add response data to the database

    return NextResponse.json(
      { success: true, data: response.data.data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Promised rejected ", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
