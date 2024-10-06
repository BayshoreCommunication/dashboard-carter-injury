import { Field } from "formik";
import useTheme from "@/hooks/useTheme";
import { IconPeople } from "@/components/Icons";

export const EmailField = ({ label, ...props }) => {
  const theme = useTheme();

  return (
    <label htmlFor={props.name} className="block">
      {label && <span>{label}</span>}

      <div className="relative mt-1">
        <div className="absolute inset-y-0 flex items-center left-3 text-gray-500">
          <IconPeople />
        </div>
        <Field
          id={props.name}
          type="email"
          className={
            "pl-9 pr-3 py-3 w-full outline-none bg-custom-gray rounded-md border border-custom-gray2"
          }
          {...props}
          onFocus={(e) => {
            e.target.style.border = `1px solid ${theme}`;
          }}
          onBlur={(e) => {
            e.target.style = "border-custom-gray2";
          }}
        />
      </div>
    </label>
  );
};
