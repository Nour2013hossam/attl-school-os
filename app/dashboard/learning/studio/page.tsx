"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePreferences } from "@/components/providers/preferences-provider";

type Course = {
  id: string;
  title: string;
  description: string | null;
  level: string | null;
  published: boolean;
  subject: { code: string; name: string } | null;
  lessons: Array<{ id: string; title: string; duration: number | null; position: number }>;
  resources: Array<{ id: string; title: string; type: string; url: string | null }>;
  _count: { lessons: number; resources: number; enrollments: number };
};

type Asset = {
  id: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
  owner: { id: string; name: string };
};

function prettyBytes(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function CourseStudioPage() {
  const { can, permissionsReady } = usePreferences();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("Beginner");

  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonContent, setLessonContent] = useState("");
  const [lessonDuration, setLessonDuration] = useState("30");

  const [resourceTitle, setResourceTitle] = useState("");
  const [resourceType, setResourceType] = useState("Reference");
  const [resourceUrl, setResourceUrl] = useState("");

  const [files, setFiles] = useState<Asset[]>([]);

  const selected = useMemo(() => courses.find((course) => course.id === selectedId) ?? null, [courses, selectedId]);

  async function load() {
    const response = await fetch("/api/courses?manage=1", { cache: "no-store" });
    const data = await response.json();
    if (!response.ok) {
      setMessage(data.error ?? "Could not load courses.");
      return;
    }
    const rows = data.courses ?? [];
    setCourses(rows);
    if (!selectedId && rows[0]?.id) setSelectedId(rows[0].id);
  }

  async function loadFiles(courseId: string) {
    const response = await fetch("/api/uploads?entityType=course&entityId=" + encodeURIComponent(courseId), { cache: "no-store" });
    const data = await response.json();
    if (response.ok) setFiles(data.files ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (selectedId) loadFiles(selectedId);
    else setFiles([]);
  }, [selectedId]);

  async function createCourse(event: FormEvent) {
    event.preventDefault();
    setBusy("course");
    setMessage("");
    const response = await fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, level, published: false }),
    });
    const data = await response.json();
    setBusy("");
    setMessage(response.ok ? "Course created as draft." : (data.error ?? "Could not create course."));
    if (response.ok) {
      setTitle("");
      setDescription("");
      await load();
      if (data.course?.id) setSelectedId(data.course.id);
    }
  }

  async function patchCourse(patch: Record<string, unknown>) {
    if (!selected) return;
    setBusy("course");
    const response = await fetch("/api/courses/" + selected.id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    const data = await response.json();
    setBusy("");
    setMessage(response.ok ? "Course updated." : (data.error ?? "Could not update course."));
    if (response.ok) await load();
  }

  async function deleteCourse() {
    if (!selected) return;
    setBusy("course");
    const response = await fetch("/api/courses/" + selected.id, { method: "DELETE" });
    const data = await response.json();
    setBusy("");
    setMessage(response.ok ? "Course deleted." : (data.error ?? "Could not delete course."));
    if (response.ok) {
      setSelectedId("");
      setFiles([]);
      await load();
    }
  }

  async function createLesson(event: FormEvent) {
    event.preventDefault();
    if (!selected) return;
    setBusy("lesson");
    const response = await fetch("/api/learning/lessons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseId: selected.id,
        title: lessonTitle,
        content: lessonContent,
        position: selected.lessons.length + 1,
        duration: Number(lessonDuration) || null,
      }),
    });
    const data = await response.json();
    setBusy("");
    setMessage(response.ok ? "Lesson added." : (data.error ?? "Could not add lesson."));
    if (response.ok) {
      setLessonTitle("");
      setLessonContent("");
      await load();
    }
  }

  async function createResource(event: FormEvent) {
    event.preventDefault();
    if (!selected) return;
    setBusy("resource");
    const response = await fetch("/api/learning/resources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseId: selected.id,
        title: resourceTitle,
        type: resourceType,
        url: resourceUrl || null,
      }),
    });
    const data = await response.json();
    setBusy("");
    setMessage(response.ok ? "Resource added." : (data.error ?? "Could not add resource."));
    if (response.ok) {
      setResourceTitle("");
      setResourceUrl("");
      await load();
    }
  }

  async function uploadFile(event: React.ChangeEvent<HTMLInputElement>) {
    if (!selected) return;
    const file = event.target.files?.[0];
    if (!file) return;

    setBusy("file");
    const form = new FormData();
    form.set("entityType", "course");
    form.set("entityId", selected.id);
    form.set("file", file);

    const response = await fetch("/api/uploads", { method: "POST", body: form });
    const data = await response.json();
    setBusy("");
    setMessage(response.ok ? "File uploaded." : (data.error ?? "Could not upload file."));
    event.target.value = "";
    if (response.ok) loadFiles(selected.id);
  }

  async function deleteFile(id: string) {
    setBusy("file");
    const response = await fetch("/api/uploads/" + id, { method: "DELETE" });
    const data = await response.json();
    setBusy("");
    setMessage(response.ok ? "File deleted." : (data.error ?? "Could not delete file."));
    if (response.ok && selected) loadFiles(selected.id);
  }

  if (!permissionsReady) return null;

  if (!can("learning.manage")) {
    return <div className="rounded-[28px] border border-dashed border-black/10 p-10 text-center text-sm text-black/40">You do not have access to Course Studio.</div>;
  }

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[34px] bg-black p-7 text-white md:p-9">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-500/25 blur-[110px]" />
        <div className="absolute bottom-[-150px] left-[30%] h-80 w-80 rounded-full bg-cyan-400/10 blur-[110px]" />
        <div className="relative">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-[9px] uppercase tracking-[.22em] text-blue-300">Learning</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-[-.06em] md:text-5xl">Course Studio.</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">Create courses, build lessons, attach resources and upload actual files before publishing.</p>
            </div>
            <Link href="/dashboard/learning/courses" className="rounded-[15px] bg-white px-4 py-2.5 text-[9px] font-semibold text-black">View learner library →</Link>
          </div>
        </div>
      </section>

      {message && <div className="rounded-[16px] bg-blue-500/10 px-4 py-3 text-[10px] text-blue-700">{message}</div>}

      <section className="grid gap-4 lg:grid-cols-[.8fr_1.2fr]">
        <div className="rounded-[28px] border border-white/80 bg-white/60 p-5 backdrop-blur-2xl md:p-6">
          <p className="text-[8px] uppercase tracking-[.18em] text-black/25">New course</p>
          <h2 className="mt-1 text-xl font-semibold">Create a course</h2>
          <form onSubmit={createCourse} className="mt-5 space-y-3">
            <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Course title" className="h-11 w-full rounded-[14px] bg-white px-3 text-[10px] outline-none" />
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} placeholder="Course description" className="w-full rounded-[14px] bg-white px-3 py-3 text-[10px] outline-none" />
            <select value={level} onChange={(e) => setLevel(e.target.value)} className="h-11 w-full rounded-[14px] bg-white px-3 text-[10px] outline-none">
              <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
            </select>
            <button disabled={busy === "course"} className="w-full rounded-[14px] bg-black py-3 text-[9px] font-semibold text-white disabled:opacity-40">{busy === "course" ? "Saving..." : "Create draft"}</button>
          </form>
        </div>

        <div className="rounded-[28px] border border-white/80 bg-white/60 p-5 backdrop-blur-2xl md:p-6">
          <div className="flex items-end justify-between gap-3">
            <div><p className="text-[8px] uppercase tracking-[.18em] text-black/25">Course catalog</p><h2 className="mt-1 text-xl font-semibold">{courses.length} courses</h2></div>
            <span className="text-[9px] text-black/30">{courses.filter((c) => c.published).length} published</span>
          </div>
          <div className="mt-5 grid gap-2 md:grid-cols-2">
            {courses.map((course) => (
              <button key={course.id} type="button" onClick={() => setSelectedId(course.id)} className={"rounded-[18px] border p-4 text-left transition " + (selectedId === course.id ? "border-blue-500/20 bg-blue-500/[.05]" : "border-black/5 bg-white/50 hover:bg-white")}>
                <div className="flex items-center justify-between gap-2"><p className="text-[10px] font-semibold">{course.title}</p><span className="rounded-full bg-black/[.04] px-2 py-1 text-[7px]">{course.published ? "Published" : "Draft"}</span></div>
                <p className="mt-2 text-[8px] text-black/30">{course._count.lessons} lessons · {course._count.resources} resources · {course._count.enrollments} enrolled</p>
              </button>
            ))}
            {courses.length === 0 && <p className="text-[10px] text-black/30 md:col-span-2">No courses yet. Create the first draft above.</p>}
          </div>
        </div>
      </section>

      {selected && (
        <>
          <section className="rounded-[30px] border border-white/80 bg-white/60 p-6 backdrop-blur-2xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-[8px] uppercase tracking-[.18em] text-black/25">Selected course</p>
                <h2 className="mt-1 text-2xl font-semibold">{selected.title}</h2>
                <p className="mt-2 max-w-2xl text-[10px] leading-5 text-black/40">{selected.description ?? "No description yet."}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => patchCourse({ published: !selected.published })} disabled={busy === "course"} className="rounded-[13px] bg-black px-4 py-2.5 text-[9px] font-semibold text-white">{selected.published ? "Unpublish" : "Publish course"}</button>
                <button onClick={deleteCourse} disabled={busy === "course"} className="rounded-[13px] bg-red-500/10 px-4 py-2.5 text-[9px] font-semibold text-red-600">Delete</button>
              </div>
            </div>
          </section>

          <section className="grid gap-4 xl:grid-cols-2">
            <div className="rounded-[30px] border border-white/80 bg-white/60 p-6 backdrop-blur-2xl">
              <p className="text-[8px] uppercase tracking-[.18em] text-black/25">Lessons</p>
              <h2 className="mt-1 text-xl font-semibold">Build the course structure</h2>
              <div className="mt-5 space-y-2">
                {selected.lessons.map((lesson) => <div key={lesson.id} className="rounded-[18px] bg-white/60 p-4"><div className="flex justify-between gap-3"><p className="text-[10px] font-semibold">{lesson.position}. {lesson.title}</p><span className="text-[8px] text-black/30">{lesson.duration ?? "—"} min</span></div></div>)}
              </div>
              <form onSubmit={createLesson} className="mt-5 space-y-3 border-t border-black/5 pt-5">
                <input required value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} placeholder="Lesson title" className="h-11 w-full rounded-[14px] bg-white px-3 text-[10px] outline-none" />
                <textarea value={lessonContent} onChange={(e) => setLessonContent(e.target.value)} rows={5} placeholder="Lesson content" className="w-full rounded-[14px] bg-white px-3 py-3 text-[10px] outline-none" />
                <input type="number" min="0" value={lessonDuration} onChange={(e) => setLessonDuration(e.target.value)} placeholder="Duration in minutes" className="h-11 w-full rounded-[14px] bg-white px-3 text-[10px] outline-none" />
                <button disabled={busy === "lesson"} className="w-full rounded-[14px] bg-black py-3 text-[9px] font-semibold text-white disabled:opacity-40">{busy === "lesson" ? "Adding..." : "Add lesson"}</button>
              </form>
            </div>

            <div className="rounded-[30px] border border-white/80 bg-white/60 p-6 backdrop-blur-2xl">
              <p className="text-[8px] uppercase tracking-[.18em] text-black/25">Resources</p>
              <h2 className="mt-1 text-xl font-semibold">Attach references</h2>
              <div className="mt-5 space-y-2">
                {selected.resources.map((resource) => <a key={resource.id} href={resource.url ?? "#"} target="_blank" rel="noreferrer" className="block rounded-[18px] bg-white/60 p-4 hover:bg-white"><p className="text-[10px] font-semibold">{resource.title}</p><p className="mt-1 text-[8px] text-black/30">{resource.type}</p></a>)}
              </div>
              <form onSubmit={createResource} className="mt-5 space-y-3 border-t border-black/5 pt-5">
                <input required value={resourceTitle} onChange={(e) => setResourceTitle(e.target.value)} placeholder="Resource title" className="h-11 w-full rounded-[14px] bg-white px-3 text-[10px] outline-none" />
                <input required value={resourceUrl} onChange={(e) => setResourceUrl(e.target.value)} placeholder="https://..." className="h-11 w-full rounded-[14px] bg-white px-3 text-[10px] outline-none" />
                <input value={resourceType} onChange={(e) => setResourceType(e.target.value)} placeholder="Reference" className="h-11 w-full rounded-[14px] bg-white px-3 text-[10px] outline-none" />
                <button disabled={busy === "resource"} className="w-full rounded-[14px] bg-black py-3 text-[9px] font-semibold text-white disabled:opacity-40">{busy === "resource" ? "Adding..." : "Add resource"}</button>
              </form>
            </div>
          </section>

          <section className="rounded-[30px] border border-white/80 bg-white/60 p-6 backdrop-blur-2xl">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div><p className="text-[8px] uppercase tracking-[.18em] text-black/25">Files</p><h2 className="mt-1 text-xl font-semibold">Course file library</h2><p className="mt-2 text-[9px] text-black/30">Upload PDFs, slides, images, documents and other course materials up to 15 MB each.</p></div>
              <label className="cursor-pointer rounded-[14px] bg-black px-4 py-2.5 text-[9px] font-semibold text-white">{busy === "file" ? "Uploading..." : "Upload file"}<input type="file" className="hidden" onChange={uploadFile} disabled={busy === "file"} /></label>
            </div>
            <div className="mt-5 grid gap-2 md:grid-cols-2">
              {files.map((file) => (
                <div key={file.id} className="flex items-center gap-3 rounded-[18px] bg-white/60 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[13px] bg-black text-[9px] font-semibold text-white">FILE</div>
                  <div className="min-w-0 flex-1"><p className="truncate text-[10px] font-semibold">{file.fileName}</p><p className="mt-1 text-[8px] text-black/30">{prettyBytes(file.sizeBytes)} · {file.mimeType}</p></div>
                  <div className="flex shrink-0 gap-2"><a href={"/api/uploads/" + file.id} target="_blank" rel="noreferrer" className="rounded-[10px] bg-blue-500/10 px-2.5 py-2 text-[8px] font-semibold text-blue-600">Open</a><button onClick={() => deleteFile(file.id)} className="rounded-[10px] bg-red-500/10 px-2.5 py-2 text-[8px] font-semibold text-red-600">Delete</button></div>
                </div>
              ))}
              {files.length === 0 && <p className="rounded-[18px] bg-black/[.025] p-6 text-[10px] text-black/30 md:col-span-2">No files uploaded yet.</p>}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
