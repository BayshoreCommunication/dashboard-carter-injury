import { useState } from "react";
import { Field } from "formik";
import useTheme from "@/hooks/useTheme";
import { IconEye, IconEyeSlash, IconLock } from "@/components/Icons";

export const PasswordField = ({ label, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  const theme = useTheme();

  return (
    <label htmlFor={props.name} className="block">
      {label && <span>{label}</span>}

      <div className="relative mt-1">
        <Field
          id={props.name}
          className="pl-9 pr-3 py-3 w-full outline-none bg-custom-gray rounded-md border border-gray-300"
          {...props}
          type={showPassword ? "text" : "password"}
          autoComplete="on"
          onFocus={(e) => {
            e.target.style.border = `1px solid ${theme}`;
          }}
          onBlur={(e) => {
            e.target.style = "border-custom-gray2";
          }}
        />
        <div className="absolute inset-y-0 flex items-center left-3 text-gray-500">
          <IconLock />
        </div>

        <div className="absolute inset-y-[1px] px-1 flex items-center right-[1px] bg-custom-gray rounded-md">
          <span
            className="p-[6px] text-lg cursor-pointer hover:bg-gray-200 active:bg-gray-300 rounded-full text-black/60"
            onClick={() => setShowPassword(!showPassword)}
          >
            <span>{showPassword ? <IconEyeSlash /> : <IconEye />}</span>
          </span>
        </div>
      </div>
    </label>
  );
};

export const PasswordField2 = ({ className, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <label htmlFor={props.name} className="block w-full">
      <div className="relative mt-1">
        <Field
          id={props.name}
          type={showPassword ? "text" : "password"}
          className="pl-0.5 py-0 w-full outline-none text-2xl font-bold bg-transparent text-gray-600"
          {...props}
        />

        <div className="absolute inset-y-0 right-0 px-2 bg-custom-gray5">
          <span
            className="size-9 flex justify-center items-center text-lg cursor-pointer hover:bg-gray-200 active:bg-gray-300 rounded-full text-black/60 border border-gray-300"
            onClick={() => setShowPassword(!showPassword)}
          >
            <span>{showPassword ? <IconEyeSlash /> : <IconEye />}</span>
          </span>
        </div>
      </div>
    </label>
  );
};
