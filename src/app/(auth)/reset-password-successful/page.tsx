"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ResetPasswordSuccessful() {
  const router = useRouter();
  const goToLogin = () => {
    router.push("/login");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 max-h-screen bg-[#0284B2] max-h-[100vh] gap-4 font-[family-name:var(--font-dm)] px-[1rem] md:px-[2rem]">
      <div className="bg-white max-h-full h-full">
        <div className="h-full md:flex flex-col justify-center items-center">
          <Image
            src="/illustrations/reset-password/success-reset.svg"
            alt="reset password screen"
            width={200}
            height={400}
            className="translate-y-[50px] md:-translate-y-[50px] mx-auto"
          />
        </div>
        <div className="font-[family-name:var(--font-dm)] text-center -translate-y-[100px] md:-translate-y-[120px]">
          <h4 className="font-[family-name:var(--font-dm)] text-center text-[#0284B2] text-[30px] font-[700] mb-[13px]">
            Congratulations
          </h4>
          <p className="w-[320px] mx-auto font-[family-name:var(--font-dm)] text-[18px] text-[#0284B2]">
            You have successfully reset your password. Kindly login into your
            account to gain access to the portal.
          </p>

          <Button
            onClick={goToLogin}
            className="cursor-pointer w-[80%] md:w-[400px] bg-[#0284B2] hover:bg-[#0284B2] text-center h-[50px] mt-[15px] font-[family-name:var(--font-dm)] rounded-[4px]"
          >
            Login
          </Button>
        </div>
      </div>
    </div>
  );
}
