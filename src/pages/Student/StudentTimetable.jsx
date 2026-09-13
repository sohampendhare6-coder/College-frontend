import { useEffect, useState } from "react";
import {
  Alert, Box, Card, Chip, CircularProgress, Divider,
  Grid, Paper, Typography,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon    from "@mui/icons-material/AccessTime";
import PersonIcon        from "@mui/icons-material/Person";
import http from "../../http-common";

const DAYS  = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const SLOTS = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM"];

const DAY_COLORS = {
  Monday:    { bg: "#E3F2FD", border: "#1565C0", text: "#1565C0" },
  Tuesday:   { bg: "#F3E5F5", border: "#7B1FA2", text: "#7B1FA2" },
  Wednesday: { bg: "#E8F5E9", border: "#2E7D32", text: "#2E7D32" },
  Thursday:  { bg: "#FFF3E0", border: "#E65100", text: "#E65100" },
  Friday:    { bg: "#FCE4EC", border: "#AD1457", text: "#AD1457" },
};

const buildTimetable = (subjects) => {
  const grid = Object.fromEntries(DAYS.map((d) => [d, []]));
  (subjects || []).forEach((s, i) => {
    const day  = DAYS[i % DAYS.length];
    const slot = SLOTS[Math.floor(i / DAYS.length) % SLOTS.length];
    grid[day].push({ subject: s.subject, facultyName: s.facultyName, slot });
  });
  return grid;
};

const StudentTimetable = () => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    http.get("/student/timetable")
      .then((res) => {
        if (res.data) setData(res.data);
        else setError("No data returned from server");
      })
      .catch((err) => {
        const msg = err?.response?.data?.error || err.message || "Failed to load timetable";
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

  const { branch, semester, timetable: subjects = [] } = data;
  const grid  = buildTimetable(subjects);
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
        <CalendarMonthIcon color="primary" sx={{ fontSize: 30 }} />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h5" fontWeight={800}>Weekly Timetable</Typography>
          <Typography variant="body2" color="text.secondary">
            {branch || "—"} &nbsp;·&nbsp; Semester {semester || "—"}
          </Typography>
        </Box>
        <Chip label={`Today: ${today}`} color="primary" variant="outlined" size="small" sx={{ fontWeight: 700 }} />
      </Box>

      {subjects.length === 0 ? (
        <Paper elevation={1} sx={{ p: 5, textAlign: "center", borderRadius: 3 }}>
          <CalendarMonthIcon sx={{ fontSize: 56, opacity: 0.25 }} />
          <Typography variant="h6" mt={2} color="text.secondary">
            No subjects allocated for this semester yet.
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            Ask your admin to set up faculty allocations.
          </Typography>
        </Paper>
      ) : (
        <>
          <Grid container spacing={2}>
            {DAYS.map((day) => {
              const cfg     = DAY_COLORS[day];
              const isToday = day === today;
              const classes = grid[day];
              return (
                <Grid item xs={12} sm={6} md={2.4} key={day}>
                  <Paper elevation={isToday ? 4 : 2}
                    sx={{ borderRadius: 3, overflow: "hidden",
                      border: isToday ? `2px solid ${cfg.border}` : "1px solid #E0E0E0",
                      height: "100%" }}>
                    <Box sx={{ bgcolor: isToday ? cfg.border : cfg.bg,
                      py: 1.5, px: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Typography variant="subtitle2" fontWeight={800}
                        sx={{ color: isToday ? "#fff" : cfg.text }}>{day}</Typography>
                      {isToday && (
                        <Chip label="Today" size="small"
                          sx={{ bgcolor: "rgba(255,255,255,0.25)", color: "#fff", fontWeight: 700, height: 20, fontSize: "0.65rem" }} />
                      )}
                    </Box>
                    <Box sx={{ p: 1.5 }}>
                      {classes.length === 0 ? (
                        <Box sx={{ py: 3, textAlign: "center" }}>
                          <Typography variant="caption" color="text.disabled">No classes</Typography>
                        </Box>
                      ) : (
                        classes.map((cls, j) => (
                          <Box key={j}>
                            {j > 0 && <Divider sx={{ my: 1 }} />}
                            <Card elevation={0}
                              sx={{ bgcolor: cfg.bg, borderLeft: `3px solid ${cfg.border}`, borderRadius: 1.5, p: 1 }}>
                              <Typography variant="body2" fontWeight={700}
                                sx={{ color: cfg.text, lineHeight: 1.3 }}>{cls.subject}</Typography>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                                <PersonIcon sx={{ fontSize: 12, color: "text.secondary" }} />
                                <Typography variant="caption" color="text.secondary">{cls.facultyName}</Typography>
                              </Box>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.3 }}>
                                <AccessTimeIcon sx={{ fontSize: 12, color: "text.secondary" }} />
                                <Typography variant="caption" color="text.secondary">{cls.slot}</Typography>
                              </Box>
                            </Card>
                          </Box>
                        ))
                      )}
                    </Box>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
          <Paper elevation={0}
            sx={{ mt: 3, p: 2, borderRadius: 2, bgcolor: "#F8F9FA", border: "1px solid #E0E0E0" }}>
            <Typography variant="caption" color="text.secondary">
              ℹ️ &nbsp;Time slots are auto-arranged from faculty allocations.
            </Typography>
          </Paper>
        </>
      )}
    </Box>
  );
};

export default StudentTimetable;
