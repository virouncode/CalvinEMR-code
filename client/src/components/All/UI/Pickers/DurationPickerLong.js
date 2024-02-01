const DurationPickerLong = ({
  durationYears,
  durationMonths,
  durationWeeks,
  durationDays,
  handleDurationPickerChange,
  title = true,
}) => {
  return (
    <>
      {title && (
        <label style={{ marginRight: "10px", fontWeight: "bold" }}>
          Duration
        </label>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <label
          style={{ fontWeight: "normal", minWidth: "15px", marginRight: "5px" }}
        >
          Y
        </label>
        <input
          style={{ marginRight: "10px", width: "50px" }}
          type="number"
          step="1"
          min="0"
          value={durationYears}
          onChange={(e) => handleDurationPickerChange(e, "Y")}
        />
        <label
          style={{ fontWeight: "normal", minWidth: "15px", marginRight: "5px" }}
        >
          M
        </label>
        <input
          style={{ marginRight: "10px", width: "50px" }}
          type="number"
          step="1"
          min="0"
          value={durationMonths}
          onChange={(e) => handleDurationPickerChange(e, "M")}
        />
        <label
          style={{ fontWeight: "normal", minWidth: "15px", marginRight: "5px" }}
        >
          W
        </label>
        <input
          style={{ marginRight: "10px", width: "50px" }}
          type="number"
          step="1"
          min="0"
          value={durationWeeks}
          onChange={(e) => handleDurationPickerChange(e, "W")}
        />
        <label
          style={{ fontWeight: "normal", minWidth: "15px", marginRight: "5px" }}
        >
          D
        </label>
        <input
          style={{ marginRight: "10px", width: "50px" }}
          type="number"
          step="1"
          min="0"
          value={durationDays}
          onChange={(e) => handleDurationPickerChange(e, "D")}
        />
      </div>
    </>
  );
};

export default DurationPickerLong;
