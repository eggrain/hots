import { useState } from "react";
import "./App.css";

import { randPractice, isHot } from "./hots.js";

function App() {
  const [zip, setZip] = useState(() => randPractice());
  const [result, setResult] = useState(null);

  function handleClick() {
    if (result === null) {
      // First click: check
      setResult(isHot(zip));
    } else {
      // Second click: advance
      setZip(randPractice());
      setResult(null);
    }
  }

  return (
    <>
      <h1>thots simulator</h1>

      <div style={{ display: "flex", marginTop: "2rem", columnGap: "2rem", justifyContent: "center", alignItems: "center" }}>
        <p style={{ fontSize: "2rem", fontWeight: "bold" }}>{zip}</p>

        {result !== null && (
          <p style={{ marginTop: "1rem" }}>
            {result ? "🔥 HOT" : "❄️ NOT HOT"}
          </p>
        )}
      </div>

      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        <button onClick={handleClick}>
          {result === null ? "Check hot" : "Next"}
        </button>
      </div>


    </>
  );
}

export default App;
