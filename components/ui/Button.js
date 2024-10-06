import useTheme from "@/hooks/useTheme";
// import { useSiteInfo } from "@/lib/store";
import { cn } from "@/lib/utils";

function Button({
  children,
  type,
  onClick,
  disabled,
  variant,
  className,
  ...props
}) {
  const theme = useTheme();

  return (
    <button
      type={type}
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full border disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      style={{
        borderColor: theme,
        backgroundColor: variant === "outline" ? "transparent" : theme,
        color: variant === "outline" ? theme : "white",
      }}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
