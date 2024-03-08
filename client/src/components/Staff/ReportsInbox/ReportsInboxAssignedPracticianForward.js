import React, { useState } from "react";
import { toast } from "react-toastify";
import { putPatientRecord } from "../../../api/fetchRecords";
import useSocketContext from "../../../hooks/useSocketContext";
import useStaffInfosContext from "../../../hooks/useStaffInfosContext";
import useUserContext from "../../../hooks/useUserContext";
import ReportsInboxPracticianCategoryForward from "./ReportsInboxPracticianCategoryForward";

const ReportsInboxAssignedPracticianForward = ({
  setForwardVisible,
  reportToForward,
}) => {
  const { staffInfos } = useStaffInfosContext();
  const doctorsInfos = {
    name: "Doctors",
    infos: staffInfos.filter(({ title }) => title === "Doctor"),
  };
  const medStudentsInfos = {
    name: "Medical Students",
    infos: staffInfos.filter(({ title }) => title === "Medical Student"),
  };
  const nursesInfos = {
    name: "Nurses",
    infos: staffInfos.filter(({ title }) => title === "Nurse"),
  };
  const nursingStudentsInfos = {
    name: "Nursing Students",
    infos: staffInfos.filter(({ title }) => title === "Nursing Student"),
  };
  const ultrasoundInfos = {
    name: "Ultra Sound Techs",
    infos: staffInfos.filter(({ title }) => title === "Ultra Sound Technician"),
  };
  const labTechInfos = {
    name: "Lab Techs",
    infos: staffInfos.filter(({ title }) => title === "Lab Technician"),
  };
  const nutritionistInfos = {
    name: "Nutritionists",
    infos: staffInfos.filter(({ title }) => title === "Nutritionist"),
  };
  const physiosInfos = {
    name: "Physiotherapists",
    infos: staffInfos.filter(({ title }) => title === "Physiotherapist"),
  };
  const psychosInfos = {
    name: "Psychologists",
    infos: staffInfos.filter(({ title }) => title === "Psychologist"),
  };
  const othersInfos = {
    name: "Others",
    infos: staffInfos.filter(({ title }) => title === "Other"),
  };
  const allInfos = [
    doctorsInfos,
    medStudentsInfos,
    nursesInfos,
    nursingStudentsInfos,
    ultrasoundInfos,
    labTechInfos,
    nutritionistInfos,
    physiosInfos,
    psychosInfos,
    othersInfos,
  ];
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const [assignedId, setAssignedId] = useState(0);
  const [progress, setProgress] = useState(false);

  const handleCheckPractician = (e) => {
    const checked = e.target.checked;
    if (checked) {
      setAssignedId(parseInt(e.target.id));
    } else {
      setAssignedId(0);
    }
  };

  const isPracticianChecked = (id) => {
    return assignedId === parseInt(id);
  };

  const handleCancelForward = () => {
    setForwardVisible(false);
  };
  const handleForwardDocument = async () => {
    try {
      setProgress(true);
      reportToForward.assigned_staff_id = assignedId;
      await putPatientRecord(
        "/reports",
        reportToForward.id,
        user.id,

        reportToForward,
        socket,
        "REPORTS"
      );

      socket.emit("message", {
        route: "REPORTS INBOX",
        action: "update",
        content: { id: reportToForward.id, data: reportToForward },
      });
      setForwardVisible(false);
      setAssignedId(0);
      toast.success("Document forwarded successfully", {
        containerId: "A",
      });
      setProgress(false);
    } catch (err) {
      toast.error(`Unable to forward document: ${err.message}`, {
        containerId: "A",
      });
      setProgress(false);
    }
  };

  return (
    <div className="practicians-forward">
      <label className="practicians-forward__title">
        Forward document to practitioner
      </label>
      <div className="practicians-forward__list">
        {allInfos
          .filter((category) => category.infos.length !== 0)
          .map((category) => (
            <ReportsInboxPracticianCategoryForward
              categoryInfos={category.infos}
              categoryName={category.name}
              handleCheckPractician={handleCheckPractician}
              isPracticianChecked={isPracticianChecked}
              key={category.name}
            />
          ))}
      </div>
      <div className="practicians-forward__btn">
        <button
          onClick={handleForwardDocument}
          disabled={!assignedId || progress}
        >
          Forward
        </button>
        <button onClick={handleCancelForward} disabled={progress}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ReportsInboxAssignedPracticianForward;
