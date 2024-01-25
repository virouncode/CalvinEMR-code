import React from "react";

const RoomRadioItem = ({
  roomName,
  isRoomOccupied,
  handleRoomChange,
  isRoomSelected,
}) => {
  return (
    <div className="event-form__item event-form__item--radio">
      <input
        type="radio"
        name="room"
        id={roomName}
        value={roomName}
        onChange={handleRoomChange}
        checked={isRoomSelected(roomName)}
      />
      <label htmlFor={roomName}>
        {roomName} {isRoomOccupied(roomName) ? "(Occupied)" : ""}
      </label>
    </div>
  );
};

export default RoomRadioItem;
