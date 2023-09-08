import React, { useState } from "react";
import { ChatState } from "../components/Context/ChatProvider";
import { Box } from "@chakra-ui/react";
import Slide from "./Slide";
import MyChats from "./MyChats";
import ChatBox from "./ChatBox";

function ChatPage() {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div style={{ width: "100%" }}>
      {user && <Slide />}
      <Box d="flex" justifyContent={"space-between"} w="100%" h="90vh" p="10px">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
}

export default ChatPage;
