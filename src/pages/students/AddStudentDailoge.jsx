/* eslint-disable no-unused-vars */
import {
  DialogTitle,
  TextField,
  Button,
  Box,
  Dialog,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Divider,
} from "@material-ui/core";
import * as React from "react";
import { useRef, useEffect } from "react";
import { Form, Formik } from "formik";
import { useState } from "react";
import useHttp from "../../hooks/useHttp";
import { toast } from "react-toastify";

const StudentDialog = ({
  open,
  onCancel,
  currentRow,
  addGetNewStudent,
  resetAfterUpdation,
}) => {
  const [viewBranch, setViewBranch] = useState([]);
  const [viewSem, setSem] = useState([]);
  const { error, sendRequest: sendTaskRequest } = useHttp();
  const formikRef = useRef();

  useEffect(() => {
    sendTaskRequest({ url: "/branch", method: "get" }, (branch) => {
      setViewBranch(branch);
    });
    if (currentRow._id !== "") {
      sendTaskRequest(
        { url: `/semester/${currentRow.course}`, method: "get" },
        (semester) => setSem(semester)
      );
    }
  }, [sendTaskRequest, currentRow]);

  const reloadCreateData = (values, acknowledgementId) => {
    if (acknowledgementId) {
      addGetNewStudent({ ...values, _id: acknowledgementId });
      toast.success("Student added successfully");
    } else {
      toast.error("Failed to add student");
    }
  };

  const reloadEditData = (values, response) => {
    if (response) {
      toast.success("Updated Successfully");
      resetAfterUpdation(values);
    } else {
      toast.error("Update failed");
    }
  };

  const onSubmit = () => {
    formikRef.current.submitForm().then((values) => {
      if (values) {
        if (currentRow._id) {
          // Edit: profile only — no credential update needed
          sendTaskRequest(
            { url: "/editStudent", method: "put", data: values },
            reloadEditData.bind(null, values)
          );
          onCancel();
        } else {
          // Create: first save profile, THEN register credentials in the callback
          // Do NOT call onCancel() here — wait for the callback chain to finish
          sendTaskRequest(
            { url: "/addStudents", method: "post", data: values },
            (acknowledgementId) => {
              reloadCreateData(values, acknowledgementId);
              onCancel(); // close only after we have the insertedId
            }
          );
        }
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
          {isEdit ? "Edit Student" : "Add Student"}
        </DialogTitle>

        <Formik
          innerRef={formikRef}
          initialValues={currentRow}
          onSubmit={(values) => values}
        >
          {(formik) => (
            <Form style={{ padding: "30px", paddingTop: "0px" }}>

              {/* ── Profile fields ───────────────────────────────────────── */}
              <Grid item xs={12}>
                <TextField
                  type="text"
                  label="First Name"
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
                <Grid item xs={12} md={6}>
                  <TextField
                    type="text"
                    label="Middle Name"
                    name="mname"
                    fullWidth
                    value={formik.values.mname}
                    onChange={formik.handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    type="text"
                    label="Surname"
                    name="sname"
                    fullWidth
                    value={formik.values.sname}
                    onChange={formik.handleChange}
                  />
                </Grid>
              </Grid>
              <br />

              <Grid item xs={12}>
                <TextField
                  type="text"
                  label="Address"
                  name="address"
                  fullWidth
                  value={formik.values.address}
                  onChange={formik.handleChange}
                />
              </Grid>
              <br />

              <Grid item xs={12}>
                <TextField
                  type="text"
                  label="Enrollment No"
                  name="enroll"
                  fullWidth
                  value={formik.values.enroll}
                  onChange={formik.handleChange}
                />
              </Grid>
              <br />

              <Grid item container spacing={2}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Select Branch</InputLabel>
                    <Select
                      name="course"
                      value={formik.values.course}
                      onChange={(e) => {
                        formik.setFieldValue("course", e.target.value);
                        sendTaskRequest(
                          { url: `/semester/${e.target.value}`, method: "get" },
                          (semester) => setSem(semester)
                        );
                      }}
                    >
                      {viewBranch?.map((d) => (
                        <MenuItem key={d} value={d}>
                          {d}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Select Semester</InputLabel>
                    <Select
                      name="sem"
                      value={formik.values.sem}
                      onChange={(e) =>
                        formik.setFieldValue("sem", e.target.value)
                      }
                    >
                      {viewSem?.map((d) => (
                        <MenuItem key={d} value={d}>
                          {d}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <br />

              <Grid item container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    type="text"
                    label="Parent's Contact"
                    name="pcontact"
                    fullWidth
                    value={formik.values.pcontact}
                    onChange={formik.handleChange}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    type="text"
                    label="Student's Contact"
                    name="scontact"
                    fullWidth
                    value={formik.values.scontact}
                    onChange={formik.handleChange}
                  />
                </Grid>
              </Grid>

              {/* ── Login credentials (new students only) ─────────────────── */}
              {!isEdit && (
                <>
                  <br />
                  <Divider />
                  <br />
                  <Typography
                    variant="subtitle2"
                    style={{ fontWeight: 700, marginBottom: 8 }}
                  >
                    Login Credentials
                  </Typography>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    style={{ display: "block", marginBottom: 12 }}
                  >
                    The student will use these to log in. Role is automatically
                    set to <strong>student</strong>.
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
                {isEdit ? "Update" : "Add Student"}
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Dialog>
  );
};

export default StudentDialog;
