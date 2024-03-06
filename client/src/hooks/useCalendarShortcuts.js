import { useEffect } from "react";
import { toast } from "react-toastify";
import xanoDelete from "../api/xanoCRUD/xanoDelete";
import { axiosXanoStaff } from "../api/xanoStaff";
import { confirmAlert } from "../components/All/Confirm/ConfirmGlobal";
import useAuthContext from "./useAuthContext";
import useSocketContext from "./useSocketContext";
import useUserContext from "./useUserContext";

const useCalendarShortcuts = (
  fcRef,
  currentEvent,
  lastCurrentId,
  eventCounter,
  formVisible,
  setFormVisible,
  setCalendarSelectable
) => {
  const { auth } = useAuthContext();
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  useEffect(() => {
    const handleKeyboardShortcut = async (event) => {
      if (event.keyCode === 37 && event.shiftKey) {
        //arrow left
        fcRef.current.calendar.prev();
      } else if (event.keyCode === 39 && event.shiftKey) {
        //arrow right
        fcRef.current.calendar.next();
      } else if (event.keyCode === 84 && event.shiftKey) {
        //T
        fcRef.current.calendar.today();
      } else if (
        currentEvent.current &&
        (currentEvent.current.extendedProps.host === user.id ||
          user.title === "Secretary") &&
        (event.key === "Backspace" || event.key === "Delete") &&
        !formVisible
      ) {
        //backspace
        if (
          await confirmAlert({
            content: "Do you really want to remove this event ?",
          })
        ) {
          try {
            await xanoDelete(
              "/appointments",
              axiosXanoStaff,
              auth.authToken,
              currentEvent.current.id
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
      } else if (event.keyCode === 40 && event.shiftKey) {
        const eventsList = document.getElementsByClassName("fc-event");
        eventCounter.current += 1;
        eventsList[eventCounter.current % eventsList.length].click();
        eventsList[eventCounter.current % eventsList.length].scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      } else if (event.keyCode === 38 && event.shiftKey) {
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
    auth.authToken,
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
  ]);
};

export default useCalendarShortcuts;
