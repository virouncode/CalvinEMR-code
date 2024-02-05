import React from "react";

const RoomItem = ({ room, handleDeleteRoom, handleChangeRoomTitle }) => {
  return (
    <li className="site-form__room-item">
      <div className="site-form__room-item-id">
        <label>ID*:</label>
        {room.id}
      </div>
      <label>Name*:</label>
      <input
        value={room.title}
        onChange={(e) => handleChangeRoomTitle(e, room.id)}
      />
      <i
        className="fa-solid fa-trash  message-detail__trash"
        onClick={(e) => handleDeleteRoom(e, room.id)}
      ></i>
    </li>
  );
};

export default RoomItem;
