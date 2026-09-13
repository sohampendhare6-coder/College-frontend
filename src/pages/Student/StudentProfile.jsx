import { useEffect, useState } from "react";
import {
  Avatar, Box, Card, CardContent, Chip, CircularProgress,
  Divider, Grid, Paper, Typography,
} from "@mui/material";
import SchoolIcon       from "@mui/icons-material/School";
import PersonIcon       from "@mui/icons-material/Person";
import PhoneIcon        from "@mui/icons-material/Phone";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import BadgeIcon        from "@mui/icons-material/Badge";
import HomeIcon         from "@mui/icons-material/Home";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import http from "../../http-common";
import { toast } from "react-toastify";

// ── Single detail row ─────────────────────────────────────────────────────────
const DetailRow = ({ icon, label, value }) => (
  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2, py: 1.5 }}>
    <Box sx={{ color: "#1565C0", pt: 0.3 }}>{icon}</Box>
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase">
        {label}
      </Typography>
      <Typography variant="body1" fontWeight={600} mt={0.2}>
        {value || "—"}
      </Typography>
    </Box>
  </Box>
);

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    http.get("/student/profile")
      .then((res) => setProfile(res.data))
      .catch(() => toast.error("Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) return null;

  const fullName = [profile.fname, profile.mname, profile.sname]
    .filter(Boolean).join(" ");
  const initials = [profile.fname?.[0], profile.sname?.[0]]
    .filter(Boolean).join("").toUpperCase();

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 900, mx: "auto" }}>

      {/* ── Profile hero card ─────────────────────────────────────────────── */}
      <Paper
        elevation={0}
        sx={{
          mb: 3, borderRadius: 3, overflow: "hidden",
          background: "linear-gradient(135deg, #1565C0 0%, #1976D2 60%, #42A5F5 100%)",
        }}
      >
        <Box
          sx={{
            px: 4, py: 4,
            display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap",
          }}
        >
          <Avatar
            sx={{
              width: 88, height: 88, fontSize: 36, fontWeight: 800,
              bgcolor: "rgba(255,255,255,0.25)", color: "#fff",
              border: "3px solid rgba(255,255,255,0.5)",
            }}
          >
            {initials || <SchoolIcon fontSize="large" />}
          </Avatar>

          <Box sx={{ color: "#fff" }}>
            <Typography variant="h5" fontWeight={800}>
              {fullName || "—"}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.85, mt: 0.5 }}>
              {profile.course} &nbsp;·&nbsp; Semester {profile.sem}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              <Chip
                label="Student"
                size="small"
                icon={<SchoolIcon sx={{ fontSize: 14, color: "#fff !important" }} />}
                sx={{ bgcolor: "rgba(255,255,255,0.2)", color: "#fff", fontWeight: 700 }}
              />
              <Chip
                label={`Enroll: ${profile.enroll || "—"}`}
                size="small"
                sx={{ bgcolor: "rgba(255,255,255,0.15)", color: "#fff" }}
              />
            </Box>
          </Box>
        </Box>
      </Paper>

      <Grid container spacing={3}>

        {/* ── Personal details ────────────────────────────────────────────── */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <PersonIcon color="primary" />
                <Typography variant="subtitle1" fontWeight={700}>
                  Personal Details
                </Typography>
              </Box>
              <Divider sx={{ mb: 1 }} />

              <DetailRow
                icon={<PersonIcon fontSize="small" />}
                label="Full Name"
                value={fullName}
              />
              <Divider />
              <DetailRow
                icon={<HomeIcon fontSize="small" />}
                label="Address"
                value={profile.address}
              />
              <Divider />
              <DetailRow
                icon={<PhoneIcon fontSize="small" />}
                label="Student Contact"
                value={profile.scontact}
              />
              <Divider />
              <DetailRow
                icon={<ContactPhoneIcon fontSize="small" />}
                label="Parent's Contact"
                value={profile.pcontact}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* ── Academic details ─────────────────────────────────────────────── */}
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <AccountBalanceIcon color="primary" />
                <Typography variant="subtitle1" fontWeight={700}>
                  Academic Details
                </Typography>
              </Box>
              <Divider sx={{ mb: 1 }} />

              <DetailRow
                icon={<BadgeIcon fontSize="small" />}
                label="Enrollment Number"
                value={profile.enroll}
              />
              <Divider />
              <DetailRow
                icon={<AccountBalanceIcon fontSize="small" />}
                label="Branch / Department"
                value={profile.course}
              />
              <Divider />
              <DetailRow
                icon={<SchoolIcon fontSize="small" />}
                label="Current Semester"
                value={profile.sem ? `Semester ${profile.sem}` : null}
              />
              <Divider />
              <DetailRow
                icon={<BadgeIcon fontSize="small" />}
                label="Student ID (MongoDB)"
                value={profile._id?.toString()}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentProfile;
