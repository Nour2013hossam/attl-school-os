import Link from "next/link";

const modules = [
  ["Users", "Manage every account in the school.", "/dashboard/admin/users", "◎"],
  ["Students", "Student records and academic profiles.", "/dashboard/admin/students", "○"],
  ["Teachers", "Teacher accounts and access.", "/dashboard/admin/teachers", "◇"],
  ["Roles", "Create and manage system roles.", "/dashboard/admin/roles", "◈"],
  ["Permissions", "Granular access control.", "/dashboard/admin/permissions", "⌘"],
  ["Applications", "Review ATTL membership applications.", "/dashboard/admin/applications", "◇"],
  ["Grades", "Manage academic grade imports.", "/dashboard/admin/grades", "▤"],
  ["Projects", "Monitor school projects.", "/dashboard/admin/projects", "✦"],
  ["Competitions", "Competition management.", "/dashboard/admin/competitions", "◈"],
  ["Events", "Manage school events.", "/dashboard/admin/events", "✺"],
  ["Analytics", "School-wide analytics.", "/dashboard/admin/analytics", "⌁"],
  ["Audit Logs", "Track important system actions.", "/dashboard/admin/audit-logs", "◷"],
  ["Security", "System security center.", "/dashboard/admin/security", "◆"],
  ["System", "Global School OS configuration.", "/dashboard/admin/system", "⚙"],
];

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[34px] bg-black p-8 text-white shadow-[0_35px_100px_rgba(0,0,0,.2)]">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[.22em] text-blue-400">
              ATTL School OS · Administration
            </p>

            <h1 className="mt-3 text-4xl font-semibold tracking-[-.055em]">
              Command the system.
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
              Manage users, permissions, academic data, ATTL operations and
              the entire School OS.
            </p>
          </div>

          <div className="rounded-[20px] border border-white/10 bg-white/5 px-5 py-4">
            <p className="text-[9px] uppercase tracking-wider text-white/30">
              System Status
            </p>
            <p className="mt-1 text-sm font-medium text-green-400">
              All systems operational
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ["Students", "1,248"],
          ["Teachers", "86"],
          ["ATTL Members", "24"],
          ["Pending Reviews", "17"],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-[24px] border border-white/80 bg-white/60 p-5 backdrop-blur-xl"
          >
            <p className="text-[9px] text-black/30">{label}</p>
            <p className="mt-2 text-2xl font-semibold">{value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {modules.map(([title, description, href, icon]) => (
          <Link
            key={title}
            href={href}
            className="group rounded-[27px] border border-white/80 bg-white/60 p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/90"
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-black text-white">
                {icon}
              </div>

              <span className="text-black/20 transition-transform group-hover:translate-x-1">
                →
              </span>
            </div>

            <h2 className="mt-5 text-sm font-semibold">{title}</h2>

            <p className="mt-2 text-[10px] leading-5 text-black/35">
              {description}
            </p>
          </Link>
        ))}
      </section>
    </div>
  );
}
