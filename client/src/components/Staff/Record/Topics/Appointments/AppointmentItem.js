import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
  deletePatientRecord,
  putPatientRecord,
} from "../../../../../api/fetchRecords";
import { getAvailableRooms } from "../../../../../api/getAvailableRooms";
import useAuthContext from "../../../../../hooks/useAuthContext";
import useAvailableRooms from "../../../../../hooks/useAvailableRooms";
import useSocketContext from "../../../../../hooks/useSocketContext";
import useStaffInfosContext from "../../../../../hooks/useStaffInfosContext";
import useUserContext from "../../../../../hooks/useUserContext";
import {
  firstLetterOfFirstWordUpper,
  firstLetterUpper,
} from "../../../../../utils/firstLetterUpper";
import {
  fromLocalToISOStringNoMs,
  toLocalAMPM,
  toLocalDate,
  toLocalHours,
  toLocalMinutes,
  toLocalTimeWithSeconds,
} from "../../../../../utils/formatDates";
import {
  staffIdToFirstName,
  staffIdToLastName,
  staffIdToOHIP,
} from "../../../../../utils/staffIdToName";
import { staffIdToTitleAndName } from "../../../../../utils/staffIdToTitleAndName";
import { statuses } from "../../../../../utils/statuses";
import { toSiteName } from "../../../../../utils/toSiteName";
import { appointmentSchema } from "../../../../../validation/appointmentValidation";
import { toRoomTitle } from "../../../../../validation/toRoomTitle";
import { confirmAlert } from "../../../../All/Confirm/ConfirmGlobal";
import TimePicker from "../../../../All/UI/Pickers/TimePicker";
import HostsList from "../../../EventForm/HostsList";
import RoomsList from "../../../EventForm/RoomsList";
import SelectSite from "../../../EventForm/SelectSite";
import StatusList from "../../../EventForm/StatusList";
import SignCell from "../SignCell";

const AppointmentItem = ({
  item,
  editCounter,
  setErrMsgPost,
  errMsgPost,
  sites,
  lastItemRef = null,
}) => {
  //HOOKS
  const { auth } = useAuthContext();
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [editVisible, setEditVisible] = useState(false);
  const [itemInfos, setEventInfos] = useState(null);
  const previousStartDate = useRef(toLocalDate(item.start));
  const previousEndDate = useRef(toLocalDate(item.end));
  const previousStartHours = useRef(toLocalHours(item.start));
  const previousEndHours = useRef(toLocalHours(item.end));
  const previousStartMin = useRef(toLocalMinutes(item.start));
  const previousEndMin = useRef(toLocalMinutes(item.end));
  const previousStartAMPM = useRef(toLocalAMPM(item.start));
  const previousEndAMPM = useRef(toLocalAMPM(item.end));
  const startDateInput = useRef(null);
  const endDateInput = useRef(null);
  const startHourInput = useRef(null);
  const endHourInput = useRef(null);
  const startMinInput = useRef(null);
  const endMinInput = useRef(null);
  const startAMPMInput = useRef(null);
  const endAMPMInput = useRef(null);
  const minEndDate = useRef(toLocalDate(item.start));
  const [progress, setProgress] = useState(false);

  useEffect(() => {
    setEventInfos(item);
  }, [item]);

  const [availableRooms, setAvailableRooms] = useAvailableRooms(
    item.id,
    item.start,
    item.end,
    sites,
    item.site_id,
    auth.authToken
  );

  //HANDLERS
  const isSecretary = () => {
    return user.title === "Secretary";
  };

  const handleSiteChange = async (e) => {
    const value = parseInt(e.target.value);
    setEventInfos({ ...itemInfos, site_id: value, room_id: "z" });
    if (itemInfos.start && itemInfos.end) {
      const availableRoomsResult = await getAvailableRooms(
        parseInt(item.id),
        itemInfos.start,
        itemInfos.end,
        sites,
        value,
        auth.authToken
      );
      setAvailableRooms(availableRoomsResult);
    }
  };

  const handleChange = (e) => {
    setErrMsgPost(false);
    const name = e.target.name;
    let value = e.target.value;
    setEventInfos({ ...itemInfos, [name]: value });
  };

  const handleHostChange = async (e) => {
    setErrMsgPost(false);
    const value = parseInt(e.target.value);
    setEventInfos({
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
      setEventInfos({ ...itemInfos, [name]: value });
    }
  };

  const handleStartChange = async (e) => {
    setErrMsgPost(false);
    const dateValue = startDateInput.current.value; //choosen local date YYYY:MM:DD
    const hourValue = startHourInput.current.value; //choosen local hour
    const minValue = startMinInput.current.value; //choosen local min
    const ampmValue = startAMPMInput.current.value; //choosen local ampm
    const name = e.target.name;

    if (name === "date" && dateValue === "") {
      setEventInfos({ ...itemInfos, start: null });
      return;
    }

    if (name === "date" && itemInfos.all_day) {
      const startAllDay = new Date(startDateInput.current.value).setHours(
        0,
        0,
        0,
        0
      );
      let endAllDay = new Date(startAllDay);
      endAllDay = endAllDay.setDate(endAllDay.getDate() + 1);
      setEventInfos({ ...itemInfos, start: startAllDay, end: endAllDay });
      return;
    }

    let value = fromLocalToISOStringNoMs(
      dateValue,
      hourValue,
      minValue,
      ampmValue
    );

    value = Date.parse(new Date(value));
    const rangeEnd =
      new Date(value) > new Date(itemInfos.end) ? value : itemInfos.end;

    let hypotheticAvailableRooms;

    try {
      hypotheticAvailableRooms = await getAvailableRooms(
        item.id,
        value,
        rangeEnd,
        sites,
        itemInfos.site_id,
        auth.authToken
      );

      if (
        itemInfos.room_id === "z" ||
        hypotheticAvailableRooms.includes(itemInfos.room_id) ||
        (!hypotheticAvailableRooms.includes(itemInfos.room_id) &&
          (await confirmAlert({
            content: `${toRoomTitle(
              sites,
              itemInfos.site_id,
              itemInfos.room_id
            )} will be occupied at this time slot, book it anyway ?`,
          })))
      ) {
        switch (name) {
          case "date":
            previousStartDate.current = dateValue;
            minEndDate.current = dateValue;
            break;
          case "hour":
            previousStartHours.current = hourValue;
            break;
          case "min":
            previousStartMin.current = minValue;
            break;
          case "ampm":
            previousStartAMPM.current = ampmValue;
            break;
          default:
            break;
        }

        if (new Date(value) > new Date(itemInfos.end)) {
          setEventInfos({
            ...itemInfos,
            start: value,
            end: value,
            Duration: 0,
          });
          endHourInput.value = startHourInput.value;
          endMinInput.value = startMinInput.value;
          endAMPMInput.value = startAMPMInput.value;
        } else {
          setEventInfos({
            ...itemInfos,
            start: value,
            Duration: Math.floor((itemInfos.end - value) / (1000 * 60)),
          });
        }
      } else {
        //set input value to previous start
        switch (name) {
          case "date":
            e.target.value = previousStartDate.current;
            break;
          case "hour":
            e.target.value = previousStartHours.current;
            break;
          case "min":
            e.target.value = previousStartMin.current;
            break;
          case "ampm":
            e.target.value = previousStartAMPM.current;
            break;
          default:
            break;
        }
      }
    } catch (err) {
      toast.error(`Error: unable to save start date: ${err.message}`, {
        containerId: "B",
      });
    }
  };

  const handleEndChange = async (e) => {
    setErrMsgPost(false);
    const dateValue = endDateInput.current.value;
    const hourValue = endHourInput.current.value; //choosen local hour
    const minValue = endMinInput.current.value; //choosen local min
    const ampmValue = endAMPMInput.current.value; //choosen local ampm
    const name = e.target.name;

    if (name === "date" && dateValue === "") {
      setEventInfos({ ...itemInfos, end: null });
      return;
    }

    let value = fromLocalToISOStringNoMs(
      dateValue,
      hourValue,
      minValue,
      ampmValue
    );

    value = Date.parse(new Date(value));

    let hypotheticAvailableRooms;
    try {
      hypotheticAvailableRooms = await getAvailableRooms(
        item.id,
        itemInfos.start,
        value,
        sites,
        itemInfos.site_id,
        auth.authToken
      );
      if (
        itemInfos.room_id === "z" ||
        hypotheticAvailableRooms.includes(itemInfos.room_id) ||
        (!hypotheticAvailableRooms.includes(itemInfos.room_id) &&
          (await confirmAlert({
            content: `${toRoomTitle(
              sites,
              itemInfos.site_id,
              itemInfos.room_id
            )} will be occupied at this time slot, book it anyway ?`,
          })))
      ) {
        switch (name) {
          case "date":
            previousEndDate.current = dateValue;
            break;
          case "hour":
            previousEndHours.current = hourValue;
            break;
          case "min":
            previousEndMin.current = minValue;
            break;
          case "ampm":
            previousEndAMPM.current = ampmValue;
            break;
          default:
            break;
        }
        setEventInfos({
          ...itemInfos,
          end: value,
          duration: Math.floor((value - itemInfos.start) / (1000 * 60)),
        });
      } else {
        switch (name) {
          case "date":
            e.target.value = previousEndDate.current;
            break;
          case "hour":
            e.target.value = previousEndHours.current;
            break;
          case "min":
            e.target.value = previousEndMin.current;
            break;
          case "ampm":
            e.target.value = previousEndAMPM.current;
            break;
          default:
            break;
        }
      }
    } catch (err) {
      toast.error(`Error: unable to save end date: ${err.message}`, {
        containerId: "B",
      });
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
      const startAllDay = new Date(itemInfos.start).setHours(0, 0, 0, 0);
      let endAllDay = new Date(startAllDay);
      endAllDay = endAllDay.setDate(endAllDay.getDate() + 1);

      setEventInfos({
        ...itemInfos,
        all_day: true,
        start: startAllDay,
        end: endAllDay,
        Duration: 1440,
      });
    } else {
      setEventInfos({
        ...itemInfos,
        all_day: false,
        Duration: Math.floor((itemInfos.end - itemInfos.start) / (1000 * 60)),
      });
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    editCounter.current -= 1;
    setErrMsgPost("");
    setEventInfos(item);
    setEditVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Formatting
    const datasToPut = {
      ...itemInfos,
      AppointmentPurpose: firstLetterUpper(itemInfos.AppointmentPurpose),
      AppointmentTime: toLocalTimeWithSeconds(itemInfos.start),
      AppointmentDate: toLocalDate(itemInfos.start),
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
    try {
      setProgress(true);
      await putPatientRecord(
        "/appointments",
        item.id,
        user.id,
        auth.authToken,
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
          item.patients_guests_ids?.length || item.staff_guests_ids?.length
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
          auth.authToken,
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
          backgroundColor: item.end < Date.now() && "#cecdcd",
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
                    disabled={item.end < Date.now() || progress}
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
            <HostsList
              staffInfos={staffInfos}
              handleHostChange={handleHostChange}
              hostId={itemInfos.host_id}
            />
          ) : (
            <p>{staffIdToTitleAndName(staffInfos, item.host_id, true)}</p>
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
            <div className="appointments__item-date-container">
              <input
                type="date"
                value={
                  itemInfos.start !== null ? toLocalDate(itemInfos.start) : ""
                }
                onChange={handleStartChange}
                ref={startDateInput}
                name="date"
              />
              <TimePicker
                handleChange={handleStartChange}
                dateTimeValue={itemInfos.start}
                passingRefHour={startHourInput}
                passingRefMin={startMinInput}
                passingRefAMPM={startAMPMInput}
                readOnly={itemInfos.all_day || !toLocalDate(itemInfos.start)}
              />
            </div>
          ) : item.start !== null ? (
            new Date(item.start).toLocaleString("en-CA", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            })
          ) : (
            ""
          )}
        </td>
        <td>
          {editVisible ? (
            <div className="appointments__item-date-container">
              <input
                type="date"
                value={itemInfos.end !== null ? toLocalDate(itemInfos.end) : ""}
                onChange={handleEndChange}
                min={minEndDate.current}
                ref={endDateInput}
                readOnly={itemInfos.all_day}
                name="date"
              />
              <TimePicker
                handleChange={handleEndChange}
                dateTimeValue={itemInfos.end}
                passingRefHour={endHourInput}
                passingRefMin={endMinInput}
                passingRefAMPM={endAMPMInput}
                readOnly={itemInfos.all_day || !toLocalDate(itemInfos.end)}
              />
            </div>
          ) : item.end !== null ? (
            new Date(item.end).toLocaleString("en-CA", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            })
          ) : (
            ""
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
            <SelectSite
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
            <RoomsList
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
            <StatusList
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
