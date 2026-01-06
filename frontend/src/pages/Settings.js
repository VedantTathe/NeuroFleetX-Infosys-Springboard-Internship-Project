import { useState } from "react";

export default function Settings() {
  const [config, setConfig] = useState(
    JSON.parse(localStorage.getItem("aiConfig")) || {
      trafficWeight: 0.7,
      rerouteThreshold: 0.4
    }
  );

  const save = () => {
    localStorage.setItem("aiConfig", JSON.stringify(config));
    alert("Saved");
  };

  return (
    <div className="page">
      <h2>AI Settings</h2>

      <label>Traffic Weight</label>
      <input
        type="number"
        value={config.trafficWeight}
        onChange={e => setConfig({ ...config, trafficWeight: e.target.value })}
      />

      <label>Re-route threshold</label>
      <input
        type="number"
        value={config.rerouteThreshold}
        onChange={e => setConfig({ ...config, rerouteThreshold: e.target.value })}
      />

      <button onClick={save}>Save</button>
    </div>
  );
}
