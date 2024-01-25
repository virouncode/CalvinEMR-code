import React from "react";
import RoomOption from "./RoomOption";

const RoomsList = ({
  handleRoomChange,
  roomSelected,
  rooms,
  isRoomOccupied,
  label = true,
}) => {
  //Rooms vector with all Rooms
  return (
    <>
      {label && <label>Room</label>}
      <select name="room" onChange={handleRoomChange} value={roomSelected}>
        <option disabled value="">
          Choose a room...
        </option>
        {rooms.map((room) => (
          <RoomOption
            key={room.id}
            roomName={room.title}
            isRoomOccupied={isRoomOccupied}
          />
        ))}
      </select>
    </>
  );
};

export default RoomsList;
