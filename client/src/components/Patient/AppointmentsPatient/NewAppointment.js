import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { axiosXanoPatient } from "../../../api/xanoPatient";
import useAuth from "../../../hooks/useAuth";
import { getWeekRange } from "../../../utils/formatDates";
import { patientIdToName } from "../../../utils/patientIdToName";
import { onMessageAvailability } from "../../../utils/socketHandlers/onMessageAvailability";
import { staffIdToName } from "../../../utils/staffIdToName";
import { staffIdToTitleAndName } from "../../../utils/staffIdToTitleAndName";
import { confirmAlert } from "../../All/Confirm/ConfirmGlobal";
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
  const { user, auth, clinic, socket } = useAuth();
  const [appointmentsInRange, setAppointmentsInRange] = useState(null);
  const [availability, setAvailability] = useState(null);
  const [rangeStart, setRangeStart] = useState(
    Date.parse(getWeekRange(new Date().getDay())[0])
  );
  const [rangeEnd, setRangeEnd] = useState(
    Date.parse(getWeekRange(new Date().getDay())[1])
  );
  // const [practicianSelectedId, setPracticianSelectedId] = useState(
  //   user.demographics.assigned_staff_id
  // );
  // const assignedStaff = [
  //   { category: "Doctor", id: user.demographics.assigned_md_id },
  //   { category: "Nurse", id: user.demographics.assigned_nurse_id },
  //   { category: "Midwife", id: user.demographics.assigned_midwife_id },
  // ].filter(({ id }) => id);
  // const assignedStaffId = user.demographics.assigned_staff_id;

  const [appointmentSelected, setAppointmentSelected] = useState({});
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    // if (!practicianSelectedId) return;
    const abortController = new AbortController();
    const fetchAppointmentsInRange = async () => {
      try {
        const response = await axiosXanoPatient.post(
          "/appointments_for_staff",
          {
            host_id: user.demographics.assigned_staff_id,
            range_start: rangeStart + 86400000, //+1 day
            range_end: rangeEnd + 86400000,
          },
          {
            headers: {
              Authorization: `Bearer ${auth.authToken}`,
            },
          }
        );
        if (abortController.signal.aborted) return;
        setAppointmentsInRange(
          response.data.filter(({ start }) => start > rangeStart + 86400000)
        );
      } catch (err) {
        if (err.name !== "CanceledError")
          toast.error(
            `Error : unable fetch your account infos: ${err.message}`,
            {
              containerId: "A",
            }
          );
      }
    };
    fetchAppointmentsInRange();
    return () => abortController.abort();
  }, [
    auth.authToken,
    rangeEnd,
    rangeStart,
    user.demographics.assigned_staff_id,
  ]);

  useEffect(() => {
    // if (!practicianSelectedId) return;
    const abortController = new AbortController();
    const fetchAvailability = async () => {
      try {
        const response = await axiosXanoPatient.get(
          `/availability_for_staff?staff_id=${user.demographics.assigned_staff_id}`,
          {
            headers: {
              Authorization: `Bearer ${auth.authToken}`,
            },
            signal: abortController.signal,
          }
        );
        if (abortController.signal.aborted) return;
        setAvailability(response.data);
      } catch (err) {
        if (err.name !== "CanceledError")
          toast.error(
            `Error : unable fetch practician availability: ${err.message}`,
            {
              containerId: "A",
            }
          );
      }
    };
    fetchAvailability();
    return () => abortController.abort();
  }, [auth.authToken, user.demographics.assigned_staff_id]);

  useEffect(() => {
    if (!socket) return;
    const onMessage = (message) =>
      onMessageAvailability(
        message,
        setAvailability,
        user.demographics.assigned_staff_id
      );
    socket.on("message", onMessage);
    return () => {
      socket.off("message", onMessage);
    };
  }, [socket, user.demographics.assigned_staff_id]);

  // const handlePracticianChange = (e) => {
  //   const value = parseInt(e.target.value);
  //   setPracticianSelectedId(value);
  // };

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
          clinic.staffInfos,
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
      const secretariesIds = clinic.staffInfos
        .filter(({ title }) => title === "Secretary")
        .map(({ id }) => id);

      //create the message
      try {
        for (const secretaryId of secretariesIds) {
          const message = {
            from_id: user.id,
            from_user_type: "patient",
            to_id: secretaryId,
            to_user_type: "staff",
            subject: "Appointment request",
            body: `Hello ${staffIdToName(clinic.staffInfos, secretaryId)},

I would like to have an appointment with ${staffIdToTitleAndName(
              clinic.staffInfos,
              user.demographics.assigned_staff_id
            )} on:

${new Date(appointmentSelected.start).toLocaleString(
  "en-CA",
  optionsDate
)} ${new Date(appointmentSelected.start).toLocaleTimeString(
              "en-CA",
              optionsTime
            )} - ${new Date(appointmentSelected.end).toLocaleTimeString(
              "en-CA",
              optionsTime
            )} 
  
Please call me or send me a message to confirm the appointment.

Patient: ${patientIdToName(
              clinic.demographicsInfos,
              user.demographics.patient_id
            )}
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
          const response = await axiosXanoPatient.post(
            "/messages_external",
            message,
            {
              headers: {
                Authorization: `Bearer ${auth.authToken}`,
                "Content-Type": "application/json",
              },
            }
          );
          socket.emit("message", {
            route: "MESSAGES INBOX EXTERNAL",
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
          clinic.staffInfos,
          user.demographics.assigned_staff_id,
          true
        )}
      </div>
      {/* {!assignedStaffId ? (
        <p>
          You don't seem to have any assigned practician, please contact the
          clinic
        </p>
      ) : (
        <AssignedPracticiansList
          assignedStaffId={assignedStaffId}
          handlePracticianChange={handlePracticianChange}
          practicianSelectedId={practicianSelectedId}
          staffInfos={clinic.staffInfos}
        />
      )} */}

      <p className="new-appointments__disclaimer">
        These time slots are automatically generated, if you want other time
        slots please call the clinic
      </p>
      {availability && appointmentsInRange && (
        <AppointmentsSlots
          availability={availability}
          appointmentsInRange={appointmentsInRange}
          practicianSelectedId={user.demographics.assigned_staff_id}
          staffInfos={clinic.staffInfos}
          rangeStart={rangeStart}
          setAppointmentSelected={setAppointmentSelected}
          appointmentSelected={appointmentSelected}
        />
      )}
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
              clinic.staffInfos,
              user.demographics.assigned_staff_id
            )}
          </strong>
        </p>
      )}
    </div>
  );
};

export default NewAppointment;
