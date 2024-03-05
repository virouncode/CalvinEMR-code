import React from "react";
import { toast } from "react-toastify";
import { axiosXanoStaff } from "../../../../api/xanoStaff";
import useAuthContext from "../../../../hooks/useAuthContext";
import useSocketContext from "../../../../hooks/useSocketContext";
import useUserContext from "../../../../hooks/useUserContext";
import { confirmAlert } from "../../../All/Confirm/ConfirmGlobal";

const MessagesToolBar = ({
  search,
  setSearch,
  newVisible,
  setNewVisible,
  messages,
  section,
  setSection,
  msgsSelectedIds,
  setMsgsSelectedIds,
  currentMsgId,
  setPopUpVisible,
  selectAllVisible,
  setSelectAllVisible,
  paging,
  setPaging,
}) => {
  const { auth } = useAuthContext();
  const { user } = useUserContext();
  const { socket } = useSocketContext();

  const handleChange = (e) => {
    setSearch(e.target.value);
    setPaging({ ...paging, page: 1 });
  };
  const handleClickNew = (e) => {
    if (newVisible) {
      alert(
        "You already opened a New Message window, please send your message or close the window"
      );
      return;
    }
    setNewVisible(true);
  };

  const handleSelectAll = () => {
    const allMessagesIds = messages.map(({ id }) => id);
    setMsgsSelectedIds(allMessagesIds);
    setSelectAllVisible(false);
  };

  const handleUnselectAll = () => {
    setMsgsSelectedIds([]);
    setSelectAllVisible(true);
  };

  const handleDeleteSelected = async () => {
    if (
      await confirmAlert({
        content: "Do you really want to delete selected messages ?",
      })
    ) {
      try {
        const msgsSelected = (
          await axiosXanoStaff.get("/messages_selected", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
            params: {
              messages_ids: msgsSelectedIds,
            },
          })
        ).data;
        for (let message of msgsSelected) {
          const datasToPut = {
            ...message,
            deleted_by_staff_ids: [...message.deleted_by_staff_ids, user.id],
            attachments_ids: message.attachments_ids.map(
              ({ attachment }) => attachment.id
            ),
          };
          delete datasToPut.patient_infos;
          const response = await axiosXanoStaff.put(
            `/messages/${message.id}`,
            datasToPut,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth.authToken}`,
              },
            }
          );
          socket.emit("message", {
            route: "MESSAGES INBOX",
            action: "update",
            content: { id: message.id, data: response.data },
          });
          socket.emit("message", {
            route: "MESSAGES ABOUT PATIENT",
            action: "update",
            content: { id: message.id, data: response.data },
          });
        }
        setNewVisible(false);
        toast.success("Message(s) deleted successfully", { containerId: "A" });
        setMsgsSelectedIds([]);
        setSelectAllVisible(true);
      } catch (err) {
        toast.error(`Error: unable to delete message(s): ${err.message}`, {
          containerId: "A",
        });
      }
    }
  };

  const handleClickUndelete = async (e) => {
    try {
      const msgsSelected = (
        await axiosXanoStaff.get("/messages_selected", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.authToken}`,
          },
          params: {
            messages_ids: msgsSelectedIds,
          },
        })
      ).data;
      for (let message of msgsSelected) {
        const datasToPut = {
          ...message,
          deleted_by_staff_ids: message.deleted_by_staff_ids.filter(
            (id) => id !== user.id
          ),
          attachments_ids: message.attachments_ids.map(
            ({ attachment }) => attachment.id
          ),
        };
        delete datasToPut.patient_infos;
        const response = await axiosXanoStaff.put(
          `/messages/${message.id}`,
          datasToPut,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
          }
        );
        socket.emit("message", {
          route: "MESSAGES INBOX",
          action: "update",
          content: { id: message.id, data: response.data },
        });
        socket.emit("message", {
          route: "MESSAGES ABOUT PATIENT",
          action: "update",
          content: { id: message.id, data: response.data },
        });
      }
      // setSection("Inbox");
      setMsgsSelectedIds([]);
      setSelectAllVisible(true);
      toast.success("Message(s) undeleted successfully", {
        containerId: "A",
      });
    } catch (err) {
      toast.error(`Error: unable to undelete message(s): ${err.message}`, {
        containerId: "A",
      });
    }
  };

  // const handleClickSearch = (e) => {};
  const handleClickPrint = () => {
    setPopUpVisible(true);
  };

  return (
    <div className="messages-toolbar">
      <p className="messages-toolbar__title">Messaging</p>
      <input
        type="text"
        placeholder="Search in messages"
        value={search}
        onChange={handleChange}
        id="search"
      />
      <div className="messages-toolbar__btns">
        <button onClick={handleClickNew}>New</button>
        {section === "Deleted messages" && msgsSelectedIds.length !== 0 && (
          <button onClick={handleClickUndelete}>Undelete</button>
        )}
        {currentMsgId !== 0 && (
          <button onClick={handleClickPrint}>Print</button>
        )}
        {section !== "Deleted messages" &&
          currentMsgId === 0 &&
          msgsSelectedIds.length !== 0 && (
            <button onClick={handleDeleteSelected}>Delete Selected</button>
          )}
        {currentMsgId === 0 &&
          (selectAllVisible ? (
            <button onClick={handleSelectAll}>Select All</button>
          ) : (
            <button onClick={handleUnselectAll}>Unselect All</button>
          ))}
      </div>
    </div>
  );
};

export default MessagesToolBar;
