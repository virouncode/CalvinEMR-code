import React from "react";
import { toast } from "react-toastify";
import xanoPut from "../../../api/xanoCRUD/xanoPut";
import { axiosXanoStaff } from "../../../api/xanoStaff";
import useAuthContext from "../../../hooks/useAuthContext";
import useSocketContext from "../../../hooks/useSocketContext";
import useUserContext from "../../../hooks/useUserContext";

const SlotSelect = () => {
  const { auth } = useAuthContext();
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const handleChange = async (e) => {
    const value = e.target.value;
    try {
      const datasToPut = { ...user.settings, slot_duration: value };
      await xanoPut(
        "/settings",
        axiosXanoStaff,
        auth.authToken,
        datasToPut,
        user.settings.id
      );
      socket.emit("message", {
        route: "USER",
        action: "update",
        content: {
          id: user.id,
          data: {
            ...user,
            settings: { ...user.settings, slot_duration: value },
          },
        },
      });
      toast.success("Saved preference", { containerId: "A" });
    } catch (err) {
      toast.error(`Error: unable to save preference: ${err.message}`, {
        containerId: "A",
      });
    }
  };
  return (
    <div className="calendar__slot-select">
      <label htmlFor="duration">Time Slot Duration</label>
      <select
        id="duration"
        name="duration"
        value={user.settings.slot_duration}
        onChange={handleChange}
      >
        <option value="00:05">5 mn</option>
        <option value="00:10">10 mn</option>
        <option value="00:15">15 mn</option>
        <option value="00:20">20 mn</option>
        <option value="00:30">30 mn</option>
        <option value="01:00">1 h</option>
      </select>
    </div>
  );
};

export default SlotSelect;
