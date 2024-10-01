import { TimelineContextProvider } from "../context/TimelineContext";
import GantInterface from "./GanttInterface";

const GanttContainer = () => {
  return (
    <TimelineContextProvider>
      <GantInterface />
    </TimelineContextProvider>
  );
};

export default GanttContainer;
