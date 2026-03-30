import * as React from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ClearableInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear: () => void;
}

const ClearableInput = React.forwardRef<HTMLInputElement, ClearableInputProps>(
  ({ value, onClear, className, onChange, ...props }, ref) => {
    const [internalValue, setInternalValue] = React.useState("");
    const displayValue = value !== undefined ? String(value) : internalValue;
    const hasValue = displayValue.length > 0;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInternalValue(e.target.value);
      onChange?.(e);
    };

    const handleClear = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setInternalValue("");
      onClear();
    };

    return (
      <div className="relative flex-1">
        <Input
          ref={ref}
          value={value !== undefined ? value : internalValue}
          onChange={handleChange}
          className={`pr-8 ${className || ""}`}
          {...props}
        />
        {hasValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors z-10"
            tabIndex={-1}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }
);

ClearableInput.displayName = "ClearableInput";

export { ClearableInput };
