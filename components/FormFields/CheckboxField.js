import { Field } from "formik";

export const CheckboxField = ({ label, className, ...props }) => {
  return (
    <label
      htmlFor={label}
      className="inline-flex items-center gap-2 cursor-pointer"
    >
      <Field id={label} type="checkbox" className="cursor-pointer" {...props} />
      <span>{label}</span>
    </label>
  );
};
