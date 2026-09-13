import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { css } from "@emotion/react";
import StudentDialog from "./AddStudentDailoge";
import { useState, useEffect } from "react";
import { GridActionsCellItem } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import AddMultipleStudents from "./AddMultipalStudent";
import useHttp from "../../hooks/useHttp";
import { toast } from "react-toastify";

const StudentCollection = () => {
  const {error,sendRequest: fetchTasks} = useHttp();
  const [open, setOpen] = useState(false);
  const [openAddFileDialog, setOpenAddFileDialog] = useState(false);
  const [studentCollection, setStudentCollection] = useState([]);
  const [currentRow, setCurrentRow] = useState();

  const initialValues = {
    _id: "",
    fname: "",
    mname: "",
    sname: "",
    address: "",
    enroll: "",
    course: "",
    sem: "",
    pcontact: "",
    scontact: "",
    email: "",
    password: "",
  };

  const loadData = (data) => {
    setStudentCollection(data);
  };

  const addGetNewStudent = (student) => {
    setStudentCollection((prev) => prev.concat(student));
  }
  
  const resetAfterDelection = (id,response) => {
    if (response){
      toast.success("Record Deleted Successfully");
      const indexDelete = studentCollection.findIndex(student => student._id === id)
      setStudentCollection(prev => prev.filter((_,index) => index !== indexDelete))
    }
  }
  
  if (error){
    toast.error(error);
  }
  
  const resetAfterUpdation = (data) => {
    const indexEdit = studentCollection.findIndex(student => student._id === data._id)
    studentCollection[indexEdit] = data
    setStudentCollection([...studentCollection])
  }

  useEffect(() => {
     fetchTasks({url:'/getStudents',method:'get'},loadData);
  }, [fetchTasks]);

  const handleClickOpen = () => {
    setCurrentRow(initialValues);
    setOpen(true);
  };

  const handleClickClose = () => {
    setOpen(false);
  };

  const handleOpenAddFileDialog = () => {
    setOpenAddFileDialog(true);
  };

  const handleCloseAddFileDialog = () => {
    setOpenAddFileDialog(false);
  };

  const handleDeleteClick = (row) => (event) => {
    event.stopPropagation();
    if (window.confirm("Are you sure to delete?") === true) {
       fetchTasks({url:'/deleteStudent',method:"delete",id:row._id},resetAfterDelection.bind(null,row._id))
    }
  };
  
  const handleEditClick = (row) => (event) => {
    event.stopPropagation();
    setCurrentRow({
      _id : row._id ? row._id :"",
      fname: row.fname ? row.fname : "",
      mname: row.mname ? row.mname : "",
      sname: row.sname ? row.sname : "",
      address: row.address ? row.address : "",
      enroll: row.enroll ? row.enroll : "",
      course: row.course ? row.course : "",
      sem: row.sem ? row.sem : "",
      pcontact: row.pcontact ? row.pcontact : "",
      scontact: row.scontact ? row.scontact : "",
    });
    setOpen(true);
  };

  const columns = [
    {field : "id", headerName: "SR.", width:50},
    { field: "fname", headerName: "First Name", width: 150 },
    { field: "mname", headerName: "Middle Name", width: 150 },
    { field: "sname", headerName: "SureName", width: 150 },
    { field: "address", headerName: "Address", width: 150 },
    { field: "enroll", headerName: "Enrollment No", width: 150 },
    { field: "course", headerName: "Course", width: 150 },
    { field: "sem", headerName: "Sem", width: 50 },
    { field: "pcontact", headerName: "Parents Contact ", width: 150 },
    { field: "scontact", headerName: "Student Contact ", width: 150 },
    {
      field: "delete",
      headerName: "Delete",
      width: 80,
      renderCell: ({ row }) => (
        <strong>
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(row)}
            color="inherit"
          />
        </strong>
      ),
    },
    {
      field: "edit",
      headerName: "Edit",
      width: 80,
      renderCell: ({ row }) => (
        <strong>
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            onClick={handleEditClick(row)}
            color="inherit"
          />
        </strong>
      ),
    },
  ];

  return (
    <>
      {open && (
        <StudentDialog
          open={open}
          onCancel={handleClickClose}
          loadData={loadData}
          currentRow={currentRow}
          addGetNewStudent = {addGetNewStudent}
          resetAfterUpdation = {resetAfterUpdation}
        />
      )}
      {openAddFileDialog && (
        <AddMultipleStudents
          openAddFileDialog={openAddFileDialog}
          closeAddFileDialog={handleCloseAddFileDialog}
        />
      )}
      <Button
        onClick={handleClickOpen}
        variant="contained"
        sx={{ margin: "10px" }}
      >
        Add
      </Button>
      <Button onClick={handleOpenAddFileDialog} variant="contained">
        Add From Excel File
      </Button>
      <div style={{ height: 450, width: "100%" }}>
        <DataGrid
          editMode="row"
          rows={studentCollection.map((student, index) => ({
            ...student,
            id: index + 1,
          }))}
          columns={columns}
          css={css`
            height: calc(100vh - 1500px - 30px) !important;
          `}
          experimentalFeatures={{ newEditingApi: true }}
        />
      </div>
    </>
  );
};
export default StudentCollection;