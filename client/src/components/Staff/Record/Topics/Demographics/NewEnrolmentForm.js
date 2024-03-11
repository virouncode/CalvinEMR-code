import React, { useState } from "react";
import { toast } from "react-toastify";
import { putPatientRecord } from "../../../../../api/fetchRecords";
import {
  enrollmentStatusCT,
  terminationReasonCT,
} from "../../../../../datas/codesTables";
import useSocketContext from "../../../../../hooks/useSocketContext";
import useUserContext from "../../../../../hooks/useUserContext";
import { firstLetterUpper } from "../../../../../utils/firstLetterUpper";
import { toLocalDate } from "../../../../../utils/formatDates";
import { enrolmentSchema } from "../../../../../validation/enrolmentValidation";
import GenericList from "../../../../All/UI/Lists/GenericList";

const NewEnrolmentForm = ({ setNewEnrolmentVisible, demographicsInfos }) => {
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const [newEnrolment, setNewEnrolment] = useState({
    EnrollmentStatus: "",
    EnrollmentDate: null,
    EnrollmentTerminationDate: null,
    TerminationReason: "",
    EnrolledToPhysician: {
      Name: {
        FirstName: "",
        LastName: "",
      },
      OHIPPhysicianId: "",
    },
  });

  const [err, setErr] = useState("");

  const handleChange = (e) => {
    setErr("");
    const name = e.target.name;
    let value = e.target.value;
    if (name === "EnrollmentDate" || name === "EnrollmentTerminationDate") {
      value = value === "" ? null : Date.parse(new Date(value));
    }
    if (name === "EnrolledToPhysicianFirstName") {
      setNewEnrolment({
        ...newEnrolment,
        EnrolledToPhysician: {
          ...newEnrolment.EnrolledToPhysician,
          Name: { ...newEnrolment.EnrolledToPhysician.Name, FirstName: value },
        },
      });
      return;
    } else if (name === "EnrolledToPhysicianLastName") {
      setNewEnrolment({
        ...newEnrolment,
        EnrolledToPhysician: {
          ...newEnrolment.EnrolledToPhysician,
          Name: { ...newEnrolment.EnrolledToPhysician.Name, LastName: value },
        },
      });
      return;
    } else if (name === "EnrolledToPhysicianOHIP") {
      setNewEnrolment({
        ...newEnrolment,
        EnrolledToPhysician: {
          ...newEnrolment.EnrolledToPhysician,
          OHIPPhysicianId: value,
        },
      });
      return;
    }
    setNewEnrolment({ ...newEnrolment, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Validation
    try {
      await enrolmentSchema.validate(newEnrolment);
    } catch (err) {
      setErr(err.message);
      return;
    }
    if (
      newEnrolment.TerminationReason &&
      !newEnrolment.EnrollmentTerminationDate
    ) {
      setErr("Please enter a Termination date");
      return;
    }
    if (
      !newEnrolment.TerminationReason &&
      newEnrolment.EnrollmentTerminationDate
    ) {
      setErr("Please enter a Termination reason");
      return;
    }
    //Formatting
    const newEnrolmentToPost = {
      ...newEnrolment,
      EnrolledToPhysician: {
        ...newEnrolment.EnrolledToPhysician,
        Name: {
          FirstName: firstLetterUpper(
            newEnrolment.EnrolledToPhysician.Name.FirstName
          ),
          LastName: firstLetterUpper(
            newEnrolment.EnrolledToPhysician.Name.LastName
          ),
        },
      },
    };
    const datasToPut = {
      ...demographicsInfos,
      Enrolment: {
        EnrolmentHistory: [
          ...demographicsInfos.Enrolment.EnrolmentHistory,
          newEnrolmentToPost,
        ],
      },
    };

    //Submission
    try {
      await putPatientRecord(
        `/demographics/${demographicsInfos.id}`,
        user.id,
        datasToPut,
        socket,
        "DEMOGRAPHICS"
      );
      setNewEnrolmentVisible(false);
      toast.success("New enrolment saved successfully", { containerId: "B" });
    } catch (err) {
      toast.error(`Error: unable to add new enrolment : ${err.message}`, {
        containerId: "B",
      });
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setNewEnrolmentVisible(false);
  };

  return (
    <div className="new-enrolment__form">
      <form onSubmit={handleSubmit}>
        {err && <p className="new-enrolment__err">{err}</p>}
        <div className="new-enrolment__form-physician">
          <label>Enrolled to physician: </label>
          <div className="new-enrolment__form-row new-enrolment__form-row--special">
            <label>First Name*: </label>
            <input
              type="text"
              name="EnrolledToPhysicianFirstName"
              value={newEnrolment?.EnrolledToPhysician?.Name?.FirstName}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
          <div className="new-enrolment__form-row new-enrolment__form-row--special">
            <label>Last Name*: </label>
            <input
              type="text"
              name="EnrolledToPhysicianLastName"
              value={newEnrolment?.EnrolledToPhysician?.Name?.LastName}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
          <div className="new-enrolment__form-row new-enrolment__form-row--special">
            <label>OHIP#: </label>
            <input
              type="text"
              name="EnrolledToPhysicianOHIP"
              value={newEnrolment?.EnrolledToPhysician?.OHIPPhysicianId}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
        </div>
        <div className="new-enrolment__form-row">
          <label>Enrolment status*:</label>
          <GenericList
            name="EnrollmentStatus"
            list={enrollmentStatusCT}
            value={newEnrolment?.EnrollmentStatus}
            handleChange={handleChange}
            placeHolder="Choose a status..."
            noneOption={true}
          />
        </div>
        <div className="new-enrolment__form-row">
          <label>Enrolment date*:</label>
          <input
            type="date"
            value={toLocalDate(newEnrolment?.EnrollmentDate)}
            onChange={handleChange}
            name="EnrollmentDate"
          />
        </div>
        <div className="new-enrolment__form-row">
          <label>Termination date:</label>
          <input
            type="date"
            value={toLocalDate(newEnrolment?.EnrollmentTerminationDate)}
            onChange={handleChange}
            name="EnrollmentTerminationDate"
          />
        </div>
        <div className="new-enrolment__form-row">
          <label>Termination reason:</label>
          <GenericList
            list={terminationReasonCT}
            value={newEnrolment?.TerminationReason}
            handleChange={handleChange}
            name="TerminationReason"
          />
        </div>
        <div className="new-enrolment__btn-container">
          <input type="submit" value="Save" />
          <button onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default NewEnrolmentForm;
