import { Box, Button, Input, SnackbarContent } from "@mui/material";
import React, { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import Tooltip from "@mui/material/Tooltip";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";
import {
  MenuItem,
  Avatar,
  Menu,
  List,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Skeleton,
  Stack,
} from "@mui/material";
import { ChatState } from "../context/ChatProvider";
import Profile from "./Profile";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserListItems from "./UserListItems";

function SideDrawer() {
  const [filter, setFilter] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState();
  const [open, setOpen] = useState(false);
  const [notification, setNotification] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarColor, setSnackbarColor] = useState();

  const navigate = useNavigate();

  const openBtn = Boolean(anchorEl);
  const { user, chat, setChat, setSingleChat } = ChatState();

  const handleSearch = (e) => {
    setSearchInput(e.target.value);
  };

  const handleCloseToast = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseToast}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  const accessChat = async (userId) => {
    try {
      setChatLoading(true);
      console.log("userId:-", userId);

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(`/api/chat`, { userId }, config);
      console.log("DATA:-", data);

      if (!chat.find((c) => c._id === data._id)) {
        setChat([data, ...chat]);
      }

      console.log("chat:-", chat);
      setSingleChat(data);
      setChatLoading(false);
      setOpen(false);
    } catch (error) {
      // console.log("error:-",error);
      setSnackbarMessage(error.message);
      setSnackbarColor("red");
      setSnackbarOpen(true);
      setTimeout(() => {
        setSnackbarOpen(false);
      }, 3000);
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchInput || searchInput.trim() === "") {
      console.log("hello");
      setSnackbarMessage("Please enter a valid query");
      setSnackbarColor("#FF9966");
      setSnackbarOpen(true);
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `/api/user?search=${searchInput}`,
        config
      );
      // console.log(data);
      setLoading(false);
      setFilter(data);
    } catch (error) {
      setLoading(false);
      setSnackbarMessage("Error occurred while fetching data");
      setSnackbarColor("red");
      setSnackbarOpen(true);
    }
  };

  const logoutHandle = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const notificationHandle = () => {
    setNotification(!notification);
  };

  return (
    <>
      {/* {JSON.stringify(filter)} */}
      <div>
        <Box className="sideDrawer_box">
          <div className="search_box">
            <Tooltip
              title="Search user to chat"
              sx={{ color: "black" }}
              className="Search_bar"
            >
              <Button
                style={{ textTransform: "none", padding: "0.4rem .7rem" }}
                className="search_btn"
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
              >
                <SearchIcon />
                <span className="hideOnSmallScreen">Search User</span>
              </Button>
            </Tooltip>
          </div>

          <h3>chat app</h3>
          <div className="notification_bar">
            <Tooltip>
              <Button
                style={{ textTransform: "none", padding: "0.4rem .7rem" }}
                className="notification_btn"
                color="inherit"
                onClick={notificationHandle}
                edge="start"
              >
                <NotificationsIcon />
              </Button>
            </Tooltip>
            <Button
              id="demo-positioned-button"
              aria-controls={openBtn ? "demo-positioned-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openBtn ? "true" : undefined}
              onClick={handleClick}
            >
              <Avatar alt={user.name} src={user.pic} />
            </Button>
            <Menu
              id="demo-positioned-menu"
              aria-labelledby="demo-positioned-button"
              anchorEl={anchorEl}
              open={openBtn}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <MenuItem>{<Profile user={user} />}</MenuItem>
              <hr />
              <MenuItem onClick={handleClose}>
                <Button
                  sx={{
                    textTransform: "none",
                    color: "black",
                    fontWeight: "bold",
                  }}
                  onClick={logoutHandle}
                >
                  Logout
                </Button>
              </MenuItem>
            </Menu>
          </div>

          <Drawer
            variant="temporary"
            anchor="left"
            open={open}
            onClose={handleDrawerClose}
            ModalProps={{ keepMounted: true }}
          >
            <h3 style={{ margin: "10px auto" }}>Search User</h3>
            <Divider />
            <Box
              sx={{
                minWidth: "300px",
                margin: ".5rem",
                display: "flex",
                justifyContent: "space-evenly",
              }}
            >
              <input
                name="search"
                placeholder="Search by name or email"
                autoComplete="off"
                value={searchInput}
                onChange={handleSearch}
                type="text"
              />
              <Button variant="contained" onClick={handleSearchSubmit}>
                Go
              </Button>
            </Box>
            <Box
              sx={{
                minWidth: "300px",
                margin: ".5rem",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {loading ? (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      height: "40vh",
                      alignItems: "center",
                    }}
                  >
                    <CircularProgress />
                  </Box>
                </>
              ) : (
                filter.map((val) => (
                  <>
                    <UserListItems
                      key={val._id}
                      name={val.name}
                      email={val.email}
                      pic={val.pic}
                      handleFunction={() => accessChat(val._id)}
                    />
                  </>
                ))
              )}
              <Box sx={{ margin: "auto auto"}}>
                {chatLoading && <CircularProgress />}
              </Box>
            </Box>
          </Drawer>

          <Drawer
            variant="temporary"
            anchor="right"
            open={notification}
            onClose={notificationHandle}
            ModalProps={{ keepMounted: true }}
          >
            <IconButton onClick={notificationHandle}>
              <ChevronLeftIcon />
            </IconButton>
            <p>notification</p>
          </Drawer>
        </Box>
      </div>
      {
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={handleCloseToast}
        >
          <SnackbarContent
            style={{ backgroundColor: snackbarColor }}
            message={
              <span style={{ display: "flex", alignItems: "center" }}>
                {snackbarMessage}
              </span>
            }
            action={action}
          />
        </Snackbar>
      }
    </>
  );
}

export default SideDrawer;
