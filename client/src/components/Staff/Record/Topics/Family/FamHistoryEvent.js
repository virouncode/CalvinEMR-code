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
import { famHistorySchema } from "../../../../../validation/famHistoryValidation";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";
import GenericList from "../../../../All/UI/Lists/GenericList";
import RelativesList from "../../../../All/UI/Lists/RelativesList";
import SignCell from "../SignCell";

const FamHistoryEvent = ({ event, editCounter, setErrMsgPost, errMsgPost }) => {
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
    if (name === "StartDate") {
      value = value === "" ? null : Date.parse(new Date(value));
    }
    setEventInfos({ ...eventInfos, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Formatting
    const formDatas = {
      ...eventInfos,
      ProblemDiagnosisProcedureDescription: firstLetterOfFirstWordUpper(
        eventInfos.ProblemDiagnosisProcedureDescription
      ),
      Treatment: firstLetterOfFirstWordUpper(eventInfos.Treatment),
      Notes: firstLetterOfFirstWordUpper(eventInfos.Notes),
    };

    //Validation
    try {
      await famHistorySchema.validate(formDatas);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    //Submission
    try {
      await putPatientRecord(
        "/family_history",
        event.id,
        user.id,
        auth.authToken,
        formDatas,
        socket,
        "FAMILY HISTORY"
      );
      editCounter.current -= 1;
      setEditVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
    } catch (err) {
      toast.error(
        `Error unable to update family history item: ${err.message}`,
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

  const handleMemberChange = (value) => {
    setEventInfos({ ...eventInfos, Relationship: value });
  };

  const handleEditClick = (e) => {
    editCounter.current += 1;
    setErrMsgPost("");
    setEditVisible((v) => !v);
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
          "/family_history",
          event.id,
          auth.authToken,
          socket,
          "FAMILY HISTORY"
        );
        toast.success("Deleted successfully", { containerId: "B" });
      } catch (err) {
        toast.error(
          `Error unable to delete family history item: ${err.message}`,
          { containerId: "B" }
        );
      }
    }
  };

  return (
    eventInfos && (
      <tr
        className="famhistory__event"
        style={{ border: errMsgPost && editVisible && "solid 1.5px red" }}
      >
        <td>
          {editVisible ? (
            <input
              name="ProblemDiagnosisProcedureDescription"
              type="text"
              value={eventInfos.ProblemDiagnosisProcedureDescription}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            eventInfos.ProblemDiagnosisProcedureDescription
          )}
        </td>
        <td>
          {editVisible ? (
            <RelativesList
              handleChange={handleMemberChange}
              value={eventInfos.Relationship}
            />
          ) : (
            eventInfos.Relationship
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              type="date"
              max={toLocalDate(Date.now())}
              name="StartDate"
              value={toLocalDate(eventInfos.StartDate)}
              onChange={handleChange}
            />
          ) : (
            toLocalDate(eventInfos.StartDate)
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              type="text"
              name="AgeAtOnset"
              value={eventInfos.AgeAtOnset}
              onChange={handleChange}
            />
          ) : (
            eventInfos.AgeAtOnset
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
              type="text"
              name="Treatment"
              value={eventInfos.Treatment}
              onChange={handleChange}
            />
          ) : (
            eventInfos.Treatment
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              type="text"
              name="Notes"
              value={eventInfos.Notes}
              onChange={handleChange}
            />
          ) : (
            eventInfos.Notes
          )}
        </td>
        <SignCell item={event} staffInfos={clinic.staffInfos} />
        <td>
          <div className="famhistory__event-btn-container">
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

export default FamHistoryEvent;
