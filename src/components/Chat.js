import { HubConnectionBuilder } from '@microsoft/signalr';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

const Chat = () => {
    const [missionId, setMissionId] = useState();
    const [latitude, setLatitude] = useState();
    const [longitude, setLongitude] = useState();
    const [altitude, setAltitude] = useState();
    const [heading, setHeading] = useState();
    const [order, setOrder] = useState();

    const [scriptName, setScriptName] = useState();

    const [connection, setConnection] = useState(null);
    const [chat, setChat] = useState([]);
    const latestChat = useRef(null);

    latestChat.current = chat;

    useEffect(() => {
        // Check for internet. If internet, connect to https://localhost:5000/FlightHub. If no internet, connect to https://localhost:7000/FlightHub
        const newConnection = new HubConnectionBuilder()
            .withUrl('https://localhost:7001/FlightHub')
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
                        console.log('Connected!');

                        connection.on('FlightData', (message) => {
                            console.log(message);
                        });
                    })
                    .catch((e) => console.log('Connection failed: ', e));
            }
        }
        getData();
    }, [connection]);

    const sendWaypoint = () => {
        axios.post(`https://localhost:7001/DroneCommand/Waypoint`, {
            latitude,
            longitude,
            altitude,
            heading,
            order,
            missionId,
        });
    };

    const runScript = () => {
        axios.post(`https://localhost:7001/DroneCommand/RunScript`, { scriptName });
    };

    return (
        <div style={{ padding: '25px' }}>
            <label htmlFor="missionId">Mission ID</label>
            <input type="text" onChange={(e) => setMissionId(e.target.value)} placeholder="Enter mission id" />
            <br />
            <label htmlFor="latitude">Latitude</label>
            <input type="text" onChange={(e) => setLatitude(e.target.value)} placeholder="Latitude" />
            <br />
            <label htmlFor="longitude">Longitude</label>
            <input type="text" onChange={(e) => setLongitude(e.target.value)} placeholder="Longitude" />
            <br />
            <label htmlFor="altitude">Altitude</label>
            <input type="text" onChange={(e) => setAltitude(e.target.value)} placeholder="Altitude" />
            <br />
            <label htmlFor="heading">Heading</label>
            <input type="text" onChange={(e) => setHeading(e.target.value)} placeholder="Heading" />
            <br />
            <label htmlFor="order">Order</label>
            <input type="text" onChange={(e) => setOrder(e.target.value)} placeholder="Order" />
            <br />
            <button onClick={sendWaypoint}>Send Waypoint</button>

            <br />
            <br />
            <br />

            <label htmlFor="scriptName">Script Name</label>
            <input type="text" onChange={(e) => setScriptName(e.target.value)} placeholder="Enter script name" />
            <br />
            <button onClick={runScript}>Run script</button>
        </div>
    );
};

export default Chat;
