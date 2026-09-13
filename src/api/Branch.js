import http from "../http-common";

// ─── Branch CRUD ─────────────────────────────────────────────────────────────

export const getBranch = async () => {
  const res = await http.get("/getBranch");
  // backend returns a plain array now
  return Array.isArray(res.data) ? res.data : [];
};

export const getBranchById = async (id) => {
  const res = await http.get(`/getBranch/${id}`);
  return res.data;
};

export const createBranch = async (values) => {
  const res = await http.post("/addBranch", values);
  return res.data; // { insertedId }
};

export const updateBranch = async (values) => {
  const res = await http.put("/editBranch", values);
  return res.data;
};

export const deleteBranch = async (id) => {
  const res = await http.delete(`/deleteBranch?id=${id}`);
  return res.data;
};

// ─── Dropdown helpers (used by Attendance / Allocation) ──────────────────────

export const getbranchName = async () => {
  try {
    const res = await http.get("/branch");
    return Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getSem = async (branch) => {
  try {
    const res = await http.get(`/semester/${branch}`);
    return Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getSubject = async (branch, semester) => {
  try {
    const res = await http.get(`/subject/${branch}/${semester}`);
    return Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getId = async (fName) => {
  try {
    const res = await http.get(`/id/${fName}`);
    return res.data;
  } catch (error) {
    console.error(error);
  }
};

export const getNonAllocatedSubjects = async (facultyId, branch, sem, subject) => {
  try {
    const res = await http.get(
      `/getNonAllocatedSubjects/${facultyId}/${branch}/${sem}/${subject}`
    );
    return Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    console.error(error);
    return [];
  }
};
