import { cva } from "class-variance-authority";

export const cardVariants = cva("relative w-full transition-all duration-300", {
  variants: {
    color: {
      default:
        "bg-white dark:bg-muted-800 border border-muted-200 dark:border-muted-700",
      contrast:
        "bg-white dark:bg-muted-900 border border-muted-200 dark:border-muted-800",
      muted:
        "bg-muted-100 dark:bg-muted-800 border border-muted-200 dark:border-muted-700",
      mutedContrast:
        "bg-muted-100 dark:bg-muted-900 border border-muted-200 dark:border-muted-800",
      primary:
        "bg-[#17161a]/10 border border-[#17161a] dark:bg-[#17161a]/20",
      info: "bg-info-500/10 border border-info-500 dark:bg-info-500/20",
      success:
        "bg-success-500/10 border border-success-500 dark:bg-success-500/20",
      warning:
        "bg-warning-500/10 border border-warning-500 dark:bg-warning-500/20",
      danger: "bg-danger-500/10 border border-danger-500 dark:bg-danger-500/20",
    },
    shape: {
      straight: "",
      rounded: "rounded-md",
      "rounded-xs": "rounded-xs",
      "rounded-sm": "rounded-sm",
      smooth: "rounded-lg",
      curved: "rounded-xl",
    },
    shadow: {
      flat: "shadow-xl shadow-muted-300/30 dark:shadow-muted-800/20",
      hover:
        "hover:shadow-xl hover:shadow-muted-300/30 dark:hover:shadow-muted-900/20",
      none: "",
    },
  },
  defaultVariants: {
    color: "default",
    shape: "smooth",
    shadow: "none",
  },
});
