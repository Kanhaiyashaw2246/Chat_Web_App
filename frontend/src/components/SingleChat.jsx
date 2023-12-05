import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import {
  Box,
  FormControl,
  CircularProgress,
  IconButton,
  TextField,
  Typography,
  SnackbarContent,
  Snackbar,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getSender, getSenderFUll } from "../config/ChatLogics";
import Profile from "./Profile";
import UpdateGrpChatModal from "./UpdateGrpChatModal";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import ScrollableChat from "./ScrollableChat";

function SingleChat({ fetchAgain, setFetchAgain }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarColor, setSnackbarColor] = useState();
  const { user, singleChat, setSingleChat } = ChatState();

  // const fetchMessages = async () => {
  //   if (!singleChat) return;

  //   try {
  //     const config = {
  //       headers: {
  //         Authorization: `Bearer ${user.token}`,
  //       },
  //     };
  //     setLoading(true);
  //     console.log(singleChat._id);
  //     const { data } = axios.get(`/api/message/${singleChat._id}`, config);
  //     setMessages(data);
  //     setLoading(false);
  //     console.log(data);
  //   } catch (error) {
  //     setLoading(false);
  //     setSnackbarMessage("Uable to fetch messages");
  //     setSnackbarColor("error");
  //     setSnackbarOpen(true);
  //   }
  // };

  const fetchMessages = async () => {
    if (!singleChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);

      console.log(singleChat._id);

      const response = await axios.get(
        `/api/message/${singleChat._id}`,
        config
      );
      const { data } = response;

      if (!Array.isArray(data)) {
        throw new Error(
          "Invalid data structure, expected an array of messages."
        );
      }

      setMessages(data);
      setLoading(false);
      console.log(messages);
    } catch (error) {
      setLoading(false);
      setSnackbarMessage("Unable to fetch messages");
      setSnackbarColor("error");
      setSnackbarOpen(true);
    }
  };

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      e.preventDefault();
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: singleChat._id,
          },
          config
        );
        console.log("done");
        setMessages([...messages, data]);
        console.log(messages);
      } catch (error) {
        setSnackbarMessage("Unable to send message ");
        console.log(error.message);
        setNewMessage("");
        setSnackbarColor("#ff0000");
        setSnackbarOpen(true);
      }
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [singleChat]);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
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
      {singleChat ? (
        <>
          <Box
            display="flex"
            justifyContent="space-between"
            borderBottom={"2px solid gray"}
            width="100%"
            marginBottom={1}
            // border={"2px solid red"}
          >
            <IconButton>
              <ArrowBackIcon onClick={() => setSingleChat("")} />
            </IconButton>
            <Box>
              <Typography
                fontFamily="Work Sans"
                variant="h4"
                textTransform={"capitalize"}
              >
                {!singleChat.isGroupChat
                  ? getSender(user, singleChat.users)
                  : singleChat.chatName}
              </Typography>
            </Box>
            {singleChat.isGroupChat ? (
              <>
                <UpdateGrpChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            ) : (
              <Profile
                user={getSenderFUll(user, singleChat.users)}
                show={true}
              />
            )}
          </Box>
          {/* message box */}
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            padding={3}
            paddingBottom={1}
            backgroundColor="#E8E8E8"
            width="90%"
            height="80%"
            borderRadius="10px"
            overflowY="hidden"
            margin={"auto auto"}
          >
            {loading ? (
              <>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    height: "100%",
                    alignItems: "center",
                  }}
                >
                  <CircularProgress
                    style={{ height: "100px", width: "100px" }}
                  />
                </Box>
              </>
            ) : (
              <>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    overflowY: "scroll",
                    scrollbarWidth: "none",
                    border:"1px solid red",
                    height:"100%"
                  }}
                >
                  {/* {messages?.map((message) => (
                    <Message
                    key={message._id}
                    senderId={currentUser?._id}
                    currentUser={currentUser}
                    message={message}
                    chatRoomId={singleChat._id}
                    getMessages={()=>{}}
                    setLoading={setLoading}
                    />
                    ))} */}
                  <ScrollableChat messages={messages} />
                </Box>
              </>
            )}
            <Box
              display="flex"
              alignItems="center"
              justifyContent={"space-between"}
            >
              <FormControl onKeyDown={sendMessage} fullWidth>
                <TextField
                  placeholder="Type a message"
                  variant="outlined"
                  fullWidth
                  autoComplete="off"
                  onChange={typingHandler}
                  value={newMessage}
                />
              </FormControl>
            </Box>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems={"center"}
          justifyContent={"center"}
          height={"80%"}
        >
          <Typography variant="h4" fontFamily={"Work sans"}>
            Select a chat to see the messages.
          </Typography>
        </Box>
      )}
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

export default SingleChat;
