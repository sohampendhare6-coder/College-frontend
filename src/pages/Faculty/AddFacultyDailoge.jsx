/* eslint-disable no-unused-vars */
import {
  DialogTitle,
  TextField,
  Button,
  Box,
  Dialog,
  Grid,
  Typography,
  Divider,
} from "@material-ui/core";
import { toast } from "react-toastify";
import * as React from "react";
import { useRef } from "react";
import { Form, Formik } from "formik";
import useHttp from "../../hooks/useHttp";

const FacultyDialog = ({ open, onCancel, currentRow, reloadNewData, reloadAfterUpdation }) => {
  const formikRef = useRef();
  const { error, sendRequest: sendTaskRequest } = useHttp();

  const reloadCreateData = (values, id) => {
    if (id) {
      toast.success("Faculty profile added successfully");
      reloadNewData({ ...values, _id: id }, id);
    } else {
      toast.error("Failed to add faculty");
    }
  };

  const reloadEditData = (values, acknowledgment) => {
    if (acknowledgment) {
      toast.success("Updated Successfully");
      reloadAfterUpdation(values);
    } else {
      toast.error("Update failed");
    }
  };

  const onSubmit = () => {
    formikRef.current.submitForm().then((values) => {
      if (values) {
        if (currentRow._id) {
          // Edit — profile fields only, no credential update
          sendTaskRequest(
            { url: "/editFaculty", method: "put", data: values },
            reloadEditData.bind(null, values)
          );
        } else {
          // Create — save profile first, Faculty.jsx.reloadNewData handles /registerFaculty
          sendTaskRequest(
            { url: "/addFaculty", method: "post", data: values },
            reloadCreateData.bind(null, values)
          );
        }
        onCancel();
      }
    });
  };

  if (error) {
    toast.error(error);
  }

  const isEdit = Boolean(currentRow._id);

  return (
    <Dialog fullWidth open={open} onClose={onCancel}>
      <Box>
        <DialogTitle style={{ paddingBottom: "0px" }}>
          {isEdit ? "Edit Faculty" : "Add Faculty"}
        </DialogTitle>

        <Formik
          innerRef={formikRef}
          initialValues={currentRow}
          onSubmit={(values) => values}
        >
          {(formik) => (
            <Form style={{ padding: "30px", paddingTop: "0px" }}>

              {/* ── Profile fields ──────────────────────────────────────── */}
              <Grid item xs={12}>
                <TextField
                  type="text"
                  label="Faculty Name"
                  name="fname"
                  fullWidth
                  value={formik.values.fname}
                  onChange={formik.handleChange}
                  error={formik.touched.fname && Boolean(formik.errors.fname)}
                  helperText={formik.touched.fname && formik.errors.fname}
                />
              </Grid>
              <br />

              <Grid item container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    type="text"
                    label="Qualification"
                    name="qulification"
                    fullWidth
                    value={formik.values.qulification}
                    onChange={formik.handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    type="number"
                    label="Experience (years)"
                    name="experience"
                    fullWidth
                    value={formik.values.experience}
                    onChange={formik.handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    type="text"
                    label="Expertise / Subject Area"
                    name="expertise"
                    fullWidth
                    value={formik.values.expertise}
                    onChange={formik.handleChange}
                  />
                </Grid>
              </Grid>

              {/* ── Login credentials (new faculty only) ─────────────────── */}
              {!isEdit && (
                <>
                  <br />
                  <Divider />
                  <br />
                  <Typography
                    variant="subtitle2"
                    style={{ fontWeight: 700, marginBottom: 4 }}
                  >
                    Login Credentials
                  </Typography>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    style={{ display: "block", marginBottom: 12 }}
                  >
                    The faculty member will use these to log in. Role is
                    automatically set to <strong>faculty</strong>.
                  </Typography>

                  <Grid item container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        type="email"
                        label="Email"
                        name="email"
                        fullWidth
                        value={formik.values.email || ""}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.email && Boolean(formik.errors.email)
                        }
                        helperText={formik.touched.email && formik.errors.email}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        type="password"
                        label="Password"
                        name="password"
                        fullWidth
                        value={formik.values.password || ""}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.password &&
                          Boolean(formik.errors.password)
                        }
                        helperText={
                          formik.touched.password && formik.errors.password
                        }
                      />
                    </Grid>
                  </Grid>
                </>
              )}

              <br />
              <Button onClick={onSubmit} variant="contained" color="primary">
                {isEdit ? "Update" : "Add Faculty"}
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Dialog>
  );
};

export default FacultyDialog;