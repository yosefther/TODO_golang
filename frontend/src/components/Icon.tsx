interface IconProps {
  name: "check" | "plus" | "trash" | "list";
  className?: string;
}

export function Icon({ name, className = "size-5" }: IconProps) {
  const paths = {
    check: "m5 12 4 4L19 6",
    plus: "M12 5v14M5 12h14",
    trash: "M3 6h18M9 6V4h6v2M5 6l1 14h12l1-14M10 10v6M14 10v6",
    list: "m3 6 1 1 2-2M10 6h11M3 12l1 1 2-2M10 12h11M3 18l1 1 2-2M10 18h11",
  };
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}
