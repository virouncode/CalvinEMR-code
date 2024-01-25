import React from "react";

const RoomOption = ({ roomName, isRoomOccupied }) => {
  return (
    <option value={roomName}>
      {roomName} {isRoomOccupied(roomName) ? "(Occupied)" : ""}
    </option>
  );
};
export default RoomOption;
