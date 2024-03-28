import { DateTime } from "luxon";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  deletePatientRecord,
  putPatientRecord,
} from "../../../../../api/fetchRecords";
import { getAvailableRooms } from "../../../../../api/getAvailableRooms";
import useSocketContext from "../../../../../hooks/context/useSocketContext";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../../hooks/context/useUserContext";
import useAvailableRooms from "../../../../../hooks/useAvailableRooms";
import { statuses } from "../../../../../utils/appointments/statuses";
import {
  nowTZTimestamp,
  timestampToDateISOTZ,
  timestampToDateTimeStrTZ,
  timestampToTimeISOTZ,
  tzComponentsToTimestamp,
} from "../../../../../utils/dates/formatDates";
import {
  staffIdToFirstName,
  staffIdToLastName,
  staffIdToOHIP,
} from "../../../../../utils/names/staffIdToName";
import { staffIdToTitleAndName } from "../../../../../utils/names/staffIdToTitleAndName";
import { toRoomTitle } from "../../../../../utils/names/toRoomTitle";
import { toSiteName } from "../../../../../utils/names/toSiteName";
import {
  firstLetterOfFirstWordUpper,
  firstLetterUpper,
} from "../../../../../utils/strings/firstLetterUpper";
import { appointmentSchema } from "../../../../../validation/record/appointmentValidation";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";
import DateTimePicker from "../../../../UI/Pickers/DateTimePicker";
import SignCell from "../../../../UI/Tables/SignCell";
import HostsSelect from "../../../EventForm/Host/HostsSelect";
import RoomsSelect from "../../../EventForm/Rooms/RoomsSelect";
import SiteSelect from "../../../EventForm/SiteSelect";
import StatusSelect from "../../../EventForm/Status/StatusSelect";

const AppointmentItem = ({
  item,
  editCounter,
  setErrMsgPost,
  errMsgPost,
  sites,
  lastItemRef = null,
}) => {
  //HOOKS
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [editVisible, setEditVisible] = useState(false);
  const [itemInfos, setItemInfos] = useState(null);
  const [progress, setProgress] = useState(false);

  const refDateStart = useRef(null);
  const refHoursStart = useRef(null);
  const refMinutesStart = useRef(null);
  const refAMPMStart = useRef(null);
  const refDateEnd = useRef(null);
  const refHoursEnd = useRef(null);
  const refMinutesEnd = useRef(null);
  const refAMPMEnd = useRef(null);
  const [previousStart, setPreviousStart] = useState(null);
  const [previousEnd, setPreviousEnd] = useState(null);

  useEffect(() => {
    setItemInfos(item);
    setPreviousStart(item.start);
    setPreviousEnd(item.end);
  }, [item]);

  const [availableRooms, setAvailableRooms] = useAvailableRooms(
    item.id,
    item.start,
    item.end,
    sites,
    item.site_id
  );

  //HANDLERS
  const isSecretary = () => {
    return user.title === "Secretary";
  };

  const handleSiteChange = async (e) => {
    const value = parseInt(e.target.value);
    setItemInfos({ ...itemInfos, site_id: value, room_id: "z" });
    if (itemInfos.start && itemInfos.end) {
      const availableRoomsResult = await getAvailableRooms(
        parseInt(item.id),
        itemInfos.start,
        itemInfos.end,
        sites,
        value
      );
      setAvailableRooms(availableRoomsResult);
    }
  };

  const handleChange = (e) => {
    setErrMsgPost(false);
    const name = e.target.name;
    let value = e.target.value;
    setItemInfos({ ...itemInfos, [name]: value });
  };

  const handleHostChange = async (e) => {
    setErrMsgPost(false);
    const value = parseInt(e.target.value);
    setItemInfos({
      ...itemInfos,
      host_id: value,
      Provider: {
        Name: {
          FirstName: staffIdToFirstName(staffInfos, value),
          LastName: staffIdToLastName(staffInfos, value),
        },
        OHIPPhysicianId: staffIdToOHIP(staffInfos, value),
      },
    });
  };

  const handleRoomChange = async (e) => {
    setErrMsgPost(false);
    const name = e.target.name;
    const value = e.target.value;
    if (
      (isRoomOccupied(value) &&
        (await confirmAlert({
          content: `${toRoomTitle(
            sites,
            itemInfos.site_id,
            value
          )} will be occupied at this time slot, choose this room anyway ?`,
        }))) ||
      !isRoomOccupied(value)
    ) {
      setItemInfos({ ...itemInfos, [name]: value });
    }
  };

  const handleStartChange = async (e) => {
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
      timestampStart > itemInfos.end ? timestampStart : itemInfos.end;
    let hypotheticAvailableRooms;

    try {
      hypotheticAvailableRooms = await getAvailableRooms(
        0,
        timestampStart,
        rangeEnd,
        sites,
        itemInfos.site_id
      );
    } catch (err) {
      toast.error(`Error: unable to get available rooms: ${err.message}`, {
        containerId: "A",
      });
      return;
    }

    if (
      itemInfos.room_id === "z" ||
      hypotheticAvailableRooms.includes(itemInfos.room_id) ||
      (!hypotheticAvailableRooms.includes(itemInfos.room_id) &&
        (await confirmAlert({
          content: `${toRoomTitle(
            sites,
            itemInfos.site_id,
            itemInfos.room_id
          )} will be occupied at this time slot, change start time anyway ?`,
        })))
    ) {
      if (timestampStart > itemInfos.end) {
        // endPicker.setDate(date); //Change flatpickr end
        //Update form datas
        setItemInfos({
          ...itemInfos,
          start: timestampStart,
          end: timestampStart,
          Duration: 0,
        });
        setPreviousStart(timestampStart);
        setPreviousEnd(timestampStart);
      } else {
        //Update form datas
        setItemInfos({
          ...itemInfos,
          start: timestampStart,
          Duration: Math.floor((itemInfos.end - timestampStart) / (1000 * 60)),
        });
        setPreviousStart(timestampStart);
      }
    }
  };

  const handleEndChange = async (e) => {
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
        itemInfos.start,
        timestampEnd,
        sites,
        itemInfos.site_id
      );
    } catch (err) {
      toast.error(`Error: unable to get available rooms: ${err.message}`, {
        containerId: "A",
      });
    }
    if (
      itemInfos.room_id === "z" ||
      hypotheticAvailableRooms.includes(itemInfos.room_id) ||
      (!hypotheticAvailableRooms.includes(itemInfos.room_id) &&
        (await confirmAlert({
          content: `${toRoomTitle(
            sites,
            itemInfos.site_id,
            itemInfos.room_id
          )} will be occupied at this time slot, change end time anyway ?`,
        })))
    ) {
      //Update form datas
      setItemInfos({
        ...itemInfos,
        end: timestampEnd,
        Duration: Math.floor((timestampEnd - itemInfos.start) / (1000 * 60)),
      });
      setPreviousEnd(timestampEnd);
    }
  };

  const handleAllDayChange = (e) => {
    setErrMsgPost("");
    let value = e.target.value;
    value = value === "true"; //cast to boolean
    if (value) {
      if (itemInfos.start === null) {
        setErrMsgPost("Please choose a start date first");
        return;
      }
      const startAllDay = DateTime.fromMillis(itemInfos.start, {
        zone: "America/Toronto",
      })
        .set({ hour: 0, minute: 0, second: 0 })
        .toMillis();
      const endAllDay = startAllDay + 24 * 3600 * 1000;

      setItemInfos({
        ...itemInfos,
        all_day: true,
        start: startAllDay,
        end: endAllDay,
        Duration: 1440,
      });
    } else {
      setItemInfos({
        ...itemInfos,
        all_day: false,
        start: previousStart,
        end: previousEnd,
        Duration: Math.floor((itemInfos.end - itemInfos.start) / (1000 * 60)),
      });
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    editCounter.current -= 1;
    setErrMsgPost("");
    setItemInfos(item);
    setEditVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Formatting
    const datasToPut = {
      ...itemInfos,
      AppointmentPurpose: firstLetterUpper(itemInfos.AppointmentPurpose),
      AppointmentTime: timestampToTimeISOTZ(itemInfos.start),
      AppointmentDate: timestampToDateISOTZ(itemInfos.start),
      Provider: {
        Name: {
          FirstName: staffIdToFirstName(
            staffInfos,
            parseInt(itemInfos.host_id)
          ),
          LastName: staffIdToLastName(staffInfos, parseInt(itemInfos.host_id)),
        },
        OHIPPhysicianId: staffIdToOHIP(staffInfos, parseInt(itemInfos.host_id)),
      },
      AppointmentNotes: firstLetterOfFirstWordUpper(itemInfos.AppointmentNotes),
      patients_guests_ids: itemInfos.patients_guests_ids.map(
        ({ patient_infos }) => patient_infos.patient_id
      ),
      staff_guests_ids: itemInfos.staff_guests_ids.map(
        ({ staff_infos }) => staff_infos.id
      ),
    };
    delete datasToPut.host_infos;
    delete datasToPut.site_infos;

    //Validation
    try {
      await appointmentSchema.validate(datasToPut);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    if (itemInfos.end < itemInfos.start) {
      setErrMsgPost("End of appointment can't be before start !");
      return;
    }
    try {
      setProgress(true);
      await putPatientRecord(
        `/appointments/${item.id}`,
        user.id,
        datasToPut,
        socket,
        "APPOINTMENTS"
      );

      editCounter.current -= 1;
      setEditVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
      setProgress(false);
    } catch (err) {
      toast.error(`Error: unable to save appointment: ${err.message}`, {
        containerId: "B",
      });
      setProgress(false);
    }
  };

  const handleEditClick = (e) => {
    editCounter.current += 1;
    setErrMsgPost(false);
    setEditVisible((v) => !v);
  };

  const handleDeleteClick = async (e) => {
    //if many patients_guests_ids or staff_guests_ids, ask if remove for everyone or only the patient
    if (
      await confirmAlert({
        content: `Do you really want to delete this item ?${
          item.patients_guests_ids?.length > 1 || item.staff_guests_ids?.length
            ? " There are other guests scheduled for this appointment, this action will also delete their appointment"
            : ""
        }`,
      })
    ) {
      try {
        setProgress(true);
        await deletePatientRecord(
          "/appointments",
          item.id,

          socket,
          "APPOINTMENTS"
        );
        toast.success("Deleted successfully", { containerId: "B" });
        setProgress(false);
      } catch (err) {
        toast.error(`Error: unable to delete appointment: ${err.message}`, {
          containerId: "B",
        });
        setProgress(false);
      }
    }
  };

  const isRoomOccupied = (roomId) => {
    if (roomId === "z") {
      return false;
    }
    return availableRooms.includes(roomId) ? false : true;
  };

  return (
    itemInfos && (
      <tr
        className="appointments__item"
        style={{
          border: errMsgPost && editVisible && "solid 1.5px red",
          backgroundColor: item.end < nowTZTimestamp() && "#cecdcd",
        }}
        ref={lastItemRef}
      >
        <td>
          {(isSecretary() || user.id === itemInfos.host_id) && (
            <div className="appointments__item-btn-container">
              {!editVisible ? (
                <>
                  <button
                    onClick={handleEditClick}
                    disabled={item.end < nowTZTimestamp() || progress}
                  >
                    Edit
                  </button>
                  <button onClick={handleDeleteClick} disabled={progress}>
                    Delete
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="submit"
                    value="Save"
                    onClick={handleSubmit}
                    disabled={progress}
                  />
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={progress}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          )}
        </td>
        <td style={{ minWidth: "170px" }}>
          {editVisible && isSecretary() ? (
            <HostsSelect
              staffInfos={staffInfos}
              handleHostChange={handleHostChange}
              hostId={itemInfos.host_id}
            />
          ) : (
            <p>{staffIdToTitleAndName(staffInfos, item.host_id)}</p>
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              type="text"
              name="AppointmentPurpose"
              value={itemInfos.AppointmentPurpose}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            item.AppointmentPurpose
          )}
        </td>
        <td>
          {editVisible ? (
            <DateTimePicker
              value={itemInfos.start}
              timezone="America/Toronto"
              locale="en-CA"
              handleChange={handleStartChange}
              refDate={refDateStart}
              refHours={refHoursStart}
              refMinutes={refMinutesStart}
              refAMPM={refAMPMStart}
              readOnlyTime={itemInfos.all_day}
              // readOnlyDate
            />
          ) : (
            timestampToDateTimeStrTZ(item.start, "America/Toronto")
          )}
        </td>
        <td>
          {editVisible ? (
            <DateTimePicker
              value={itemInfos.end}
              timezone="America/Toronto"
              locale="en-CA"
              handleChange={handleEndChange}
              refDate={refDateEnd}
              refHours={refHoursEnd}
              refMinutes={refMinutesEnd}
              refAMPM={refAMPMEnd}
              readOnlyTime={itemInfos.all_day}
              readOnlyDate={itemInfos.all_day}
            />
          ) : (
            timestampToDateTimeStrTZ(item.end, "America/Toronto")
          )}
        </td>
        <td>
          {editVisible ? (
            <select
              name="all_day"
              value={itemInfos.all_day.toString()}
              onChange={handleAllDayChange}
              style={{ width: "50px" }}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          ) : item.all_day ? (
            "Yes"
          ) : (
            "No"
          )}
        </td>
        <td>
          {editVisible ? (
            <SiteSelect
              handleSiteChange={handleSiteChange}
              sites={sites}
              value={itemInfos.site_id}
              label={false}
            />
          ) : (
            toSiteName(sites, item.site_id)
          )}
        </td>
        <td>
          {editVisible ? (
            <RoomsSelect
              handleRoomChange={handleRoomChange}
              roomSelectedId={itemInfos.room_id}
              rooms={sites
                .find(({ id }) => id === itemInfos.site_id)
                ?.rooms.sort((a, b) => a.id.localeCompare(b.id))}
              isRoomOccupied={isRoomOccupied}
              label={false}
            />
          ) : (
            toRoomTitle(sites, item.site_id, item.room_id)
          )}
        </td>
        <td>
          {editVisible ? (
            <StatusSelect
              handleChange={handleChange}
              statuses={statuses}
              selectedStatus={itemInfos.AppointmentStatus}
              label={false}
            />
          ) : (
            item.AppointmentStatus
          )}
        </td>
        <td>
          {editVisible ? (
            <input
              type="text"
              name="AppointmentNotes"
              value={itemInfos.AppointmentNotes}
              onChange={handleChange}
              autoComplete="off"
            />
          ) : (
            item.AppointmentNotes
          )}
        </td>
        <SignCell item={item} staffInfos={staffInfos} />
      </tr>
    )
  );
};

export default AppointmentItem;
