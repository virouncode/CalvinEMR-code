import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  deletePatientRecord,
  putPatientRecord,
} from "../../../../../api/fetchRecords";
import useAuth from "../../../../../hooks/useAuth";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/firstLetterUpper";
import { toLocalDate } from "../../../../../utils/formatDates";
import { pregnancySchema } from "../../../../../validation/pregnancyValidation";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";
import PregnanciesList from "../../../../All/UI/Lists/PregnanciesList";
import SignCell from "../SignCell";

const PregnancyEvent = ({ event, editCounter, setErrMsgPost, errMsgPost }) => {
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
    if (name === "date_of_event") {
      value = value === "" ? null : Date.parse(new Date(value));
    }
    if (name === "term_nbr_of_weeks" || name === "term_nbr_of_days") {
      value = parseInt(value);
    }
    setEventInfos({ ...eventInfos, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Formatting
    const datasToPut = { ...eventInfos };
    const datasForValidation = { ...eventInfos };
    if (datasForValidation.term_nbr_of_weeks === "") {
      datasForValidation.term_nbr_of_weeks = 0;
    }
    if (datasForValidation.term_nbr_of_days === "") {
      datasForValidation.term_nbr_of_days = 0;
    }
    datasToPut.premises = firstLetterOfFirstWordUpper(datasToPut.premises);

    try {
      await pregnancySchema.validate(datasForValidation);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    try {
      await putPatientRecord(
        "/pregnancies",
        event.id,
        user.id,
        auth.authToken,
        datasToPut,
        socket,
        "PREGNANCIES"
      );

      editCounter.current -= 1;
      setEditVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
    } catch (err) {
      toast.error(`Error: unable to update pregnancy event: ${err.message}`, {
        containerId: "B",
      });
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
          "/pregnancies",
          event.id,
          auth.authToken,
          socket,
          "PREGNANCIES"
        );

        toast.success("Deleted successfully", { containerId: "B" });
      } catch (err) {
        toast.error(`Error: unable to delete pregnancy event: ${err.message}`, {
          containerId: "B",
        });
      }
    }
  };

  return (
    eventInfos && (
      <tr
        className="pregnancies-event"
        style={{ border: errMsgPost && editVisible && "solid 1.5px red" }}
      >
        <td>
          {editVisible ? (
            <PregnanciesList
              value={eventInfos.description}
              name="description"
              handleChange={handleChange}
            />
          ) : (
            eventInfos.description
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="date_of_event"
              type="date"
              value={toLocalDate(eventInfos.date_of_event)}
              onChange={handleChange}
              className="pregnancies-event__input2"
            />
          ) : (
            toLocalDate(eventInfos.date_of_event)
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              name="premises"
              type="text"
              value={eventInfos.premises}
              onChange={handleChange}
              className="pregnancies-event__input1"
              autoComplete="off"
            />
          ) : (
            eventInfos.premises
          )}
        </td>
        <td>
          {editVisible ? (
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
                width: "100%",
              }}
            >
              <input
                name="term_nbr_of_weeks"
                type="number"
                value={eventInfos.term_nbr_of_weeks}
                onChange={handleChange}
                className="pregnancies-event__input3"
                autoComplete="off"
              />
              w
              <input
                name="term_nbr_of_days"
                type="number"
                value={eventInfos.term_nbr_of_days}
                onChange={handleChange}
                className="pregnancies-event__input3"
                autoComplete="off"
              />
              d
            </div>
          ) : (
            <div>
              {eventInfos.term_nbr_of_weeks}w{eventInfos.term_nbr_of_days}d
            </div>
          )}
        </td>
        <SignCell item={event} staffInfos={clinic.staffInfos} />
        <td>
          <div className="pregnancies-event__btn-container">
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

export default PregnancyEvent;
