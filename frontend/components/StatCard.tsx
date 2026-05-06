interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent?: "teal" | "amber" | "red" | "slate";
}

const accentMap = {
  teal: { bg: "bg-teal-50", icon: "text-teal-600", value: "text-teal-700" },
  amber: { bg: "bg-amber-50", icon: "text-amber-500", value: "text-amber-700" },
  red: { bg: "bg-red-50", icon: "text-red-500", value: "text-red-700" },
  slate: { bg: "bg-slate-100", icon: "text-slate-500", value: "text-slate-800" },
};

export default function StatCard({ label, value, icon, accent = "slate" }: StatCardProps) {
  const colors = accentMap[accent];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${colors.bg}`}>
        <span className={colors.icon}>{icon}</span>
      </div>
      <div>
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        <p className={`text-2xl font-semibold mt-0.5 ${colors.value}`}>{value}</p>
      </div>
    </div>
  );
}
