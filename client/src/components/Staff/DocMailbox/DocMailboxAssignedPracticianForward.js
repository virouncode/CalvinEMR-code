import React from "react";
import { toast } from "react-toastify";
import { putPatientRecord } from "../../../api/fetchRecords";
import useAuth from "../../../hooks/useAuth";
import DocMailboxPracticianCategoryForward from "./DocMailboxPracticianCategoryForward";

const DocMailboxAssignedPracticianForward = ({
  staffInfos,
  isPracticianChecked,
  handleCheckPractician,
  assignedId,
  setForwardVisible,
  setAssignedId,
}) => {
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
  const { user, auth, socket } = useAuth();
  const handleCancelForward = () => {
    setForwardVisible(false);
  };
  const handleForwardDocument = async () => {
    try {
      const doc = { ...user.docToForward };
      doc.assigned_staff_id = assignedId;
      await putPatientRecord(
        "/reports",
        doc.id,
        user.id,
        auth.authToken,
        doc,
        socket,
        "REPORTS"
      );

      socket.emit("message", {
        route: "DOCMAILBOX",
        action: "update",
        content: { id: doc.id, data: doc },
      });
      setForwardVisible(false);
      setAssignedId(0);
      toast.success("Document forwarded successfully", {
        containerId: "A",
      });
    } catch (err) {
      toast.error(`Unable to forward document: ${err.message}`, {
        containerId: "A",
      });
    }
  };

  return (
    <div className="practicians-forward">
      <label className="practicians-forward__title">
        Forward document to practician
      </label>
      <div className="practicians-forward__list">
        {allInfos
          .filter((category) => category.infos.length !== 0)
          .map((category) => (
            <DocMailboxPracticianCategoryForward
              categoryInfos={category.infos}
              categoryName={category.name}
              handleCheckPractician={handleCheckPractician}
              isPracticianChecked={isPracticianChecked}
              key={category.name}
            />
          ))}
      </div>
      <div className="practicians-forward__btn">
        <button onClick={handleForwardDocument} disabled={!assignedId}>
          Forward
        </button>
        <button onClick={handleCancelForward}>Cancel</button>
      </div>
    </div>
  );
};

export default DocMailboxAssignedPracticianForward;
