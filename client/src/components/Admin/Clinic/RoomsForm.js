import React, { useRef } from "react";
import RoomItem from "./RoomItem";

const RoomsForm = ({ formDatas, setFormDatas, setErrMsg }) => {
  const roomIds = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
  ];
  const roomIdCounter = useRef("a");

  const handleAddRoom = (e) => {
    e.preventDefault();
    setErrMsg("");
    const idsTaken = [...formDatas.rooms].map(({ id }) => id);
    let nextId = roomIdCounter.current;
    let i = 0;
    while (idsTaken.includes(nextId)) {
      i++;
      nextId = roomIds[i];
    }
    roomIdCounter.current = nextId;

    setFormDatas({
      ...formDatas,
      rooms: [...formDatas.rooms, { id: roomIdCounter.current, title: "" }],
    });
  };

  const handleChangeRoomTitle = (e, id) => {
    setErrMsg("");
    const value = e.target.value;
    setFormDatas({
      ...formDatas,
      rooms: formDatas.rooms.map((room) => {
        return room.id === id ? { id: id, title: value } : room;
      }),
    });
  };

  const handleDeleteRoom = (e, id) => {
    setFormDatas({
      ...formDatas,
      rooms: formDatas.rooms.filter((room) => room.id !== id),
    });
    const idsTaken = formDatas.rooms
      .filter((room) => room.id !== id)
      .map(({ id }) => id);
    let nextId = "a";
    let i = 0;
    while (idsTaken.includes(nextId)) {
      i++;
      nextId = roomIds[i];
    }
    roomIdCounter.current = nextId;
  };

  return (
    <div className="site-form__rooms">
      <label>Rooms*:</label>
      <button onClick={handleAddRoom}>Add a new room</button>
      <ul>
        {formDatas.rooms
          .filter(({ id }) => id !== "z")
          .sort((a, b) => a.id.localeCompare(b.id))
          .map((room) => (
            <RoomItem
              room={room}
              key={room.id}
              handleChangeRoomTitle={handleChangeRoomTitle}
              handleDeleteRoom={handleDeleteRoom}
            />
          ))}
      </ul>
    </div>
  );
};

export default RoomsForm;
