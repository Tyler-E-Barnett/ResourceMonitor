import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import InventoryScheduler from "./pages/InventoryScheduler";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="">Scheduler</div>
      <InventoryScheduler />
    </>
  );
}

export default App;
