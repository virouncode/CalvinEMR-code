import React from "react";
import ContactsCategory from "./ContactsCategory";

const Contacts = ({
  staffInfos,
  handleCheckContact,
  isContactChecked,
  handleCheckCategory,
  isCategoryChecked,
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
  const secretariesInfos = {
    name: "Secretaries",
    infos: staffInfos.filter(({ title }) => title === "Secretary"),
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
    secretariesInfos,
    ultrasoundInfos,
    labTechInfos,
    nutritionistInfos,
    physiosInfos,
    psychosInfos,
    othersInfos,
  ];

  return (
    <div className="contacts">
      <div className="contacts__title">Recipients</div>
      <div className="contacts__list">
        {allInfos
          .filter((category) => category.infos.length !== 0)
          .map((category) => (
            <ContactsCategory
              categoryInfos={category.infos}
              categoryName={category.name}
              handleCheckContact={handleCheckContact}
              isContactChecked={isContactChecked}
              handleCheckCategory={handleCheckCategory}
              isCategoryChecked={isCategoryChecked}
              key={category.name}
            />
          ))}
      </div>
    </div>
  );
};

export default Contacts;
