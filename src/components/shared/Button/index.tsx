import React from "react";
export interface IButtonProps {
  name?: React.ReactNode;
  onClick?: (e: any) => void;
  icon?: any;
  type?: any;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "primaryLarge" | "small" | "outline";
  className?: string;
  children?: React.ReactNode;
}

export const Button: React.FC<IButtonProps> = ({
  name,
  onClick,
  icon,
  type,
  disabled,
  variant = "primary",
  className = "",
  children,
}) => {
  const getVariantStyles = (variant: IButtonProps["variant"]) => {
    switch (variant) {
      case "primaryLarge":
        return {
          bg: "py-2 md:py-2.5 px-4 w-full text-white",
          imageSize: "h-4 w-4",
          baseBg: "bg-theme",
        };
      case "primary":
        return {
          bg: "py-2 md:py-2.5 px-4 text-white",
          imageSize: "h-4 w-4",
          baseBg: "bg-theme",
        };
      case "secondary":
        return {
          bg: "py-2 md:py-2 px-4 bg-white border border-theme text-theme",
          baseBg: "",
        };
      case "outline":
        return {
          bg: "py-2 md:py-2 px-4 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50",
          baseBg: "",
        };
      case "small":
        return {
          bg: "py-2 px-2 text-white text-xs",
          baseBg: "bg-theme",
        };
      default:
        return {
          bg: "py-2 md:py-2.5 px-4 text-white",
          baseBg: "bg-theme",
        };
    }
  };
  const variantStyles = getVariantStyles(variant);
  return (
    <button
      type={type}
      className={`${variantStyles?.bg} ${variantStyles?.baseBg} lg:px-6 text-p4 md:text-p3 w-full sm:w-fit font-bold uppercase rounded-md flex justify-center items-center h-9 gap-2 ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {name && <span className="p-0">{name}</span>}
      {icon && icon}
      {children}
    </button>
  );
};
