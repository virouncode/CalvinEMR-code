import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  deletePatientRecord,
  putPatientRecord,
} from "../../../../../api/fetchRecords";
import { lifeStageCT, toCodeTableName } from "../../../../../datas/codesTables";
import useAuth from "../../../../../hooks/useAuth";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/firstLetterUpper";
import { toLocalDate } from "../../../../../utils/formatDates";
import { pastHealthSchema } from "../../../../../validation/pastHealthValidation";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";
import GenericList from "../../../../All/UI/Lists/GenericList";
import SignCell from "../SignCell";

const PastHealthEvent = ({ event, editCounter, setErrMsgPost, errMsgPost }) => {
  //HOOKS
  const { auth, user, clinic, socket } = useAuth();
  const [editVisible, setEditVisible] = useState(false);
  const [eventInfos, setEventInfos] = useState(null);

  useEffect(() => {
    setEventInfos(event);
  }, [event]);

  //HANDLERS
  const handleChange = (e) => {
    setErrMsgPost("");
    const name = e.target.name;
    let value = e.target.value;
    if (
      name === "ProcedureDate" ||
      name === "OnsetOrEventDate" ||
      name === "ResolvedDate"
    ) {
      value = value === "" ? null : Date.parse(new Date(value));
    }
    setEventInfos({ ...eventInfos, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Formatting
    const formDatas = {
      ...eventInfos,
      PastHealthProblemDescriptionOrProcedures: firstLetterOfFirstWordUpper(
        eventInfos.PastHealthProblemDescriptionOrProcedures
      ),
      ProblemStatus: firstLetterOfFirstWordUpper(eventInfos.ProblemStatus),
      Notes: firstLetterOfFirstWordUpper(eventInfos.Notes),
    };

    //Validation
    try {
      await pastHealthSchema.validate(formDatas);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    //Submission
    try {
      await putPatientRecord(
        "/past_health",
        event.id,
        user.id,
        auth.authToken,
        formDatas,
        socket,
        "PAST HEALTH"
      );
      editCounter.current -= 1;
      setEditVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
    } catch (err) {
      toast.error(
        `Error unable to update medical history event: ${err.message}`,
        { containerId: "B" }
      );
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    editCounter.current -= 1;
    setErrMsgPost("");
    setEventInfos(event);
    setEditVisible(false);
  };

  const handleEditClick = (e) => {
    editCounter.current += 1;
    setErrMsgPost("");
    setEditVisible(true);
  };

  const handleDeleteClick = async (e) => {
    setErrMsgPost("");
    if (
      await confirmAlert({
        content: "Do you really want to delete this item ?",
      })
    ) {
      try {
        await deletePatientRecord(
          "/past_health",
          event.id,
          auth.authToken,
          socket,
          "PAST HEALTH"
        );
        toast.success("Deleted successfully", { containerId: "B" });
      } catch (err) {
        toast.error(
          `Error unable to delete medical history event: ${err.message}`,
          { containerId: "B" }
        );
      }
    }
  };

  return (
    eventInfos && (
      <tr
        className="pasthealth__event"
        style={{ border: errMsgPost && editVisible && "solid 1.5px red" }}
      >
        <td>
          {editVisible ? (
            <input
              name="PastHealthProblemDescriptionOrProcedures"
              type="text"
              value={eventInfos.PastHealthProblemDescriptionOrProcedures}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            eventInfos.PastHealthProblemDescriptionOrProcedures
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="OnsetOrEventDate"
              type="date"
              max={toLocalDate(Date.now())}
              value={toLocalDate(eventInfos.OnsetOrEventDate)}
              onChange={handleChange}
            />
          ) : (
            toLocalDate(eventInfos.OnsetOrEventDate)
          )}
        </td>
        <td>
          {editVisible ? (
            <GenericList
              list={lifeStageCT}
              value={eventInfos.LifeStage}
              name="LifeStage"
              handleChange={handleChange}
              placeHolder="Choose a lifestage..."
              noneOption={false}
            />
          ) : (
            toCodeTableName(lifeStageCT, eventInfos.LifeStage)
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="ProcedureDate"
              type="date"
              max={toLocalDate(Date.now())}
              value={toLocalDate(eventInfos.ProcedureDate)}
              onChange={handleChange}
            />
          ) : (
            toLocalDate(eventInfos.ProcedureDate)
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="ResolvedDate"
              type="date"
              max={toLocalDate(Date.now())}
              value={toLocalDate(eventInfos.ResolvedDate)}
              onChange={handleChange}
            />
          ) : (
            toLocalDate(eventInfos.ResolvedDate)
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="ProblemStatus"
              type="text"
              value={eventInfos.ProblemStatus}
              onChange={handleChange}
            />
          ) : (
            eventInfos.ProblemStatus
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="Notes"
              type="text"
              value={eventInfos.Notes}
              onChange={handleChange}
            />
          ) : (
            eventInfos.Notes
          )}
        </td>
        <SignCell item={event} staffInfos={clinic.staffInfos} />
        <td>
          <div className="pasthealth__event-btn-container">
            {!editVisible ? (
              <>
                <button onClick={handleEditClick}>Edit</button>
                <button onClick={handleDeleteClick}>Delete</button>
              </>
            ) : (
              <>
                <input type="submit" value="Save" onClick={handleSubmit} />
                <button type="button" onClick={handleCancel}>
                  Cancel
                </button>
              </>
            )}
          </div>
        </td>
      </tr>
    )
  );
};

export default PastHealthEvent;
