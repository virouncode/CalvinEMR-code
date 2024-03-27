import { toast } from "react-toastify";
import xanoDelete from "../../../../api/xanoCRUD/xanoDelete";
import xanoGet from "../../../../api/xanoCRUD/xanoGet";
import xanoPut from "../../../../api/xanoCRUD/xanoPut";
import useSocketContext from "../../../../hooks/context/useSocketContext";
import useUserContext from "../../../../hooks/context/useUserContext";
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
  newTodoVisible,
  setNewTodoVisible,
}) => {
  const { user } = useUserContext();
  const { socket } = useSocketContext();

  const handleChange = (e) => {
    setSearch(e.target.value);
    setPaging({ ...paging, page: 1 });
  };
  const handleClickNew = (e) => {
    if (section === "To-dos") {
      setNewTodoVisible(true);
    } else {
      setNewVisible(true);
    }
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
        content: `Do you really want to delete selected ${
          section === "To-dos" ? "to-dos" : "messages"
        }?`,
      })
    ) {
      try {
        if (section === "To-dos") {
          for (let messageId of msgsSelectedIds) {
            const messageToDelete = messages.find(({ id }) => id === messageId);
            const attachmentsIdsToDelete = messageToDelete.attachments_ids.map(
              ({ attachment }) => attachment.id
            );
            for (let attachmentId of attachmentsIdsToDelete) {
              await xanoDelete(
                `/messages_attachments/${attachmentId}`,
                "staff"
              );
            }
            await xanoDelete(`/todos/${messageId}`, "staff");
            socket.emit("message", {
              route: "MESSAGES INBOX",
              action: "delete",
              content: { id: messageId },
            });
            socket.emit("message", {
              route: "TO-DOS ABOUT PATIENT",
              action: "delete",
              content: { id: messageId },
            });
          }
          setNewVisible(false);
          toast.success("To-do(s) deleted successfully", {
            containerId: "A",
          });
          setMsgsSelectedIds([]);
          setSelectAllVisible(true);
        } else {
          const msgsSelected = (
            await xanoGet("/messages_selected", "staff", {
              messages_ids: msgsSelectedIds,
            })
          ).data;
          for (let message of msgsSelected) {
            const datasToPut = {
              ...message,
              deleted_by_staff_ids: [...message.deleted_by_staff_ids, user.id],
            };
            const response = await xanoPut(
              `/messages/${message.id}`,
              "staff",
              datasToPut
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
          toast.success("Message(s) deleted successfully", {
            containerId: "A",
          });
          setMsgsSelectedIds([]);
          setSelectAllVisible(true);
        }
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
        await xanoGet("/messages_selected", "staff", {
          messages_ids: msgsSelectedIds,
        })
      ).data;
      for (let message of msgsSelected) {
        const datasToPut = {
          ...message,
          deleted_by_staff_ids: message.deleted_by_staff_ids.filter(
            (id) => id !== user.id
          ),
        };
        delete datasToPut.patient_infos;
        const response = await xanoPut(
          `/messages/${message.id}`,
          "staff",
          datasToPut
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
        <button
          onClick={handleClickNew}
          disabled={
            (section === "To-dos" && newTodoVisible) ||
            (section !== "To-dos" && newVisible)
          }
        >
          New
        </button>
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
