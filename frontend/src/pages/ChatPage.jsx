import React, { useEffect, useState } from "react";
import axios from "axios";
import "./styles/chatPage.css";
import { ChatState } from "../context/ChatProvider";
import { Box } from "@mui/material";
import SideDrawer from "../components/SideDrawer";
import MyChats from "../components/MyChats";
import MessageBox from "../components/MessageBox";

function ChatPage() {
  const { user } = ChatState();
  const { fetchAgain, setFetchAgain } = useState(false);

  return (
    <>
      <div className="chatPage_container">
        {user && <SideDrawer />}
        <Box
          className="box"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            padding: "10px",
          }}
        >
          {user && (
            <MyChats fetchAgain={fetchAgain}  />
          )}
          {user && (
            <MessageBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          )}
        </Box>
      </div>
    </>
  );
}

export default ChatPage;
