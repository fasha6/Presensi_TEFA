import type { DemoRole } from "./auth";

export const schoolMajors = ["AKL", "PM", "MPL", "TLG", "TKF", "TLM", "DKV", "TET", "PPL", "TJK"] as const;

export const schoolClasses = [
  "X AKL 1", "X AKL 2", "X AKL 3",
  "XI AKL 1", "XI AKL 2", "XI AKL 3",
  "XII AKL 1", "XII AKL 2", "XII AKL 3",
  "X PM 1", "X PM 2",
  "XI PM 1", "XI PM 2",
  "XII PM 1", "XII PM 2",
  "X MPL 1", "X MPL 2", "X MPL 3",
  "XI MPL 1", "XI MPL 2", "XI MPL 3",
  "XII MPL 1", "XII MPL 2", "XII MPL 3",
  "X TLG 1", "X TLG 2",
  "XI TLG 1", "XI TLG 2",
  "XII TLG 1", "XII TLG 2",
  "X TKF 1", "X TKF 2", "X TKF 3",
  "XI TKF 1", "XI TKF 2", "XI TKF 3",
  "XII TKF 1", "XII TKF 2", "XII TKF 3",
  "X TLM 1", "X TLM 2",
  "XI TLM 1", "XI TLM 2",
  "XII TLM 1", "XII TLM 2",
  "X DKV 1", "X DKV 2", "X DKV 3",
  "XI DKV 1", "XI DKV 2", "XI DKV 3",
  "XII DKV 1", "XII DKV 2", "XII DKV 3",
  "X TET 1",
  "XI TET 1",
  "XII TET 1",
  "X PPL 1", "X PPL 2",
  "XI PPL 1", "XI PPL 2",
  "XII PPL 1", "XII PPL 2",
  "X TJK 1", "X TJK 2", "X TJK 3",
  "XI TJK 1", "XI TJK 2", "XI TJK 3",
  "XII TJK 1", "XII TJK 2", "XII TJK 3",
] as const;

export const secretaryAssignment = {
  className: "X PPL 1",
  assignedBy: "Bu Sari",
  assignmentLabel: "Hak akses sekretaris kelas dari wali kelas",
};

export const homeroomAssignment = {
  className: "X PPL 1",
  major: "PPL",
  assignedBy: "Operator Sekolah",
  assignmentLabel: "Hak akses wali kelas dari operator",
};

export const teacherScheduleToday = [
  {
    className: "XI PPL 1",
    subject: "PWPB",
    session: "1",
    time: "07:30 - 09:00",
    totalStudents: 36,
    present: 32,
    late: 2,
    absent: 2,
    status: "current",
  },
  {
    className: "XI PPL 2",
    subject: "PBO",
    session: "3",
    time: "09:15 - 10:45",
    totalStudents: 34,
    present: 30,
    late: 1,
    absent: 3,
    status: "upcoming",
  },
  {
    className: "XII TJK 3",
    subject: "Basis Data",
    session: "5",
    time: "11:00 - 12:30",
    totalStudents: 35,
    present: 31,
    late: 2,
    absent: 2,
    status: "upcoming",
  },
] as const;

export function getDefaultClassForRole(role?: DemoRole | null) {
  if (role === "secretary") {
    return secretaryAssignment.className;
  }

  if (role === "homeroom") {
    return homeroomAssignment.className;
  }

  if (role === "teacher") {
    return teacherScheduleToday[0].className;
  }

  return "";
}

export function getAllowedClassesForRole(role?: DemoRole | null) {
  if (role === "secretary") {
    return [secretaryAssignment.className];
  }

  if (role === "homeroom") {
    return [homeroomAssignment.className];
  }

  if (role === "teacher") {
    return teacherScheduleToday.map((schedule) => schedule.className);
  }

  return null;
}

export function isClassAllowedForRole(className: string, role?: DemoRole | null) {
  const allowedClasses = getAllowedClassesForRole(role);

  return !allowedClasses || allowedClasses.includes(className);
}

export function getTeacherScheduleByClass(className: string) {
  return teacherScheduleToday.find((schedule) => schedule.className === className);
}
