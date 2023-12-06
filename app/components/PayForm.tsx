"use client";

import Naira from "@/public/nigeria-naira-icon.svg";
import { zodResolver } from "@hookform/resolvers/zod";
import { BellIcon } from "@radix-ui/react-icons";
import { Box, Button, Container, Text, TextField } from "@radix-ui/themes";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import Spinner from "./Spinner";

const paymentSchema = z.object({
  email: z.string().min(3).email(),
  amount: z.coerce.number().min(500, "Cannot dispense for amounts below 500"),
});
type Payment = z.infer<typeof paymentSchema>;

const PayForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyReference, setVerifyReference] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Payment>({
    resolver: zodResolver(paymentSchema),
  });
  const router = useRouter();
  const params = new URLSearchParams();

  const initiateTransactionUrl = "/api/paystack/initialize";
  const verifyTransactionUrl = "/api/paystack/verify";

  const submitHandler: SubmitHandler<Payment> = async (data) => {
    setIsLoading(true);
    const response = axios
      .post(initiateTransactionUrl, { ...data, amount: data.amount * 100 })
      .then(function (response) {
        setVerifyReference(response.data.data.reference);
        console.log(verifyReference);
        const paystack_authorzation_url = response.data.data.authorization_url;
        router.push(paystack_authorzation_url);
      })
      .finally(async () => {
        setIsLoading(false);
      });
    console.log(response);
  };

  const verifyPayment = () => {
    setIsVerifying(true);
    params.append("reference", "b2deda3130eaa3250f13094a");
    const query = verifyTransactionUrl + "?" + params.toString();
    console.log(query);
    const data = axios.get(query).then((response) => response.data);
    console.log({ data });
  };

  return (
    <Container>
      <Box className="my-5">
        <form className="space-y-3" onSubmit={handleSubmit(submitHandler)}>
          <TextField.Root className="">
            <TextField.Slot>
              <BellIcon height={"16"} width={"16"} />
            </TextField.Slot>
            <TextField.Input
              placeholder="Enter an email address to receive your token..."
              {...register("email")}
            />
          </TextField.Root>
          {errors.email?.message && (
            <Text color="red" as="p" size={"1"}>
              {errors.email.message}
            </Text>
          )}
          <TextField.Root>
            <TextField.Slot>
              <Image
                src={Naira}
                alt="Naira symbol"
                height={"16"}
                width={"16"}
              />
            </TextField.Slot>
            <TextField.Input
              placeholder="Enter purchase amount"
              {...register("amount")}
            />
          </TextField.Root>
          {errors.amount?.message && (
            <Text color="red" as="p" size={"1"}>
              {errors.amount.message}
            </Text>
          )}
          <Button className="cursor-pointer" disabled={isLoading}>
            {isLoading && <Spinner />} Buy Grain
          </Button>
        </form>
        <Box my={"3"}>
          <Button onClick={verifyPayment}>Verify payment</Button>
        </Box>
      </Box>
    </Container>
  );
};

export default PayForm;
