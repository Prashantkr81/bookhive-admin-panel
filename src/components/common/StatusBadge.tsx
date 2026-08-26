interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({
  status,
}: StatusBadgeProps) {
  const normalized =
    status.toLowerCase();

  let classes =
    "bg-slate-100 text-slate-700";

  if (
    normalized === "active" ||
    normalized === "available"
  ) {
    classes =
      "bg-green-50 text-green-700";
  }

  if (
    normalized === "inactive" ||
    normalized === "disabled"
  ) {
    classes =
      "bg-red-50 text-red-700";
  }

  if (
    normalized === "pending"
  ) {
    classes =
      "bg-yellow-50 text-yellow-700";
  }

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${classes}`}
    >
      {status}
    </span>
  );
}