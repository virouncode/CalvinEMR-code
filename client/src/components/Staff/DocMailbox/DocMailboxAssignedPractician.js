import React from "react";
import DocMailboxPracticianCategory from "./DocMailboxPracticianCategory";

const DocMailboxAssignedPractician = ({
  staffInfos,
  isPracticianChecked,
  handleCheckPractician,
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

  return (
    <div className="practicians">
      <label className="practicians__title">Assigned Practician</label>
      <div className="practicians__list">
        {allInfos
          .filter((category) => category.infos.length !== 0)
          .map((category) => (
            <DocMailboxPracticianCategory
              categoryInfos={category.infos}
              categoryName={category.name}
              handleCheckPractician={handleCheckPractician}
              isPracticianChecked={isPracticianChecked}
              key={category.name}
            />
          ))}
      </div>
    </div>
  );
};

export default DocMailboxAssignedPractician;
