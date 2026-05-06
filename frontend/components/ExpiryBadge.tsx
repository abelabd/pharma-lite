import { getExpiryStatus, daysUntilExpiry, formatDate } from "@/lib/expiry";

interface ExpiryBadgeProps {
  expiryDate: string;
}

const statusConfig = {
  expired: {
    bg: "bg-red-100 text-red-700",
    dot: "bg-red-500",
    label: "Expired",
  },
  critical: {
    bg: "bg-red-50 text-red-600",
    dot: "bg-red-400",
    label: "Critical",
  },
  warning: {
    bg: "bg-amber-50 text-amber-700",
    dot: "bg-amber-400",
    label: "Expiring soon",
  },
  ok: {
    bg: "bg-slate-100 text-slate-600",
    dot: "bg-slate-400",
    label: "",
  },
};

export default function ExpiryBadge({ expiryDate }: ExpiryBadgeProps) {
  const status = getExpiryStatus(expiryDate);
  const days = daysUntilExpiry(expiryDate);
  const cfg = statusConfig[status];

  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-slate-700">{formatDate(expiryDate)}</span>
      {status !== "ok" && (
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full w-fit ${cfg.bg}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          {status === "expired" ? "Expired" : `${days}d left`}
        </span>
      )}
    </div>
  );
}
