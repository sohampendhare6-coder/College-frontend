import { useEffect, useState } from "react";
import {
  Alert, Box, Card, CardContent, Chip, CircularProgress,
  LinearProgress, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Typography,
} from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import http from "../../http-common";

const statusConfig = (pct) => {
  if (pct >= 85) return { label: "Excellent", color: "#2E7D32", bg: "#E8F5E9" };
  if (pct >= 75) return { label: "Good",      color: "#1565C0", bg: "#E3F2FD" };
  if (pct >= 60) return { label: "Warning",   color: "#F57C00", bg: "#FFF3E0" };
  return               { label: "Critical",  color: "#C62828", bg: "#FFEBEE" };
};

const pctColor = (pct) =>
  pct >= 75 ? "#2E7D32" : pct >= 60 ? "#F57C00" : "#C62828";

const StudentAttendance = () => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    http.get("/student/attendance")
      .then((res) => {
        if (res.data) setData(res.data);
        else setError("No data returned from server");
      })
      .catch((err) => {
        const msg = err?.response?.data?.error || err.message || "Failed to load attendance";
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
      </Box>
    );
  }

  if (!data) return null;

  const { branch, semester, attendance = [] } = data;
  const totalPresent = attendance.reduce((s, r) => s + (r.present || 0), 0);
  const totalClasses = attendance.reduce((s, r) => s + (r.total   || 0), 0);
  const overallPct   = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
        <MenuBookIcon color="primary" sx={{ fontSize: 30 }} />
        <Box>
          <Typography variant="h5" fontWeight={800}>My Attendance</Typography>
          <Typography variant="body2" color="text.secondary">
            {branch || "—"} &nbsp;·&nbsp; Semester {semester || "—"}
          </Typography>
        </Box>
      </Box>

      {/* Overall card */}
      <Card elevation={3} sx={{ mb: 3, borderRadius: 3, borderTop: `4px solid ${pctColor(overallPct)}` }}>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
            <Typography variant="subtitle1" fontWeight={700}>Overall Attendance</Typography>
            <Typography variant="h4" fontWeight={800} sx={{ color: pctColor(overallPct) }}>
              {overallPct}%
            </Typography>
          </Box>
          <LinearProgress variant="determinate" value={Math.min(overallPct, 100)}
            sx={{ height: 10, borderRadius: 5,
              bgcolor: overallPct >= 75 ? "#E8F5E9" : overallPct >= 60 ? "#FFF3E0" : "#FFEBEE",
              "& .MuiLinearProgress-bar": { bgcolor: pctColor(overallPct), borderRadius: 5 } }} />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {totalPresent} present out of {totalClasses} total classes
            </Typography>
            <Typography variant="caption" color="text.secondary">Min required: 75%</Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Subject table */}
      {attendance.length === 0 ? (
        <Paper elevation={1} sx={{ p: 5, textAlign: "center", borderRadius: 3 }}>
          <MenuBookIcon sx={{ fontSize: 56, opacity: 0.25 }} />
          <Typography variant="h6" mt={2} color="text.secondary">
            No attendance records found yet.
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Attendance will appear here once your faculty marks it.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#1565C0" }}>
                {["#", "Subject", "Faculty", "Total", "Present", "Absent", "Attendance %", "Status"].map(
                  (h) => <TableCell key={h} sx={{ color: "#fff", fontWeight: 700, py: 1.5 }}>{h}</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {attendance.map((row, i) => {
                const st = statusConfig(row.pct ?? 0);
                return (
                  <TableRow key={i}
                    sx={{ "&:nth-of-type(even)": { bgcolor: "#F9FAFB" }, "&:hover": { bgcolor: "#EEF2FF" } }}>
                    <TableCell sx={{ color: "text.secondary", fontWeight: 600 }}>{i + 1}</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{row.subject}</TableCell>
                    <TableCell>{row.facultyName}</TableCell>
                    <TableCell align="center">{row.total}</TableCell>
                    <TableCell align="center" sx={{ color: "#2E7D32", fontWeight: 700 }}>{row.present}</TableCell>
                    <TableCell align="center" sx={{ color: "#C62828", fontWeight: 700 }}>{row.absent}</TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight={800} sx={{ color: pctColor(row.pct ?? 0) }}>
                        {row.pct ?? 0}%
                      </Typography>
                      <LinearProgress variant="determinate" value={Math.min(row.pct ?? 0, 100)}
                        sx={{ height: 5, borderRadius: 3, mt: 0.5, bgcolor: "#F0F0F0",
                          "& .MuiLinearProgress-bar": { bgcolor: pctColor(row.pct ?? 0), borderRadius: 3 } }} />
                    </TableCell>
                    <TableCell>
                      <Chip label={st.label} size="small"
                        sx={{ bgcolor: st.bg, color: st.color, fontWeight: 700, fontSize: "0.7rem" }} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default StudentAttendance;
