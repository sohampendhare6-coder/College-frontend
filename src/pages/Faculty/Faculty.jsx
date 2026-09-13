import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { css } from "@emotion/react";
import FacultyDialog from "./AddFacultyDailoge";
import { useState, useEffect } from "react";
import { GridActionsCellItem } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { toast } from "react-toastify";
import useHttp from "../../hooks/useHttp";

const FacultyCollection = () => {
  const {error, sendRequest : fetchTasks} = useHttp();
  const [open, setOpen] = useState(false);
  const [facultyCollection, setFacultyCollection] = useState([]);
  const [currentRow, setCurrentRow] = useState();

  const initialValues = {
    _id : "",
    fname: "",
    qulification: "",
    experience: "",
    expertise: "",
    email:"",
    password:""
  };

  const loadData = (data) => {
    setFacultyCollection(data);
  };

  const resetAfterDelection = (id,response) => {
    if (response){
      toast.success("Record Delete Sucessfully");
      const indexDelete = facultyCollection.findIndex(faculty => faculty._id === id)
      setFacultyCollection(prev => prev.filter((_,index) => index !== indexDelete))
    }
  }

  const reloadNewData = (faculty, id) => {
    // Backend now handles Registration entry inside /addFaculty — no second call needed
    setFacultyCollection((prev) => prev.concat({ ...faculty, _id: id }));
    toast.success("Faculty added successfully");
  };

  useEffect(() => {
    fetchTasks({url:'/getFaculty',method:'get'},loadData);
  },[fetchTasks]);

  const handleClickOpen = () => {
    setCurrentRow(initialValues);
    setOpen(true);
  };

  const handleClickClose = () => {
    setOpen(false);
  };

  const reloadAfterUpdation = (data,response) => {
      const indexEdit = facultyCollection.findIndex(faculty => faculty._id === data._id)
      facultyCollection[indexEdit] = data
      setFacultyCollection([...facultyCollection])
      toast.success("Data updated successfully");
  }

  const handleDeleteClick = (row) => (event) => {
    event.stopPropagation();
    if (window.confirm("Are you sure to delete?") === true) {
      fetchTasks({url : "/deleteFaculty",method:"delete",id:row._id},resetAfterDelection.bind(null,row._id))
    }
  };
  
  const handleEditClick = (row) => (event) => {
    event.stopPropagation();
    setCurrentRow({
      _id: row._id ? row._id : "",
      fname: row.fname ? row.fname : "",
      qulification: row.qulification ? row.qulification : "",
      experience: row.experience ? row.experience : "",
      expertise: row.expertise ? row.expertise : "",
    });
    setOpen(true);
  };

  if (error){
    toast.error(error);
  }

  const columns = [
    { field: "id", headerName: "SR.", width: 50 },
    { field: "fname", headerName: "Facuty Name", width: 200 },
    { field: "qulification", headerName: "Qulification ", width: 200 },
    { field: "experience", headerName: "Expirience ", width: 200 },
    { field: "expertise", headerName: "Expertise ", width: 200 },
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
        <FacultyDialog
          open={open}
          onCancel={handleClickClose}
          loadData={loadData}
          currentRow={currentRow}
          reloadNewData={reloadNewData}
          reloadAfterUpdation={reloadAfterUpdation}
        />
      )}
      <Button
        onClick={handleClickOpen}
        variant="contained"
        sx={{ margin: "10px" }}
      >
        Add Faculty
      </Button>
      <div style={{ height: 475, width: "100%" }}>
        <DataGrid
          editMode="row"
          rows={facultyCollection.map((student, index) => ({
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

export default FacultyCollection;