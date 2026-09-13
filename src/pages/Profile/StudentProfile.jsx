import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Typography,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";
import { useAuthContext } from "../../context/AuthContext";

/**
 * StudentProfile
 * A lightweight read-only profile page for logged-in students.
 * Displays the information already held in AuthContext (role + id).
 * Can be extended later to fetch full student details from the API.
 */
const StudentProfile = () => {
  const { user, id } = useAuthContext();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        pt: 6,
        px: 2,
      }}
    >
      <Card elevation={4} sx={{ maxWidth: 480, width: "100%", borderRadius: 3 }}>
        {/* Header strip */}
        <Box
          sx={{
            bgcolor: "#2E7D32",
            py: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Avatar
            sx={{
              width: 72,
              height: 72,
              bgcolor: "#fff",
              color: "#2E7D32",
              fontSize: 36,
            }}
          >
            <SchoolIcon fontSize="inherit" />
          </Avatar>
          <Typography variant="h6" fontWeight={700} color="#fff">
            Student Profile
          </Typography>
          <Chip
            label="Student"
            size="small"
            sx={{ bgcolor: "#fff", color: "#2E7D32", fontWeight: 700 }}
          />
        </Box>

        <CardContent sx={{ px: 3, py: 3 }}>
          {/* Role */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
            <BadgeIcon color="action" />
            <Box>
              <Typography variant="caption" color="text.secondary">
                Role
              </Typography>
              <Typography variant="body1" fontWeight={600} textTransform="capitalize">
                {user || "student"}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 1.5 }} />

          {/* Student ID */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 2 }}>
            <EmailIcon color="action" />
            <Box>
              <Typography variant="caption" color="text.secondary">
                Student ID
              </Typography>
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ wordBreak: "break-all" }}
              >
                {id || "—"}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Typography variant="caption" color="text.secondary">
            More profile details will appear here once the student data API is
            connected to this page.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StudentProfile;
