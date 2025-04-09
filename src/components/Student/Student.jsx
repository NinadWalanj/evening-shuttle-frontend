import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Student.css";
const backendURL = import.meta.env.VITE_BACKEND_URL;

function Student({ suid }) {
  const [message, setMessage] = useState("");
  // const [isPolling, setIsPolling] = useState(false);
  const intervalRef = useRef(null);

  const fetchPickupStatus = () => {
    axios
      .get(`${backendURL}/requestPickup`, {
        params: { suid },
      })
      .then((response) => {
        const data = response.data;
        setMessage(`${data}`);
      })
      .catch((error) => {
        console.error(`Error polling for SUID ${suid}:`, error);
        setMessage("Error fetching status.");
      });
  };

  const handlePickup = () => {
    console.log(`Requesting pickup for SUID: ${suid}`);
    fetchPickupStatus(); // initial request

    // Start polling every 1 second
    // if (!isPolling) {
    //   intervalRef.current = setInterval(fetchPickupStatus, 1000);
    //   setIsPolling(true);
    // }
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="student-card">
      <p>
        <strong>SUID:</strong> {suid}
      </p>
      <button onClick={handlePickup}>Request Pickup</button>
      <div className="student-message">{message}</div>
    </div>
  );
}

export default Student;
