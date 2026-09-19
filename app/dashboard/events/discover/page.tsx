import Link from "next/link";

const events = [
  ["ATTL Innovation Workshop", "Sep 24", "Workshop", "ATTL"],
  ["Tech Community Meetup", "Sep 29", "Community", "School"],
  ["Project Demo Day", "Oct 05", "Showcase", "ATTL"],
  ["Student Hackathon", "Oct 12", "Competition", "School"],
];

export default function EventsDiscoverPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[34px] border border-white/80 bg-white/65 p-7 backdrop-blur-[30px]">
        <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-blue-500">
          Events
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-[-.05em]">
          What's happening?
        </h1>

        <p className="mt-3 text-sm text-black/40">
          Discover workshops, competitions, showcases and school activities.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {events.map(([title, date, type, organizer]) => (
          <div
            key={title}
            className="group rounded-[28px] border border-white/80 bg-white/60 p-6 backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/80"
          >
            <div className="flex items-start justify-between">
              <div className="rounded-[15px] bg-black px-4 py-3 text-center text-white">
                <p className="text-[9px] text-white/45">DATE</p>
                <p className="mt-1 text-sm font-semibold">{date}</p>
              </div>

              <span className="rounded-full bg-blue-500/10 px-3 py-1 text-[9px] text-blue-500">
                {type}
              </span>
            </div>

            <h2 className="mt-6 text-base font-semibold">{title}</h2>

            <p className="mt-2 text-[10px] text-black/35">
              Organized by {organizer}
            </p>

            <Link
              href="/dashboard/events/upcoming"
              className="mt-6 block text-[10px] text-blue-500"
            >
              View event →
            </Link>
          </div>
        ))}
      </section>
    </div>
  );
}
