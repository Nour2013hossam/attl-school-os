type StatCardProps = {
  title: string;
  value: string;
  description: string;
};

export function StatCard({
  title,
  value,
  description,
}: StatCardProps) {
  return (
    <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
      <p className="text-sm text-black/50">{title}</p>
      <p className="mt-3 text-3xl font-bold tracking-tight">{value}</p>
      <p className="mt-2 text-sm text-black/40">{description}</p>
    </div>
  );
}

