import { NextResponse } from "next/server";
import xlsx from "node-xlsx";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

type ImportRow = {
  studentId: string;
  subjectCode: string;
  term: string;
  assessment: string;
  score: number;
  maxScore: number;
  published: boolean;
};

function text(value: unknown) {
  return String(value ?? "").trim();
}

function numberValue(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : NaN;
}

function booleanValue(value: unknown) {
  const normalized = text(value).toLowerCase();
  return normalized === "true" || normalized === "1" || normalized === "yes";
}

function parseWorkbook(buffer: Buffer): ImportRow[] {
  const sheets = xlsx.parse(buffer);
  const rows = sheets[0]?.data ?? [];

  if (rows.length < 2) {
    throw new Error("The spreadsheet must contain a header row and data rows.");
  }

  const header = rows[0].map((value: unknown) =>
    text(value).toLowerCase().replace(/\s+/g, "_")
  );

  const indexOf = (...names: string[]) =>
    names.map((name) => header.indexOf(name)).find((index) => index >= 0) ?? -1;

  const indexes = {
    studentId: indexOf("student_id", "studentid", "school_id"),
    subjectCode: indexOf("subject_code", "subjectcode", "subject"),
    term: indexOf("term", "academic_term"),
    assessment: indexOf("assessment", "assessment_name"),
    score: indexOf("score", "mark"),
    maxScore: indexOf("max_score", "maxscore", "maximum"),
    published: indexOf("published", "is_published"),
  };

  const missing = Object.entries(indexes)
    .filter(([key, index]) => index < 0 && key !== "published")
    .map(([key]) => key);

  if (missing.length) {
    throw new Error(
      `Missing required columns: ${missing.join(", ")}. Required columns are student_id, subject_code, term, assessment, score, max_score.`
    );
  }

  return rows.slice(1).map((row) => ({
    studentId: text(row[indexes.studentId]),
    subjectCode: text(row[indexes.subjectCode]).toUpperCase(),
    term: text(row[indexes.term]),
    assessment: text(row[indexes.assessment]),
    score: numberValue(row[indexes.score]),
    maxScore: numberValue(row[indexes.maxScore]),
    published:
      indexes.published >= 0 ? booleanValue(row[indexes.published]) : false,
  }));
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (![UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(session.user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const mode =
    new URL(request.url).searchParams.get("mode") === "commit"
      ? "commit"
      : "preview";

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Spreadsheet file is required." }, { status: 400 });
  }

  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "Maximum file size is 10 MB." }, { status: 400 });
  }

  try {
    const rows = parseWorkbook(Buffer.from(await file.arrayBuffer()));

    const errors: string[] = [];
    const keys = new Set<string>();
    const validRows: ImportRow[] = [];

    for (let index = 0; index < rows.length; index += 1) {
      const row = rows[index];
      const rowNumber = index + 2;

      if (!row.studentId || !row.subjectCode || !row.term || !row.assessment) {
        errors.push(`Row ${rowNumber}: missing required values.`);
        continue;
      }

      if (
        !Number.isFinite(row.score) ||
        !Number.isFinite(row.maxScore) ||
        row.maxScore <= 0 ||
        row.score < 0 ||
        row.score > row.maxScore
      ) {
        errors.push(`Row ${rowNumber}: score must be between 0 and max_score.`);
        continue;
      }

      const key = [
        row.studentId,
        row.subjectCode,
        row.term,
        row.assessment,
      ].join("|");

      if (keys.has(key)) {
        errors.push(`Row ${rowNumber}: duplicate grade row.`);
        continue;
      }

      keys.add(key);
      validRows.push(row);
    }

    if (validRows.length) {
      const [studentCount, subjectCount] = await Promise.all([
        prisma.user.count({
          where: {
            schoolId: { in: [...new Set(validRows.map((row) => row.studentId))] },
            isActive: true,
          },
        }),
        prisma.subject.count({
          where: { code: { in: [...new Set(validRows.map((row) => row.subjectCode))] } },
        }),
      ]);

      const uniqueStudents = new Set(validRows.map((row) => row.studentId)).size;
      const uniqueSubjects = new Set(validRows.map((row) => row.subjectCode)).size;

      if (studentCount !== uniqueStudents) {
        errors.push("One or more student IDs do not match active school accounts.");
      }

      if (subjectCount !== uniqueSubjects) {
        errors.push("One or more subject codes do not exist.");
      }
    }

    if (mode === "commit" && errors.length > 0) {
      return NextResponse.json(
        { error: "Import blocked. Fix validation errors first.", errors, rows: validRows.length },
        { status: 422 }
      );
    }

    if (mode === "commit" && validRows.length > 0) {
      const studentIds = [...new Set(validRows.map((row) => row.studentId))];
      const subjectCodes = [...new Set(validRows.map((row) => row.subjectCode))];

      const [students, subjects] = await Promise.all([
        prisma.user.findMany({
          where: { schoolId: { in: studentIds }, isActive: true },
          select: { id: true, schoolId: true },
        }),
        prisma.subject.findMany({
          where: { code: { in: subjectCodes } },
          select: { id: true, code: true },
        }),
      ]);

      const studentMap = new Map(students.map((item) => [item.schoolId as string, item.id]));
      const subjectMap = new Map(subjects.map((item) => [item.code, item.id]));

      const result = await prisma.$transaction(async (tx) => {
        let imported = 0;

        for (const row of validRows) {
          const userId = studentMap.get(row.studentId);
          const subjectId = subjectMap.get(row.subjectCode);

          if (!userId || !subjectId) continue;

          const existing = await tx.grade.findFirst({
            where: {
              userId,
              subjectId,
              term: row.term,
              assessment: row.assessment,
            },
            select: { id: true },
          });

          if (existing) {
            await tx.grade.update({
              where: { id: existing.id },
              data: {
                score: row.score,
                maxScore: row.maxScore,
                published: row.published,
              },
            });
          } else {
            await tx.grade.create({
              data: {
                userId,
                subjectId,
                term: row.term,
                assessment: row.assessment,
                score: row.score,
                maxScore: row.maxScore,
                published: row.published,
              },
            });
          }

          imported += 1;
        }

        await tx.auditLog.create({
          data: {
            actorId: session.user.id,
            action: "GRADES_IMPORT",
            entity: "Grade",
            metadata: {
              imported,
              sourceFile: file.name,
              mode,
            },
          },
        });

        return imported;
      });

      return NextResponse.json({
        ok: true,
        mode,
        imported: result,
        errors: [],
      });
    }

    return NextResponse.json({
      ok: true,
      mode,
      preview: {
        totalRows: rows.length,
        validRows: validRows.length,
        errors,
        sample: validRows.slice(0, 25),
      },
    });
  } catch (error) {
    console.error("Grade import error", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not read the spreadsheet." },
      { status: 400 }
    );
  }
}
