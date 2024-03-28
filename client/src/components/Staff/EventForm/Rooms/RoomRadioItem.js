import React from "react";

const RoomRadioItem = ({
  roomId,
  roomName,
  isRoomOccupied,
  handleRoomChange,
  isRoomSelected,
}) => {
  return (
    <div className="event-form__item event-form__item--radio">
      <input
        type="radio"
        name="room_id"
        id={roomId}
        value={roomId}
        onChange={handleRoomChange}
        checked={isRoomSelected(roomId)}
      />
      <label htmlFor={roomId}>
        {roomName} {isRoomOccupied(roomId) ? "(Occupied)" : ""}
      </label>
    </div>
  );
};

export default RoomRadioItem;
