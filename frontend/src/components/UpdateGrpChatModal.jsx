import React, { useState } from "react";
import {
  Backdrop,
  Box,
  Modal,
  Fade,
  Button,
  Typography,
  IconButton,
  Snackbar,
  SnackbarContent,
  FormControl,
  InputLabel,
  Input,
  CircularProgress,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { ChatState } from "../context/ChatProvider";
import CloseIcon from "@mui/icons-material/Close";
import GroupUserList from "./GroupUserList";
import axios from "axios";
import UserListItems from "./UserListItems";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "8px",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: 2,
};

function UpdateGrpChatModal({ fetchAgain, setFetchAgain, fetchMessages }) {
  const [open, setOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarColor, setSnackbarColor] = useState();

  const { user, singleChat, setSingleChat, selectedUsers, setSelectedUsers } =
    ChatState();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

  async function handleRename() {
    if (!groupChatName) {
      setSnackbarColor("#ff9966");
      setSnackbarMessage("Please enter a valid name!");
      setSnackbarOpen(true);
      return;
    }

    try {
      setRenameLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chat/rename",
        {
          chatId: singleChat._id,
          chatName: groupChatName,
        },
        config
      );

      //   setFetchAgain(!fetchAgain)
      setGroupChatName("");
      setSingleChat(data);
      setRenameLoading(false);
      setSnackbarColor("green");
      setSnackbarMessage("Successfully renamed the chat!");
      setSnackbarOpen(true);
    } catch (error) {
      setRenameLoading(false);
      setSnackbarColor("red");
      setSnackbarMessage("unable to renamed the chat");
      setSnackbarOpen(true);
      setGroupChatName("");
    }
  }

  const handleAddGroup = async (usersToAdd) => {
    if (singleChat.users.find((u) => u._id === usersToAdd._id)) {
      setSnackbarOpen(true);
      setSnackbarMessage("User already in group");
      setSnackbarColor("#ff9966");
      return;
    }

    if (singleChat.groupAdmin._id !== user._id) {
      setSnackbarOpen(true);
      setSnackbarMessage("Only the admin can add members to a chat");
      setSnackbarColor("red");
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      // console.log(`SINgle:- ${singleChat._id}\n USERTOADD:- ${usersToAdd._id}`);
      const { data } = await axios.put(
        `/api/chat/groupadd`,
        {
          chatId: singleChat._id,
          userId: usersToAdd._id,
        },
        config
      );
      console.log(data);

      setSingleChat(data);
      // setFetchAgain(!fetchAgain);
      setLoading(false);
      setSnackbarColor("green");
      setSnackbarMessage("Member added successfully!");
      setSnackbarOpen(true);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setSnackbarColor("red");
      setSnackbarMessage("Unable to add member");
      setSnackbarOpen(true);
    }
  };

  async function deleteGroupMember(delUser) {
    // setSelectedUsers(selectedUsers.filter((val) => val._id !== delUser));
    console.log(
      `singleChat:- ${singleChat.groupAdmin._id}\nuser.id:- ${user.id}`
    );
    if (singleChat.groupAdmin._id !== user._id) {
      setSnackbarOpen(true);
      setSnackbarMessage("Only the admin can remove members from a group");
      setSnackbarColor("red");
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        `/api/chat/groupremove`,
        {
          chatId: singleChat._id,
          userId: delUser,
        },
        config
      );
      // console.log(data);

      console.log(data.user);

      delUser._id === user._id ? setSingleChat() : setSingleChat(data);
      fetchMessages();
      setLoading(false);
      setFetchAgain(!fetchAgain);
    } catch (error) {
      console.log(error.message);
      setLoading(false);
      setSnackbarColor("red");
      setSnackbarMessage("Failed to remove member");
      setSnackbarOpen(true);
    }
  }

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
        <Button
          onClick={handleOpen}
          sx={{ textTransform: "none", color: "black", fontWeight: "bold" }}
        >
          <IconButton>
            <VisibilityIcon />
          </IconButton>
        </Button>
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
                  fontSize: 30,
                  textTransform: "capitalize",
                  fontFamily: "Work sans",
                  fontWeight: "bold",
                }}
                // sx={{}}
              >
                {` ${singleChat.chatName}`}
              </Typography>
              <hr color="grey" width="100%" />

              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  width: "100%",
                  overflow: "hidden",
                  flexWrap: "wrap",
                }}
              >
                {singleChat.users.map((val) => (
                  <GroupUserList
                    key={val._id}
                    user={val}
                    handleFunction={() => deleteGroupMember(val._id)}
                  />
                ))}
              </Box>
              <Box
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <FormControl sx={{ width: "100%", marginBottom: 3 }}>
                  <InputLabel htmlFor="rename">Rename</InputLabel>
                  <Input
                    onChange={(e) => setGroupChatName(e.target.value)}
                    value={groupChatName}
                    id="rename"
                  />
                </FormControl>

                <FormControl sx={{ width: "100%", marginBottom: 3 }}>
                  <InputLabel htmlFor="addUser">Add User</InputLabel>
                  <Input
                    onChange={(e) => handleSearch(e.target.value)}
                    id="addUser"
                  />
                </FormControl>
              </Box>

              <Box
                display={"flex"}
                justifyContent={"space-between"}
                width={"100%"}
              >
                <Button
                  variant="contained"
                  color="success"
                  textTransform="none"
                  size="large"
                  onClick={handleRename}
                >
                  Rename
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  textTransform="none"
                  size="large"
                  onClick={() => deleteGroupMember(user)}
                >
                  leave
                </Button>
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
          </Fade>
        </Modal>
      </div>
      {/* ....................................... */}
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

export default UpdateGrpChatModal;
