import { useEffect, useState } from "react";
import "./App.css";

const testURL = import.meta.env.VITE_API_URL + "/health";

function App() {
  const [message, setMessage] = useState("Checking...");

  useEffect(() => {
    fetch(testURL)
      .then((res) => res.json())
      .then((data) => {
        setMessage("Backend says " + data.status);
      });
  }, []);

  return (
    <>
      <h1>{message}</h1>
    </>
  );
}

export default App;
