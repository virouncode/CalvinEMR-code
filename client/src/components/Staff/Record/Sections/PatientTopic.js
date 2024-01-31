import React, { useEffect, useRef, useState } from "react";
import useAuth from "../../../../hooks/useAuth";
import { usePatientRecord } from "../../../../hooks/usePatientRecord";
import { patientIdToName } from "../../../../utils/patientIdToName";
import { onMessageClinic } from "../../../../utils/socketHandlers/onMessageClinic";
import { onMessageTopic } from "../../../../utils/socketHandlers/onMessageTopic";
import FakeWindow from "../../../All/UI/Windows/FakeWindow";
import AlertsPU from "../Popups/AlertsPU";
import AllergiesPU from "../Popups/AllergiesPU";
import AppointmentsPU from "../Popups/AppointmentsPU";
import CareElementsPU from "../Popups/CareElementsPU";
import DemographicsPU from "../Popups/DemographicsPU";
import EformsPU from "../Popups/EformsPU";
import FamHistoryPU from "../Popups/FamHistoryPU";
import FamilyDoctorsPU from "../Popups/FamilyDoctorsPU";
import ImmunizationsPU from "../Popups/ImmunizationsPU";
import MedicationsPU from "../Popups/MedicationsPU";
import PastHealthPU from "../Popups/PastHealthPU";
import PersonalHistoryPU from "../Popups/PersonalHistoryPU";
import PharmaciesPU from "../Popups/PharmaciesPU";
import PregnanciesPU from "../Popups/PregnanciesPU";
import ProblemListPU from "../Popups/ProblemListPU";
import RelationshipsPU from "../Popups/RelationshipsPU";
import RemindersPU from "../Popups/RemindersPU";
import ReportsPU from "../Popups/ReportsPU";
import RiskPU from "../Popups/RiskPU";
import AlertsContent from "../Topics/Alerts/AlertContent";
import AllergiesContent from "../Topics/Allergies/AllergiesContent";
import AppointmentsContent from "../Topics/Appointments/AppointmentsContent";
import CareElementsContent from "../Topics/CareElements/CareElementsContent";
import DemographicsContent from "../Topics/Demographics/DemographicsContent";
import EformsContent from "../Topics/Eforms/EformsContent";
import FamHistoryContent from "../Topics/Family/FamHistoryContent";
import FamilyDoctorsContent from "../Topics/FamilyDoctors/FamilyDoctorsContent";
import ImmunizationsContent from "../Topics/Immunizations/ImmunizationsContent";
import LabResultsContent from "../Topics/LabResults/LabResultsContent";
import MedicationsContent from "../Topics/Medications/MedicationsContent";
import MessagesContent from "../Topics/MessagesAboutPatient/MessagesContent";
import MessagesExternalContent from "../Topics/MessagesWithPatient/MessagesExternalContent";
import PastHealthContent from "../Topics/PastHealth/PastHealthContent";
import PersonalHistoryContent from "../Topics/PersonalHistory/PersonalHistoryContent";
import PharmaciesContent from "../Topics/Pharmacies/PharmaciesContent";
import PregnanciesContent from "../Topics/Pregnancies/PregnanciesContent";
import ProblemListContent from "../Topics/ProblemList/ProblemListContent";
import RelationshipsContent from "../Topics/Relationships/RelationshipsContent";
import RemindersContent from "../Topics/Reminders/RemindersContent";
import ReportsContent from "../Topics/Reports/ReportsContent";
import RiskContent from "../Topics/Risks/RiskContent";
import PatientTopicHeader from "./PatientTopicHeader";

const PatientTopic = ({
  url,
  backgroundColor,
  textColor,
  topic,
  patientId,
  demographicsInfos = {},
  setDemographicsInfos = null,
  allContentsVisible,
  side,
  preferredPharmacy = null,
}) => {
  //HOOKS
  const { clinic, socket, setClinic } = useAuth();
  const [popUpVisible, setPopUpVisible] = useState(false);
  const [{ datas, isLoading, errMsg }, fetchRecord, setDatas] =
    usePatientRecord(url, patientId);
  const containerRef = useRef("null");

  useEffect(() => {
    // if (!socket || topic === "DEMOGRAPHICS") return;
    if (!socket) return;
    const onMessage = (message) =>
      onMessageTopic(message, topic, datas, setDatas, patientId);
    const onMessageDemographics = (message) =>
      onMessageClinic(message, clinic, setClinic);
    socket.on("message", onMessage);
    socket.on("message", onMessageDemographics);
    return () => {
      socket.off("message", onMessage);
      socket.off("message", onMessageDemographics);
    };
  }, [clinic, datas, patientId, setClinic, setDatas, socket, topic]);

  //STYLE
  const TOPIC_STYLE = { color: textColor, background: backgroundColor };

  //HANDLERS
  const handlePopUpClick = (e) => {
    setPopUpVisible((v) => !v);
  };

  const handleTriangleClick = (e) => {
    e.target.classList.toggle("triangle--active");
    containerRef.current.classList.toggle(
      `patient-record__topic-container--active`
    );
  };

  const showDocument = async (docUrl, docMime) => {
    let docWindow;
    if (!docMime.includes("officedocument")) {
      docWindow = window.open(
        docUrl,
        "_blank",
        "resizable=no, toolbar=no, scrollbars=no, menubar=no, status=no, directories=no, width=800, height=600, left=320, top=200"
      );
    } else {
      docWindow = window.open(
        `https://docs.google.com/gview?url=${docUrl}`,
        "_blank",
        "resizable=no, toolbar=no, scrollbars=no, menubar=no, status=no, directories=no, width=800, height=600, left=320, top=200"
      );
    }

    if (docWindow === null) {
      alert("Please disable your browser pop-up blocker and sign in again");
      window.location.assign("/login");
      return;
    }
  };

  return (
    <div className="patient-record__topic">
      <div
        className={`patient-record__topic-header patient-record__topic-header--${side}`}
        style={TOPIC_STYLE}
      >
        <PatientTopicHeader
          topic={topic}
          handleTriangleClick={handleTriangleClick}
          handlePopUpClick={handlePopUpClick}
          allContentsVisible={allContentsVisible}
          popUpButton={
            topic === "MESSAGES WITH PATIENT" ||
            topic === "MESSAGES ABOUT PATIENT"
              ? false
              : true
          }
        />
      </div>
      <div
        className={
          allContentsVisible
            ? topic === "PERSONAL HISTORY" || topic === "MESSAGES WITH PATIENT"
              ? `patient-record__topic-container patient-record__topic-container--${side} patient-record__topic-container--active patient-record__topic-container--bottom`
              : `patient-record__topic-container patient-record__topic-container--${side} patient-record__topic-container--active`
            : `patient-record__topic-container patient-record__topic-container--${side} `
        }
        ref={containerRef}
      >
        {/* DEMOGRAPHICS */}
        {topic === "DEMOGRAPHICS" && (
          <DemographicsContent demographicsInfos={demographicsInfos} />
        )}
        {topic === "DEMOGRAPHICS" && popUpVisible && (
          <FakeWindow
            title={`DEMOGRAPHICS of ${patientIdToName(
              clinic.demographicsInfos,
              patientId
            )}`}
            width={1100}
            height={600}
            x={(window.innerWidth - 1100) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <DemographicsPU
              demographicsInfos={demographicsInfos}
              setDemographicsInfos={setDemographicsInfos}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/*******************/}

        {/* MEDICAL HISTORY */}
        {topic === "PAST HEALTH" && (
          <PastHealthContent
            datas={datas}
            isLoading={isLoading}
            errMsg={errMsg}
          />
        )}
        {topic === "PAST HEALTH" && popUpVisible && (
          <FakeWindow
            title={`PAST HEALTH of ${patientIdToName(
              clinic.demographicsInfos,
              patientId
            )}`}
            width={1300}
            height={600}
            x={(window.innerWidth - 1300) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <PastHealthPU
              patientId={patientId}
              datas={datas}
              setDatas={setDatas}
              isLoading={isLoading}
              errMsg={errMsg}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/*******************/}

        {/* FAMILY HISTORY */}
        {topic === "FAMILY HISTORY" && (
          <FamHistoryContent
            datas={datas}
            isLoading={isLoading}
            errMsg={errMsg}
          />
        )}
        {topic === "FAMILY HISTORY" && popUpVisible && (
          <FakeWindow
            title={`FAMILY HISTORY of ${patientIdToName(
              clinic.demographicsInfos,
              patientId
            )}`}
            width={1200}
            height={600}
            x={(window.innerWidth - 1200) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <FamHistoryPU
              patientId={patientId}
              datas={datas}
              setDatas={setDatas}
              setPopUpVisible={setPopUpVisible}
              isLoading={isLoading}
              errMsg={errMsg}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* RELATIONSHIPS */}
        {topic === "RELATIONSHIPS" && (
          <RelationshipsContent
            datas={datas}
            isLoading={isLoading}
            errMsg={errMsg}
          />
        )}
        {topic === "RELATIONSHIPS" && popUpVisible && (
          <FakeWindow
            title={`RELATIONSHIPS of ${patientIdToName(
              clinic.demographicsInfos,
              patientId
            )}`}
            width={800}
            height={600}
            x={(window.innerWidth - 800) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <RelationshipsPU
              patientId={patientId}
              datas={datas}
              setDatas={setDatas}
              isLoading={isLoading}
              errMsg={errMsg}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* ALERTS AND SPECIAL NEEDS */}
        {topic === "ALERTS & SPECIAL NEEDS" && (
          <AlertsContent datas={datas} isLoading={isLoading} errMsg={errMsg} />
        )}
        {topic === "ALERTS & SPECIAL NEEDS" && popUpVisible && (
          <FakeWindow
            title={`ALERTS & SPECIAL NEEDS about ${patientIdToName(
              clinic.demographicsInfos,
              patientId
            )}`}
            width={1100}
            height={600}
            x={(window.innerWidth - 1100) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <AlertsPU
              patientId={patientId}
              datas={datas}
              setDatas={setDatas}
              isLoading={isLoading}
              errMsg={errMsg}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* FAMILY DOCTORS */}
        {topic === "FAMILY DOCTORS/SPECIALISTS" && (
          <FamilyDoctorsContent
            datas={datas}
            isLoading={isLoading}
            errMsg={errMsg}
            patientId={patientId}
          />
        )}
        {topic === "FAMILY DOCTORS/SPECIALISTS" && popUpVisible && (
          <FakeWindow
            title={`FAMILY DOCTORS & SPECIALISTS of ${patientIdToName(
              clinic.demographicsInfos,
              patientId
            )}`}
            width={1400}
            height={600}
            x={(window.innerWidth - 1400) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <FamilyDoctorsPU
              patientId={patientId}
              datas={datas}
              isLoading={isLoading}
              errMsg={errMsg}
              setPopUpVisible={setPopUpVisible}
              demographicsInfos={demographicsInfos}
            />
          </FakeWindow>
        )}
        {/*******************/}

        {/* RISK FACTORS */}
        {topic === "RISK FACTORS" && (
          <RiskContent datas={datas} isLoading={isLoading} errMsg={errMsg} />
        )}
        {topic === "RISK FACTORS" && popUpVisible && (
          <FakeWindow
            title={`RISK FACTORS of ${patientIdToName(
              clinic.demographicsInfos,
              patientId
            )}`}
            width={1300}
            height={600}
            x={(window.innerWidth - 1300) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <RiskPU
              patientId={patientId}
              datas={datas}
              setDatas={setDatas}
              isLoading={isLoading}
              errMsg={errMsg}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/*******************/}

        {/* MEDICATIONS AND TREATMENTS */}
        {topic === "MEDICATIONS AND TREATMENTS" && (
          <MedicationsContent
            datas={datas}
            isLoading={isLoading}
            errMsg={errMsg}
          />
        )}
        {topic === "MEDICATIONS AND TREATMENTS" && popUpVisible && (
          <FakeWindow
            title={`MEDICATIONS AND TREATMENTS for ${patientIdToName(
              clinic.demographicsInfos,
              patientId
            )}`}
            width={1400}
            height={600}
            x={(window.innerWidth - 1400) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <MedicationsPU
              patientId={patientId}
              datas={datas}
              setDatas={setDatas}
              isLoading={isLoading}
              errMsg={errMsg}
              setPopUpVisible={setPopUpVisible}
              demographicsInfos={demographicsInfos}
            />
          </FakeWindow>
        )}
        {/*******************/}

        {/* PHARMACIES */}
        {topic === "PHARMACIES" && (
          <PharmaciesContent
            datas={datas}
            isLoading={isLoading}
            errMsg={errMsg}
            demographicsInfos={demographicsInfos}
          />
        )}
        {topic === "PHARMACIES" && popUpVisible && (
          <FakeWindow
            title={`PHARMACIES of ${patientIdToName(
              clinic.demographicsInfos,
              patientId
            )}`}
            width={1400}
            height={600}
            x={(window.innerWidth - 1400) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <PharmaciesPU
              patientId={patientId}
              datas={datas}
              setDatas={setDatas}
              isLoading={isLoading}
              errMsg={errMsg}
              setPopUpVisible={setPopUpVisible}
              demographicsInfos={demographicsInfos}
            />
          </FakeWindow>
        )}
        {/*******************/}

        {/*E-FORMS */}
        {topic === "E-FORMS" && (
          <EformsContent
            datas={datas}
            isLoading={isLoading}
            errMsg={errMsg}
            showDocument={showDocument}
          />
        )}
        {topic === "E-FORMS" && popUpVisible && (
          <FakeWindow
            title={`ELECTRONIC FORMS of ${patientIdToName(
              clinic.demographicsInfos,
              patientId
            )}`}
            width={800}
            height={600}
            x={(window.innerWidth - 800) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <EformsPU
              demographicsInfos={demographicsInfos}
              patientId={patientId}
              showDocument={showDocument}
              datas={datas}
              setDatas={setDatas}
              isLoading={isLoading}
              errMsg={errMsg}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/*******************/}

        {/* PERSONAL HISTORY */}
        {topic === "PERSONAL HISTORY" && (
          <PersonalHistoryContent
            datas={datas}
            isLoading={isLoading}
            errMsg={errMsg}
            showDocument={showDocument}
          />
        )}
        {topic === "PERSONAL HISTORY" && popUpVisible && (
          <FakeWindow
            title={`PERSONAL HISTORY of ${patientIdToName(
              clinic.demographicsInfos,
              patientId
            )}`}
            width={800}
            height={500}
            x={(window.innerWidth - 800) / 2}
            y={(window.innerHeight - 500) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <PersonalHistoryPU
              demographicsInfos={demographicsInfos}
              patientId={patientId}
              showDocument={showDocument}
              datas={datas}
              setDatas={setDatas}
              isLoading={isLoading}
              errMsg={errMsg}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/*******************/}

        {/* CARE ELEMENTS */}
        {topic === "CARE ELEMENTS" && (
          <CareElementsContent
            datas={datas}
            isLoading={isLoading}
            errMsg={errMsg}
          />
        )}
        {topic === "CARE ELEMENTS" && popUpVisible && (
          <FakeWindow
            title={`CARE ELEMENTS of ${patientIdToName(
              clinic.demographicsInfos,
              patientId
            )}`}
            width={800}
            height={600}
            x={(window.innerWidth - 800) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <CareElementsPU
              patientId={patientId}
              datas={datas}
              setDatas={setDatas}
              isLoading={isLoading}
              errMsg={errMsg}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* PROBLEM LIST */}
        {topic === "PROBLEM LIST" && (
          <ProblemListContent
            datas={datas}
            isLoading={isLoading}
            errMsg={errMsg}
          />
        )}
        {topic === "PROBLEM LIST" && popUpVisible && (
          <FakeWindow
            title={`PROBLEM LIST of ${patientIdToName(
              clinic.demographicsInfos,
              patientId
            )}`}
            width={1250}
            height={600}
            x={(window.innerWidth - 1250) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <ProblemListPU
              patientId={patientId}
              datas={datas}
              setDatas={setDatas}
              isLoading={isLoading}
              errMsg={errMsg}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/*******************/}

        {/* REMINDERS */}
        {topic === "REMINDERS" && (
          <RemindersContent
            datas={datas}
            isLoading={isLoading}
            errMsg={errMsg}
          />
        )}
        {topic === "REMINDERS" && popUpVisible && (
          <FakeWindow
            title={`REMINDERS for ${patientIdToName(
              clinic.demographicsInfos,
              patientId
            )}`}
            width={800}
            height={600}
            x={(window.innerWidth - 800) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <RemindersPU
              patientId={patientId}
              datas={datas}
              setDatas={setDatas}
              isLoading={isLoading}
              errMsg={errMsg}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/*******************/}

        {/* PREGNANCIES */}
        {topic === "PREGNANCIES" && (
          <PregnanciesContent
            datas={datas}
            isLoading={isLoading}
            errMsg={errMsg}
          />
        )}
        {topic === "PREGNANCIES" && popUpVisible && (
          <FakeWindow
            title={`PREGNANCIES of ${patientIdToName(
              clinic.demographicsInfos,
              patientId
            )}`}
            width={1100}
            height={600}
            x={(window.innerWidth - 1100) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <PregnanciesPU
              patientId={patientId}
              datas={datas}
              setDatas={setDatas}
              isLoading={isLoading}
              errMsg={errMsg}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/*******************/}

        {/* ALLERGIES */}
        {topic === "ALLERGIES & ADVERSE REACTIONS" && (
          <AllergiesContent
            datas={datas}
            isLoading={isLoading}
            errMsg={errMsg}
          />
        )}
        {topic === "ALLERGIES & ADVERSE REACTIONS" && popUpVisible && (
          <FakeWindow
            title={`ALLERGIES & ADVERSE REACTIONS of ${patientIdToName(
              clinic.demographicsInfos,
              patientId
            )}`}
            width={1300}
            height={600}
            x={(window.innerWidth - 1300) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <AllergiesPU
              patientId={patientId}
              datas={datas}
              setDatas={setDatas}
              isLoading={isLoading}
              errMsg={errMsg}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}

        {/* LAB RESULTS */}
        {topic === "LABORATORY RESULTS" && (
          <LabResultsContent
            datas={datas}
            isLoading={isLoading}
            errMsg={errMsg}
            showDocument={showDocument}
          />
        )}
        {/*******************/}

        {/* REPORTS */}
        {topic === "REPORTS" && (
          <ReportsContent
            datas={datas}
            isLoading={isLoading}
            errMsg={errMsg}
            showDocument={showDocument}
          />
        )}
        {topic === "REPORTS" && popUpVisible && (
          <FakeWindow
            title={`REPORTS about ${patientIdToName(
              clinic.demographicsInfos,
              patientId
            )}`}
            width={1400}
            height={600}
            x={(window.innerWidth - 1400) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <ReportsPU
              patientId={patientId}
              demographicsInfos={demographicsInfos}
              datas={datas}
              setDatas={setDatas}
              isLoading={isLoading}
              errMsg={errMsg}
              showDocument={showDocument}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/*******************/}

        {/* IMMUNIZATIONS */}
        {topic === "IMMUNIZATIONS" && (
          <ImmunizationsContent
            datas={datas}
            isLoading={isLoading}
            errMsg={errMsg}
          />
        )}
        {topic === "IMMUNIZATIONS" && popUpVisible && (
          <FakeWindow
            title={`IMMUNIZATIONS of ${patientIdToName(
              clinic.demographicsInfos,
              patientId
            )}`}
            width={1400}
            height={700}
            x={(window.innerWidth - 1400) / 2}
            y={(window.innerHeight - 700) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <ImmunizationsPU
              datas={datas}
              setDatas={setDatas}
              isLoading={isLoading}
              errMsg={errMsg}
              setPopUpVisible={setPopUpVisible}
              demographicsInfos={demographicsInfos}
              patientId={patientId}
            />
          </FakeWindow>
        )}
        {/*******************/}

        {/* APPOINTMENTS */}
        {topic === "APPOINTMENTS" && (
          <AppointmentsContent
            datas={datas}
            isLoading={isLoading}
            errMsg={errMsg}
          />
        )}
        {topic === "APPOINTMENTS" && popUpVisible && (
          <FakeWindow
            title={`APPOINTMENTS of ${patientIdToName(
              clinic.demographicsInfos,
              patientId
            )}`}
            width={1300}
            height={600}
            x={(window.innerWidth - 1300) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <AppointmentsPU
              patientId={patientId}
              demographicsInfos={demographicsInfos}
              datas={datas}
              setDatas={setDatas}
              isLoading={isLoading}
              errMsg={errMsg}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* MESSAGES ABOUT PATIENT */}
        {topic === "MESSAGES ABOUT PATIENT" && (
          <MessagesContent
            datas={datas}
            isLoading={isLoading}
            errMsg={errMsg}
          />
        )}
        {/*******************/}
        {/* MESSAGES WITH PATIENT */}
        {topic === "MESSAGES WITH PATIENT" && (
          <MessagesExternalContent
            datas={datas}
            isLoading={isLoading}
            errMsg={errMsg}
          />
        )}
        {/*******************/}
      </div>
    </div>
  );
};

export default PatientTopic;
