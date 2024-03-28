import React from "react";

const RoomOption = ({ roomName, roomId, isRoomOccupied }) => {
  return (
    <option value={roomId}>
      {roomName} {isRoomOccupied(roomId) ? "(Occupied)" : ""}
    </option>
  );
};
export default RoomOption;
