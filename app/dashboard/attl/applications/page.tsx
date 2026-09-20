"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { usePreferences } from "@/components/providers/preferences-provider";

type Track = { id: string; name: string; description: string | null };
type Question = { id: string; prompt: string; type: string; required: boolean; options?: string[] | null };
type Application = {
  id: string;
  status: string;
  reviewerNotes: string | null;
  interviewAt: string | null;
  interviewResult: string | null;
  interviewNotes: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    role?: string;
    attlMembershipActive?: boolean;
  };
  track: { name: string };
};

const stages = [
  ["NEW", "Submitted"],
  ["UNDER_REVIEW", "Review"],
  ["SHORTLISTED", "Shortlisted"],
  ["INTERVIEW", "Interview"],
  ["ACCEPTED", "Activated"],
] as const;

const statuses = ["NEW", "UNDER_REVIEW", "SHORTLISTED", "INTERVIEW", "ACCEPTED", "REJECTED"];

type Draft = {
  status: string;
  interviewAt: string;
  interviewResult: string;
  interviewNotes: string;
  reviewerNotes: string;
};

function stageIndex(status: string) {
  if (status === "REJECTED") return -1;
  const index = stages.findIndex((stage) => stage[0] === status);
  return index < 0 ? 0 : index;
}

function getOptions(question: Question) {
  return Array.isArray(question.options) ? question.options : [];
}

export default function AttlApplicationsPage() {
  const { can, permissionsReady } = usePreferences();
  const reviewer = permissionsReady && can("attl.review");
  const applicant = permissionsReady && can("attl.apply");

  const [tracks, setTracks] = useState<Track[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [trackId, setTrackId] = useState("");
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});

  async function load() {
    const [tracksResponse, questionsResponse, applicationsResponse] = await Promise.all([
      fetch("/api/attl/tracks", { cache: "no-store" }),
      fetch("/api/attl/questions", { cache: "no-store" }),
      fetch("/api/attl/applications", { cache: "no-store" }),
    ]);

    const [tracksData, questionsData, applicationsData] = await Promise.all([
      tracksResponse.json(),
      questionsResponse.json(),
      applicationsResponse.json(),
    ]);

    setTracks(tracksData.tracks ?? []);
    setQuestions(questionsData.questions ?? []);

    const rows = applicationsData.applications ?? [];
    setApplications(rows);

    const nextDrafts: Record<string, Draft> = {};
    for (const row of rows as Application[]) {
      nextDrafts[row.id] = {
        status: row.status,
        interviewAt: row.interviewAt ? row.interviewAt.slice(0, 16) : "",
        interviewResult: row.interviewResult ?? "PENDING",
        interviewNotes: row.interviewNotes ?? "",
        reviewerNotes: row.reviewerNotes ?? "",
      };
    }
    setDrafts(nextDrafts);
  }

  useEffect(() => {
    if (permissionsReady) load();
  }, [permissionsReady]);

  const myApplication = useMemo(
    () => applications.find((item) => item.user?.id),
    [applications]
  );

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setStatus("");

    const response = await fetch("/api/attl/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackId, answers }),
    });

    const data = await response.json();
    setStatus(response.ok ? "Application submitted successfully." : (data.error ?? "Could not submit application."));
    setSaving(false);

    if (response.ok) {
      setTrackId("");
      setAnswers({});
      await load();
    }
  }

  function updateDraft(id: string, patch: Partial<Draft>) {
    setDrafts((current) => ({
      ...current,
      [id]: {
        ...(current[id] ?? {
          status: "NEW",
          interviewAt: "",
          interviewResult: "PENDING",
          interviewNotes: "",
          reviewerNotes: "",
        }),
        ...patch,
      },
    }));
  }

  async function saveReview(id: string) {
    const draft = drafts[id];
    if (!draft) return;

    const response = await fetch("/api/admin/attl/applications/" + id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: draft.status,
        interviewAt: draft.interviewAt || null,
        interviewResult: draft.interviewResult || null,
        interviewNotes: draft.interviewNotes || null,
        reviewerNotes: draft.reviewerNotes || null,
      }),
    });

    const data = await response.json();
    setStatus(
      response.ok
        ? draft.status === "ACCEPTED"
          ? "Accepted — the ATTL member account is now activated."
          : "Application updated."
        : (data.error ?? "Could not update application.")
    );

    if (response.ok) await load();
  }

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[34px] bg-black p-7 text-white shadow-[0_25px_80px_rgba(0,0,0,.16)] md:p-9">
        <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-blue-500/30 blur-[105px]" />
        <div className="absolute -bottom-36 left-[25%] h-80 w-80 rounded-full bg-cyan-400/10 blur-[105px]" />
        <div className="relative">
          <p className="text-[9px] uppercase tracking-[.22em] text-blue-300">ATTL Recruitment</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-[-.06em] md:text-5xl">
            {reviewer ? "Recruitment control." : "Join ATTL."}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">
            {reviewer
              ? "Move every applicant through review, interview and the final decision."
              : "Apply to a track, complete the form, attend the interview and wait for the decision."}
          </p>
        </div>
      </section>

      {status && (
        <div className="rounded-[18px] border border-blue-500/10 bg-blue-500/10 px-4 py-3 text-[10px] text-blue-700">
          {status}
        </div>
      )}

      {!reviewer && applicant && myApplication && (
        <section className="rounded-[30px] border border-white/80 bg-white/60 p-5 backdrop-blur-2xl md:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[8px] uppercase tracking-[.18em] text-black/30">Application status</p>
              <h2 className="mt-2 text-xl font-semibold">{myApplication.track.name}</h2>
              <p className="mt-1 text-[9px] text-black/35">
                {myApplication.status === "REJECTED"
                  ? "Decision: not selected"
                  : "Current stage: " + myApplication.status.replaceAll("_", " ")}
              </p>
            </div>

            <div className={
              myApplication.status === "ACCEPTED"
                ? "rounded-full bg-green-500/10 px-4 py-2 text-[9px] font-semibold text-green-700"
                : "rounded-full bg-black/[.04] px-4 py-2 text-[9px] font-semibold text-black/45"
            }>
              {myApplication.status === "ACCEPTED" ? "ATTL account activated" : "ATTL account locked"}
            </div>
          </div>

          <div className="mt-7 grid gap-2 md:grid-cols-5">
            {stages.map(([value, label], index) => {
              const active = stageIndex(myApplication.status) >= index;
              return (
                <div key={value} className="rounded-[18px] bg-black/[.025] p-3">
                  <div className={"mb-3 h-1.5 rounded-full " + (active ? "bg-blue-500" : "bg-black/[.06]")} />
                  <p className="text-[8px] font-semibold">{label}</p>
                  <p className="mt-1 text-[7px] text-black/30">{value}</p>
                </div>
              );
            })}
          </div>

          {myApplication.interviewAt && (
            <div className="mt-4 rounded-[18px] bg-blue-500/[.05] p-4">
              <p className="text-[8px] uppercase tracking-[.16em] text-blue-600">Interview</p>
              <p className="mt-2 text-[10px] font-semibold">
                {new Date(myApplication.interviewAt).toLocaleString()}
              </p>
              <p className="mt-1 text-[9px] text-black/35">
                Result: {myApplication.interviewResult ?? "PENDING"}
              </p>
              {myApplication.interviewNotes && (
                <p className="mt-2 text-[9px] leading-5 text-black/40">{myApplication.interviewNotes}</p>
              )}
            </div>
          )}

          {myApplication.reviewerNotes && (
            <div className="mt-4 rounded-[18px] bg-black/[.025] p-4">
              <p className="text-[8px] uppercase tracking-[.16em] text-black/25">Reviewer notes</p>
              <p className="mt-2 text-[10px] leading-5 text-black/45">{myApplication.reviewerNotes}</p>
            </div>
          )}
        </section>
      )}

      {!reviewer && applicant && (!myApplication || myApplication.status === "REJECTED") && (
        <section className="rounded-[30px] border border-white/80 bg-white/60 p-5 backdrop-blur-2xl md:p-8">
          <div className="mb-7 grid gap-3 md:grid-cols-3">
            <div className="rounded-[20px] bg-black/[.025] p-4">
              <p className="text-[8px] uppercase tracking-[.16em] text-black/25">01</p>
              <p className="mt-2 text-sm font-semibold">Apply</p>
              <p className="mt-1 text-[9px] leading-4 text-black/35">Pick the track where you can contribute.</p>
            </div>
            <div className="rounded-[20px] bg-black/[.025] p-4">
              <p className="text-[8px] uppercase tracking-[.16em] text-black/25">02</p>
              <p className="mt-2 text-sm font-semibold">Interview</p>
              <p className="mt-1 text-[9px] leading-4 text-black/35">Your account stays locked while the interview is pending.</p>
            </div>
            <div className="rounded-[20px] bg-blue-500/[.06] p-4">
              <p className="text-[8px] uppercase tracking-[.16em] text-blue-600">03</p>
              <p className="mt-2 text-sm font-semibold">Activate</p>
              <p className="mt-1 text-[9px] leading-4 text-black/35">Only INTERVIEW + PASS can activate ATTL membership.</p>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-6">
            <div>
              <label className="mb-2 block text-[9px] uppercase tracking-[.16em] text-black/30">Track</label>
              <select
                value={trackId}
                onChange={(event) => setTrackId(event.target.value)}
                required
                className="h-12 w-full rounded-[16px] border border-black/5 bg-white/80 px-4 text-xs outline-none"
              >
                <option value="">Select a track</option>
                {tracks.map((track) => <option key={track.id} value={track.id}>{track.name}</option>)}
              </select>
              {trackId && (
                <p className="mt-2 text-[9px] leading-5 text-black/35">
                  {tracks.find((track) => track.id === trackId)?.description}
                </p>
              )}
            </div>

            {questions.map((question, index) => {
              const options = getOptions(question);
              const value = answers[question.id];

              return (
                <div key={question.id} className="rounded-[22px] bg-black/[.02] p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <label className="text-[10px] font-semibold">
                      {index + 1}. {question.prompt}{question.required ? " *" : ""}
                    </label>
                    <span className="text-[7px] uppercase tracking-[.14em] text-black/25">{question.type}</span>
                  </div>

                  {question.type === "textarea" ? (
                    <textarea
                      required={question.required}
                      rows={5}
                      value={typeof value === "string" ? value : ""}
                      onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))}
                      className="w-full rounded-[15px] border border-black/5 bg-white px-4 py-3 text-xs outline-none"
                    />
                  ) : question.type === "select" ? (
                    <select
                      required={question.required}
                      value={typeof value === "string" ? value : ""}
                      onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))}
                      className="h-11 w-full rounded-[14px] border border-black/5 bg-white px-3 text-xs outline-none"
                    >
                      <option value="">Choose</option>
                      {options.map((option) => <option key={option}>{option}</option>)}
                    </select>
                  ) : question.type === "multiselect" ? (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {options.map((option) => {
                        const selected = Array.isArray(value) && value.includes(option);
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => setAnswers((current) => {
                              const existing = Array.isArray(current[question.id]) ? current[question.id] as string[] : [];
                              return {
                                ...current,
                                [question.id]: selected ? existing.filter((item) => item !== option) : [...existing, option],
                              };
                            })}
                            className={"rounded-[13px] border px-3 py-2.5 text-left text-[9px] transition " + (
                              selected
                                ? "border-blue-500/20 bg-blue-500/10 text-blue-700"
                                : "border-black/5 bg-white"
                            )}
                          >
                            {selected ? "✓ " : ""}{option}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <input
                      required={question.required}
                      value={typeof value === "string" ? value : ""}
                      onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))}
                      className="h-11 w-full rounded-[14px] border border-black/5 bg-white px-3 text-xs outline-none"
                    />
                  )}
                </div>
              );
            })}

            <button
              disabled={saving}
              className="w-full rounded-[16px] bg-black px-5 py-3.5 text-[9px] font-semibold text-white disabled:opacity-40"
            >
              {saving ? "Submitting application..." : "Submit ATTL application"}
            </button>
          </form>
        </section>
      )}

      {reviewer && (
        <section className="space-y-3">
          {applications.map((application) => {
            const draft = drafts[application.id] ?? {
              status: application.status,
              interviewAt: application.interviewAt ? application.interviewAt.slice(0, 16) : "",
              interviewResult: application.interviewResult ?? "PENDING",
              interviewNotes: application.interviewNotes ?? "",
              reviewerNotes: application.reviewerNotes ?? "",
            };

            return (
              <article key={application.id} className="rounded-[28px] border border-white/80 bg-white/60 p-5 backdrop-blur-2xl md:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold">{application.user.name}</p>
                      {application.user.attlMembershipActive && (
                        <span className="rounded-full bg-green-500/10 px-2.5 py-1 text-[7px] font-semibold text-green-700">
                          ACTIVE MEMBER
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-[9px] text-black/30">
                      {application.user.email} · {application.track.name}
                    </p>
                  </div>

                  <select
                    value={draft.status}
                    onChange={(event) => updateDraft(application.id, { status: event.target.value })}
                    className="h-10 rounded-[13px] border border-black/5 bg-white px-3 text-[9px] outline-none"
                  >
                    {statuses
                      .filter((item) => item !== "ACCEPTED" || (application.status === "INTERVIEW" && draft.interviewResult === "PASS"))
                      .map((item) => <option key={item}>{item}</option>)}
                  </select>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  <label className="rounded-[18px] bg-black/[.025] p-4">
                    <span className="text-[8px] uppercase tracking-[.15em] text-black/25">Interview date</span>
                    <input
                      type="datetime-local"
                      value={draft.interviewAt}
                      onChange={(event) => updateDraft(application.id, { interviewAt: event.target.value })}
                      className="mt-2 h-10 w-full rounded-[12px] bg-white px-2 text-[9px] outline-none"
                    />
                  </label>

                  <label className="rounded-[18px] bg-black/[.025] p-4">
                    <span className="text-[8px] uppercase tracking-[.15em] text-black/25">Interview result</span>
                    <select
                      value={draft.interviewResult}
                      onChange={(event) => updateDraft(application.id, { interviewResult: event.target.value })}
                      className="mt-2 h-10 w-full rounded-[12px] bg-white px-2 text-[9px] outline-none"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PASS">PASS</option>
                      <option value="FAIL">FAIL</option>
                    </select>
                  </label>

                  <div className="rounded-[18px] bg-blue-500/[.05] p-4">
                    <p className="text-[8px] uppercase tracking-[.15em] text-blue-600">Activation rule</p>
                    <p className="mt-2 text-[9px] leading-4 text-black/40">
                      ACCEPTED requires the current stage to be INTERVIEW and the result to be PASS.
                    </p>
                  </div>
                </div>

                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <textarea
                    value={draft.interviewNotes}
                    onChange={(event) => updateDraft(application.id, { interviewNotes: event.target.value })}
                    rows={3}
                    placeholder="Interview notes..."
                    className="rounded-[18px] border border-black/5 bg-white/75 p-3 text-[9px] outline-none"
                  />
                  <textarea
                    value={draft.reviewerNotes}
                    onChange={(event) => updateDraft(application.id, { reviewerNotes: event.target.value })}
                    rows={3}
                    placeholder="Reviewer notes..."
                    className="rounded-[18px] border border-black/5 bg-white/75 p-3 text-[9px] outline-none"
                  />
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-[8px] text-black/30">
                    Current: <span className="font-semibold">{application.status.replaceAll("_", " ")}</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => saveReview(application.id)}
                    className="rounded-[14px] bg-black px-5 py-2.5 text-[9px] font-semibold text-white"
                  >
                    Save decision
                  </button>
                </div>
              </article>
            );
          })}

          {applications.length === 0 && (
            <div className="rounded-[26px] border border-dashed border-black/10 p-10 text-center text-[10px] text-black/30">
              No applications in the recruitment queue.
            </div>
          )}
        </section>
      )}

      {!reviewer && !applicant && permissionsReady && (
        <section className="rounded-[26px] border border-dashed border-black/10 p-10 text-center text-[10px] text-black/35">
          ATTL recruitment access is not enabled for this account.
        </section>
      )}
    </div>
  );
}
