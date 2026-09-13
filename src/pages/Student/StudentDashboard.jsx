import { useEffect, useState } from "react";
import {
  Alert, Avatar, Box, Card, CardContent, Chip, CircularProgress,
  Divider, Grid, LinearProgress, Paper, Typography,
} from "@mui/material";
import SchoolIcon      from "@mui/icons-material/School";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon      from "@mui/icons-material/Cancel";
import MenuBookIcon    from "@mui/icons-material/MenuBook";
import TodayIcon       from "@mui/icons-material/Today";
import PercentIcon     from "@mui/icons-material/Percent";
import http from "../../http-common";

const attendanceColor = (pct) =>
  pct >= 75 ? "#2E7D32" : pct >= 60 ? "#F57C00" : "#C62828";

const attendanceBg = (pct) =>
  pct >= 75 ? "#E8F5E9" : pct >= 60 ? "#FFF3E0" : "#FFEBEE";

const MetricCard = ({ title, value, subtitle, icon, color, bg }) => (
  <Card elevation={3} sx={{ borderRadius: 3, borderTop: `4px solid ${color}`, height: "100%" }}>
    <CardContent>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
            {title}
          </Typography>
          <Typography variant="h3" fontWeight={800} sx={{ color, mt: 0.5 }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" mt={0.5}>{subtitle}</Typography>
          )}
        </Box>
        <Avatar sx={{ bgcolor: bg, color, width: 48, height: 48 }}>{icon}</Avatar>
      </Box>
    </CardContent>
  </Card>
);

const StudentDashboard = () => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    http.get("/student/dashboard")
      .then((res) => {
        if (res.data) setData(res.data);
        else setError("No data returned from server");
      })
      .catch((err) => {
        const msg = err?.response?.data?.error || err.message || "Failed to load dashboard";
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
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!data) return null;

  const { profile, summary } = data;
  const fullName = [profile?.fname, profile?.mname, profile?.sname].filter(Boolean).join(" ");
  const initials = [profile?.fname?.[0], profile?.sname?.[0]].filter(Boolean).join("").toUpperCase();
  const pct      = summary?.overallPct ?? 0;
  const color    = attendanceColor(pct);
  const bg       = attendanceBg(pct);

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>

      {/* Welcome banner */}
      <Paper elevation={0} sx={{
        p: 3, mb: 3, borderRadius: 3,
        background: "linear-gradient(135deg, #1565C0 0%, #1976D2 60%, #42A5F5 100%)",
        color: "#fff", display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap",
      }}>
        <Avatar sx={{ width: 72, height: 72, fontSize: 28, fontWeight: 700,
          bgcolor: "rgba(255,255,255,0.25)", color: "#fff" }}>
          {initials || <SchoolIcon fontSize="large" />}
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" fontWeight={800}>
            Welcome back, {profile?.fname || "Student"}! 👋
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
            {profile?.course || "—"} &nbsp;·&nbsp; Semester {profile?.sem || "—"}
            &nbsp;·&nbsp; Enroll: {profile?.enroll || "—"}
          </Typography>
        </Box>
        <Chip label={`${pct}% Overall`}
          sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "#fff", fontWeight: 700, fontSize: "1rem", px: 1, height: 36 }}
        />
      </Paper>

      {/* Metric cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard title="Overall Attendance" value={`${pct}%`}
            subtitle={pct >= 75 ? "✅ Above threshold" : "⚠️ Below 75% threshold"}
            icon={<PercentIcon />} color={color} bg={bg} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard title="Total Subjects" value={summary?.totalSubjects ?? 0}
            subtitle="enrolled this semester" icon={<MenuBookIcon />}
            color="#1565C0" bg="#E3F2FD" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard title="Classes Attended" value={summary?.totalPresent ?? 0}
            subtitle={`out of ${summary?.totalClasses ?? 0} total`}
            icon={<CheckCircleIcon />} color="#2E7D32" bg="#E8F5E9" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard title="Classes Missed" value={summary?.totalAbsent ?? 0}
            subtitle="across all subjects" icon={<CancelIcon />}
            color="#C62828" bg="#FFEBEE" />
        </Grid>
      </Grid>

      {/* Progress bar */}
      <Paper elevation={2} sx={{ p: 2.5, mb: 3, borderRadius: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="subtitle2" fontWeight={700}>Overall Attendance Progress</Typography>
          <Typography variant="subtitle2" fontWeight={700} sx={{ color }}>{pct}%</Typography>
        </Box>
        <LinearProgress variant="determinate" value={Math.min(pct, 100)}
          sx={{ height: 12, borderRadius: 6, bgcolor: bg,
            "& .MuiLinearProgress-bar": { bgcolor: color, borderRadius: 6 } }} />
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 0.5 }}>
          <Typography variant="caption" color="text.secondary">Minimum required: 75%</Typography>
        </Box>
      </Paper>

      {/* Today's lectures */}
      <Paper elevation={2} sx={{ p: 2.5, borderRadius: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <TodayIcon color="primary" />
          <Typography variant="subtitle1" fontWeight={700}>Today's Classes</Typography>
          <Chip label={new Date().toLocaleDateString("en-IN",
            { weekday: "long", day: "numeric", month: "short" })}
            size="small" variant="outlined" color="primary" />
        </Box>

        {!summary?.todayLectures?.length ? (
          <Box sx={{ py: 4, textAlign: "center", color: "text.secondary" }}>
            <TodayIcon sx={{ fontSize: 48, opacity: 0.3 }} />
            <Typography variant="body2" mt={1}>No lectures recorded for today yet.</Typography>
          </Box>
        ) : (
          summary.todayLectures.map((lec, i) => (
            <Box key={i}>
              {i > 0 && <Divider sx={{ my: 1 }} />}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 0.5 }}>
                <Box>
                  <Typography variant="body2" fontWeight={700}>{lec.subject}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {lec.facultyName} &nbsp;·&nbsp; Lecture {lec.lectureNo}
                  </Typography>
                </Box>
                <Chip label={lec.status} size="small" sx={{
                  fontWeight: 700,
                  bgcolor: lec.status === "Present" ? "#E8F5E9" : lec.status === "Absent" ? "#FFEBEE" : "#F5F5F5",
                  color:   lec.status === "Present" ? "#2E7D32" : lec.status === "Absent" ? "#C62828" : "#757575",
                }} />
              </Box>
            </Box>
          ))
        )}
      </Paper>
    </Box>
  );
};

export default StudentDashboard;
