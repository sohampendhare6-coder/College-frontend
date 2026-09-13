import AddIcon from "@mui/icons-material/Add";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import SchoolIcon from "@mui/icons-material/School";
import BadgeIcon from "@mui/icons-material/Badge";
import Button from "@mui/material/Button";
import { useState } from "react";
import { Box, Chip } from "@mui/material";
import { css } from "@emotion/react";
import { deleteUserData, getUsers } from "../../api/users";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { DataGrid } from "@mui/x-data-grid";
import { GridActionsCellItem } from "@mui/x-data-grid-pro";
import { toast } from "react-toastify";
import Loading from "../../common/Loader";
import { useGlobalContext } from "../../context/GlobalContext";
import useProgress from "../../hooks/useProgress";
import ConfirmDialog from "../../common/ConFirmDialog";
import CreateUserForm from "./dialog";

// ── Role badge config ─────────────────────────────────────────────────────────
const ROLE_CONFIG = {
  admin: {
    label: "Admin",
    color: "#7B1FA2",       // purple
    bgcolor: "#F3E5F5",
    icon: <AdminPanelSettingsIcon sx={{ fontSize: 14 }} />,
  },
  faculty: {
    label: "Faculty",
    color: "#1565C0",       // blue
    bgcolor: "#E3F2FD",
    icon: <BadgeIcon sx={{ fontSize: 14 }} />,
  },
  student: {
    label: "Student",
    color: "#2E7D32",       // green
    bgcolor: "#E8F5E9",
    icon: <SchoolIcon sx={{ fontSize: 14 }} />,
  },
};

const RoleBadge = ({ role }) => {
  // Normalise to lowercase; fall back to "admin" when missing
  const key = (role || "admin").toLowerCase();
  const cfg = ROLE_CONFIG[key] || ROLE_CONFIG.admin;
  return (
    <Chip
      icon={cfg.icon}
      label={cfg.label}
      size="small"
      sx={{
        bgcolor: cfg.bgcolor,
        color: cfg.color,
        fontWeight: 700,
        border: `1px solid ${cfg.color}30`,
        "& .MuiChip-icon": { color: cfg.color },
      }}
    />
  );
};

const initialValues = {
  email: "",
  firebaseId: "",
  role: "admin",
};

const Users = () => {
  const { users, setUsers } = useGlobalContext();

  const [currentRow, setCurrentRow] = useState(initialValues);
  const [open, setOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    subTitle: "",
  });

  const [getAllUsers, loading] = useProgress(getUsers);
  const handleClickOpen = () => {
    setCurrentRow(initialValues);
    setOpen(true);
  };

  const loadData = () => {
    getAllUsers().then(setUsers);
  };

  const handleClose = () => {
    setOpen(false);
    loadData();
  };

  const handleEditClick = (row) => (event) => {
    event.stopPropagation();
    setCurrentRow({
      email: row.email || initialValues.email,
      // normalise role; fall back to "admin" when missing
      role: (row.role || initialValues.role).toLowerCase(),
      firebaseId: row.firebaseId,
    });
    setOpen(true);
  };

  const onDelete = (row) => {
    setConfirmDialog({
      ...confirmDialog,
      isOpen: false,
    });
    deleteUserData(row)
      .then(() => {
        loadData();
        toast.success("User Delete successfully");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeleteClick = (row) => (event) => {
    event.stopPropagation();
    setConfirmDialog({
      isOpen: true,
      title: "Are you sure to delete this record?",
      subTitle: "You can't undo this operation",
      onConfirm: () => {
        onDelete(row);
      },
    });
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "email", headerName: "Email", width: 300, flex: 1 },
    {
      field: "role",
      headerName: "Role",
      width: 140,
      renderCell: ({ row }) => <RoleBadge role={row.role} />,
    },
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
    <Box>
      {loading ? (
        <Loading title="Loading Users..." />
      ) : (
        <>
          <Button
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleClickOpen}
          >
            Add User
          </Button>
          {open && (
            <CreateUserForm handleClose={handleClose} currentRow={currentRow} />
          )}
          <div style={{ height: 475, width: "100%" }}>
            <DataGrid
              editMode="row"
              rows={users.map((item, index) => ({ ...item, id: index + 1 }))}
              columns={columns}
              css={css`
                height: calc(100vh - 1500px - 30px) !important;
              `}
              experimentalFeatures={{ newEditingApi: true }}
            />
          </div>
          {confirmDialog && (
            <ConfirmDialog
              confirmDialog={confirmDialog}
              setConfirmDialog={setConfirmDialog}
            />
          )}
        </>
      )}
    </Box>
  );
};

export default Users;
