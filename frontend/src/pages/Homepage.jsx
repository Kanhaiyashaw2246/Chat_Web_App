import React, { useEffect } from "react";
import ColorTabs from "../components/Tabs";
import Box from "@mui/material/Box";
import { Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./styles/homepage.css"

function Homepage() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if(user){
      navigate("chats");
    }
  }, [navigate]);
  return (
    <>
      <Container
        sx={{ display: "flex", flexDirection: "column", alignItems: "center"}}
        fluid
        className="homepage_container"
      >
        <Box
          maxWidth={{
            xs: "100%",
            sm: "80%",
            md: "60%",
          }}
          sx={{
            borderTop: "1px solid black",
            borderTopLeftRadius: "1rem",
            borderTopRightRadius: "1rem",
            width: "100%",
            backgroundColor: "#1976D2",
            display: "flex",
            justifyContent: "center" 
          }}
        >
          <h2 style={{ margin: "1rem 0", color: "white" }}>Chat app</h2>
        </Box>
        <Box
          maxWidth={{
            xs: "100%",
            sm: "80%",
            md: "60%",
          }}
          sx={{
            borderBottom: "1px solid black",
            borderTop: "none",
            width: "100%",
            borderRadius: "1rem",
            display: "flex",
            justifyContent: "center",
            // margin:"1rem 0"
          }}
        >
          <ColorTabs />
        </Box>
      </Container>
    </>
  );
}

export default Homepage;
