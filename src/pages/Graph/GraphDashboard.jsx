import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import BarChartIcon        from "@mui/icons-material/BarChart";
import CheckCircleIcon     from "@mui/icons-material/CheckCircle";
import CancelIcon          from "@mui/icons-material/Cancel";
import GroupIcon           from "@mui/icons-material/Group";
import MenuBookIcon        from "@mui/icons-material/MenuBook";
import PercentIcon         from "@mui/icons-material/Percent";
import WarningAmberIcon    from "@mui/icons-material/WarningAmber";
import RefreshIcon         from "@mui/icons-material/Refresh";
import IconButton          from "@mui/material/IconButton";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartTooltip,
  XAxis,
  YAxis,
} from "recharts";

import http from "../../http-common";
import { useAuthContext } from "../../context";

// ── Colour helpers ────────────────────────────────────────────────────────────
const pctColor  = (p) => (p >= 75 ? "#2E7D32" : p >= 60 ? "#F57C00" : "#C62828");
const pctBg     = (p) => (p >= 75 ? "#E8F5E9" : p >= 60 ? "#FFF3E0" : "#FFEBEE");
const barColor  = (p) => (p >= 75 ? "#43A047" : p >= 60 ? "#FB8C00" : "#E53935");
const DOUGHNUT  = ["#1565C0", "#EF5350"];

// ── Metric card ───────────────────────────────────────────────────────────────
const MetricCard = ({ title, value, icon, color, bg, subtitle }) => (
  <Card elevation={3} sx={{ borderRadius: 3, borderTop: `4px solid ${color}`, height: "100%" }}>
    <CardContent>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={700} textTransform="uppercase">
            {title}
          </Typography>
          <Typography variant="h4" fontWeight={800} sx={{ color, mt: 0.5 }}>
            {value ?? "—"}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">{subtitle}</Typography>
          )}
        </Box>
        <Avatar sx={{ bgcolor: bg, color, width: 44, height: 44 }}>{icon}</Avatar>
      </Box>
    </CardContent>
  </Card>
);

// ── Skeleton card ─────────────────────────────────────────────────────────────
const CardSkeleton = () => (
  <Card elevation={2} sx={{ borderRadius: 3, height: "100%" }}>
    <CardContent>
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="40%" height={48} />
      <Skeleton variant="text" width="80%" />
    </CardContent>
  </Card>
);

// ── Chart skeleton ────────────────────────────────────────────────────────────
const ChartSkeleton = ({ height = 300 }) => (
  <Skeleton variant="rectangular" width="100%" height={height} sx={{ borderRadius: 2 }} />
);

// ── Empty chart state ─────────────────────────────────────────────────────────
const EmptyChart = ({ height = 300, message = "No attendance records found for the selected filters" }) => (
  <Box sx={{ height, display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", color: "text.secondary" }}>
    <BarChartIcon sx={{ fontSize: 56, opacity: 0.2, mb: 1 }} />
    <Typography variant="body2">{message}</Typography>
  </Box>
);

// ── Custom Recharts tooltip ───────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <Paper elevation={4} sx={{ p: 1.5, borderRadius: 2, minWidth: 140 }}>
      <Typography variant="caption" fontWeight={700}>{label}</Typography>
      {payload.map((p, i) => (
        <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.3 }}>
          <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: p.color }} />
          <Typography variant="caption">{p.name}: <b>{p.value}{p.name === "%" ? "%" : ""}</b></Typography>
        </Box>
      ))}
    </Paper>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────
const GraphDashboard = () => {
  const { user } = useAuthContext();
  const isAdmin   = user !== "faculty";
  const isFaculty = user === "faculty";

  // ── Filter state ──────────────────────────────────────────────────────────
  const [filters, setFilters] = useState({
    branch:    "",
    semester:  "",
    subject:   "",
    dateRange: "all",   // "7d" | "30d" | "all"
    startDate: "",
    endDate:   "",
  });

  // ── Dropdown option lists ─────────────────────────────────────────────────
  const [branchOptions,  setBranchOptions]  = useState([]);
  const [semOptions,     setSemOptions]     = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);

  // ── Data state ────────────────────────────────────────────────────────────
  const [overview,     setOverview]     = useState(null);
  const [trend,        setTrend]        = useState([]);
  const [subjects,     setSubjects]     = useState([]);
  const [branches,     setBranches]     = useState([]);
  const [defaulters,   setDefaulters]   = useState([]);

  // ── Loading / error ───────────────────────────────────────────────────────
  const [loadingOverview,   setLoadingOverview]   = useState(true);
  const [loadingCharts,     setLoadingCharts]     = useState(true);
  const [loadingDefaulters, setLoadingDefaulters] = useState(true);
  const [error,             setError]             = useState(null);

  // ── Build query string from filters ──────────────────────────────────────
  const buildQS = useCallback((extra = {}) => {
    const merged = { ...filters, ...extra };
    const params = new URLSearchParams();

    // Resolve date range shortcut → actual dates
    if (merged.dateRange === "7d") {
      const d = new Date(); d.setDate(d.getDate() - 7);
      params.set("startDate", d.toISOString().split("T")[0]);
    } else if (merged.dateRange === "30d") {
      const d = new Date(); d.setDate(d.getDate() - 30);
      params.set("startDate", d.toISOString().split("T")[0]);
    } else if (merged.startDate) {
      params.set("startDate", merged.startDate);
    }
    if (merged.endDate) params.set("endDate", merged.endDate);
    if (merged.branch)   params.set("branch",   merged.branch);
    if (merged.semester) params.set("semester", merged.semester);
    if (merged.subject)  params.set("subject",  merged.subject);
    return params.toString() ? `?${params.toString()}` : "";
  }, [filters]);

  // ── Load branch options (admin: all branches; faculty: their branches) ────
  useEffect(() => {
    const userId = sessionStorage.getItem("userId") || "";
    if (isFaculty && !userId) return; // no id yet — wait for sessionStorage
    const url = isFaculty ? `/getFacultyBranch/${userId}` : "/branch";
    http.get(url)
      .then((r) => setBranchOptions(Array.isArray(r.data) ? r.data : []))
      .catch(() => setBranchOptions([]));
  }, [isFaculty]);

  // When branch changes load semesters
  useEffect(() => {
    if (!filters.branch) { setSemOptions([]); setSubjectOptions([]); return; }
    const url = isFaculty
      ? `/getFacultySem/${filters.branch}`
      : `/semester/${filters.branch}`;
    http.get(url)
      .then((r) => setSemOptions(Array.isArray(r.data) ? r.data : []))
      .catch(() => {});
    setFilters((f) => ({ ...f, semester: "", subject: "" }));
  }, [filters.branch, isFaculty]);

  // When semester changes load subjects
  useEffect(() => {
    if (!filters.branch || !filters.semester) { setSubjectOptions([]); return; }
    const url = isFaculty
      ? `/getFacultySubject/${filters.semester}`
      : `/subject/${filters.branch}/${filters.semester}`;
    http.get(url)
      .then((r) => setSubjectOptions(Array.isArray(r.data) ? r.data : []))
      .catch(() => {});
    setFilters((f) => ({ ...f, subject: "" }));
  }, [filters.semester, filters.branch, isFaculty]);

  // ── Fetch all analytics data ──────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    const qs = buildQS();
    setLoadingOverview(true);
    setLoadingCharts(true);
    setLoadingDefaulters(true);
    setError(null);

    // Each request is independent — one failure must never block the others
    const safe = async (promise, fallback) => {
      try {
        const res = await promise;
        return res.data;
      } catch (e) {
        // Only surface a visible error for true server errors (5xx),
        // not for 403/404 which simply mean "no data for this role/filter"
        const status = e?.response?.status;
        if (status && status >= 500) {
          setError(`Server error (${status}): ${e?.response?.data?.error || e.message}`);
        }
        return fallback;
      }
    };

    const [ovData, trendData, subData] = await Promise.all([
      safe(http.get(`/analytics/overview${qs}`),  { totalPresent: 0, totalAbsent: 0, totalClasses: 0, overallPct: 0, totalStudents: 0, defaultersCount: 0 }),
      safe(http.get(`/analytics/trend${qs}`),     []),
      safe(http.get(`/analytics/subjects${qs}`),  []),
    ]);

    setOverview(ovData);
    setTrend(Array.isArray(trendData) ? trendData : []);
    setSubjects(Array.isArray(subData) ? subData : []);
    setLoadingOverview(false);
    setLoadingCharts(false);

    // Branch comparison — admin only, silently ignored for faculty
    if (isAdmin) {
      const brData = await safe(http.get(`/analytics/branches${qs}`), []);
      setBranches(Array.isArray(brData) ? brData : []);
    }

    // Defaulters — available to both roles
    const defData = await safe(http.get(`/analytics/defaulters${qs}`), []);
    setDefaulters(Array.isArray(defData) ? defData : []);
    setLoadingDefaulters(false);
  }, [buildQS, isAdmin]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Filter helpers ────────────────────────────────────────────────────────
  const setFilter = (key, val) => setFilters((f) => ({ ...f, [key]: val }));

  // ── Computed values for doughnut ──────────────────────────────────────────
  const doughnutData = overview
    ? [
        { name: "Present", value: overview.totalPresent },
        { name: "Absent",  value: overview.totalAbsent  },
      ]
    : [];

  // ── Branch chart data ─────────────────────────────────────────────────────
  const branchChartData = branches.map((b) => ({
    name: `${b.branch} S${b.semester}`,
    pct:  b.pct,
    present: b.present,
    absent:  b.absent,
  }));

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between",
        mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <BarChartIcon color="primary" sx={{ fontSize: 34 }} />
          <Box>
            <Typography variant="h5" fontWeight={800}>Attendance Analytics</Typography>
            <Typography variant="body2" color="text.secondary">
              {isAdmin ? "College-wide view" : "Your allocated classes"}
            </Typography>
          </Box>
        </Box>
        <Tooltip title="Refresh data">
          <IconButton onClick={fetchAll} color="primary">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>
      )}

      {/* ── Filter ribbon ─────────────────────────────────────────────────── */}
      <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Branch</InputLabel>
              <Select value={filters.branch} label="Branch"
                onChange={(e) => setFilter("branch", e.target.value)}>
                <MenuItem value="">All Branches</MenuItem>
                {branchOptions.map((b) => <MenuItem key={b} value={b}>{b}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} sm={3} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Semester</InputLabel>
              <Select value={filters.semester} label="Semester"
                onChange={(e) => setFilter("semester", e.target.value)}
                disabled={!filters.branch}>
                <MenuItem value="">All</MenuItem>
                {semOptions.map((s) => <MenuItem key={s} value={s}>Sem {s}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} sm={3} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Subject</InputLabel>
              <Select value={filters.subject} label="Subject"
                onChange={(e) => setFilter("subject", e.target.value)}
                disabled={!filters.semester}>
                <MenuItem value="">All Subjects</MenuItem>
                {subjectOptions.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Date Range</InputLabel>
              <Select value={filters.dateRange} label="Date Range"
                onChange={(e) => setFilter("dateRange", e.target.value)}>
                <MenuItem value="all">Entire Semester</MenuItem>
                <MenuItem value="7d">Last 7 Days</MenuItem>
                <MenuItem value="30d">Last 30 Days</MenuItem>
                <MenuItem value="custom">Custom</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {filters.dateRange === "custom" && (
            <>
              <Grid item xs={6} sm={3} md={2}>
                <TextField size="small" fullWidth type="date" label="From"
                  InputLabelProps={{ shrink: true }} value={filters.startDate}
                  onChange={(e) => setFilter("startDate", e.target.value)} />
              </Grid>
              <Grid item xs={6} sm={3} md={2}>
                <TextField size="small" fullWidth type="date" label="To"
                  InputLabelProps={{ shrink: true }} value={filters.endDate}
                  onChange={(e) => setFilter("endDate", e.target.value)} />
              </Grid>
            </>
          )}
        </Grid>
      </Paper>

      {/* ── 6 Metric cards ───────────────────────────────────────────────── */}
      <Grid container spacing={2} mb={3}>
        {loadingOverview ? (
          [0,1,2,3,4,5].map((i) => (
            <Grid item xs={12} sm={6} md={4} lg={2} key={i}>
              <CardSkeleton />
            </Grid>
          ))
        ) : (
          <>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <MetricCard title="Overall Attendance" icon={<PercentIcon />}
                value={`${overview?.overallPct ?? 0}%`}
                color={pctColor(overview?.overallPct ?? 0)}
                bg={pctBg(overview?.overallPct ?? 0)}
                subtitle={overview?.overallPct >= 75 ? "Above threshold" : "Below 75%"} />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <MetricCard title="Students Tracked" icon={<GroupIcon />}
                value={overview?.totalStudents ?? 0}
                color="#1565C0" bg="#E3F2FD" subtitle="unique students" />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <MetricCard title="Total Lectures" icon={<MenuBookIcon />}
                value={overview?.totalClasses ?? 0}
                color="#6A1B9A" bg="#F3E5F5" subtitle="attendance marks" />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <MetricCard title="Total Present" icon={<CheckCircleIcon />}
                value={overview?.totalPresent ?? 0}
                color="#2E7D32" bg="#E8F5E9" />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <MetricCard title="Total Absent" icon={<CancelIcon />}
                value={overview?.totalAbsent ?? 0}
                color="#C62828" bg="#FFEBEE" />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <MetricCard title="Defaulters" icon={<WarningAmberIcon />}
                value={overview?.defaultersCount ?? 0}
                color="#E65100" bg="#FBE9E7"
                subtitle="< 75% attendance" />
            </Grid>
          </>
        )}
      </Grid>

      {/* ── Charts row 1: Line + Doughnut ─────────────────────────────────── */}
      <Grid container spacing={3} mb={3}>

        {/* Line chart — attendance trend */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} mb={2}>
              Attendance Trend Over Time
            </Typography>
            {loadingCharts ? <ChartSkeleton height={260} /> :
             trend.length === 0 ? <EmptyChart height={260} /> : (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={trend} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }}
                    tickFormatter={(v) => v.slice(5)} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }}
                    tickFormatter={(v) => `${v}%`} />
                  <RechartTooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="pct" name="%" stroke="#1565C0"
                    strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                  {/* 75% threshold line */}
                  <Line type="monotone" dataKey={() => 75} name="Min 75%"
                    stroke="#E53935" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>

        {/* Doughnut — present vs absent */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 3, height: "100%" }}>
            <Typography variant="subtitle1" fontWeight={700} mb={2}>
              Present vs Absent
            </Typography>
            {loadingCharts ? <ChartSkeleton height={260} /> :
             !doughnutData[0]?.value && !doughnutData[1]?.value
               ? <EmptyChart height={260} />
               : (
              <Box>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={doughnutData} cx="50%" cy="50%"
                      innerRadius={65} outerRadius={95}
                      paddingAngle={3} dataKey="value"
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={false}>
                      {doughnutData.map((_, i) => (
                        <Cell key={i} fill={DOUGHNUT[i]} />
                      ))}
                    </Pie>
                    <RechartTooltip />
                  </PieChart>
                </ResponsiveContainer>
                <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 1 }}>
                  {doughnutData.map((d, i) => (
                    <Chip key={i} size="small"
                      label={`${d.name}: ${d.value}`}
                      sx={{ bgcolor: DOUGHNUT[i], color: "#fff", fontWeight: 700 }} />
                  ))}
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* ── Charts row 2: Subject bar chart ──────────────────────────────── */}
      <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
        <Typography variant="subtitle1" fontWeight={700} mb={2}>
          Subject-wise Attendance (sorted by lowest first)
        </Typography>
        {loadingCharts ? <ChartSkeleton height={300} /> :
         subjects.length === 0 ? <EmptyChart height={300} /> : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={subjects}
              margin={{ top: 5, right: 20, bottom: 60, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="subject" tick={{ fontSize: 11 }} angle={-35}
                textAnchor="end" interval={0} />
              <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`}
                tick={{ fontSize: 11 }} />
              <RechartTooltip content={<CustomTooltip />}
                formatter={(v) => [`${v}%`, "Attendance"]} />
              {/* 75% reference line drawn as a constant bar overlay */}
              <Bar dataKey="pct" name="%" radius={[4, 4, 0, 0]}>
                {subjects.map((s, i) => (
                  <Cell key={i} fill={barColor(s.pct)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
        {/* Colour legend */}
        {subjects.length > 0 && (
          <Box sx={{ display: "flex", gap: 2, mt: 1.5, flexWrap: "wrap" }}>
            {[["≥ 75% (Good)", "#43A047"], ["60-74% (Warning)", "#FB8C00"], ["< 60% (Critical)", "#E53935"]].map(
              ([label, color]) => (
                <Box key={label} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: color }} />
                  <Typography variant="caption" color="text.secondary">{label}</Typography>
                </Box>
              )
            )}
          </Box>
        )}
      </Paper>

      {/* ── Admin only: Branch / Semester grouped bar ─────────────────────── */}
      {isAdmin && (
        <Paper elevation={3} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={2}>
            Branch &amp; Semester Comparison (Admin View)
          </Typography>
          {branchChartData.length === 0 ? <EmptyChart height={300} /> : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={branchChartData}
                margin={{ top: 5, right: 20, bottom: 60, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-35}
                  textAnchor="end" interval={0} />
                <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`}
                  tick={{ fontSize: 11 }} />
                <RechartTooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="pct" name="Attendance %" radius={[4, 4, 0, 0]}>
                  {branchChartData.map((b, i) => (
                    <Cell key={i} fill={barColor(b.pct)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Paper>
      )}

      {/* ── Defaulters / Low-attendance roster ───────────────────────────── */}
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <WarningAmberIcon sx={{ color: "#E65100" }} />
          <Typography variant="subtitle1" fontWeight={700}>
            Low-Attendance Students (&lt; 75%)
          </Typography>
          {!loadingDefaulters && (
            <Chip label={defaulters.length} size="small"
              sx={{ bgcolor: "#FBE9E7", color: "#E65100", fontWeight: 700 }} />
          )}
        </Box>

        {loadingDefaulters ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {[0, 1, 2].map((i) => <Skeleton key={i} height={40} />)}
          </Box>
        ) : defaulters.length === 0 ? (
          <Box sx={{ py: 5, textAlign: "center" }}>
            <CheckCircleIcon sx={{ fontSize: 48, color: "#43A047", opacity: 0.5 }} />
            <Typography variant="body2" color="text.secondary" mt={1}>
              No students below 75% for the selected filters. 🎉
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: "#FFF8E1" }}>
                  {["#", "Name", "Enroll", "Branch", "Sem", "Present", "Absent", "Attendance %"].map(
                    (h) => (
                      <TableCell key={h} sx={{ fontWeight: 700, fontSize: "0.75rem" }}>
                        {h}
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {defaulters.map((d, i) => (
                  <TableRow key={i}
                    sx={{ "&:hover": { bgcolor: "#FFF3E0" } }}>
                    <TableCell sx={{ color: "text.secondary" }}>{i + 1}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {d.fname} {d.sname}
                    </TableCell>
                    <TableCell>{d.enroll || "—"}</TableCell>
                    <TableCell>{d.course || "—"}</TableCell>
                    <TableCell>{d.sem || "—"}</TableCell>
                    <TableCell sx={{ color: "#2E7D32", fontWeight: 700 }}>{d.present}</TableCell>
                    <TableCell sx={{ color: "#C62828", fontWeight: 700 }}>{d.absent}</TableCell>
                    <TableCell>
                      <Chip label={`${d.pct}%`} size="small"
                        sx={{
                          bgcolor: pctBg(d.pct), color: pctColor(d.pct),
                          fontWeight: 700, fontSize: "0.72rem",
                        }} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default GraphDashboard;
