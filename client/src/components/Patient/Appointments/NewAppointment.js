import { DateTime } from "luxon";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import xanoPost from "../../../api/xanoCRUD/xanoPost";
import useSocketContext from "../../../hooks/context/useSocketContext";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import useAvailabilitySocket from "../../../hooks/socket/useAvailabilitySocket";
import useFetchDatas from "../../../hooks/useFetchDatas";
import {
  nowTZ,
  nowTZTimestamp,
  timestampToHumanDateTimeTZ,
} from "../../../utils/dates/formatDates";
import { staffIdToName } from "../../../utils/names/staffIdToName";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";
import { toPatientName } from "../../../utils/names/toPatientName";
import { confirmAlert } from "../../All/Confirm/ConfirmGlobal";
import EmptyParagraph from "../../UI/Paragraphs/EmptyParagraph";
import LoadingParagraph from "../../UI/Paragraphs/LoadingParagraph";
import AppointmentsSlots from "./AppointmentsSlots";
import WeekPicker from "./WeekPicker";
var _ = require("lodash");

const NewAppointment = () => {
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [appointmentsInRange, setAppointmentsInRange] = useState(null);
  const [rangeStart, setRangeStart] = useState(
    nowTZ().plus({ days: 1 }).startOf("day").toMillis()
  ); //tomorrow midnight
  const [rangeEnd, setRangeEnd] = useState(
    nowTZ().plus({ weeks: 1 }).startOf("day").toMillis()
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
          range_start: rangeStart,
          range_end: rangeEnd,
        });
        if (abortController.signal.aborted) return;
        setAppointmentsInRange(response.data);
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
    setRangeStart((rs) =>
      DateTime.fromMillis(rs, { zone: "America/Toronto" })
        .plus({ weeks: 1 })
        .toMillis()
    );
    setRangeEnd((re) =>
      DateTime.fromMillis(re, { zone: "America/Toronto" })
        .plus({ weeks: 1 })
        .toMillis()
    );
    setAppointmentSelected({});
  };
  const handleClickPrevious = () => {
    setRangeStart((rs) =>
      DateTime.fromMillis(rs, { zone: "America/Toronto" })
        .minus({ weeks: 1 })
        .toMillis()
    );
    setRangeEnd((re) =>
      DateTime.fromMillis(re, { zone: "America/Toronto" })
        .minus({ weeks: 1 })
        .toMillis()
    );
    setAppointmentSelected({});
  };

  const handleSubmit = async () => {
    if (
      await confirmAlert({
        content: `You are about to request an appointment with ${staffIdToTitleAndName(
          staffInfos,
          user.demographics.assigned_staff_id
        )}, from ${timestampToHumanDateTimeTZ(
          appointmentSelected.start
        )} to ${timestampToHumanDateTimeTZ(
          appointmentSelected.end
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
            )},

From ${timestampToHumanDateTimeTZ(
              appointmentSelected.start
            )} to ${timestampToHumanDateTimeTZ(appointmentSelected.end)}
  
Please call me or send me a message to confirm the appointment.

Patient: ${toPatientName(user.demographics)}
Chart Nbr: ${user.demographics.ChartNumber}
Cellphone: ${
              user.demographics.PhoneNumber.find(
                ({ _phoneNumberType }) => _phoneNumberType === "C"
              )?.phoneNumber
            }`,
            read_by_patient_id: user.id,
            date_created: nowTZTimestamp(),
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
