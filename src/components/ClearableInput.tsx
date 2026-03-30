import * as React from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ClearableInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear: () => void;
}

const ClearableInput = React.forwardRef<HTMLInputElement, ClearableInputProps>(
  ({ value, onClear, className, ...props }, ref) => {
    return (
      <div className="relative flex-1">
        <Input ref={ref} value={value} className={`pr-8 ${className || ""}`} {...props} />
        {value && String(value).length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
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
