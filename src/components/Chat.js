import { HubConnectionBuilder } from "@microsoft/signalr";
import { useEffect, useRef, useState } from "react";

const Chat = () => {
  const [connection, setConnection] = useState(null);
  const [chat, setChat] = useState([]);
  const latestChat = useRef(null);

  latestChat.current = chat;

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("https://localhost:7008/FlightHub")
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    async function getData() {
      if (connection) {
        console.log(connection);
        await connection
          .start()
          .then((result) => {
            console.log("Connected!");

            connection.on("FlightData", (message) => {
              console.log(message);
            });
          })
          .catch((e) => console.log("Connection failed: ", e));
      }
    }
    getData();
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
