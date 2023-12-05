import React, { useState } from "react";
import {
  Backdrop,
  Box,
  Modal,
  Fade,
  Button,
  Typography,
  Snackbar,
  SnackbarContent,
  IconButton,
  FormControl,
  InputLabel,
  Input,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ChatState } from "../context/ChatProvider";
import axios from "axios";
import UserListItems from "./UserListItems";
import GroupUserList from "./GroupUserList";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  p: 3,
  pt: 1,
};

function GroupChatModal({ children }) {
  const [open, setOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarColor, setSnackbarColor] = useState();
  const [loading, setLoading] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { user, chat, setChat } = ChatState();

  function deleteGroupMember(delUser) {
    setSelectedUsers(selectedUsers.filter((val) => val._id !== delUser));
  }

  const handleSearch = async (val) => {
    setSearch(val);
    if (!val) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      // console.log(`SEARCH${search}`);
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      //   console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      setLoading(false);
      setSnackbarColor("red");
      setSnackbarMessage(error.message);
      setSnackbarOpen(true);
    }
  };

  const handleAddGroup = (usersToAdd) => {
    const isUserAlreadyAdded = selectedUsers.some(
      (val) => val._id === usersToAdd._id
    );

    if (isUserAlreadyAdded) {
      setSnackbarMessage("User already added");
      setSnackbarColor("#ff9966");
      setSnackbarOpen(true);
    } else {
      setSelectedUsers([...selectedUsers, usersToAdd]);
    }
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      setSnackbarMessage("Please fill all fields");
      setSnackbarColor("#ff9966");
      setSnackbarOpen(true);
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((val) => val._id)),
        },
        config
      );

      setChat([data, ...chat]);
      setGroupChatName("");
      setSelectedUsers([]);
      setSnackbarMessage("Created Group Chat Successfully!");
      setSnackbarColor("green");
      setSnackbarOpen(true);
      setSearchResult([])
    } catch (error) {
      setSnackbarMessage(error.message);
      setSnackbarColor("red");
      setSnackbarOpen(true);
    }
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
  return (
    <>
      <div>
        <span
          onClick={handleOpen}
          sx={{ textTransform: "none", color: "black", fontWeight: "bold" }}
        >
          {children}
        </span>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={open}
          onClose={handleClose}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={open}>
            <Box sx={style}>
              <Typography
                style={{
                  fontSize: 28,
                  textTransform: "capitalize",
                  fontFamily: "Work sans",
                  fontWeight: "bold",
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "16px",
                }}
              >
                Create Group chat
              </Typography>
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <FormControl sx={{ width: "100%", marginBottom: 3 }}>
                  <InputLabel htmlFor="chatName">Chat Name</InputLabel>
                  <Input
                    onChange={(e) => setGroupChatName(e.target.value)}
                    value={groupChatName}
                    id="chatName"
                  />
                </FormControl>
                <FormControl sx={{ width: "100%", marginBottom: 3 }}>
                  <InputLabel htmlFor="addUser">Add User:</InputLabel>
                  <Input
                    onChange={(e) => handleSearch(e.target.value)}
                    id="addUser"
                  />
                </FormControl>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    width: "100%",
                    overflow: "hidden",
                    flexWrap: "wrap",
                  }}
                >
                  {selectedUsers.map((val) => (
                    <GroupUserList
                      key={val._id}
                      admin={user._id}
                      user={val}
                      handleFunction={() => deleteGroupMember(val._id)}
                    />
                  ))}
                </Box>
                {loading ? (
                  <CircularProgress />
                ) : (
                  searchResult
                    .slice(0, 3)
                    .map((val) => (
                      <UserListItems
                        handleFunction={() => handleAddGroup(val)}
                        key={val._id}
                        name={val.name}
                        email={val.email}
                        pic={val.pic}
                      />
                    ))
                )}
              </Box>
              <Button
                variant="contained"
                size="large"
                onClick={handleSubmit}
                sx={{ textTransform: "capitalize" }}
              >
                Create Chat
              </Button>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                }}
              ></Box>
            </Box>
          </Fade>
        </Modal>
      </div>
      {/* ---------------------------------------------- */}
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
    </>
  );
}

export default GroupChatModal;
