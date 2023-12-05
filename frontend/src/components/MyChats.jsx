import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import {
  Box,
  Button,
  Container,
  IconButton,
  Snackbar,
  SnackbarContent,
  Stack,
  Typography,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import { getSender } from "../config/ChatLogics";
import { styled } from "@mui/material/styles";
import GroupChatModal from "./GroupChatModal";

function MyChats({ fetchAgain }) {
  const [loggedUser, setLoggedUser] = useState();
  const { user, setUser, singleChat, setSingleChat, chat, setChat } =
    ChatState();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarColor, setSnackbarColor] = useState();
  const [loading, setLoading] = useState(false);

  const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    cursor: "pointer",
    borderRadius: "8px",
    color: theme.palette.text.secondary,
  }));

  const fetchChats = async () => {
    // console.log(user._id);
    // console.log(JSON.stringify(singleChat));
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      // console.log(data)
      setChat(data);
      // console.log(`CHAT:-${chat}`);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setSnackbarMessage("Failed To Load The Chats");
      setSnackbarColor("red");
      snackbarOpen(true);
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

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // console.log(`CHATS:- ${chat[0]}`)
  }, [fetchAgain]);

  return (
    <>
      <Box
        // display={{ base: singleChat ? "none" : "flex", md: "flex" }}
        flexDirection="column"
        alignItems="center"
        padding={2}
        paddingRight={6}
        marginRight={1}
        width="35%"
        bgcolor="white"
        border="2px solid black"
        borderRadius="10px"
        borderWidth="1px"
        overflow="auto"
        height={"100%"}
        style={{ overflowX: "hidden" }}
        sx={{
          "@media (max-width:900px)": {
            display: singleChat ? "none" : "flex",
            width: "100%",
            justifyContent: "center",
          },
        }}
      >
        <Box
          paddingBottom={3}
          paddingLeft={3}
          paddingRight={3}
          fontSize={{ xs: "28px", md: "30px" }}
          fontFamily="Work Sans"
          display="flex"
          width="100%"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h4">My Chats</Typography>
          <GroupChatModal>
            <Button
              variant="contained"
              size="small"
              style={{
                display: "flex",
                textTransform: "capitalize",
                fontSize: "17px",
                color: "white",
                "@media (min-width:600px)": {
                  fontSize: "10px",
                },
                "@media (min-width:1280px)": {
                  fontSize: "17px",
                },
              }}
              endIcon={<AddIcon />}
            >
              New Group Chat
            </Button>
          </GroupChatModal>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          padding={3}
          bgcolor="#F8F8F8"
          width="100%"
          height="100%"
          borderRadius="lg"
          overflowY="hidden"
        >
          {chat ? (
            <Stack spacing={2}>
              {chat.map((val) => {
                return (
                  <Item>
                    <Box
                      onClick={() => setSingleChat(val)}
                      bgcolor={singleChat === val ? "#38B2AC" : "#E8E8E8"}
                      color={singleChat === val ? "white" : "black"}
                      paddingX={3}
                      paddingY={2}
                      borderRadius="8px"
                      key={val._id}
                    >
                      <Typography>
                        {!val.isGroupChat
                          ? getSender(loggedUser, val.users)
                          : val.chatName}
                      </Typography>
                    </Box>
                  </Item>
                );
              })}
            </Stack>
          ) : (
            <></>
          )}
          {loading && (
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
          )}
        </Box>
      </Box>

      {/* ---------------------------------------------------------- */}
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

export default MyChats;
