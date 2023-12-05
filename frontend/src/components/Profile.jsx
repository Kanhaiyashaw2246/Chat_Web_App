import React, { useState } from "react";
import { Backdrop, Box, Modal, Fade, Button, Typography, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

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

function Profile({ user, show }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <div>
        <Button
          onClick={handleOpen}
          sx={{ textTransform: "none", color: "black", fontWeight: "bold" }}
        >
          {show ? (
            <IconButton>
              <VisibilityIcon />
            </IconButton>
          ) : (
            "Profile"
          )}
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
                {` ${user.name}`}
              </Typography>
              <hr color="grey" width="100%" />
              <Typography sx={{ mt: 2 }}>
                <img
                  src={user.pic}
                  height={200}
                  width={230}
                  style={{
                    borderRadius: "50%",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    border: "2px solid grey",
                  }}
                  alt={user.name}
                />
              </Typography>
              <Typography sx={{ fontFamily: "Work sans", fontSize: "1.2rem" }}>
                {`${user.email}`}
              </Typography>

              <Button variant="contained" size="large" onClick={handleClose}>
                Close
              </Button>
            </Box>
          </Fade>
        </Modal>
      </div>
    </>
  );
}

export default Profile;
