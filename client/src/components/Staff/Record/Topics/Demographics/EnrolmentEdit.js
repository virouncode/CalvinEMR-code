import React, { useState } from "react";
import { toast } from "react-toastify";
import { putPatientRecord } from "../../../../../api/fetchRecords";
import {
  enrollmentStatusCT,
  terminationReasonCT,
} from "../../../../../datas/codesTables";
import useAuth from "../../../../../hooks/useAuth";
import { firstLetterUpper } from "../../../../../utils/firstLetterUpper";
import { toLocalDate } from "../../../../../utils/formatDates";
import { enrolmentSchema } from "../../../../../validation/enrolmentValidation";
import GenericList from "../../../../All/UI/Lists/GenericList";

const EnrolmentEdit = ({
  setEditVisible,
  enrolment,
  enrolmentIndex,
  demographicsInfos,
  enrolmentHistory,
}) => {
  const { user, socket, auth } = useAuth();
  const [err, setErr] = useState("");
  const [formDatas, setFormDatas] = useState(enrolment);

  console.log("enrolmentIndex", enrolmentIndex);

  const handleChange = (e) => {
    setErr("");
    const name = e.target.name;
    let value = e.target.value;
    if (name === "EnrollmentDate" || name === "EnrollmentTerminationDate") {
      value = value === "" ? null : Date.parse(new Date(value));
    }
    if (name === "EnrolledToPhysicianFirstName") {
      setFormDatas({
        ...formDatas,
        EnrolledToPhysician: {
          ...formDatas.EnrolledToPhysician,
          Name: { ...formDatas.EnrolledToPhysician.Name, FirstName: value },
        },
      });
      return;
    } else if (name === "EnrolledToPhysicianLastName") {
      setFormDatas({
        ...formDatas,
        EnrolledToPhysician: {
          ...formDatas.EnrolledToPhysician,
          Name: { ...formDatas.EnrolledToPhysician.Name, LastName: value },
        },
      });
      return;
    } else if (name === "EnrolledToPhysicianOHIP") {
      setFormDatas({
        ...formDatas,
        EnrolledToPhysician: {
          ...formDatas.EnrolledToPhysician,
          OHIPPhysicianId: value,
        },
      });
      return;
    }
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Validation
    try {
      await enrolmentSchema.validate(formDatas);
    } catch (err) {
      setErr(err.message);
      return;
    }
    if (formDatas.TerminationReason && !formDatas.EnrollmentTerminationDate) {
      setErr("Please enter a Termination date");
      return;
    }
    if (!formDatas.TerminationReason && formDatas.EnrollmentTerminationDate) {
      setErr("Please enter a Termination reason");
      return;
    }
    //Formatting
    const newEnrolmentToPut = {
      ...formDatas,
      EnrolledToPhysician: {
        ...formDatas.EnrolledToPhysician,
        Name: {
          FirstName: firstLetterUpper(
            formDatas.EnrolledToPhysician.Name.FirstName
          ),
          LastName: firstLetterUpper(
            formDatas.EnrolledToPhysician.Name.LastName
          ),
        },
      },
    };
    console.log("newEnrolmentToPut", newEnrolmentToPut);
    const datasToPut = {
      ...demographicsInfos,
      Enrolment: {
        EnrolmentHistory: enrolmentHistory.map((enrolment, index) =>
          index === enrolmentIndex ? newEnrolmentToPut : enrolment
        ),
      },
    };

    //Submission
    try {
      await putPatientRecord(
        "/demographics",
        demographicsInfos.id,
        user.id,
        auth.authToken,
        datasToPut,
        socket,
        "DEMOGRAPHICS"
      );
      setEditVisible(false);
      toast.success("Enrolment saved successfully", { containerId: "B" });
    } catch (err) {
      toast.error(`Error: unable to save enrolment : ${err.message}`, {
        containerId: "B",
      });
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setEditVisible(false);
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
              value={formDatas?.EnrolledToPhysician?.Name?.FirstName || ""}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
          <div className="new-enrolment__form-row new-enrolment__form-row--special">
            <label>Last Name*: </label>
            <input
              type="text"
              name="EnrolledToPhysicianLastName"
              value={formDatas?.EnrolledToPhysician?.Name?.LastName || ""}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
          <div className="new-enrolment__form-row new-enrolment__form-row--special">
            <label>OHIP#: </label>
            <input
              type="text"
              name="EnrolledToPhysicianOHIP"
              value={formDatas?.EnrolledToPhysician?.OHIPPhysicianId || ""}
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
            value={formDatas?.EnrollmentStatus || ""}
            handleChange={handleChange}
            placeHolder="Choose a status..."
            noneOption={true}
          />
        </div>
        <div className="new-enrolment__form-row">
          <label>Enrolment date*:</label>
          <input
            type="date"
            value={toLocalDate(formDatas?.EnrollmentDate)}
            onChange={handleChange}
            name="EnrollmentDate"
          />
        </div>
        <div className="new-enrolment__form-row">
          <label>Termination date:</label>
          <input
            type="date"
            value={toLocalDate(formDatas?.EnrollmentTerminationDate)}
            onChange={handleChange}
            name="EnrollmentTerminationDate"
          />
        </div>
        <div className="new-enrolment__form-row">
          <label>Termination reason:</label>
          <GenericList
            list={terminationReasonCT}
            value={formDatas?.TerminationReason || ""}
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

export default EnrolmentEdit;
