import { cva } from "class-variance-authority";

export const checkboxVariants = cva(
  "absolute top-0 left-0 z-1 block h-full w-full scale-0 transition-transform duration-300 peer-checked:scale-[1.1]",
  {
    variants: {
      color: {
        primary: "bg-[#17161a] border-[#17161a]",
        info: "bg-info-500 border-info-500",
        success: "bg-success-500 border-success-500",
        warning: "bg-warning-500 border-warning-500",
        danger: "bg-danger-500 border-danger-500",
        default: "bg-muted-300 dark:bg-muted-700",
      },
      shape: {
        straight: "",
        "rounded-sm": "rounded-sm",
        rounded: "rounded",
        smooth: "rounded-md",
        curved: "rounded-lg",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      color: "default",
      shape: "smooth",
    },
  }
);
