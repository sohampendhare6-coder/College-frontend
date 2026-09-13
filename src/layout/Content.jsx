import { Route, Routes, Navigate } from "react-router-dom";
import { useAuthContext } from "../context";

// ── Admin / shared pages ──────────────────────────────────────────────────────
import Users               from "../components/users";
import StudentCollection   from "../pages/students/Student";
import BranchCollection    from "../pages/Branch/Branch";
import AttendenceCollection from "../pages/Attendance/AttendenceIndex";
import FacultyCollection   from "../pages/Faculty/Faculty";
import AllocationCollection from "../pages/Allocation/Allocation";
import AttendanceReport    from "../pages/Attendance/AttendanceReport";
import GraphDashboard      from "../pages/Graph/GraphDashboard";

// ── Student portal pages ──────────────────────────────────────────────────────
import StudentDashboard    from "../pages/Student/StudentDashboard";
import StudentAttendance   from "../pages/Student/StudentAttendance";
import StudentTimetable    from "../pages/Student/StudentTimetable";
import StudentProfile      from "../pages/Student/StudentProfile";

const Content = () => {
  const { user } = useAuthContext();

  // ── Faculty ───────────────────────────────────────────────────────────────
  if (user === "faculty") {
    return (
      <Routes>
        <Route path="/attendance" element={<AttendenceCollection />} />
        <Route path="/branch"     element={<BranchCollection />} />
        <Route path="/student"    element={<StudentCollection />} />
        <Route path="/report"     element={<AttendanceReport />} />
        <Route path="/graph"      element={<GraphDashboard />} />
        <Route path="*"           element={<Navigate to="/attendance" replace />} />
      </Routes>
    );
  }

  // ── Student portal ────────────────────────────────────────────────────────
  if (user === "student") {
    return (
      <Routes>
        <Route path="/student/dashboard"  element={<StudentDashboard />} />
        <Route path="/student/attendance" element={<StudentAttendance />} />
        <Route path="/student/timetable"  element={<StudentTimetable />} />
        <Route path="/student/profile"    element={<StudentProfile />} />
        {/* Legacy short paths → redirect to new sub-paths */}
        <Route path="/attendance" element={<Navigate to="/student/attendance" replace />} />
        <Route path="/profile"    element={<Navigate to="/student/profile"    replace />} />
        {/* Default landing for student */}
        <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
      </Routes>
    );
  }

  // ── Admin ─────────────────────────────────────────────────────────────────
  return (
    <Routes>
      <Route path="/"           element={<Users />} />
      <Route path="/users"      element={<Users />} />
      <Route path="/student"    element={<StudentCollection />} />
      <Route path="/branch"     element={<BranchCollection />} />
      <Route path="/faculty"    element={<FacultyCollection />} />
      <Route path="/allocation" element={<AllocationCollection />} />
      <Route path="/report"     element={<AttendanceReport />} />
      <Route path="/graph"      element={<GraphDashboard />} />
      <Route path="*"           element={<Navigate to="/users" replace />} />
    </Routes>
  );
};

export default Content;
