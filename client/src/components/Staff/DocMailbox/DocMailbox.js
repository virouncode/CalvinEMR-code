import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosXanoStaff } from "../../../api/xanoStaff";
import useAuthContext from "../../../hooks/useAuthContext";
import { onMessageDocMailbox } from "../../../utils/socketHandlers/onMessageDocMailbox";
import CircularProgressMedium from "../../All/UI/Progress/CircularProgressMedium";
import DocMailboxAssignedPracticianForward from "./DocMailboxAssignedPracticianForward";
import DocMailboxItem from "./DocMailboxItem";

const DocMailbox = () => {
  //HOOKS
  const { user, auth, clinic, socket } = useAuthContext();
  const [documents, setDocuments] = useState(null);
  const [forwardVisible, setForwardVisible] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [assignedId, setAssignedId] = useState(0);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchDocMailbox = async () => {
      try {
        const response = await axiosXanoStaff.get(
          `/reports_for_staff?staff_id=${user.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
            signal: abortController.signal,
          }
        );
        if (abortController.signal.aborted) return;
        setDocuments(response.data.filter(({ acknowledged }) => !acknowledged));
      } catch (err) {
        if (err.name !== "CanceledError")
          toast.error(`Error: unable to get inbox documents: ${err.message}`, {
            containerId: "A",
          });
      }
    };
    fetchDocMailbox();
    return () => abortController.abort();
  }, [auth.authToken, user.id]);

  useEffect(() => {
    if (!socket) return;
    const onMessage = (message) =>
      onMessageDocMailbox(message, documents, setDocuments, user.id, false);
    socket.on("message", onMessage);
    return () => {
      socket.off("message", onMessage);
    };
  }, [documents, socket, user.id]);

  //HANDLERS

  const handleCheckPractician = (e) => {
    setErrMsg("");
    setAssignedId(parseInt(e.target.id));
  };

  const isPracticianChecked = (id) => {
    return assignedId === parseInt(id);
  };
  return (
    <>
      {documents ? (
        <>
          {errMsg && <div className="docmailbox__err">{errMsg}</div>}
          {documents.length > 0 ? (
            <>
              <h3 className="docmailbox__subtitle">Reports to acknowledge</h3>
              <table className="docmailbox__table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Format</th>
                    <th>File extension and version</th>
                    <th>File</th>
                    <th>Class</th>
                    <th>SubClass</th>
                    <th>Related patient</th>
                    <th>Date of document</th>
                    <th>Date received</th>
                    <th>Author</th>
                    <th>Notes</th>
                    <th>Updated by</th>
                    <th>Updated on</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((document) => (
                    <DocMailboxItem
                      item={document}
                      key={document.id}
                      setErrMsg={setErrMsg}
                      setForwardVisible={setForwardVisible}
                      forwardVisible={forwardVisible}
                    />
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <p className="docmailbox__noinbox">No inbox documents</p>
          )}
          {forwardVisible && (
            <DocMailboxAssignedPracticianForward
              staffInfos={clinic.staffInfos}
              handleCheckPractician={handleCheckPractician}
              isPracticianChecked={isPracticianChecked}
              assignedId={assignedId}
              setForwardVisible={setForwardVisible}
              setDocuments={setDocuments}
              setAssignedId={setAssignedId}
            />
          )}
        </>
      ) : (
        <CircularProgressMedium />
      )}
    </>
  );
};

export default DocMailbox;
