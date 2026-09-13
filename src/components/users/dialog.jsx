import { Grid } from "@mui/material";
import { toast } from "react-toastify";
import { Form, Formik } from "formik";
import FormikController from "../../formik/FormikController";
import * as Yup from "yup";
import { createUser, updateUser } from "../../api/users";
import Modal from "../../common/Modal";
import { useRef } from "react";
import Loading from "../../common/Loader";
import useProgress from "../../hooks/useProgress";

const CreateUserForm = ({ handleClose, currentRow }) => {
  const [createNewUser, createLoading] = useProgress(createUser);
  const [updateExistingUser, updateLoading] = useProgress(updateUser);
  const formikRef = useRef();

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Email is required"),
    role: Yup.string().required("Role is required"),
  });

  const onOk = () => {
    formikRef.current.submitForm().then((values) => {
      if (values) {
        if (currentRow.firebaseId) {
          updateExistingUser(values).then(() => {
            toast.success("User updated successfully");
            handleClose();
          });
        } else {
          createNewUser(values).then(() => {
            toast.success("User created successfully");
            handleClose();
          });
        }
      }
    });
  };

  return (
    <Modal
      title={currentRow.firebaseId ? "Update User" : "Add User"}
      onOk={onOk}
      onCancel={handleClose}
      sx={{ minHeight: (createLoading || updateLoading) && "200px" }}
    >
      {createLoading || updateLoading ? (
        <Loading
          title={
            currentRow.firebaseId
              ? "Updating user..."
              : "Creating user..."
          }
          top="65%"
        />
      ) : (
        <Grid item xs={12}>
          <Formik
            innerRef={formikRef}
            initialValues={currentRow}
            validationSchema={validationSchema}
            onSubmit={(values) => values}
          >
            {(formik) => (
              <Form>
                {/* Email */}
                <Grid item xs={12}>
                  <FormikController
                    control="input"
                    type="email"
                    label="Email"
                    name="email"
                    fullWidth
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                </Grid>

                {/* Role */}
                <Grid item xs={12} paddingTop="1rem">
                  <FormikController
                    control="select"
                    label="Role"
                    name="role"
                    options={[
                      { label: "Admin", value: "admin" },
                      { label: "Faculty", value: "faculty" },
                      { label: "Student", value: "student" },
                    ]}
                    fullWidth
                    value={formik.values.role}
                    onChange={formik.handleChange}
                    error={formik.touched.role && Boolean(formik.errors.role)}
                    helperText={formik.touched.role && formik.errors.role}
                  />
                </Grid>
              </Form>
            )}
          </Formik>
        </Grid>
      )}
    </Modal>
  );
};

export default CreateUserForm;
