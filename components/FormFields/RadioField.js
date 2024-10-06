export const RadioField = ({ label, name, ...props }) => {
  return (
    <label htmlFor={label} className="flex items-center gap-3 cursor-pointer">
      <input type="radio" id={label} {...props} />
      <span>{label}</span>
    </label>
  );
};
