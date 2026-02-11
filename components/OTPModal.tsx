"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { verifySecret, sendEmailOTP } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

const OtpModal = ({
  accountId,
  email,
}: {
  accountId: string;
  email: string;
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);

    console.log({ accountId, password });

    try {
      const sessionId = await verifySecret({ accountId, password });

      console.log({ sessionId });

      if (sessionId) router.push("/");
    } catch (error) {
      console.log("Failed to verify OTP", error);
    }

    setIsLoading(false);
  };

  const handleResendOtp = async () => {
    await sendEmailOTP({ email });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="bg-white/95 backdrop-blur-3xl border border-gray-100 shadow-2xl rounded-[2rem] p-10 max-w-[420px] outline-none gap-8">
        
        {/* Close Button - positioned absolute to content */}
        <div className="absolute top-5 right-5 cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-colors group z-50" onClick={() => setIsOpen(false)}>
            <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
        </div>

        <AlertDialogHeader className="space-y-4">
          <AlertDialogTitle className="text-3xl font-bold text-center text-gray-900 tracking-tight">
            Verification Code
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-gray-500 text-base leading-relaxed max-w-[85%] mx-auto">
            We've sent a 6-digit code to <br/>
            <span className="font-semibold text-gray-800">{email}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex justify-center w-full my-2">
            <InputOTP maxLength={6} value={password} onChange={setPassword}>
              <InputOTPGroup className="gap-3 sm:gap-4">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                    <InputOTPSlot
                        key={index}
                        index={index}
                        className="w-10 h-12 sm:w-12 sm:h-14 border-2 border-gray-100 rounded-xl text-xl font-bold text-gray-800 shadow-sm focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all outline-none bg-white/50"
                    />
                ))}
              </InputOTPGroup>
            </InputOTP>
        </div>

        <AlertDialogFooter className="sm:justify-center">
          <div className="flex w-full flex-col gap-5">
            <AlertDialogAction
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-brand to-rose-500 hover:from-brand-100 hover:to-rose-600 text-white font-semibold h-[50px] rounded-xl shadow-lg shadow-brand/20 transition-all text-lg border-none"
              type="button"
            >
              Verify Code
              {isLoading && (
                <Image
                  src="/assets/icons/loader.svg"
                  alt="loader"
                  width={24}
                  height={24}
                  className="ml-2 animate-spin"
                />
              )}
            </AlertDialogAction>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <span className="font-medium">Didn't receive code?</span>
              <Button
                type="button"
                variant="ghost"
                className="p-0 h-auto font-bold text-brand hover:text-brand-100 hover:bg-transparent transition-colors"
                onClick={handleResendOtp}
              >
                Resend
              </Button>
            </div>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OtpModal;