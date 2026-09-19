const users = [
  ["A", "Ahmed Hassan", "Student", "Active"],
  ["M", "Mariam Ali", "ATTL Member", "Active"],
  ["O", "Omar Khaled", "Teacher", "Active"],
  ["S", "Sara Mohamed", "Student", "Pending"],
];

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-white/80 bg-white/65 p-7 backdrop-blur-[30px]">
        <p className="text-[10px] uppercase tracking-[.2em] text-blue-500">
          Administration
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-.05em]">
          Users
        </h1>
        <p className="mt-3 text-sm text-black/40">
          Search, review and manage School OS accounts.
        </p>
      </section>

      <section className="rounded-[28px] border border-white/80 bg-white/60 p-5 backdrop-blur-xl">
        <div className="mb-5 flex flex-col gap-3 md:flex-row">
          <input
            placeholder="Search users..."
            className="h-11 flex-1 rounded-[14px] border border-black/5 bg-white/70 px-4 text-xs outline-none placeholder:text-black/25"
          />

          <button className="rounded-[14px] bg-black px-5 text-[10px] text-white">
            Add User
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left">
            <thead>
              <tr className="border-b border-black/5 text-[9px] uppercase tracking-wider text-black/25">
                <th className="pb-4">User</th>
                <th className="pb-4">Role</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map(([avatar, name, role, status]) => (
                <tr key={name} className="border-b border-black/5 last:border-0">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-[10px] text-white">
                        {avatar}
                      </div>
                      <span className="text-xs font-medium">{name}</span>
                    </div>
                  </td>

                  <td className="py-4 text-[10px] text-black/45">{role}</td>

                  <td className="py-4">
                    <span className="rounded-full bg-green-500/10 px-3 py-1 text-[9px] text-green-600">
                      {status}
                    </span>
                  </td>

                  <td className="py-4">
                    <button className="text-[10px] text-blue-500">
                      Manage →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
