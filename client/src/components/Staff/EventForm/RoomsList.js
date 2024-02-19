import React from "react";
import RoomOption from "./RoomOption";

const RoomsList = ({
  handleRoomChange,
  roomSelectedId,
  rooms,
  isRoomOccupied,
  label = true,
}) => {
  return (
    <>
      {label && <label>Room</label>}
      <select name="room_id" onChange={handleRoomChange} value={roomSelectedId}>
        <option disabled value="">
          Choose a room...
        </option>
        {rooms.map((room) => (
          <RoomOption
            key={room.id}
            roomName={room.title}
            roomId={room.id}
            isRoomOccupied={isRoomOccupied}
          />
        ))}
      </select>
    </>
  );
};

export default RoomsList;
