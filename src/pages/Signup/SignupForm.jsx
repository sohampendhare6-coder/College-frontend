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
import { primaryButtonStyles, inputFieldStyles } from "../../components/login/loginStyles";
import useHttp from "../../hooks/useHttp";
import { useState } from "react";

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const initialValues = {
    email: "",
    password: "",
    confirmpassword: "",
  };

  const { sendRequest: sendTaskRequest } = useHttp();

  const loadNewUser = (values, response) => {
    if (response === true) {
      toast.error("Email already exists");
    } else {
      toast.success("Account created successfully! You can now sign in.");
    }
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Please enter a valid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmpassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm your password"),
  });

  const onSubmit = (values, { resetForm }) => {
    if (values) {
      sendTaskRequest(
        {
          url: "/checkEmail",
          method: "post",
          data: { email: values.email, password: values.password },
        },
        (data) => {
          if (data && data.length > 0) {
            toast.error("An account with this email already exists");
          } else {
            sendTaskRequest(
              {
                url: "/addUser",
                method: "post",
                data: { email: values.email, password: values.password },
              },
              loadNewUser.bind(null, values)
            )
              .then(() => {
                resetForm();
              })
              .catch((err) => {
                toast.error(err.message || "Failed to create account");
              });
          }
        }
      );
    } else {
      toast.error("Something went wrong");
    }
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
          Create an account
        </Typography>
        <Typography variant="body2" sx={{ color: "#64748b" }}>
          Enter your details to register for the college attendance system
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

              <TextField
                fullWidth
                id="confirmpassword"
                name="confirmpassword"
                type={showConfirmPassword ? "text" : "password"}
                label="Confirm Password"
                placeholder="••••••••"
                value={formik.values.confirmpassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.confirmpassword && Boolean(formik.errors.confirmpassword)}
                helperText={formik.touched.confirmpassword && formik.errors.confirmpassword}
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
                        aria-label="toggle confirm password visibility"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        size="small"
                        sx={{ color: "#94a3b8" }}
                      >
                        {showConfirmPassword ? (
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
                Create Account
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default SignupForm;