import React, { useState } from "react";
import { ChatState } from "../context/ChatProvider";
import { Box, Button, Container, IconButton, Typography } from "@mui/material";
import SingleChat from "./SingleChat";

function MessageBox({ fetchAgain, setFetchAgain }) {
  const { singleChat } = ChatState();
  const { display, setDisplay } = useState("none");

  return (
    <>
      <Box
        sx={{
          alignItems: "center",
          flexDirection: "column",
          padding: "1rem 1.2rem",
          backgroundColor: "white",
          width: "60%",
          height:"100%",
          borderRadius: "10px",
          border: "2px solid black",
          "@media (max-width:900px)": {
            display: singleChat ? "flex" : "none",
            width: "100%",
          },
        }}
      >
        <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </Box>
    </>
  );
}

export default MessageBox;
