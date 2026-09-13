import React, { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import AttendanceLogo from "../../assets/images/attendanceLogo.jpg";
import {
  Alert,
  Box,
  Button,
  Divider,
  Typography,
  Stack,
} from "@mui/material";
import FingerprintOutlinedIcon from "@mui/icons-material/FingerprintOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import {
  loginBackgroundStyles,
  authCardStyles,
  brandSideStyles,
  formSideStyles,
  googleButtonStyles,
} from "./loginStyles";
import LoginWithUserNamePassword from "./LoginWithUserNamePassword";
import SignupForm from "../../pages/Signup/SignupForm";

const LoginForm = () => {
  const { googleLogin, userNotExistInDb } = useAuthContext();
  const [open, setOpen] = useState(false);

  const handleSignup = () => {
    setOpen(true);
  };

  const handleClickClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={loginBackgroundStyles}>
      <Box sx={authCardStyles}>
        {/* ── Left Branded Showcase Panel (Desktop) ── */}
        <Box
          sx={{
            ...brandSideStyles,
            display: { xs: "none", md: "flex" },
          }}
        >
          {/* Ambient Glow Effects */}
          <Box
            sx={{
              position: "absolute",
              top: -80,
              right: -80,
              width: 260,
              height: 260,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(56, 189, 248, 0.28) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: -60,
              left: -60,
              width: 240,
              height: 240,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(37, 99, 235, 0.45) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          {/* Top Live Status Badge */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1.25,
              px: 2,
              py: 0.75,
              borderRadius: "9999px",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(14px)",
              border: "1px solid rgba(255, 255, 255, 0.22)",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
              width: "fit-content",
              zIndex: 1,
            }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#34d399",
                boxShadow: "0 0 10px #34d399",
                animation: "pulseLive 2s ease-in-out infinite",
                "@keyframes pulseLive": {
                  "0%, 100%": { opacity: 1, transform: "scale(1)" },
                  "50%": { opacity: 0.35, transform: "scale(0.85)" },
                },
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: "#f8fafc",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                fontSize: "0.725rem",
              }}
            >
              Campus Cloud • System Online
            </Typography>
          </Box>

          {/* Center Brand Showcase */}
          <Box
            sx={{
              my: "auto",
              py: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              zIndex: 1,
            }}
          >
            {/* Ultra-smooth Floating 3D Logo Frame */}
            <Box
              sx={{
                width: 148,
                height: 148,
                borderRadius: "30px",
                overflow: "hidden",
                p: "3px",
                background:
                  "linear-gradient(135deg, rgba(56, 189, 248, 0.6) 0%, rgba(37, 99, 235, 0.2) 50%, rgba(255, 255, 255, 0.4) 100%)",
                boxShadow:
                  "0 24px 48px -12px rgba(0, 0, 0, 0.45), 0 0 25px rgba(56, 189, 248, 0.35)",
                mb: 3,
                animation: "floatLogo 6s ease-in-out infinite",
                "@keyframes floatLogo": {
                  "0%, 100%": { transform: "translateY(0px)" },
                  "50%": { transform: "translateY(-7px)" },
                },
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "scale(1.04) translateY(-8px)",
                  boxShadow:
                    "0 30px 60px -12px rgba(0, 0, 0, 0.55), 0 0 35px rgba(56, 189, 248, 0.5)",
                },
              }}
            >
              <Box
                component="img"
                src={AttendanceLogo}
                alt="College Attendance Logo"
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "27px",
                  display: "block",
                }}
              />
            </Box>

            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                letterSpacing: "-0.035em",
                color: "#ffffff",
                mb: 1.25,
                fontSize: { xs: "1.65rem", md: "1.9rem" },
                lineHeight: 1.2,
              }}
            >
              Smart Attendance Portal
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "rgba(226, 232, 240, 0.88)",
                maxWidth: 320,
                lineHeight: 1.6,
                fontSize: "0.9rem",
              }}
            >
              Intelligent session tracking, instant reporting, and seamless role-based authentication.
            </Typography>
          </Box>

          {/* Bottom Interactive Highlights */}
          <Stack spacing={1.5} sx={{ zIndex: 1 }}>
            {[
              {
                icon: <FingerprintOutlinedIcon sx={{ fontSize: 20, color: "#38bdf8" }} />,
                title: "1-Click Attendance",
                desc: "Instant classroom mark & report generation",
              },
              {
                icon: <InsightsOutlinedIcon sx={{ fontSize: 20, color: "#38bdf8" }} />,
                title: "Live Analytics",
                desc: "Real-time student & branch trends",
              },
              {
                icon: <SecurityOutlinedIcon sx={{ fontSize: 20, color: "#38bdf8" }} />,
                title: "Institutional Security",
                desc: "Role-based Admin, Faculty & Student access",
              },
            ].map((item, idx) => (
              <Box
                key={idx}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  p: 1.25,
                  borderRadius: "14px",
                  backgroundColor: "rgba(255, 255, 255, 0.06)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.12)",
                    transform: "translateX(4px)",
                  },
                }}
              >
                <Box
                  sx={{
                    p: 0.75,
                    borderRadius: "10px",
                    backgroundColor: "rgba(56, 189, 248, 0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </Box>
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: "#ffffff",
                      fontWeight: 700,
                      fontSize: "0.85rem",
                      lineHeight: 1.2,
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "rgba(226, 232, 240, 0.75)",
                      fontSize: "0.75rem",
                    }}
                  >
                    {item.desc}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>

        {/* ── Right Form Panel ── */}
        <Box sx={formSideStyles}>
          {/* Mobile-only header with logo */}
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              alignItems: "center",
              gap: 1.5,
              mb: 3,
            }}
          >
            <Box
              component="img"
              src={AttendanceLogo}
              alt="Logo"
              sx={{
                width: 48,
                height: 48,
                borderRadius: "12px",
                objectFit: "cover",
                boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
              }}
            />
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 800, color: "#0f172a", lineHeight: 1.2 }}
              >
                College Attendance
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748b" }}>
                Campus Cloud Portal
              </Typography>
            </Box>
          </Box>

          {/* Ultra-Smooth Segmented Pill Mode Switch */}
          <Box
            sx={{
              display: "flex",
              p: 0.5,
              borderRadius: "14px",
              backgroundColor: "#f1f5f9",
              mb: 3.5,
              position: "relative",
            }}
          >
            <Button
              fullWidth
              onClick={handleClickClose}
              sx={{
                py: 0.9,
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: !open ? 700 : 500,
                fontSize: "0.875rem",
                color: !open ? "#0f172a" : "#64748b",
                backgroundColor: !open ? "#ffffff" : "transparent",
                boxShadow: !open
                  ? "0 2px 8px rgba(15, 23, 42, 0.08)"
                  : "none",
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  backgroundColor: !open ? "#ffffff" : "rgba(255, 255, 255, 0.6)",
                },
              }}
            >
              Sign In
            </Button>
            <Button
              fullWidth
              onClick={handleSignup}
              sx={{
                py: 0.9,
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: open ? 700 : 500,
                fontSize: "0.875rem",
                color: open ? "#0f172a" : "#64748b",
                backgroundColor: open ? "#ffffff" : "transparent",
                boxShadow: open
                  ? "0 2px 8px rgba(15, 23, 42, 0.08)"
                  : "none",
                transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  backgroundColor: open ? "#ffffff" : "rgba(255, 255, 255, 0.6)",
                },
              }}
            >
              Register Account
            </Button>
          </Box>

          {/* Smooth Form Container with Keyframe Transition */}
          <Box
            key={open ? "signup-mode" : "login-mode"}
            sx={{
              animation: "smoothGlide 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              "@keyframes smoothGlide": {
                "0%": { opacity: 0, transform: "translateY(8px)" },
                "100%": { opacity: 1, transform: "translateY(0)" },
              },
            }}
          >
            {open ? (
              <Box>
                <SignupForm />
                <Box sx={{ mt: 3, textAlign: "center" }}>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    Already registered?{" "}
                    <Button
                      onClick={handleClickClose}
                      sx={{
                        p: 0,
                        minWidth: 0,
                        textTransform: "none",
                        fontWeight: 700,
                        color: "#2563eb",
                        fontSize: "0.875rem",
                        "&:hover": {
                          backgroundColor: "transparent",
                          textDecoration: "underline",
                        },
                      }}
                    >
                      Sign in here
                    </Button>
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box>
                <LoginWithUserNamePassword />

                <Box sx={{ my: 2.75, display: "flex", alignItems: "center" }}>
                  <Divider sx={{ flex: 1, borderColor: "#e2e8f0" }} />
                  <Typography
                    variant="caption"
                    sx={{
                      px: 2,
                      color: "#94a3b8",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      fontSize: "0.725rem",
                    }}
                  >
                    or continue with
                  </Typography>
                  <Divider sx={{ flex: 1, borderColor: "#e2e8f0" }} />
                </Box>

                <Button
                  fullWidth
                  variant="outlined"
                  sx={googleButtonStyles}
                  onClick={() => googleLogin()}
                  startIcon={
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  }
                >
                  Sign in with Google
                </Button>

                {userNotExistInDb && (
                  <Alert
                    severity="error"
                    sx={{
                      mt: 2,
                      borderRadius: "14px",
                      fontSize: "0.85rem",
                      alignItems: "center",
                    }}
                  >
                    <strong>{userNotExistInDb.email}</strong> does not exist in our
                    database. Please contact your college administrator to request access.
                  </Alert>
                )}

                <Box sx={{ mt: 3, textAlign: "center" }}>
                  <Typography variant="body2" sx={{ color: "#64748b" }}>
                    Need a new account?{" "}
                    <Button
                      onClick={handleSignup}
                      sx={{
                        p: 0,
                        minWidth: 0,
                        textTransform: "none",
                        fontWeight: 700,
                        color: "#2563eb",
                        fontSize: "0.875rem",
                        "&:hover": {
                          backgroundColor: "transparent",
                          textDecoration: "underline",
                        },
                      }}
                    >
                      Register here
                    </Button>
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>

          {/* Institutional Security Footnote */}
          <Box
            sx={{
              mt: 4,
              pt: 2.5,
              borderTop: "1px solid #f1f5f9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.75,
              color: "#94a3b8",
            }}
          >
            <SecurityOutlinedIcon sx={{ fontSize: 15 }} />
            <Typography variant="caption" sx={{ fontSize: "0.75rem", fontWeight: 500 }}>
              Institutional grade security • 256-bit encrypted
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginForm;
