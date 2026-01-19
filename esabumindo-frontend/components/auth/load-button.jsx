import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { cn } from "@/lib/utils";

export default function LoadButton({
  label = "Submit",
  loading = false,
  variant = "default",
  size = "sm",
  className,
  disabled,
  ...props
}) {
  return (
    <Button
      variant={variant}
      size={size}
      disabled={loading || disabled}
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      {loading && <Spinner />}
      {label}
    </Button>
  );
}
