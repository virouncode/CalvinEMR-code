import React from "react";
import { toast } from "react-toastify";
import xanoPut from "../../../api/xanoPut";
import { axiosXanoStaff } from "../../../api/xanoStaff";
import useAuthContext from "../../../hooks/useAuthContext";
import useSocketContext from "../../../hooks/useSocketContext";
import useUserContext from "../../../hooks/useUserContext";

const FirstDaySelect = () => {
  const { auth } = useAuthContext();
  const { user } = useUserContext();
  const { socket } = useSocketContext();

  const handleChange = async (e) => {
    const value = e.target.value;
    try {
      const datasToPut = { ...user.settings, first_day: value };
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
            settings: { ...user.settings, first_day: value },
          },
        },
      });
      toast.success("Saved preference", { containerId: "A" });
    } catch (err) {
      toast.success(`Error: unable to save preference: ${err.message}`, {
        containerId: "A",
      });
    }
  };
  return (
    <div className="calendar__day-select">
      <label htmlFor="firstDay">First day of the week</label>
      <select
        name="firstDay"
        value={user.settings.first_day}
        onChange={handleChange}
        id="firstDay"
      >
        <option value="0">Sunday</option>
        <option value="1">Monday</option>
        <option value="2">Tuesday</option>
        <option value="3">Wednesday</option>
        <option value="4">Thursday</option>
        <option value="5">Friday</option>
        <option value="6">Saturday</option>
      </select>
    </div>
  );
};

export default FirstDaySelect;
