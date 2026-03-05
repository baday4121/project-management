import { ImgHTMLAttributes } from "react";

type LogoVariant = "default" | "circular";

interface ApplicationLogoProps extends ImgHTMLAttributes<HTMLImageElement> {
  variant?: LogoVariant;
}

export default function ApplicationLogo({
  variant = "default",
  className = "",
  ...props
}: ApplicationLogoProps) {
  const logoPath = "/logo.svg";

  return (
    <img
      {...props}
      src={logoPath}
      alt="Application Logo"
      className={className}
    />
  );
}