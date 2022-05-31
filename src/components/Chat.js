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
    const [coords, setCoords] = useState();

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

                        connection.on('FlightDataDebugMessage', (message) => {
                            var textarea = document.getElementById('debugMessagesTextArea');
                            textarea.append(message+'\n');
                            textarea.scrollTop = textarea.scrollHeight;
                        });
                    })
                    .catch((e) => console.log('Connection failed: ', e));
            }
        }
        getData();
    }, [connection]);

    const eraseTextarea = () => {
        document.getElementById('debugMessagesTextArea').value = "";
    }

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

    const startTraining = () => {
        axios.post(`https://localhost:7001/DroneCommand/RunScript`, { scriptName: 'f_data.py' });
    };

    const startListening = () => {
        axios.post(`https://localhost:7001/DroneCommand/StartListeningToDrone`);
    };

    const sendCoords = () => {
        axios.post(`https://localhost:7001/DroneCommand/SendTrainingCoords`, { scriptName: coords });
    };

    const startMission = () => {
        axios.post(`https://localhost:7001/DroneCommand/StartMission`, { Id: missionId });
    };

    const endMission = () => {
        axios.post(`https://localhost:7001/DroneCommand/EndMission`, { Id: missionId });
    };

    return (
        <div style={{ padding: '25px' }}>
            {/* <label htmlFor="missionId">Mission ID</label>
            <input type="text" onChange={(e) => setMissionId(e.target.value)} placeholder="Enter mission id" />
            <button onClick={startMission}>Start Mission</button>
            <button onClick={endMission}>End Mission</button>
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
            <button onClick={sendWaypoint}>Send Waypoint</button> */}

            <br />
            <br />
            
            <button onClick={startTraining}>Start Training</button>
            <br />
            <label htmlFor="coords">Coords</label>
            <input type="text" onChange={(e) => setCoords(e.target.value)} placeholder="Coords" />
            <button onClick={sendCoords}>Send Coords</button>

            <br />
            <br />
            <br />

            <label htmlFor="scriptName">Script Name</label>
            <input type="text" onChange={(e) => setScriptName(e.target.value)} placeholder="Enter script name" />
            <br />
            <button onClick={runScript}>Run script</button>

            <br />
            <br />
            <br />
            
            <p>Debug messages<button onClick={eraseTextarea}>Clear</button></p>
            
            <textarea id="debugMessagesTextArea" name="debugMessages" rows="20" cols="100">
                
            </textarea>
        </div>
    );
};

export default Chat;
