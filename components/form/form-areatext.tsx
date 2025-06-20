"use client";

import { forwardRef, KeyboardEventHandler } from "react";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { FormErrors } from "./form-errors";
import { useFormState, useFormStatus } from "react-dom";

interface FormAreaTextProps {
  id: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disable?: boolean;
  errors?: Record<string, string[] | undefined>;
  className?: string;
  onBlur?: () => void;
  onClick?: () => void;
  onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement> | undefined;
  defaultValue?: string;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormAreaTextProps>(
  (
    {
      id,
      label,
      placeholder,
      required,
      disable,
      errors,
      onBlur,
      onClick,
      onKeyDown,
      className,
      defaultValue,
    },
    ref
  ) => {
    const {pending} = useFormStatus();
    return (
      <div className="space-y-2 w-full">
        <div className="space-y-1 w-full">
          {label ? <Label htmlFor={id} className="text-xs font-semibold text-neutral-700">{label}</Label> : null}
          <Textarea onKeyDown={onKeyDown} onBlur={onBlur} onClick={onClick} ref={ref} required={required}   placeholder={placeholder} name={id} id={id} disabled={pending || disable} className={cn("resize-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none shadow-sm", className)} aria-describedby={`${id}-error`} defaultValue={defaultValue}/>
        </div>
        <FormErrors
        id={id}
        errors={errors}
        />
      </div>
    );
  }
);
FormTextarea.displayName = "FormTextarea";
