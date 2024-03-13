import { useEffect } from "react";
import { toast } from "react-toastify";

import xanoDelete from "../api/xanoCRUD/xanoDelete";
import { confirmAlert } from "../components/All/Confirm/ConfirmGlobal";
import useSocketContext from "./useSocketContext";
import useUserContext from "./useUserContext";

const useCalendarShortcuts = (
  fcRef,
  currentEvent,
  lastCurrentId,
  eventCounter,
  formVisible,
  setFormVisible,
  setCalendarSelectable,
  editAvailabilityVisible
) => {
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  useEffect(() => {
    const handleKeyboardShortcut = async (e) => {
      if (editAvailabilityVisible || formVisible) return;
      if (e.keyCode === 37 && e.shiftKey) {
        //arrow left
        fcRef.current.calendar.prev();
      } else if (e.keyCode === 39 && e.shiftKey) {
        //arrow right
        fcRef.current.calendar.next();
      } else if (e.keyCode === 84 && e.shiftKey) {
        //T
        fcRef.current.calendar.today();
      } else if (
        currentEvent.current &&
        (currentEvent.current.extendedProps.host === user.id ||
          user.title === "Secretary") &&
        (e.key === "Backspace" || e.key === "Delete")
      ) {
        //backspace
        if (
          await confirmAlert({
            content: "Do you really want to remove this event ?",
          })
        ) {
          try {
            await xanoDelete(
              `/appointments/${parseInt(currentEvent.current.id)}`,
              "staff"
            );
            toast.success("Deleted Successfully", { containerId: "A" });
            socket.emit("message", {
              route: "EVENTS",
              action: "delete",
              content: { id: currentEvent.current.id },
            });
            socket.emit("message", {
              route: "APPOINTMENTS",
              action: "delete",
              content: { id: currentEvent.current.id },
            });
            setFormVisible(false);
            setCalendarSelectable(true);
            currentEvent.current = null;
            lastCurrentId.current = "";
          } catch (err) {
            toast.error(`Error: unable to delete appointment: ${err.message}`, {
              containerId: "A",
            });
          }
        }
      } else if (e.keyCode === 40 && e.shiftKey) {
        const eventsList = document.getElementsByClassName("fc-event");
        eventCounter.current += 1;
        eventsList[eventCounter.current % eventsList.length].click();
        eventsList[eventCounter.current % eventsList.length].scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      } else if (e.keyCode === 38 && e.shiftKey) {
        const eventsList = document.getElementsByClassName("fc-event");
        eventCounter.current - 1 < 0
          ? (eventCounter.current = eventsList.length - 1)
          : (eventCounter.current -= 1);
        eventsList[eventCounter.current % eventsList.length].click();
        eventsList[eventCounter.current % eventsList.length].scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }
    };

    window.addEventListener("keydown", handleKeyboardShortcut);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyboardShortcut);
    };
  }, [
    currentEvent,
    eventCounter,
    fcRef,
    formVisible,
    lastCurrentId,
    setCalendarSelectable,
    setFormVisible,
    socket,
    user.id,
    user.title,
    editAvailabilityVisible,
  ]);
};

export default useCalendarShortcuts;
