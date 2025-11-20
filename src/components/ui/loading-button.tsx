import { Button } from "./button";
import { Loader } from "lucide-react";

interface ButtonProps {
  isLoading: boolean;
  buttonText: string;
  className?: string;
  disabled?: boolean;
  nextStep?: () => void;
  variant?: string;
}

const LoaderButton = ({
  isLoading,
  buttonText,
  className,
  nextStep,
  disabled,
}: ButtonProps) => {
  return (
    <Button
      type="submit"
      className={`w-full text-center h-[50px] font-[700] rounded-[4px] cursor-pointer ${className}`}
      disabled={disabled || isLoading}
      onClick={nextStep}
    >
      {isLoading && <Loader className="mr-1 animate-spin h-[40px] w-[40px]" />}
      {buttonText}
    </Button>
  );
};

export default LoaderButton;
