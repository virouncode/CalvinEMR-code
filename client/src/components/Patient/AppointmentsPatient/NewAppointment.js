import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import xanoPost from "../../../api/xanoCRUD/xanoPost";
import useAvailabilitySocket from "../../../hooks/useAvailabilitySocket";
import useFetchDatas from "../../../hooks/useFetchDatas";
import useSocketContext from "../../../hooks/useSocketContext";
import useStaffInfosContext from "../../../hooks/useStaffInfosContext";
import useUserContext from "../../../hooks/useUserContext";
import { getWeekRange } from "../../../utils/formatDates";
import { staffIdToName } from "../../../utils/staffIdToName";
import { staffIdToTitleAndName } from "../../../utils/staffIdToTitleAndName";
import { toPatientName } from "../../../utils/toPatientName";
import { confirmAlert } from "../../All/Confirm/ConfirmGlobal";
import EmptyParagraph from "../../All/UI/Paragraphs/EmptyParagraph";
import LoadingParagraph from "../../All/UI/Tables/LoadingParagraph";
import AppointmentsSlots from "./AppointmentsSlots";
import WeekPicker from "./WeekPicker";

var _ = require("lodash");

const optionsDate = {
  weekday: "short",
  year: "numeric",
  month: "short",
  day: "numeric",
};

const optionsTime = {
  hour: "2-digit",
  minute: "2-digit",
};

const NewAppointment = () => {
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [appointmentsInRange, setAppointmentsInRange] = useState(null);
  const [rangeStart, setRangeStart] = useState(
    Date.parse(getWeekRange(new Date().getDay())[0])
  );
  const [rangeEnd, setRangeEnd] = useState(
    Date.parse(getWeekRange(new Date().getDay())[1])
  );
  const [appointmentSelected, setAppointmentSelected] = useState({});
  const [requestSent, setRequestSent] = useState(false);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [errAppointments, setErrAppointments] = useState("");

  useEffect(() => {
    const abortController = new AbortController();
    const fetchAppointmentsInRange = async () => {
      try {
        setLoadingAppointments(true);
        const response = await xanoGet("/appointments_of_staff", "patient", {
          host_id: user.demographics.assigned_staff_id,
          range_start: rangeStart + 86400000, //+1 day
          range_end: rangeEnd + 86400000,
        });
        if (abortController.signal.aborted) return;
        setAppointmentsInRange(
          response.data.filter(({ start }) => start > rangeStart + 86400000)
        );
        setLoadingAppointments(false);
      } catch (err) {
        setLoadingAppointments(false);
        if (err.name !== "CanceledError") {
          setErrAppointments(
            `Error : unable fetch your account infos: ${err.message}`
          );
        }
      }
    };
    fetchAppointmentsInRange();
    return () => abortController.abort();
  }, [rangeEnd, rangeStart, user.demographics.assigned_staff_id]);

  const [availability, setAvailability, loadingAvailability, errAvailability] =
    useFetchDatas(
      "/availability_of_staff",
      "patient",
      "staff_id",
      user.demographics.assigned_staff_id,
      true
    );

  useAvailabilitySocket(setAvailability);

  const handleClickNext = async () => {
    setRangeStart((rs) => rs + 6.048e8);
    setRangeEnd((re) => re + 6.048e8);
    setAppointmentSelected({});
  };
  const handleClickPrevious = () => {
    setRangeStart((rs) => rs - 6.048e8);
    setRangeEnd((re) => re - 6.048e8);
    setAppointmentSelected({});
  };

  const handleSubmit = async () => {
    if (
      await confirmAlert({
        content: `You are about to request an appointment with ${staffIdToTitleAndName(
          staffInfos,
          user.demographics.assigned_staff_id
        )}, on ${new Date(appointmentSelected.start).toLocaleString(
          "en-CA",
          optionsDate
        )} ${new Date(appointmentSelected.start).toLocaleTimeString(
          "en-CA",
          optionsTime
        )} - ${new Date(appointmentSelected.end).toLocaleTimeString(
          "en-CA",
          optionsTime
        )}, do you confirm ?`,
      })
    ) {
      //get all secretaries id
      const secretariesIds = staffInfos
        .filter(({ title }) => title === "Secretary")
        .map(({ id }) => id);

      //create the message
      try {
        for (const secretaryId of secretariesIds) {
          const message = {
            from_patient_id: user.id,
            to_staff_id: secretaryId,
            subject: "Appointment request",
            body: `Hello ${staffIdToName(staffInfos, secretaryId)},

I would like to have an appointment with ${staffIdToTitleAndName(
              staffInfos,
              user.demographics.assigned_staff_id
            )} on:

${new Date(appointmentSelected.start).toLocaleString(
  "en-CA",
  optionsDate
)} from ${new Date(appointmentSelected.start).toLocaleTimeString(
              "en-CA",
              optionsTime
            )} to ${new Date(appointmentSelected.end).toLocaleTimeString(
              "en-CA",
              optionsTime
            )} 
  
Please call me or send me a message to confirm the appointment.

Patient: ${toPatientName(user.demographics)}
Chart Nbr: ${user.demographics.ChartNumber}
Cellphone: ${
              user.demographics.PhoneNumber.find(
                ({ _phoneNumberType }) => _phoneNumberType === "C"
              )?.phoneNumber
            }`,
            read_by_patient_id: user.id,
            date_created: Date.now(),
            type: "External",
          };
          const response = await xanoPost(
            "/messages_external",
            "patient",
            message
          );
          socket.emit("message", {
            route: "MESSAGES INBOX EXTERNAL",
            action: "create",
            content: { data: response.data },
          });
          socket.emit("message", {
            route: "MESSAGES WITH PATIENT",
            action: "create",
            content: { data: response.data },
          });
        }
        window.alert(
          "YOUR APPOINTMENT IS NOT CONFIRMED YET, a secretary will contact you to confirm the appointment"
        );
        toast.success(`Appointment request sent successfully`, {
          containerId: "A",
        });
        setRequestSent(true);
        setTimeout(() => setRequestSent(false), 6000);
      } catch (err) {
        toast.error(`Couldn't send the appointment request : ${err.text}`, {
          containerId: "A",
        });
      }
    }
  };

  return (
    <div className="new-appointments">
      <div className="new-appointments__title">Request a new appointment</div>
      <div className="assigned-practicians-list">
        <label>With: </label>
        {staffIdToTitleAndName(
          staffInfos,
          user.demographics.assigned_staff_id,
          true
        )}
      </div>
      <p className="new-appointments__disclaimer">
        These time slots are automatically generated based on the availability
        of your practitioner. If you require different time options, please
        contact the clinic directly.
      </p>
      {errAvailability && (
        <p className="new-appointments__err">{errAvailability}</p>
      )}
      {errAppointments && (
        <p className="new-appointments__err">{errAppointments}</p>
      )}
      {!errAvailability &&
      !errAppointments &&
      appointmentsInRange &&
      availability.id ? (
        <AppointmentsSlots
          availability={availability}
          appointmentsInRange={appointmentsInRange}
          practicianSelectedId={user.demographics.assigned_staff_id}
          staffInfos={staffInfos}
          rangeStart={rangeStart}
          setAppointmentSelected={setAppointmentSelected}
          appointmentSelected={appointmentSelected}
        />
      ) : (
        !loadingAvailability &&
        !loadingAppointments && (
          <EmptyParagraph text="No time slots available" />
        )
      )}
      {(loadingAvailability || loadingAppointments) && <LoadingParagraph />}
      <>
        <WeekPicker
          handleClickNext={handleClickNext}
          handleClickPrevious={handleClickPrevious}
          rangeStart={rangeStart}
          rangeEnd={rangeEnd}
        />

        <div className="new-appointments__submit">
          <button
            onClick={handleSubmit}
            disabled={_.isEmpty(appointmentSelected)}
          >
            Submit
          </button>
        </div>
      </>
      {requestSent && (
        <p className="new-appointments__confirm">
          Your request has been sent,{" "}
          <strong>
            Please wait for a secretary to confirm your appointment with{" "}
            {staffIdToTitleAndName(
              staffInfos,
              user.demographics.assigned_staff_id
            )}
          </strong>
        </p>
      )}
    </div>
  );
};

export default NewAppointment;
