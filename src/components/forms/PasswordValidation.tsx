import Image from "next/image";
import { useFormContext } from "react-hook-form";

export default function PasswordValidation({ fieldNames }: { fieldNames: [string, string] }) {
  const { watch } = useFormContext();
  const [password, confirmPassword] = fieldNames.map(name => watch(name));
  
  const field = password || confirmPassword;
  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  const validations = [
    {
      label: "8 character minimum",
      test: field ? field.length >= 8 : false,
    },
    {
      label: "one uppercase character",
      test: field ? /[A-Z]/.test(field) : false,
    },
    {
      label: "one special character",
      test: field ? /[!@#$%^&*(),.?\":{}|<>]/.test(field) : false,
    },
    {
      label: "one number",
      test: field ? /[0-9]/.test(field) : false,
    },
    {
      label: "Passwords match",
      test: passwordsMatch,
    },
  ];

  const getIconSrc = (pass: boolean) => {
    if (!field) return "/validation-icons/default.svg";
    return pass ? "/validation-icons/pass.svg" : "/validation-icons/error.svg";
  };

  return (
    <div className="mt-4 text-left">
      <ul className="list-none text-gray-700">
        {validations.map((rule, i) => (
          <li key={i} className="flex items-center gap-2">
            <Image
              src={getIconSrc(rule.test)}
              alt="validation icon"
              width={16}
              height={16}
            />
            {rule.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
