/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import backgroundImage from "../../assets/images/Bg.png";

// ─── Ultra-Smooth Modern SaaS Design System Styles (MUI sx compatible) ─────────

export const loginBackgroundStyles = {
  minHeight: "100vh",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  p: { xs: 2, sm: 3, md: 4 },
  background:
    "radial-gradient(at 0% 0%, rgba(37, 99, 235, 0.14) 0px, transparent 48%), " +
    "radial-gradient(at 100% 0%, rgba(99, 102, 241, 0.15) 0px, transparent 48%), " +
    "radial-gradient(at 100% 100%, rgba(14, 165, 233, 0.12) 0px, transparent 52%), " +
    "radial-gradient(at 0% 100%, rgba(168, 85, 247, 0.1) 0px, transparent 50%), " +
    "#f8fafc",
  position: "relative",
  overflow: "hidden",
};

export const authCardStyles = {
  position: "relative",
  width: "100%",
  maxWidth: "1020px",
  display: "flex",
  flexDirection: { xs: "column", md: "row" },
  borderRadius: "28px",
  backgroundColor: "rgba(255, 255, 255, 0.98)",
  backdropFilter: "blur(24px)",
  boxShadow:
    "0 32px 64px -16px rgba(15, 23, 42, 0.14), " +
    "0 0 0 1px rgba(226, 232, 240, 0.8), " +
    "0 1px 0 rgba(255, 255, 255, 0.9) inset",
  overflow: "hidden",
  zIndex: 1,
  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
};

export const brandSideStyles = {
  width: { xs: "100%", md: "46%" },
  background: "linear-gradient(155deg, #0f172a 0%, #1e3a8a 45%, #2563eb 100%)",
  color: "#ffffff",
  p: { xs: 4, sm: 5, md: 5.5 },
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  position: "relative",
  overflow: "hidden",
};

export const formSideStyles = {
  width: { xs: "100%", md: "54%" },
  p: { xs: 3.5, sm: 5, md: 5.5 },
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  backgroundColor: "#ffffff",
};

export const primaryButtonStyles = {
  py: 1.45,
  borderRadius: "14px",
  fontWeight: 700,
  fontSize: "0.95rem",
  textTransform: "none",
  letterSpacing: "0.015em",
  background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
  boxShadow: "0 10px 22px -5px rgba(37, 99, 235, 0.42)",
  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    background: "linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%)",
    boxShadow: "0 16px 30px -6px rgba(37, 99, 235, 0.55)",
    transform: "translateY(-2px)",
  },
  "&:active": {
    transform: "scale(0.985)",
  },
};

export const googleButtonStyles = {
  py: 1.35,
  borderRadius: "14px",
  borderColor: "#e2e8f0",
  color: "#1e293b",
  fontWeight: 600,
  fontSize: "0.925rem",
  textTransform: "none",
  backgroundColor: "#ffffff",
  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
  "&:hover": {
    backgroundColor: "#f8fafc",
    borderColor: "#cbd5e1",
    boxShadow: "0 6px 16px rgba(0,0,0,0.07)",
    transform: "translateY(-1.5px)",
  },
  "&:active": {
    transform: "scale(0.985)",
  },
};

export const inputFieldStyles = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    backgroundColor: "#f8fafc",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    "& fieldset": {
      borderColor: "#e2e8f0",
      transition: "border-color 0.2s ease, border-width 0.2s ease",
    },
    "&:hover fieldset": {
      borderColor: "#94a3b8",
    },
    "&.Mui-focused": {
      backgroundColor: "#ffffff",
      boxShadow: "0 0 0 3.5px rgba(37, 99, 235, 0.12)",
      "& fieldset": {
        borderColor: "#2563eb",
        borderWidth: "1.5px",
      },
    },
  },
  "& .MuiInputLabel-root": {
    color: "#64748b",
    fontSize: "0.9rem",
    "&.Mui-focused": {
      color: "#2563eb",
    },
  },
};

// ─── Backward-compatible emotion styles (legacy support) ───────────────────────

export const loginBackgroundImage = css`
  background-image: url(${backgroundImage});
  height: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`;

export const loginSection = css`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 100vh;
  min-height: 100vh;
`;

export const loginSectionContainer = css`
  position: relative;
  width: 800px;
  height: auto;
  background: #fff;
  box-shadow: 0 15px 50px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border-top-right-radius: 25px;
  border-bottom-left-radius: 25px;
`;

export const userContainer = css`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
`;

export const userContainerImageBox = css`
  position: relative;
  width: 50%;
  height: 100%;
  background: #fff;
  transition: 0.5s;
  border-right: 5px solid;
`;

export const userContainerImage = css`
  border-radius: 0;
  height: 400px;
  margin-top: 20%;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  object-fit: cover;
`;

export const formContainer = css`
  position: relative;
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  text-align: center;
`;

export const fieldsFormContainer = css`
  padding: 20px;
  text-align: center;
`;

export const loginButtonBox = css`
  text-align: center;
`;

export const createButtonBox = css`
  text-align: center;
  padding: 1rem;
`;

export const loginButtonWidth = css`
  width: 100%;
`;
