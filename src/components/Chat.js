import { HubConnectionBuilder } from "@microsoft/signalr";
import { useEffect, useRef, useState } from "react";

const Chat = () => {
  const [connection, setConnection] = useState(null);
  const [chat, setChat] = useState([]);
  const latestChat = useRef(null);

  latestChat.current = chat;

  useEffect(async () => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:7144/flighthub")
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(async () => {
    if (connection) {
      console.log(connection);
      await connection
        .start()
        .then((result) => {
          console.log("Connected!");

          connection.on("ReceiveFlightData", (message) => {
            console.log(message);
          });
        })
        .catch((e) => console.log("Connection failed: ", e));
    }
  }, [connection]);

  const sendMessage = async (user, message) => {
    const chatMessage = {
      user: user,
      message: message,
    };

    if (connection.connectionStarted) {
      try {
        await connection.send("ReceiveFlightData", chatMessage);
      } catch (e) {
        console.log(e);
      }
    } else {
      alert("No connection to server yet.");
    }
  };

  return <div>This is our chat component</div>;
};

export default Chat;
