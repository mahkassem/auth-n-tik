import { SVGProps } from "react";

interface IconProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

export function VercelIcon({ className = "h-4 w-4", ...props }: IconProps) {
  return (
    <svg
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1155 1000"
      {...props}
    >
      <path d="m577.3 0 577.4 1000H0z" fill="currentColor" />
    </svg>
  );
}
