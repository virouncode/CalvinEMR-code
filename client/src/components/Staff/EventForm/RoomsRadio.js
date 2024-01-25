import React from "react";
import RoomRadioItem from "./RoomRadioItem";

const RoomsRadio = ({
  handleRoomChange,
  roomSelected,
  rooms,
  isRoomOccupied,
  label = true,
}) => {
  //Rooms vector with all Rooms
  const isRoomSelected = (roomName) => roomSelected === roomName;
  return (
    <>
      {label && <p>Room</p>}
      <div className="event-form__radio-container">
        {rooms.map((room) => (
          <RoomRadioItem
            key={room.id}
            roomName={room.title}
            isRoomOccupied={isRoomOccupied}
            handleRoomChange={handleRoomChange}
            isRoomSelected={isRoomSelected}
          />
        ))}
      </div>
    </>
  );
};

export default RoomsRadio;
