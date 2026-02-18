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
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }

    return () => clearInterval(interval);
  }, [timer]);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const sessionId = await verifySecret({ accountId, password });

      if (sessionId) {
        router.push("/");
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.log("Failed to verify OTP", error);
      setError("Failed to verify OTP. Please try again.");
    }

    setIsLoading(false);
  };

  const handleResendOtp = async () => {
    if (!canResend) return;

    await sendEmailOTP({ email });
    setTimer(60);
    setCanResend(false);
    setError("");
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="bg-white/95 backdrop-blur-3xl border border-gray-100 shadow-2xl rounded-[2rem] p-10 max-w-[420px] outline-none gap-8">
        
        {/* Close Button - positioned absolute to content */}
        <div className="absolute top-5 right-5 cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-colors group z-50" onClick={() => setIsOpen(false)}>
            <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
        </div>

        <AlertDialogHeader className="space-y-4 flex flex-col items-center">
          <AlertDialogTitle className="text-3xl font-bold text-center text-gray-900 tracking-tight w-full">
            Verification Code
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center text-gray-500 text-base leading-relaxed max-w-[85%] mx-auto">
            We've sent a 6-digit code to <br/>
            <span className="font-semibold text-gray-800">{email}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="flex flex-col items-center justify-center w-full my-2">
            <InputOTP maxLength={6} value={password} onChange={setPassword}>
              <InputOTPGroup className="gap-3 sm:gap-4">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                    <InputOTPSlot
                        key={index}
                        index={index}
                        className="w-10 h-12 sm:w-12 sm:h-14 border-2 border-gray-100 rounded-xl text-xl font-bold text-gray-800 shadow-sm focus:border-brand focus:ring-2 focus:ring-brand focus:ring-offset-1 transition-all outline-none bg-white/50"
                    />
                ))}
              </InputOTPGroup>
            </InputOTP>
            {error && <p className="text-red-500 text-sm mt-2 text-center font-medium">{error}</p>}
        </div>

        <AlertDialogFooter className="sm:justify-center">
          <div className="flex w-full flex-col gap-5">
            <AlertDialogAction
              onClick={handleSubmit}
              className="w-full !bg-indigo-600 hover:!bg-indigo-700 text-white font-semibold h-[50px] rounded-xl shadow-md transition-all text-lg border-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 outline-none"
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
                className={`p-0 h-auto font-bold transition-colors ${canResend ? "text-brand hover:text-brand-100 hover:bg-transparent" : "text-gray-500 cursor-not-allowed"}`}
                onClick={handleResendOtp}
                disabled={!canResend}
              >
                {canResend ? "Resend" : `Resend in ${timer}s`}
              </Button>
            </div>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default OtpModal;