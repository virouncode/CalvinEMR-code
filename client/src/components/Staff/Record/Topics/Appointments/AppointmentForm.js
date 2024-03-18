import { DateTime } from "luxon";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import { postPatientRecord } from "../../../../../api/fetchRecords";
import { getAvailableRooms } from "../../../../../api/getAvailableRooms";
import useSocketContext from "../../../../../hooks/useSocketContext";
import useStaffInfosContext from "../../../../../hooks/useStaffInfosContext";
import useUserContext from "../../../../../hooks/useUserContext";
import { firstLetterOfFirstWordUpper } from "../../../../../utils/firstLetterUpper";
import {
  nowTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
  timestampToTimeISOTZ,
  tzComponentsToTimestamp,
} from "../../../../../utils/formatDates";
import {
  staffIdToFirstName,
  staffIdToLastName,
  staffIdToOHIP,
} from "../../../../../utils/staffIdToName";
import { staffIdToTitleAndName } from "../../../../../utils/staffIdToTitleAndName";
import { statuses } from "../../../../../utils/statuses";
import { appointmentSchema } from "../../../../../validation/appointmentValidation";
import { toRoomTitle } from "../../../../../validation/toRoomTitle";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";
import { DateTimePicker } from "../../../../All/UI/Pickers/DateTimePicker";
import HostsList from "../../../EventForm/HostsList";
import RoomsList from "../../../EventForm/RoomsList";
import SelectSite from "../../../EventForm/SelectSite";
import StatusList from "../../../EventForm/StatusList";

const AppointmentForm = ({
  patientId,
  editCounter,
  setAddVisible,
  setErrMsgPost,
  errMsgPost,
  sites,
}) => {
  //HOOKS
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [formDatas, setFormDatas] = useState({
    host_id: user.title === "Secretary" ? 0 : user.id,
    start: nowTZ().set({ hour: 7, minute: 0, second: 0 }).toMillis(),
    end: nowTZ().set({ hour: 8, minute: 0, second: 0 }).toMillis(),
    patients_guests_ids: [patientId],
    staff_guests_ids: [],
    room: "To Be Determined",
    all_day: false,
    Duration: 0,
    AppointmentStatus: "Scheduled",
    AppointmentPurpose: "Appointment",
    AppointmentNotes: "",
    site_id: user.site_id,
    room_id: "z",
  });
  const [previousStart, setPreviousStart] = useState(
    nowTZ().set({ hour: 7, minute: 0, second: 0 }).toMillis()
  );
  const [previousEnd, setPreviousEnd] = useState(
    nowTZ().set({ hour: 8, minute: 0, second: 0 }).toMillis()
  );
  const [availableRooms, setAvailableRooms] = useState(
    sites.find(({ id }) => id === user.site_id)?.rooms.map(({ id }) => id)
  );

  const refDateStart = useRef(null);
  const refHoursStart = useRef(null);
  const refMinutesStart = useRef(null);
  const refAMPMStart = useRef(null);
  const refDateEnd = useRef(null);
  const refHoursEnd = useRef(null);
  const refMinutesEnd = useRef(null);
  const refAMPMEnd = useRef(null);
  const [progress, setProgress] = useState(false);

  //STYLE

  //HANDLERS
  const isSecretary = () => {
    return user.title === "Secretary";
  };

  const handleSiteChange = async (e) => {
    const value = parseInt(e.target.value);
    setFormDatas({ ...formDatas, site_id: value, room_id: "z" });
    if (formDatas.start && formDatas.end) {
      const availableRoomsResult = await getAvailableRooms(
        0,
        formDatas.start,
        formDatas.end,
        sites,
        value
      );
      setAvailableRooms(availableRoomsResult);
    }
  };

  const handleChange = (e) => {
    setErrMsgPost(false);
    const name = e.target.name;
    const value = e.target.value;
    setFormDatas({ ...formDatas, [name]: value });
  };

  const handleHostChange = async (e) => {
    setErrMsgPost(false);
    const value = parseInt(e.target.value);
    setFormDatas({ ...formDatas, host_id: value });
  };

  const handleRoomChange = async (e) => {
    const name = e.target.name;
    const value = e.target.value;
    if (
      (isRoomOccupied(value) &&
        (await confirmAlert({
          content: `${toRoomTitle(
            sites,
            formDatas.site_id,
            value
          )} will be occupied at this time slot, choose this room anyway ?`,
        }))) ||
      !isRoomOccupied(value)
    ) {
      setFormDatas({ ...formDatas, [name]: value });
    }
  };

  const handleStartChange = async (e) => {
    setErrMsgPost("");
    const name = e.target.name;
    const value = e.target.value;
    if (!value) return;
    const dateStr = refDateStart.current.value;
    const hoursStr = refHoursStart.current.value;
    const minutesStr = refMinutesStart.current.value;
    const ampmStr = refAMPMStart.current.value;
    let timestampStart;
    switch (name) {
      case "date":
        timestampStart = tzComponentsToTimestamp(
          value,
          hoursStr,
          minutesStr,
          ampmStr,
          "America/Toronto",
          "en-CA"
        );
        break;
      case "hours":
        timestampStart = tzComponentsToTimestamp(
          dateStr,
          value,
          minutesStr,
          ampmStr,
          "America/Toronto",
          "en-CA"
        );
        break;
      case "minutes":
        timestampStart = tzComponentsToTimestamp(
          dateStr,
          hoursStr,
          value,
          ampmStr,
          "America/Toronto",
          "en-CA"
        );
        break;
      case "ampm":
        timestampStart = tzComponentsToTimestamp(
          dateStr,
          hoursStr,
          minutesStr,
          value,
          "America/Toronto",
          "en-CA"
        );
        break;
      default:
        break;
    }

    const rangeEnd =
      timestampStart > formDatas.end ? timestampStart : formDatas.end;
    let hypotheticAvailableRooms;

    try {
      hypotheticAvailableRooms = await getAvailableRooms(
        0,
        timestampStart,
        rangeEnd,
        sites,
        formDatas.site_id
      );
    } catch (err) {
      toast.error(`Error: unable to get available rooms: ${err.message}`, {
        containerId: "A",
      });
      return;
    }

    if (
      formDatas.room_id === "z" ||
      hypotheticAvailableRooms.includes(formDatas.room_id) ||
      (!hypotheticAvailableRooms.includes(formDatas.room_id) &&
        (await confirmAlert({
          content: `${toRoomTitle(
            sites,
            formDatas.site_id,
            formDatas.room_id
          )} will be occupied at this time slot, change start time anyway ?`,
        })))
    ) {
      if (timestampStart > formDatas.end) {
        // endPicker.setDate(date); //Change flatpickr end
        //Update form datas
        setFormDatas({
          ...formDatas,
          start: timestampStart,
          end: timestampStart,
          Duration: 0,
        });
        setPreviousStart(timestampStart);
        setPreviousEnd(timestampStart);
      } else {
        //Update form datas
        setFormDatas({
          ...formDatas,
          start: timestampStart,
          Duration: Math.floor((formDatas.end - timestampStart) / (1000 * 60)),
        });
        setPreviousStart(timestampStart);
      }
    }
  };

  const handleEndChange = async (e) => {
    setErrMsgPost("");
    const name = e.target.name;
    const value = e.target.value;
    if (!value) return;
    const dateStr = refDateEnd.current.value;
    const hoursStr = refHoursEnd.current.value;
    const minutesStr = refMinutesEnd.current.value;
    const ampmStr = refAMPMEnd.current.value;
    let timestampEnd;
    switch (name) {
      case "date":
        timestampEnd = tzComponentsToTimestamp(
          value,
          hoursStr,
          minutesStr,
          ampmStr,
          "America/Toronto",
          "en-CA"
        );
        break;
      case "hours":
        timestampEnd = tzComponentsToTimestamp(
          dateStr,
          value,
          minutesStr,
          ampmStr,
          "America/Toronto",
          "en-CA"
        );
        break;
      case "minutes":
        timestampEnd = tzComponentsToTimestamp(
          dateStr,
          hoursStr,
          value,
          ampmStr,
          "America/Toronto",
          "en-CA"
        );
        break;
      case "ampm":
        timestampEnd = tzComponentsToTimestamp(
          dateStr,
          hoursStr,
          minutesStr,
          value,
          "America/Toronto",
          "en-CA"
        );
        break;
      default:
        break;
    }

    let hypotheticAvailableRooms;
    try {
      hypotheticAvailableRooms = await getAvailableRooms(
        0,
        formDatas.start,
        timestampEnd,
        sites,
        formDatas.site_id
      );
    } catch (err) {
      toast.error(`Error: unable to get available rooms: ${err.message}`, {
        containerId: "A",
      });
    }
    if (
      formDatas.room_id === "z" ||
      hypotheticAvailableRooms.includes(formDatas.room_id) ||
      (!hypotheticAvailableRooms.includes(formDatas.room_id) &&
        (await confirmAlert({
          content: `${toRoomTitle(
            sites,
            formDatas.site_id,
            formDatas.room_id
          )} will be occupied at this time slot, change end time anyway ?`,
        })))
    ) {
      //Update form datas
      setFormDatas({
        ...formDatas,
        end: timestampEnd,
        Duration: Math.floor((timestampEnd - formDatas.start) / (1000 * 60)),
      });
      setPreviousEnd(timestampEnd);
    }
  };

  const handleAllDayChange = (e) => {
    setErrMsgPost("");
    let value = e.target.value;
    value = value === "true"; //cast to boolean
    if (value) {
      if (formDatas.start === null) {
        setErrMsgPost("Please choose a start date first");
        return;
      }
      const startAllDay = DateTime.fromMillis(formDatas.start, {
        zone: "America/Toronto",
      })
        .set({ hour: 0, minute: 0, second: 0 })
        .toMillis();
      const endAllDay = startAllDay + 24 * 3600 * 1000;

      setFormDatas({
        ...formDatas,
        all_day: true,
        start: startAllDay,
        end: endAllDay,
        Duration: 1440,
      });
    } else {
      setFormDatas({
        ...formDatas,
        all_day: false,
        start: previousStart,
        end: previousEnd,
        Duration: Math.floor((formDatas.end - formDatas.start) / (1000 * 60)),
      });
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    editCounter.current -= 1;
    setErrMsgPost("");
    setAddVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Formatting
    const datasToPost = {
      ...formDatas,
      AppointmentPurpose: firstLetterOfFirstWordUpper(
        formDatas.AppointmentPurpose
      ),
      AppointmentTime: timestampToTimeISOTZ(formDatas.start),
      AppointmentDate: timestampToDateISOTZ(formDatas.start),
      Provider: {
        Name: {
          FirstName: staffIdToFirstName(
            staffInfos,
            parseInt(formDatas.host_id)
          ),
          LastName: staffIdToLastName(staffInfos, parseInt(formDatas.host_id)),
        },
        OHIPPhysicianId: staffIdToOHIP(staffInfos, parseInt(formDatas.host_id)),
      },
      AppointmentNotes: firstLetterOfFirstWordUpper(formDatas.AppointmentNotes),
    };

    //Validation
    try {
      await appointmentSchema.validate(datasToPost);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    if (formDatas.end < formDatas.start) {
      setErrMsgPost("End of appointment can't be before start !");
      return;
    }
    try {
      setProgress(true);
      await postPatientRecord(
        "/appointments",
        user.id,
        datasToPost,
        socket,
        "APPOINTMENTS"
      );
      editCounter.current -= 1;
      setAddVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
      setProgress(false);
    } catch (err) {
      toast.error(`Error unable to save appointment: ${err.message}`, {
        containerId: "B",
      });
      setProgress(false);
    }
  };

  const isRoomOccupied = (roomId) => {
    if (roomId === "z") {
      return false;
    }
    return availableRooms.includes(roomId) ? false : true;
  };

  return (
    <tr
      className="appointments__form"
      style={{ border: errMsgPost && "solid 1.5px red" }}
    >
      <td>
        <div className="appointments__form-btn-container">
          <input
            type="submit"
            value="Save"
            onClick={handleSubmit}
            disabled={progress}
          />
          <button type="button" onClick={handleCancel} disabled={progress}>
            Cancel
          </button>
        </div>
      </td>
      <td style={{ minWidth: "170px" }}>
        {isSecretary() ? (
          <HostsList
            staffInfos={staffInfos}
            handleHostChange={handleHostChange}
            hostId={formDatas.host_id}
          />
        ) : (
          <p>{staffIdToTitleAndName(staffInfos, user.id)}</p>
        )}
      </td>
      <td>
        <input
          type="text"
          name="AppointmentPurpose"
          value={formDatas.AppointmentPurpose}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <DateTimePicker
          value={formDatas.start}
          timezone="America/Toronto"
          locale="en-CA"
          handleChange={handleStartChange}
          refDate={refDateStart}
          refHours={refHoursStart}
          refMinutes={refMinutesStart}
          refAMPM={refAMPMStart}
          readOnlyTime={formDatas.all_day}
          // readOnlyDate
        />
      </td>
      <td>
        <DateTimePicker
          value={formDatas.end}
          timezone="America/Toronto"
          locale="en-CA"
          handleChange={handleEndChange}
          refDate={refDateEnd}
          refHours={refHoursEnd}
          refMinutes={refMinutesEnd}
          refAMPM={refAMPMEnd}
          readOnlyTime={formDatas.all_day}
          readOnlyDate={formDatas.all_day}
        />
      </td>
      <td>
        <select
          name="all_day"
          value={formDatas.all_day.toString()}
          onChange={handleAllDayChange}
          style={{ width: "50px" }}
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </td>
      <td>
        <SelectSite
          handleSiteChange={handleSiteChange}
          sites={sites}
          value={formDatas.site_id}
          label={false}
        />
      </td>
      <td>
        <RoomsList
          handleRoomChange={handleRoomChange}
          roomSelectedId={formDatas.room_id}
          rooms={sites
            .find(({ id }) => id === formDatas.site_id)
            ?.rooms?.sort((a, b) => a.id.localeCompare(b.id))}
          isRoomOccupied={isRoomOccupied}
          label={false}
        />
      </td>
      <td>
        <StatusList
          handleChange={handleChange}
          statuses={statuses}
          selectedStatus={formDatas.AppointmentStatus}
          label={false}
        />
      </td>
      <td>
        <input
          type="text"
          name="AppointmentNotes"
          value={formDatas.AppointmentNotes}
          onChange={handleChange}
          autoComplete="off"
        />
      </td>
      <td>
        <em>{staffIdToTitleAndName(staffInfos, user.id)}</em>
      </td>
      <td>
        <em>{timestampToDateISOTZ(nowTZTimestamp(), "America/Toronto")}</em>
      </td>
    </tr>
  );
};

export default AppointmentForm;
