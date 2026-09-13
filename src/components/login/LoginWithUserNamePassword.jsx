import { Form, Formik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Button, Typography } from "@mui/material";
import FormikController from "../../formik/FormikController";
import { loginButtonWidth } from "./loginStyles";
import useHttp from "../../hooks/useHttp";
import AuthContext from "../../context/AuthContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

/** Maps a role string to its default landing route */
const ROLE_HOME = {
  admin:   "/users",
  faculty: "/attendance",
  student: "/student/dashboard",
};

const LoginWithUserNamePassword = () => {
  const authctx  = useContext(AuthContext);
  const navigate = useNavigate();
  const { sendRequest } = useHttp();

  const initialValues = { email: "", password: "" };

  const validationSchema = Yup.object({
    email:    Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().required("Required"),
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

          // Extract the hex string from the ObjectId regardless of how
          // MongoDB serialised it — could be a plain string, an ObjectId
          // object, or { $oid: "..." } (extended JSON format)
          const extractId = (val) => {
            if (!val) return "";
            if (typeof val === "string") return val;
            // BSON ObjectId object has a toString() that returns the hex
            if (typeof val.toString === "function") {
              const s = val.toString();
              // Reject "[object Object]" — means toString didn't work
              if (s && !s.includes("[object")) return s;
            }
            // Extended JSON: { $oid: "hexstring" }
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
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(formik) => (
          <Form>
            <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
              College Attendance System
            </Typography>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Login
            </Typography>

            <FormikController
              control="input"
              type="text"
              label="Email"
              name="email"
              fullWidth
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <br /><br />

            <FormikController
              control="input"
              type="password"
              label="Password"
              name="password"
              fullWidth
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <br /><br />

            <Button sx={loginButtonWidth} variant="contained" type="submit">
              Login
            </Button>
          </Form>
        )}
      </Formik>
      <br />
      <Typography component="p">OR</Typography>
    </>
  );
};

export default LoginWithUserNamePassword;
