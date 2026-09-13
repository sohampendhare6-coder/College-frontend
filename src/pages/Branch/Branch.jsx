import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SearchIcon from "@mui/icons-material/Search";
import SchoolIcon from "@mui/icons-material/School";
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import BranchDialog from "./AddBranchDailoge";
import { getBranch, deleteBranch } from "../../api/Branch";

// ─── Status chip colours ──────────────────────────────────────────────────────
const statusColor = (status) =>
  status === "Active" ? "success" : "default";

// ─── Code badge colours (cycles through a palette) ───────────────────────────
const BADGE_COLORS = [
  "#1565C0", "#6A1B9A", "#00695C", "#AD1457",
  "#E65100", "#558B2F", "#4527A0", "#37474F",
];
const badgeColor = (index) => BADGE_COLORS[index % BADGE_COLORS.length];

const BranchCollection = () => {
  const [branches, setBranches] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState(null);

  const blankBranch = {
    _id: "",
    branchname: "",
    code: "",
    hodName: "",
    totalSemesters: 8,
    status: "Active",
    semesters: [],
  };

  // ── Load all branches ────────────────────────────────────────────────────────
  const loadBranches = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getBranch();
      setBranches(data);
      setFiltered(data);
    } catch (err) {
      toast.error("Failed to load branches");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBranches();
  }, [loadBranches]);

  // ── Search filter ────────────────────────────────────────────────────────────
  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      branches.filter(
        (b) =>
          b.branchname?.toLowerCase().includes(q) ||
          b.code?.toLowerCase().includes(q) ||
          b.hodName?.toLowerCase().includes(q)
      )
    );
  }, [search, branches]);

  // ── Dialog helpers ───────────────────────────────────────────────────────────
  const handleAdd = () => {
    setCurrentRow(blankBranch);
    setOpen(true);
  };

  const handleEdit = (branch) => {
    setCurrentRow({ ...branch });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentRow(null);
  };

  // ── Delete ───────────────────────────────────────────────────────────────────
  const handleDelete = async (branch) => {
    if (!window.confirm(`Delete "${branch.branchname}"?`)) return;
    try {
      await deleteBranch(branch._id);
      setBranches((prev) => prev.filter((b) => b._id !== branch._id));
      toast.success("Branch deleted successfully");
    } catch (err) {
      const msg = err?.response?.data?.error || err.message || "Failed to delete branch";
      toast.error(msg);
    }
  };

  // ── After save (add or edit) ─────────────────────────────────────────────────
  const handleSaved = (savedBranch, isEdit) => {
    if (isEdit) {
      setBranches((prev) =>
        prev.map((b) => (b._id === savedBranch._id ? savedBranch : b))
      );
      toast.success("Branch updated successfully");
    } else {
      setBranches((prev) => [...prev, savedBranch]);
      toast.success("Branch added successfully");
    }
    handleClose();
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* ── Header bar ────────────────────────────────────────────────────── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AccountBalanceIcon color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h5" fontWeight={700}>
            Departments &amp; Branches
          </Typography>
          <Chip
            label={`${branches.length} total`}
            size="small"
            color="primary"
            variant="outlined"
            sx={{ ml: 1 }}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
          <TextField
            size="small"
            placeholder="Search branch / code / HOD…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: 260 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
          >
            Add Branch
          </Button>
        </Box>
      </Box>

      {/* ── Card grid ─────────────────────────────────────────────────────── */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
          <CircularProgress />
        </Box>
      ) : filtered.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: 10, color: "text.secondary" }}>
          <SchoolIcon sx={{ fontSize: 64, opacity: 0.3 }} />
          <Typography variant="h6" mt={2}>
            {search ? "No branches match your search" : "No branches yet — add one!"}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filtered.map((branch, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={branch._id}>
              <Card
                elevation={3}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderTop: `4px solid ${badgeColor(index)}`,
                  borderRadius: 2,
                  transition: "box-shadow 0.2s",
                  "&:hover": { boxShadow: 8 },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  {/* Code badge + status */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 1.5,
                    }}
                  >
                    <Chip
                      label={branch.code || "—"}
                      size="small"
                      sx={{
                        bgcolor: badgeColor(index),
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: "0.75rem",
                        letterSpacing: 0.5,
                      }}
                    />
                    <Chip
                      label={branch.status || "Active"}
                      size="small"
                      color={statusColor(branch.status)}
                      variant="outlined"
                    />
                  </Box>

                  {/* Branch name */}
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    gutterBottom
                    sx={{ lineHeight: 1.3 }}
                  >
                    {branch.branchname}
                  </Typography>

                  {/* HOD */}
                  {branch.hodName && (
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      <b>HOD:</b> {branch.hodName}
                    </Typography>
                  )}

                  {/* Semesters / subjects summary */}
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      mt: 1.5,
                      pt: 1.5,
                      borderTop: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="h6" fontWeight={700} color="primary">
                        {branch.totalSemesters || branch.semesters?.length || 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Semesters
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: "center" }}>
                      <Typography variant="h6" fontWeight={700} color="secondary">
                        {branch.semesters?.reduce(
                          (sum, s) => sum + (s.subject?.length || 0),
                          0
                        ) || 0}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Subjects
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>

                {/* Actions */}
                <CardActions
                  sx={{
                    justifyContent: "flex-end",
                    px: 2,
                    pb: 1.5,
                    borderTop: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Tooltip title="Edit branch">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleEdit(branch)}
                      aria-label="edit branch"
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete branch">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(branch)}
                      aria-label="delete branch"
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* ── Add / Edit dialog ──────────────────────────────────────────────── */}
      {open && currentRow && (
        <BranchDialog
          open={open}
          currentRow={currentRow}
          onClose={handleClose}
          onSaved={handleSaved}
        />
      )}
    </Box>
  );
};

export default BranchCollection;
