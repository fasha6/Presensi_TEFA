import type { DemoRole } from "./auth";

export const secretaryAssignment = {
  className: "XII RPL 1",
  assignedBy: "Bu Sari",
  assignmentLabel: "Hak akses sekretaris kelas dari wali kelas",
};

export const teacherScheduleToday = [
  {
    className: "XI RPL 1",
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
    className: "XII RPL 2",
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
    className: "XI RPL 2",
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
  if (role === "secretary" || role === "homeroom") {
    return secretaryAssignment.className;
  }

  if (role === "teacher") {
    return teacherScheduleToday[0].className;
  }

  return "";
}

export function getAllowedClassesForRole(role?: DemoRole | null) {
  if (role === "secretary" || role === "homeroom") {
    return [secretaryAssignment.className];
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
