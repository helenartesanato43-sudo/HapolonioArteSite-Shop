interface DiscountBadgeProps {
  percentage: number;
}

export function DiscountBadge({ percentage }: DiscountBadgeProps) {
  return (
    <span className="absolute left-3 top-3 rounded-full bg-pix px-3 py-1 text-xs font-bold text-white shadow-sm">
      -{percentage}%
    </span>
  );
}
