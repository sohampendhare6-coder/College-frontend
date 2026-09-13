import { Form, Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import {
  Button,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Box,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { primaryButtonStyles, inputFieldStyles } from "./loginStyles";
import useHttp from "../../hooks/useHttp";
import AuthContext from "../../context/AuthContext";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

/** Maps a role string to its default landing route */
const ROLE_HOME = {
  admin: "/users",
  faculty: "/attendance",
  student: "/student/dashboard",
};

const LoginWithUserNamePassword = () => {
  const authctx = useContext(AuthContext);
  const navigate = useNavigate();
  const { sendRequest } = useHttp();
  const [showPassword, setShowPassword] = useState(false);

  const initialValues = { email: "", password: "" };

  const validationSchema = Yup.object({
    email: Yup.string().email("Please enter a valid email address").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const onSubmit = (values, { resetForm }) => {
    if (!values) {
      toast.error("Something went wrong");
      return;
    }

    sendRequest(
      { url: "/checkEmail", method: "post", data: values },
      (data) => {
        // data is either an array with one user, or false (not found)
        const user = Array.isArray(data) && data.length > 0 ? data[0] : null;

        if (user) {
          const { role, facultyId, studentId } = user;
          const normalisedRole = (role || "admin").toLowerCase();

          // Extract the hex string from the ObjectId regardless of format
          const extractId = (val) => {
            if (!val) return "";
            if (typeof val === "string") return val;
            if (typeof val.toString === "function") {
              const s = val.toString();
              if (s && !s.includes("[object")) return s;
            }
            if (val.$oid) return val.$oid;
            return "";
          };

          const userId = extractId(facultyId) || extractId(studentId) || "";

          // 1. Persist role + id (AuthContext writes to sessionStorage)
          authctx.userHandler(normalisedRole);
          authctx.idHandler(userId);
          authctx.onLogin();

          // 2. Redirect to role-appropriate home page
          const destination = ROLE_HOME[normalisedRole] || "/users";
          navigate(destination, { replace: true });
        } else {
          toast.error("Email or password is incorrect");
        }
        resetForm();
      }
    );
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            color: "#0f172a",
            letterSpacing: "-0.025em",
            mb: 0.75,
          }}
        >
          Welcome back
        </Typography>
        <Typography variant="body2" sx={{ color: "#64748b" }}>
          Enter your institutional credentials to access your account
        </Typography>
      </Box>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(formik) => (
          <Form>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.25 }}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email Address"
                placeholder="name@college.edu"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                sx={inputFieldStyles}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlinedIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                label="Password"
                placeholder="••••••••"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                sx={inputFieldStyles}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon sx={{ color: "#94a3b8", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                        sx={{ color: "#94a3b8" }}
                      >
                        {showPassword ? (
                          <VisibilityOff sx={{ fontSize: 20 }} />
                        ) : (
                          <Visibility sx={{ fontSize: 20 }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                fullWidth
                variant="contained"
                type="submit"
                sx={primaryButtonStyles}
              >
                Sign In
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default LoginWithUserNamePassword;
