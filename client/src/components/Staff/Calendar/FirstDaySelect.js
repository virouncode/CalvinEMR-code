import React from "react";
import { toast } from "react-toastify";
import { axiosXanoStaff } from "../../../api/xanoStaff";
import useAuth from "../../../hooks/useAuth";

const FirstDaySelect = () => {
  const { auth, user, setUser } = useAuth();
  const handleChange = async (e) => {
    const value = e.target.value;
    try {
      await axiosXanoStaff.put(
        `/settings/${user.settings.id}`,
        { ...user.settings, first_day: value },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
        }
      );
      setUser({
        ...user,
        settings: { ...user.settings, first_day: value },
      });
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          settings: { ...user.settings, first_day: value },
        })
      );
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
