import React from "react";
import ScrollableFeed from "react-scrollable-feed";

function ScrollableChat({ messages }) {
  return <ScrollableFeed>
    {messages && messages.map((val,index)=>{
        <div style={{display:"flex"}} key={val._id} >
            
        </div>
    })}
  </ScrollableFeed>;
}

export default ScrollableChat;
