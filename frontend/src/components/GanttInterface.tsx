import { useContext, useEffect, useRef, useState } from "react";
import TimeBlockContainerDynamic from "./TimeBlockContainerDynamic";
import TimeBlock from "./TimeBlock";
import { TimelineContext } from "../context/TimelineContext";
import axios from "axios";

const GanttInterface = () => {
  const interfaceRef = useRef(null);
  const { setRange, range } = useContext(TimelineContext);
  const { startDate, endDate } = range;

  // Local state for the date inputs
  const [inputStartDate, setInputStartDate] = useState(
    startDate.toISOString().slice(0, 16)
  );
  const [inputEndDate, setInputEndDate] = useState(
    endDate.toISOString().slice(0, 16)
  );

  // State to hold time blocks fetched from the API
  const [timeBlocks, setTimeBlocks] = useState([]);

  // State for dynamic timeline width
  const [timelineWidth, setTimelineWidth] = useState(window.innerWidth * 0.9);

  // Update timeline width on window resize
  useEffect(() => {
    const handleResize = () => {
      setTimelineWidth(window.innerWidth * 0.9);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Fetch schedule data from API
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get("/api/schedule", {
          params: {
            start: new Date(inputStartDate).toISOString(),
            end: new Date(inputEndDate).toISOString(),
          },
        });
        setTimeBlocks(response.data.value); // Update time blocks with API response
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching schedule:", error);
      }
    };

    if (inputStartDate && inputEndDate) {
      fetchSchedule();
    }
  }, [inputStartDate, inputEndDate]);

  // Set the range in the TimelineContext and handle user inputs
  useEffect(() => {
    setRange({
      startDate: new Date(inputStartDate),
      endDate: new Date(inputEndDate),
    });
  }, [inputStartDate, inputEndDate, setRange]);

  // Handlers for the input changes
  const handleStartDateChange = (e) => {
    setInputStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setInputEndDate(e.target.value);
  };

  return (
    <div
      ref={interfaceRef}
      className="ml-10 flex flex-col justify-center"
      style={{ width: timelineWidth }}
    >
      {/* Date/Time inputs for start and end dates */}
      <div className="mb-4">
        <label className="block mb-2 text-sm font-bold">Start Date/Time</label>
        <input
          type="datetime-local"
          value={inputStartDate}
          onChange={handleStartDateChange}
          className="border p-2 rounded"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-bold">End Date/Time</label>
        <input
          type="datetime-local"
          value={inputEndDate}
          onChange={handleEndDateChange}
          className="border p-2 rounded"
        />
      </div>

      {/* TimeBlockContainerDynamic */}
      <div className="mb-2 rounded bg-black w-full">
        <TimeBlockContainerDynamic />
      </div>

      {/* Time blocks rendered dynamically from the fetched data */}
      <div className="flex flex-col gap-4">
        {timeBlocks.map((block, index) => (
          <TimeBlock
            key={index}
            type={block.type}
            start={new Date(block["Start Date Time"])}
            end={new Date(block["End Date Time"])}
            height={60}
            style={`bg-sky-500 border border-sky-600 p-2 z-20 opacity-30 hover:none flex items-end shadow border-black h-full`}
            title={block.AssignedResource}
            timeLineWidth={timelineWidth}
          />
        ))}
      </div>
    </div>
  );
};

export default GanttInterface;
