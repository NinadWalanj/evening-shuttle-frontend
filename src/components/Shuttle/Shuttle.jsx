import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Shuttle.css";
const backendURL = import.meta.env.VITE_BACKEND_URL;

function Shuttle() {
  const [suid, setSuid] = useState("");
  const [address, setAddress] = useState(1);
  const [message, setMessage] = useState("");
  const [shuttleStatus, setShuttleStatus] = useState("Fetching status...");
  const [isSimulating, setIsSimulating] = useState(false);
  const simulationInterval = useRef(null);

  const getShuttleStatus = () => {
    axios
      .get(`${backendURL}/requestShuttleStatus`)
      .then((response) => {
        const data = response.data;
        setShuttleStatus(`${data}`);
      })
      .catch((error) => {
        console.error("Error fetching shuttle status:", error);
        setShuttleStatus("Error fetching status.");
      });
  };

  const handleBoard = () => {
    if (!suid) {
      alert("Please enter a SUID");
      return;
    }

    axios
      .post(`${backendURL}/addPassenger`, null, {
        params: { suid, address },
      })
      .then((res) => {
        setMessage(res.data);
        setTimeout(() => setMessage(""), 2000); // Clear after 3 seconds
      })
      .catch((err) => {
        console.error(err);
        alert("Error adding passenger");
      });
  };

  const sendLocation = () => {
    // You can randomize or cycle these values
    const longitude = (12 + Math.random()).toFixed(4);
    const latitude = (34 + Math.random()).toFixed(4);

    axios
      .post(`${backendURL}/shuttleLocation`, null, {
        params: { longitude, latitude },
      })
      .then((res) => console.log("Location sent:", res.data))
      .catch((err) => console.error("Location error:", err));
  };

  const startSimulation = () => {
    if (!isSimulating) {
      simulationInterval.current = setInterval(sendLocation, 1000);
      setIsSimulating(true);
    }
  };

  const stopSimulation = () => {
    clearInterval(simulationInterval.current);
    setIsSimulating(false);
  };

  useEffect(() => {
    return () => clearInterval(simulationInterval.current); // cleanup
  }, []);

  useEffect(() => {
    getShuttleStatus(); // initial call
    const intervalId = setInterval(getShuttleStatus, 1000); // call every 1s

    return () => clearInterval(intervalId); // cleanup on unmount
  }, []);

  return (
    <div>
      <div className="shuttle-form">
        <div className="form-group">
          <label htmlFor="suid">SUID:</label>
          <input
            type="number"
            id="suid"
            value={suid}
            placeholder="Enter student ID"
            onChange={(e) => setSuid(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address:</label>
          <select
            id="address"
            value={address}
            onChange={(e) => setAddress(Number(e.target.value))}
          >
            <option value={1}>Stop 1</option>
            <option value={2}>Stop 2</option>
          </select>
        </div>

        <div className="form-group">
          <button className="btn board-btn" onClick={handleBoard}>
            Board Passenger
          </button>
          <p className="shuttle-message">{message}</p>
        </div>

        <hr />

        <div className="form-group">
          <div className="form-group1">
            Kindly click on the "Start Location Simulation" button to get an
            accurate ETA during Shuttle transit. (Read more about this in the{" "}
            <a
              href="https://medium.com/@ninadwalanj/evening-shuttle-real-time-campus-shuttle-tracking-system-using-spring-boot-design-patterns-and-4a499990fdc2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Medium Blog
            </a>
            )
          </div>
          {!isSimulating ? (
            <button className="btn simulate-btn" onClick={startSimulation}>
              Start Location Simulation
            </button>
          ) : (
            <button className="btn stop-btn" onClick={stopSimulation}>
              Stop Simulation
            </button>
          )}
        </div>
      </div>

      <div>
        <p className="shuttle-message">Shuttle Status: {shuttleStatus}</p>
      </div>
      <div>
        <p className="shuttle-notif1">
          If the shuttle status displays 'Fetching Status', it indicates that
          the server is currently inactive due to a period of inactivity.
        </p>
        <p className="shuttle-notif2">
          To initiate a request to the server, please click the 'Request Pickup'
          button for any student.
        </p>
        <p className="shuttle-notif1">
          Please note: The backend is hosted on a free Render instance, which
          will spin down during periods of inactivity. As a result, initial
          requests may experience a delay of approximately 50 seconds or more.
        </p>
      </div>
    </div>
  );
}

export default Shuttle;

{
  /* <div className="shuttle-control">
<label>SUID: <input type="number" value={suid} onChange={(e) => setSuid(e.target.value)} /></label>
<label>Address:
  <select value={address} onChange={(e) => setAddress(Number(e.target.value))}>
    <option value={1}>Stop 1</option>
    <option value={2}>Stop 2</option>
  </select>
</label>
<button onClick={boardPassenger}>Boarded</button>
<p className="shuttle-message">{message}</p>
</div> */
}
