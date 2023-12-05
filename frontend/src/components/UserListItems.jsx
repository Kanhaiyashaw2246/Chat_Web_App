import React from "react";
import {
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Typography,
} from "@mui/material";

function UserListItems({ handleFunction, name, email, pic }) {
  return (
    <>
      <ListItem
        onClick={handleFunction}
        sx={{
          cursor: "pointer",
          borderRadius: "10px",
          marginBottom:"2px",
          marginTop:"2px",
          "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.08)" },
        }}
      >
        <ListItemAvatar>
          <Avatar alt={name} src={pic} />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography variant="h6" sx={{textTransform:"capitalize"}}>{name}</Typography>
          }
          secondary={
            <React.Fragment>
              <Typography component="span" variant="body2" >
                <b>Email:</b> {email}
              </Typography>
            </React.Fragment>
          }
        />
      </ListItem>
      <Divider />
    </>
  );
}

export default UserListItems;
