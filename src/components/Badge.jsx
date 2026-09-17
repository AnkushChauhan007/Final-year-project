export function categoryBadgeClass(category) {
  return `badge badge-${(category || "").toLowerCase()}`;
}

export function statusBadgeClass(status) {
  if (status === "Approved") return "badge badge-approved";
  if (status === "Rejected") return "badge badge-rejected";
  if (status === "Needs more info") return "badge badge-info";
  return "badge badge-status";;;;;
}

export default function Badge({ children, className }) {
  return <span className={className}>{children}</span>;
}
