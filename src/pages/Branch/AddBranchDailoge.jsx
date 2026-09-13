import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createBranch, updateBranch } from "../../api/Branch";

// ─── helpers ──────────────────────────────────────────────────────────────────
const buildSemesters = (count) =>
  Array.from({ length: count }, (_, i) => ({ sem: i + 1, subject: [] }));

const INITIAL_ERRORS = {
  branchname: "",
  code: "",
  totalSemesters: "",
};

const BranchDialog = ({ open, currentRow, onClose, onSaved }) => {
  const isEdit = Boolean(currentRow?._id);

  // ── form state ───────────────────────────────────────────────────────────────
  const [branchname, setBranchname] = useState("");
  const [code, setCode] = useState("");
  const [hodName, setHodName] = useState("");
  const [totalSemesters, setTotalSemesters] = useState(8);
  const [status, setStatus] = useState("Active");
  const [semesters, setSemesters] = useState([]);

  // subject-entry state
  const [activeSem, setActiveSem] = useState(1);
  const [subjectInput, setSubjectInput] = useState("");
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [saving, setSaving] = useState(false);

  // Populate from currentRow on open
  useEffect(() => {
    if (!currentRow) return;
    setBranchname(currentRow.branchname || "");
    setCode(currentRow.code || "");
    setHodName(currentRow.hodName || "");
    const semCount =
      currentRow.totalSemesters ||
      currentRow.semesters?.length ||
      8;
    setTotalSemesters(semCount);
    setStatus(currentRow.status || "Active");

    // Preserve existing semester subjects when editing
    if (currentRow.semesters?.length) {
      setSemesters(currentRow.semesters);
    } else {
      setSemesters(buildSemesters(semCount));
    }
    setActiveSem(1);
    setErrors(INITIAL_ERRORS);
  }, [currentRow]);

  // Rebuild semesters array when totalSemesters changes (preserve existing subjects)
  const handleSemesterCountChange = (e) => {
    const count = parseInt(e.target.value, 10) || 0;
    setTotalSemesters(count);
    setSemesters((prev) => {
      const next = buildSemesters(count);
      return next.map((s) => {
        const existing = prev.find((p) => p.sem === s.sem);
        return existing ? existing : s;
      });
    });
    if (count > 0 && activeSem > count) setActiveSem(1);
  };

  // ── subject management ───────────────────────────────────────────────────────
  const addSubject = () => {
    const trimmed = subjectInput.trim();
    if (!trimmed) return;
    setSemesters((prev) =>
      prev.map((s) => {
        if (s.sem !== activeSem) return s;
        if (s.subject.includes(trimmed)) {
          toast.warning("Subject already added");
          return s;
        }
        return { ...s, subject: [...s.subject, trimmed] };
      })
    );
    setSubjectInput("");
  };

  const removeSubject = (sem, subject) => {
    setSemesters((prev) =>
      prev.map((s) =>
        s.sem !== sem
          ? s
          : { ...s, subject: s.subject.filter((sub) => sub !== subject) }
      )
    );
  };

  // ── validation ───────────────────────────────────────────────────────────────
  const validate = () => {
    const errs = { ...INITIAL_ERRORS };
    if (!branchname.trim()) errs.branchname = "Branch name is required";
    if (!code.trim()) errs.code = "Code / abbreviation is required";
    if (!totalSemesters || totalSemesters < 1 || totalSemesters > 12)
      errs.totalSemesters = "Enter a value between 1 and 12";
    setErrors(errs);
    return !Object.values(errs).some(Boolean);
  };

  // ── submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);

    const payload = {
      ...(isEdit && { _id: currentRow._id }),
      branchname: branchname.trim(),
      code: code.trim().toUpperCase(),
      hodName: hodName.trim(),
      totalSemesters,
      status,
      semesters,
    };

    try {
      if (isEdit) {
        await updateBranch(payload);
        onSaved(payload, true);
      } else {
        const result = await createBranch(payload);
        onSaved({ ...payload, _id: result?.insertedId }, false);
      }
    } catch (err) {
      const msg = err?.response?.data?.error || err.message || "Failed to save branch";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  // ── current semester's subject list ─────────────────────────────────────────
  const activeSemObj = semesters.find((s) => s.sem === activeSem);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      {/* Title */}
      <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="h6" fontWeight={700}>
          {isEdit ? "Edit Branch" : "Add New Branch"}
        </Typography>
        <IconButton onClick={onClose} size="small" aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ pt: 3 }}>
        <Grid container spacing={3}>

          {/* ── Left column: branch details ─────────────────────────────── */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom color="primary">
              Branch Details
            </Typography>

            <TextField
              label="Branch / Department Name"
              value={branchname}
              onChange={(e) => setBranchname(e.target.value)}
              error={Boolean(errors.branchname)}
              helperText={errors.branchname}
              fullWidth
              margin="normal"
              required
              placeholder="e.g. Computer Science and Engineering"
            />

            <TextField
              label="Code / Abbreviation"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              error={Boolean(errors.code)}
              helperText={errors.code || "e.g. CSE, IT, ECE, MECH"}
              fullWidth
              margin="normal"
              required
              placeholder="e.g. CSE"
              inputProps={{ maxLength: 10 }}
            />

            <TextField
              label="Head of Department (HOD)"
              value={hodName}
              onChange={(e) => setHodName(e.target.value)}
              fullWidth
              margin="normal"
              placeholder="e.g. Dr. A. Sharma"
            />

            <TextField
              label="Total Semesters"
              type="number"
              value={totalSemesters}
              onChange={handleSemesterCountChange}
              error={Boolean(errors.totalSemesters)}
              helperText={errors.totalSemesters}
              fullWidth
              margin="normal"
              required
              inputProps={{ min: 1, max: 12 }}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* ── Right column: subject management ────────────────────────── */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" fontWeight={700} gutterBottom color="primary">
              Subjects per Semester
            </Typography>

            {semesters.length === 0 ? (
              <Typography variant="body2" color="text.secondary" mt={2}>
                Set the number of semesters on the left to manage subjects.
              </Typography>
            ) : (
              <>
                {/* Semester selector tabs */}
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                  {semesters.map((s) => (
                    <Chip
                      key={s.sem}
                      label={`Sem ${s.sem}`}
                      size="small"
                      clickable
                      color={activeSem === s.sem ? "primary" : "default"}
                      variant={activeSem === s.sem ? "filled" : "outlined"}
                      onClick={() => setActiveSem(s.sem)}
                    />
                  ))}
                </Box>

                {/* Add subject input */}
                <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                  <TextField
                    size="small"
                    label={`Add subject to Sem ${activeSem}`}
                    value={subjectInput}
                    onChange={(e) => setSubjectInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addSubject()}
                    fullWidth
                    placeholder="e.g. Data Structures"
                  />
                  <Tooltip title="Add subject">
                    <IconButton
                      color="primary"
                      onClick={addSubject}
                      aria-label="add subject"
                    >
                      <AddCircleOutlineIcon />
                    </IconButton>
                  </Tooltip>
                </Box>

                {/* Subject chips */}
                <Box
                  sx={{
                    minHeight: 80,
                    p: 1.5,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    bgcolor: "grey.50",
                  }}
                >
                  {activeSemObj?.subject?.length ? (
                    activeSemObj.subject.map((sub) => (
                      <Chip
                        key={sub}
                        label={sub}
                        size="small"
                        onDelete={() => removeSubject(activeSem, sub)}
                        deleteIcon={
                          <Tooltip title="Remove">
                            <DeleteOutlineIcon fontSize="small" />
                          </Tooltip>
                        }
                        color="primary"
                        variant="outlined"
                      />
                    ))
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      No subjects added for Semester {activeSem} yet.
                    </Typography>
                  )}
                </Box>

                {/* Total subject count across all semesters */}
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 1, display: "block" }}
                >
                  Total subjects across all semesters:{" "}
                  <b>
                    {semesters.reduce(
                      (sum, s) => sum + (s.subject?.length || 0),
                      0
                    )}
                  </b>
                </Typography>
              </>
            )}
          </Grid>
        </Grid>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={saving}
        >
          {saving ? "Saving…" : isEdit ? "Update Branch" : "Add Branch"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BranchDialog;
