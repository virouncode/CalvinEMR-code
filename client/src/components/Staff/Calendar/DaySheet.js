import React from "react";
import { timestampToHumanDateTZ } from "../../../utils/dates/formatDates";
import DaySheetEventCard from "./DaySheetEventCard";

const DaySheet = ({ events, rangeStart }) => {
  const handlePrint = (e) => {
    e.nativeEvent.view.print();
  };
  return (
    <div className="daysheet">
      <div className="daysheet__date">{timestampToHumanDateTZ(rangeStart)}</div>
      <div className="daysheet__btn-container">
        <button onClick={handlePrint}>Print</button>
      </div>
      {events
        .sort((a, b) => a.start - b.start)
        .map((event) => (
          <DaySheetEventCard event={event} />
        ))}
    </div>
  );
};

export default DaySheet;
