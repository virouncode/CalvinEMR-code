import React, { useRef, useState } from "react";
import useFetchTopicDatas from "../../../../hooks/useFetchTopicDatas";
import useTopicSocket from "../../../../hooks/useTopicSocket";
import FakeWindow from "../../../All/UI/Windows/FakeWindow";
import AlertsPU from "../Popups/AlertsPU";
import AllergiesPU from "../Popups/AllergiesPU";
import AppointmentsPU from "../Popups/AppointmentsPU";
import CareElementsPU from "../Popups/CareElementsPU";
import DemographicsPU from "../Popups/DemographicsPU";
import EformsPU from "../Popups/EformsPU";
import FamHistoryPU from "../Popups/FamHistoryPU";
import MedicationsPU from "../Popups/MedicationsPU";
import PastHealthPU from "../Popups/PastHealthPU";
import PersonalHistoryPU from "../Popups/PersonalHistoryPU";
import PharmaciesPU from "../Popups/PharmaciesPU";
import PregnanciesPU from "../Popups/PregnanciesPU";
import ProblemListPU from "../Popups/ProblemListPU";
import RelationshipsPU from "../Popups/RelationshipsPU";
import RemindersPU from "../Popups/RemindersPU";
import RiskPU from "../Popups/RiskPU";
import AlertsContent from "../Topics/Alerts/AlertContent";
import AllergiesContent from "../Topics/Allergies/AllergiesContent";
import AppointmentsContent from "../Topics/Appointments/AppointmentsContent";
import CareElementsContent from "../Topics/CareElements/CareElementsContent";
import DemographicsContent from "../Topics/Demographics/DemographicsContent";
import EformsContent from "../Topics/Eforms/EformsContent";
import FamHistoryContent from "../Topics/Family/FamHistoryContent";
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
import RiskContent from "../Topics/Risks/RiskContent";
import PatientTopicHeader from "./PatientTopicHeader";

const PatientTopic = ({
  url = null,
  backgroundColor,
  textColor,
  topic,
  patientName,
  patientId,
  demographicsInfos = null,
  allContentsVisible,
  side,
  loadingPatient = null,
  errPatient = null,
}) => {
  //HOOKS
  const [popUpVisible, setPopUpVisible] = useState(false);
  const containerRef = useRef("null");

  //STYLE
  const TOPIC_STYLE = { color: textColor, background: backgroundColor };

  //DATAS
  const [paging, setPaging] = useState({
    page: 1,
    perPage: 10,
    offset: 0,
  });
  const { topicDatas, setTopicDatas, loading, errMsg, hasMore } =
    useFetchTopicDatas(url, paging, patientId);

  //SOCKET
  useTopicSocket(topic, topicDatas, setTopicDatas, patientId);

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
            ? topic === "REMINDERS" || topic === "MESSAGES WITH PATIENT"
              ? `patient-record__topic-container patient-record__topic-container--${side} patient-record__topic-container--active patient-record__topic-container--bottom`
              : `patient-record__topic-container patient-record__topic-container--${side} patient-record__topic-container--active`
            : `patient-record__topic-container patient-record__topic-container--${side} `
        }
        ref={containerRef}
      >
        {/* DEMOGRAPHICS */}
        {topic === "DEMOGRAPHICS" && (
          <DemographicsContent
            demographicsInfos={demographicsInfos}
            loadingPatient={loadingPatient}
            errPatient={errPatient}
          />
        )}
        {topic === "DEMOGRAPHICS" && popUpVisible && (
          <FakeWindow
            title={`DEMOGRAPHICS of ${patientName}`}
            width={1100}
            height={600}
            x={(window.innerWidth - 1100) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <DemographicsPU
              demographicsInfos={demographicsInfos}
              setPopUpVisible={setPopUpVisible}
              loadingPatient={loadingPatient}
              errPatient={errPatient}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* PAST HEALTH */}
        {topic === "PAST HEALTH" && (
          <PastHealthContent
            topicDatas={topicDatas}
            loading={loading}
            errMsg={errMsg}
          />
        )}
        {topic === "PAST HEALTH" && popUpVisible && (
          <FakeWindow
            title={`PAST HEALTH of ${patientName}`}
            width={1300}
            height={600}
            x={(window.innerWidth - 1300) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <PastHealthPU
              topicDatas={topicDatas}
              loading={loading}
              errMsg={errMsg}
              hasMore={hasMore}
              setPaging={setPaging}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* FAMILY HISTORY */}
        {topic === "FAMILY HISTORY" && (
          <FamHistoryContent
            topicDatas={topicDatas}
            loading={loading}
            errMsg={errMsg}
          />
        )}
        {topic === "FAMILY HISTORY" && popUpVisible && (
          <FakeWindow
            title={`FAMILY HISTORY of ${patientName}`}
            width={1200}
            height={600}
            x={(window.innerWidth - 1200) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <FamHistoryPU
              topicDatas={topicDatas}
              loading={loading}
              errMsg={errMsg}
              hasMore={hasMore}
              setPaging={setPaging}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* RELATIONSHIPS */}
        {topic === "RELATIONSHIPS" && (
          <RelationshipsContent
            topicDatas={topicDatas}
            loading={loading}
            errMsg={errMsg}
          />
        )}
        {topic === "RELATIONSHIPS" && popUpVisible && (
          <FakeWindow
            title={`RELATIONSHIPS of ${patientName}`}
            width={800}
            height={600}
            x={(window.innerWidth - 800) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <RelationshipsPU
              topicDatas={topicDatas}
              loading={loading}
              errMsg={errMsg}
              hasMore={hasMore}
              setPaging={setPaging}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              demographicsInfos={demographicsInfos}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* ALERTS AND SPECIAL NEEDS */}
        {topic === "ALERTS & SPECIAL NEEDS" && (
          <AlertsContent
            topicDatas={topicDatas}
            loading={loading}
            errMsg={errMsg}
          />
        )}
        {topic === "ALERTS & SPECIAL NEEDS" && popUpVisible && (
          <FakeWindow
            title={`ALERTS & SPECIAL NEEDS about ${patientName}`}
            width={1100}
            height={600}
            x={(window.innerWidth - 1100) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <AlertsPU
              topicDatas={topicDatas}
              loading={loading}
              errMsg={errMsg}
              hasMore={hasMore}
              setPaging={setPaging}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* RISK FACTORS */}
        {topic === "RISK FACTORS" && (
          <RiskContent
            topicDatas={topicDatas}
            loading={loading}
            errMsg={errMsg}
          />
        )}
        {topic === "RISK FACTORS" && popUpVisible && (
          <FakeWindow
            title={`RISK FACTORS of ${patientName}`}
            width={1300}
            height={600}
            x={(window.innerWidth - 1300) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <RiskPU
              topicDatas={topicDatas}
              loading={loading}
              errMsg={errMsg}
              hasMore={hasMore}
              setPaging={setPaging}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* MEDICATIONS AND TREATMENTS */}
        {topic === "MEDICATIONS AND TREATMENTS" && (
          <MedicationsContent
            topicDatas={topicDatas}
            loading={loading}
            errMsg={errMsg}
          />
        )}
        {topic === "MEDICATIONS AND TREATMENTS" && popUpVisible && (
          <FakeWindow
            title={`MEDICATIONS AND TREATMENTS for ${patientName}`}
            width={1400}
            height={600}
            x={(window.innerWidth - 1400) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <MedicationsPU
              topicDatas={topicDatas}
              loading={loading}
              errMsg={errMsg}
              hasMore={hasMore}
              setPaging={setPaging}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              demographicsInfos={demographicsInfos}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* PHARMACIES */}
        {topic === "PHARMACIES" && (
          <PharmaciesContent
            patientId={patientId}
            demographicsInfos={demographicsInfos}
            loadingPatient={loadingPatient}
            errPatient={errPatient}
          />
        )}
        {topic === "PHARMACIES" && popUpVisible && (
          <FakeWindow
            title={`PREFERRED PHARMACY of ${patientName}`}
            width={1400}
            height={600}
            x={(window.innerWidth - 1400) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <PharmaciesPU
              patientId={patientId}
              topicDatas={topicDatas}
              loading={loading}
              errMsg={errMsg}
              hasMore={hasMore}
              setPaging={setPaging}
              setPopUpVisible={setPopUpVisible}
              demographicsInfos={demographicsInfos}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/*E-FORMS */}
        {topic === "E-FORMS" && (
          <EformsContent
            topicDatas={topicDatas}
            loading={loading}
            errMsg={errMsg}
          />
        )}
        {topic === "E-FORMS" && popUpVisible && (
          <FakeWindow
            title={`ELECTRONIC FORMS of ${patientName}`}
            width={800}
            height={600}
            x={(window.innerWidth - 800) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <EformsPU
              topicDatas={topicDatas}
              loading={loading}
              errMsg={errMsg}
              hasMore={hasMore}
              setPaging={setPaging}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              demographicsInfos={demographicsInfos}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* PERSONAL HISTORY */}
        {topic === "PERSONAL HISTORY" && (
          <PersonalHistoryContent
            topicDatas={topicDatas}
            loading={loading}
            errMsg={errMsg}
          />
        )}
        {topic === "PERSONAL HISTORY" && popUpVisible && (
          <FakeWindow
            title={`PERSONAL HISTORY of ${patientName}`}
            width={800}
            height={500}
            x={(window.innerWidth - 800) / 2}
            y={(window.innerHeight - 500) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <PersonalHistoryPU
              topicDatas={topicDatas}
              loading={loading}
              errMsg={errMsg}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* CARE ELEMENTS */}
        {topic === "CARE ELEMENTS" && (
          <CareElementsContent
            topicDatas={topicDatas}
            loading={loading}
            errMsg={errMsg}
          />
        )}
        {topic === "CARE ELEMENTS" && popUpVisible && (
          <FakeWindow
            title={`CARE ELEMENTS of ${patientName}`}
            width={800}
            height={600}
            x={(window.innerWidth - 800) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <CareElementsPU
              topicDatas={topicDatas}
              loading={loading}
              errMsg={errMsg}
              hasMore={hasMore}
              setPaging={setPaging}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              patientName={patientName}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* PROBLEM LIST */}
        {topic === "PROBLEM LIST" && (
          <ProblemListContent
            topicDatas={topicDatas}
            loading={loading}
            errMsg={errMsg}
          />
        )}
        {topic === "PROBLEM LIST" && popUpVisible && (
          <FakeWindow
            title={`PROBLEM LIST of ${patientName}`}
            width={1250}
            height={600}
            x={(window.innerWidth - 1250) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <ProblemListPU
              topicDatas={topicDatas}
              loading={loading}
              errMsg={errMsg}
              hasMore={hasMore}
              setPaging={setPaging}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* REMINDERS */}
        {topic === "REMINDERS" && (
          <RemindersContent
            topicDatas={topicDatas}
            loading={loading}
            errMsg={errMsg}
          />
        )}
        {topic === "REMINDERS" && popUpVisible && (
          <FakeWindow
            title={`REMINDERS for ${patientName}`}
            width={800}
            height={600}
            x={(window.innerWidth - 800) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <RemindersPU
              topicDatas={topicDatas}
              loading={loading}
              errMsg={errMsg}
              hasMore={hasMore}
              setPaging={setPaging}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* PREGNANCIES */}
        {topic === "PREGNANCIES" && (
          <PregnanciesContent
            topicDatas={topicDatas}
            loading={loading}
            errMsg={errMsg}
          />
        )}
        {topic === "PREGNANCIES" && popUpVisible && (
          <FakeWindow
            title={`PREGNANCIES of ${patientName}`}
            width={1100}
            height={600}
            x={(window.innerWidth - 1100) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <PregnanciesPU
              topicDatas={topicDatas}
              loading={loading}
              errMsg={errMsg}
              hasMore={hasMore}
              setPaging={setPaging}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* ALLERGIES */}
        {topic === "ALLERGIES & ADVERSE REACTIONS" && (
          <AllergiesContent
            topicDatas={topicDatas}
            loading={loading}
            errMsg={errMsg}
          />
        )}
        {topic === "ALLERGIES & ADVERSE REACTIONS" && popUpVisible && (
          <FakeWindow
            title={`ALLERGIES & ADVERSE REACTIONS of ${patientName}`}
            width={1300}
            height={600}
            x={(window.innerWidth - 1300) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <AllergiesPU
              topicDatas={topicDatas}
              loading={loading}
              errMsg={errMsg}
              hasMore={hasMore}
              setPaging={setPaging}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )}
        {/* LAB RESULTS */}
        {topic === "LABORATORY RESULTS" && (
          <LabResultsContent
            topicDatas={topicDatas}
            loading={loading}
            errMsg={errMsg}
          />
        )}
        {/*******************/}
        {/* REPORTS */}
        {/* {topic === "REPORTS" && (
          <ReportsContent
            topicDatas={topicDatas}
            loading={loading}
            errMsg={errMsg}
          />
        )}
        {topic === "REPORTS" && popUpVisible && (
          <FakeWindow
            title={`REPORTS about ${patientName}`}
            width={1400}
            height={600}
            x={(window.innerWidth - 1400) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <ReportsPU
              topicDatas={topicDatas}
              loading={loading}
              errMsg={errMsg}
              hasMore={hasMore}
              setPaging={setPaging}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
            />
          </FakeWindow>
        )} */}
        {/*******************/}
        {/* APPOINTMENTS */}
        {topic === "APPOINTMENTS" && (
          <AppointmentsContent
            topicDatas={topicDatas}
            loading={loading}
            errMsg={errMsg}
          />
        )}
        {topic === "APPOINTMENTS" && popUpVisible && (
          <FakeWindow
            title={`APPOINTMENTS of ${patientName}`}
            width={1300}
            height={600}
            x={(window.innerWidth - 1300) / 2}
            y={(window.innerHeight - 600) / 2}
            color={backgroundColor}
            setPopUpVisible={setPopUpVisible}
          >
            <AppointmentsPU
              topicDatas={topicDatas}
              loading={loading}
              errMsg={errMsg}
              hasMore={hasMore}
              setPaging={setPaging}
              patientId={patientId}
              setPopUpVisible={setPopUpVisible}
              demographicsInfos={demographicsInfos}
            />
          </FakeWindow>
        )}
        {/*******************/}
        {/* MESSAGES ABOUT PATIENT */}
        {topic === "MESSAGES ABOUT PATIENT" && (
          <MessagesContent
            topicDatas={topicDatas}
            loading={loading}
            errMsg={errMsg}
          />
        )}
        {/*******************/}
        {/* MESSAGES WITH PATIENT */}
        {topic === "MESSAGES WITH PATIENT" && (
          <MessagesExternalContent
            topicDatas={topicDatas}
            loading={loading}
            errMsg={errMsg}
          />
        )}
        {/*******************/}
      </div>
    </div>
  );
};

export default PatientTopic;
