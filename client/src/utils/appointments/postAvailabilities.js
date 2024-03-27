import xanoPost from "../../api/xanoCRUD/xanoPost";
import { nowTZTimestamp } from "./formatDates";

export const postAvailabilities = async (staff_ids) => {
  for (let staffId of staff_ids) {
    await xanoPost("/availability", "staff", {
      staff_id: staffId,
      date_created: nowTZTimestamp(),
      schedule_morning: {
        monday: [
          { hours: "07", min: "00", ampm: "AM" },
          { hours: "12", min: "00", ampm: "PM" },
        ],
        tuesday: [
          { hours: "07", min: "00", ampm: "AM" },
          { hours: "12", min: "00", ampm: "PM" },
        ],
        wednesday: [
          { hours: "07", min: "00", ampm: "AM" },
          { hours: "12", min: "00", ampm: "PM" },
        ],
        thursday: [
          { hours: "07", min: "00", ampm: "AM" },
          { hours: "12", min: "00", ampm: "PM" },
        ],
        friday: [
          { hours: "07", min: "00", ampm: "AM" },
          { hours: "12", min: "00", ampm: "PM" },
        ],
        saturday: [
          { hours: "07", min: "00", ampm: "AM" },
          { hours: "12", min: "00", ampm: "PM" },
        ],
        sunday: [
          { hours: "07", min: "00", ampm: "AM" },
          { hours: "12", min: "00", ampm: "PM" },
        ],
      },
      schedule_afternoon: {
        monday: [
          { hours: "01", min: "00", ampm: "PM" },
          { hours: "06", min: "00", ampm: "PM" },
        ],
        tuesday: [
          { hours: "01", min: "00", ampm: "PM" },
          { hours: "06", min: "00", ampm: "PM" },
        ],
        wednesday: [
          { hours: "01", min: "00", ampm: "PM" },
          { hours: "06", min: "00", ampm: "PM" },
        ],
        thursday: [
          { hours: "01", min: "00", ampm: "PM" },
          { hours: "06", min: "00", ampm: "PM" },
        ],
        friday: [
          { hours: "01", min: "00", ampm: "PM" },
          { hours: "06", min: "00", ampm: "PM" },
        ],
        saturday: [
          { hours: "01", min: "00", ampm: "PM" },
          { hours: "06", min: "00", ampm: "PM" },
        ],
        sunday: [
          { hours: "01", min: "00", ampm: "PM" },
          { hours: "06", min: "00", ampm: "PM" },
        ],
      },
      unavailability: {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false,
      },
      default_duration_hours: 1,
      default_duration_min: 0,
    });
  }
};
