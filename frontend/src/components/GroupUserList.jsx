import { Badge } from "@mui/material";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import { ChatState } from "../context/ChatProvider";

function GroupUserList({ user, handleFunction }) {
  const { singleChat } = ChatState();
  // console.log(singleChat.groupAdmin._id);

  return (
    <Badge
      variant="dot"
      sx={{
        px: 1,
        borderRadius: "10px",
        fontSize: "1rem",
        textTransform: "capitalize",
        color: "white",
        backgroundColor: "#9B59B6",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
      }}
      onClick={handleFunction}
    >
      {user.name}
      {singleChat.groupAdmin._id === user._id && <span style={{ marginLeft: "2px" }}>(Admin)</span>}
      <IconButton
        size="small"
        style={{ marginLeft: "2px" }}
        onClick={handleFunction}
      >
        <CloseIcon />
      </IconButton>
    </Badge>
  );
}

export default GroupUserList;
