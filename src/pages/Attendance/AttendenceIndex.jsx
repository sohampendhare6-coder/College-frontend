import {
  Button,
  DialogTitle,
  Grid,
  Select,
  Typography,
  TextField,
  Checkbox,
  MenuItem
} from "@mui/material";
import { useState, useRef } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { css } from "@emotion/react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { Form, Formik } from "formik";
import { useEffect } from "react";
import useHttp from "../../hooks/useHttp";
import { toast } from "react-toastify";
import { useAuthContext } from "../../context";

const AttendenceCollection = () => {
  const {id} = useAuthContext();
  const [branchCollection, setBranchCollection] = useState([]);
  const [semCollection, setSemCollection] = useState([]);
  const [subjectCollection, setSubjectCollection] = useState([]);
  let [students, setStudents] = useState([])
  const formikRef = useRef();
  const {error,sendRequest : sendTaskRequest} = useHttp();

  const [currentRow,setCurrentRow] = useState({
    branch: "",
    semester: "",
    subject: "",
    lectureNo: "",
    date:`${new Date().getMonth()+1}-${new Date().getDate()}-${new Date().getFullYear()}`
  })

  if (error){
    toast.error(error);
  }
  
  const columns = [
    { field: "id", headerName: "ID", width: 20 },
    {
      field: "fname",
      headerName: "Student Name",
      width: 150,
      editable: true,
    },
    {
      headerName: "Surname",
      field: "sname",
      editable: true,
    },
    {
      field: "1",
      headerName: "Status",
      width: 60,
      renderCell: ({ row }) => (
        <strong>
          <GridActionsCellItem icon={<Checkbox value={row.id} checked={row.AttendanceStatus === 1} onChange={changeAttendanceStatus} />} label="1" />
        </strong>
      ),
    },
  ];

  const changeAttendanceStatus = (e) => {
    const index = e.target.value - 1;
    students[index].AttendanceStatus === 1 ? students[index].AttendanceStatus = 0 : students[index].AttendanceStatus = 1;
    setStudents([...students]);
  }

  useEffect(() => {
    // If faculty has an ID, try fetching their allocated branches first.
    // Otherwise fallback directly to all branches so the dropdown is never empty.
    if (id && id !== "undefined" && id !== "null") {
      sendTaskRequest(
        { url: `/getFacultyBranch/${id}`, method: "get" },
        (branch) => {
          if (Array.isArray(branch) && branch.length > 0) {
            setBranchCollection(branch);
          } else {
            sendTaskRequest(
              { url: "/branch", method: "get" },
              (allBranches) => {
                const list = Array.isArray(allBranches) && allBranches.length > 0
                  ? allBranches
                  : [
                      "Computer Science and Engineering",
                      "Information Technology",
                      "Electronics and Communication Engineering",
                      "Mechanical Engineering",
                      "Civil Engineering"
                    ];
                setBranchCollection(list);
              }
            );
          }
        }
      );
    } else {
      // No faculty ID (e.g. admin) -> fetch all branches
      sendTaskRequest(
        { url: "/branch", method: "get" },
        (allBranches) => {
          const list = Array.isArray(allBranches) && allBranches.length > 0
            ? allBranches
            : [
                "Computer Science and Engineering",
                "Information Technology",
                "Electronics and Communication Engineering",
                "Mechanical Engineering",
                "Civil Engineering"
              ];
          setBranchCollection(list);
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onSubmit = () => {
    formikRef.current.submitForm().then((values) =>{
      setCurrentRow(values);
      sendTaskRequest({url:`/getAttendance/${encodeURIComponent(values.branch)}/${encodeURIComponent(values.semester)}/${encodeURIComponent(values.subject)}/${values.date}/${values.lectureNo}`,method:"get"},(students) => setStudents(students));
    })
  }

  const addAttendanceAcknowlegement = (acknowledgment) => {
    if (acknowledgment){
      toast.success("Attendance Marked Successfully");
      setStudents([]);
    }else{
      toast.error("Invalid Lecture No");
    }
  }

  const editAttendanceAcknowlegement = (acknowledgment) => {
    if (acknowledgment){
      toast.success("Attendance Upated Successfully");
      setStudents([]);
    }else{
      toast.error("Invalid Lecture No")
    }
  }

  const saveData = () => {
    if (students[0].objectId) {
      const objectId = students[0].objectId;
      students = students.map(student => ({ "studentId": student._id, "AttendanceStatus": student.AttendanceStatus }));
      const data = {
        "objectId" : objectId,
        "lectureNo" : currentRow.lectureNo,
        "students" : students
      }
      sendTaskRequest({url:"/editAttendance",data:data,method:"put"},editAttendanceAcknowlegement)
    } else {
      let presentAbsent = students.map(student => ({ "studentId": student._id, "AttendanceStatus": student.AttendanceStatus }));
      let Attendance = [{ "lectureNo": currentRow.lectureNo, "PresentAbsent": presentAbsent }];
      let data = {
        "Allocation_id": "",
        "Date": currentRow.date,
        Attendance
      }
      sendTaskRequest({url:"/addAttendance",data:data,method:"post"},addAttendanceAcknowlegement);
    }
  }

  return (
    <>
      <Grid container md={12} xs={12}>
        <DialogTitle style={{ paddingBottom: "0px" }}>
          Fill a Details
        </DialogTitle>
        <Formik
          innerRef={formikRef}
          initialValues={currentRow}
          onSubmit={(values) => values}        
        >
          {(formik) =>(
          <Form>
            <Grid
              item
              container
              display="flex"
              flexDirection="row"
              spacing={2}
              padding="1rem"
              paddingTop=""
            >
            <Grid item md={2.4}>
              <Typography>Select Any Branch</Typography>
              <Select
                control="select"
                type="text"
                fullWidth
                name="branch"
                value={formik.values.branch}
                displayEmpty
                onChange={(e) => {
                  const chosenBranch = e.target.value;
                  formik.setFieldValue('branch', chosenBranch);
                  // Reset downstream selections when branch changes
                  formik.setFieldValue('semester', '');
                  formik.setFieldValue('subject', '');
                  setSemCollection([]);
                  setSubjectCollection([]);
                  sendTaskRequest({ url: `/getFacultySem/${encodeURIComponent(chosenBranch)}`, method: "get" }, (semester) => {
                    if (Array.isArray(semester) && semester.length > 0) {
                      setSemCollection(semester);
                    } else {
                      // Fallback: try /semester/:branchName
                      sendTaskRequest({ url: `/semester/${encodeURIComponent(chosenBranch)}`, method: "get" }, (sems) => {
                        if (Array.isArray(sems) && sems.length > 0) {
                          setSemCollection(sems);
                        } else {
                          setSemCollection([1, 2, 3, 4, 5, 6, 7, 8]);
                        }
                      });
                    }
                  });
                }}
              >
                {branchCollection.length === 0 ? (
                  <MenuItem value="" disabled>
                    <em>No branches available</em>
                  </MenuItem>
                ) : (
                  branchCollection.map((d, index) => {
                    const val = typeof d === "object" && d !== null ? (d.branchname || d.name || String(index)) : d;
                    return <MenuItem key={`${val}-${index}`} value={val}>{val}</MenuItem>;
                  })
                )}
              </Select>
            </Grid>
            <Grid item md={2.4}>
              <Typography>Select Sem</Typography>
              <Select
                control="select"
                type="text"
                fullWidth
                name="semester"
                displayEmpty
                value={formik.values.semester}
                onChange={(e) => {
                  const chosenSem = e.target.value;
                  formik.setFieldValue('semester', chosenSem);
                  // Reset subject when semester changes
                  formik.setFieldValue('subject', '');
                  setSubjectCollection([]);
                  sendTaskRequest({ url: `/getFacultySubject/${encodeURIComponent(chosenSem)}`, method: "get" }, (subject) => {
                    const subjects = Array.isArray(subject) ? subject : [];
                    if (subjects.length > 0) {
                      setSubjectCollection(subjects);
                    } else {
                      // Fallback: try /subject/:branch/:semester
                      sendTaskRequest({ url: `/subject/${encodeURIComponent(formik.values.branch)}/${encodeURIComponent(chosenSem)}`, method: "get" }, (fallbackSubs) => {
                        setSubjectCollection(Array.isArray(fallbackSubs) ? fallbackSubs : []);
                      });
                    }
                  });
                }}
              >
                {semCollection.length === 0 ? (
                  <MenuItem value="" disabled>
                    <em>{formik.values.branch ? "Loading semesters..." : "Select branch first"}</em>
                  </MenuItem>
                ) : (
                  semCollection.map((d, i) => {
                    const val = typeof d === "object" && d !== null ? (d.sem ?? String(i)) : d;
                    return <MenuItem key={`${val}-${i}`} value={val}>{val}</MenuItem>;
                  })
                )}
              </Select>
            </Grid>
            <Grid item md={2.4}>
              <Typography>Select Any Subject</Typography>
              <Select
                control="select"
                type="text"
                fullWidth
                name="subject"
                displayEmpty
                value={formik.values.subject}
                onChange={(e) => {
                  formik.setFieldValue('subject', e.target.value);
                }}
              >
                {subjectCollection.length === 0 ? (
                  <MenuItem value="" disabled>
                    <em>{formik.values.semester ? "No subjects available" : "Select semester first"}</em>
                  </MenuItem>
                ) : (
                  subjectCollection.map((d, index) => {
                    const val = typeof d === "object" && d !== null ? (d.subject || d.name || String(index)) : d;
                    return (
                      <MenuItem key={`${val}-${index}`} value={val}>{val}</MenuItem>
                    );
                  })
                )}
              </Select>
            </Grid>
            <Grid item md={2.4} textAlign="left">
              <Typography>Select Lecture No</Typography>
              <TextField
                name="lectureNo"
                control="input"
                type="number"
                fullWidth
                value={formik.values.lectureNo}
                onChange={formik.handleChange}
              />
            </Grid>
            <Grid item md={2.4}>
              <Typography>Select Date</Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={formik.values.date}
                  name="date"
                  onChange={(e)=> {
                    formik.setFieldValue("date",`${e.$d.getMonth() + 1}-${e.$d.getDate()}-${e.$d.getFullYear()}`)
                  }}
                  renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </Grid>
              <Button
                onClick={onSubmit}
                variant="contained"
                sx={{ margin: "10px" }}
              >
              Take a Attendance
              </Button>
            </Grid>
          </Form>
          )}
        </Formik>
      </Grid>

    
      {students.length > 0 && (<Grid item xs={12} sx={{ borderTop: "1px solid black" }}>
        <Grid>
          <DialogTitle style={{ paddingBottom: "0px" }}>
            Attendance Sheet
          </DialogTitle>
          <div style={{ height: 300, width: "100%" }}>
            <DataGrid
              editMode="row"
              const
              rows={students.map((student, index) => ({ ...student, id: index + 1 }))}
              columns={columns}
              css={css`
                height: calc(100vh - 1500px - 30px) !important;
              `}
              experimentalFeatures={{ newEditingApi: true }}
              hideFooter
            />
          </div>
        </Grid>
        <br />
        <Button onClick={saveData} variant="contained">
        Submit
        </Button>
      </Grid>)
      }
    </>
  );
};
export default AttendenceCollection;