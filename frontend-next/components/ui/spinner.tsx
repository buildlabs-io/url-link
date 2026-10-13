import { Loader2 } from "lucide-react";

export default function Spinner({
  className = "size-6",
}: {
  className?: string;
}) {
  return (
    <Loader2 aria-hidden className={`animate-spin text-accent ${className}`} />
  );
}
