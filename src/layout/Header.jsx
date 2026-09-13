/* eslint-disable jsx-a11y/anchor-is-valid */
/** @jsxImportSource @emotion/react */
import { LogoutOutlined }         from "@mui/icons-material";
import AdminPanelSettingsIcon     from "@mui/icons-material/AdminPanelSettings";
import AccountBalanceIcon         from "@mui/icons-material/AccountBalance";
import AssessmentIcon             from "@mui/icons-material/Assessment";
import AssignmentIndIcon          from "@mui/icons-material/AssignmentInd";
import AutoStoriesIcon            from "@mui/icons-material/AutoStories";
import BadgeIcon                  from "@mui/icons-material/Badge";
import CalendarMonthIcon          from "@mui/icons-material/CalendarMonth";
import ChevronLeftIcon            from "@mui/icons-material/ChevronLeft";
import DashboardIcon              from "@mui/icons-material/Dashboard";
import EmojiPeopleIcon            from "@mui/icons-material/EmojiPeople";
import MenuIcon                   from "@mui/icons-material/Menu";
import PersonIcon                 from "@mui/icons-material/Person";
import QueryStatsIcon             from "@mui/icons-material/QueryStats";
import SchoolIcon                 from "@mui/icons-material/School";
import SupervisedUserCircleIcon   from "@mui/icons-material/SupervisedUserCircle";
import AttendanceLogo             from "../assets/images/attendanceLogo.jpg";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import MuiAppBar from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { Link } from "react-router-dom";
import { drawerWidth } from "../../src/constants/styleConstants";
import { useAuthContext, useLayoutContext } from "../context";

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  display: "block",
  position: "fixed",
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

const AdminDRAWER_ITEMS = [
  {
    route: "/users",
    literal: "Users",
    Icon: SupervisedUserCircleIcon,
  },
  {
    route: "/branch",
    literal: "Branches",
    Icon: AccountBalanceIcon,
  },
  {
    route: "/student",
    literal: "StudentDetails",
    Icon: SchoolIcon,
  },
  {
    route: "/faculty",
    literal: "Faculty",
    Icon: EmojiPeopleIcon,
  },

  {
    route: "/allocation",
    literal: "Faculty Allocation",
    Icon: AssignmentIndIcon,
  },

  {
    route: "/graph",
    literal: "Analytics",
    Icon: QueryStatsIcon,
  },

  {
    route: "/report",
    literal: "report",
    Icon: AssessmentIcon,
  },
];

const FacultyDrawer_Item = [
  {
    route: "/attendance",
    literal: "Mark Attendance",
    Icon: AutoStoriesIcon,
  },
  {
    route: "/branch",
    literal: "Branches",
    Icon: AccountBalanceIcon,
  },
  {
    route: "/student",
    literal: "Student Details",
    Icon: SchoolIcon,
  },
  {
    route: "/report",
    literal: "Report",
    Icon: AssessmentIcon,
  },
  {
    route: "/graph",
    literal: "Analytics",
    Icon: QueryStatsIcon,
  },
];

const StudentDrawer_Item = [
  {
    route:   "/student/dashboard",
    literal: "Dashboard",
    Icon:    DashboardIcon,
  },
  {
    route:   "/student/attendance",
    literal: "My Attendance",
    Icon:    AutoStoriesIcon,
  },
  {
    route:   "/student/timetable",
    literal: "Timetable",
    Icon:    CalendarMonthIcon,
  },
  {
    route:   "/student/profile",
    literal: "My Profile",
    Icon:    PersonIcon,
  },
];

// ── Role chip displayed in the AppBar ─────────────────────────────────────────
const ROLE_CHIP = {
  admin: {
    label: "Admin",
    icon: <AdminPanelSettingsIcon sx={{ fontSize: 16 }} />,
    sx: { bgcolor: "#7B1FA2", color: "#fff", "& .MuiChip-icon": { color: "#fff" } },
  },
  faculty: {
    label: "Faculty",
    icon: <BadgeIcon sx={{ fontSize: 16 }} />,
    sx: { bgcolor: "#1565C0", color: "#fff", "& .MuiChip-icon": { color: "#fff" } },
  },
  student: {
    label: "Student",
    icon: <SchoolIcon sx={{ fontSize: 16 }} />,
    sx: { bgcolor: "#2E7D32", color: "#fff", "& .MuiChip-icon": { color: "#fff" } },
  },
};

const RoleChip = ({ role }) => {
  const key = (role || "admin").toLowerCase();
  const cfg = ROLE_CHIP[key] || ROLE_CHIP.admin;
  return (
    <Chip
      icon={cfg.icon}
      label={cfg.label}
      size="small"
      sx={{ fontWeight: 700, mr: 2, ...cfg.sx }}
    />
  );
};

const Header = () => {
  const { isDrawerOpened, toggleDrawer } = useLayoutContext();
  const { user, logout } = useAuthContext();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const DRAWER_ITEMS =
    user === "faculty"
      ? FacultyDrawer_Item
      : user === "student"
      ? StudentDrawer_Item
      : AdminDRAWER_ITEMS;

  const mainListItems = (
    <>
      {DRAWER_ITEMS.map(({ route, literal, Icon }) => (
        <Link
          to={route}
          key={literal}
          css={{ textDecoration: "none", color: "black" }}
        >
          <ListItemButton
            classes={{
              root: { background: "red" },
              selected: { background: "green" },
            }}
          >
            <ListItemIcon>
              <Icon />
            </ListItemIcon>
            <ListItemText primary={literal} />
          </ListItemButton>
        </Link>
      ))}
    </>
  );

  const handleLogoutClick = () => {
    setConfirmOpen(true);
  };

  const handleConfirmLogout = () => {
    setConfirmOpen(false);
    logout();
  };

  const handleCancelLogout = () => {
    setConfirmOpen(false);
  };

  return (
    <Box>
      <AppBar open={isDrawerOpened}>
        <Toolbar sx={{ pr: "24px" }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{
              marginRight: "36px",
              ...(isDrawerOpened && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>

          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >
            <Box
              component="img"
              alt="College Attendance Logo"
              src={AttendanceLogo}
              sx={{
                width: 38,
                height: 38,
                borderRadius: "10px",
                objectFit: "cover",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
            />
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 800,
                color: "#ffffff",
                letterSpacing: "-0.01em",
                display: { xs: "none", sm: "block" },
              }}
            >
              College Attendance Systems
            </Typography>
          </Box>

          {/* Logged-in role badge */}
          <RoleChip role={user} />

          {/* Logout button */}
          <Tooltip title="Logout">
            <Button
              color="inherit"
              variant="outlined"
              startIcon={<LogoutOutlined />}
              onClick={handleLogoutClick}
              aria-label="logout"
              sx={{
                borderColor: "rgba(255,255,255,0.6)",
                textTransform: "none",
                fontWeight: 600,
                "&:hover": {
                  borderColor: "#fff",
                  backgroundColor: "rgba(255,255,255,0.12)",
                },
              }}
            >
              Logout
            </Button>
          </Tooltip>
        </Toolbar>
      </AppBar>

      {/* Confirmation dialog */}
      <Dialog
        open={confirmOpen}
        onClose={handleCancelLogout}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle id="logout-dialog-title">Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description">
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelLogout} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmLogout}
            color="error"
            variant="contained"
            autoFocus
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>

      <Drawer
        variant="permanent"
        sx={{ position: "fixed" }}
        open={isDrawerOpened}
      >
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            px: [1],
          }}
        >
          <IconButton onClick={toggleDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        <Divider />
        <List component="nav">
          {mainListItems}
          <Divider sx={{ my: 1 }} />
        </List>
      </Drawer>
    </Box>
  );
};

export default Header;
