import React, { useState } from "react";
import useTop10Meds from "../../../hooks/useTop10Meds";
import {
  dateISOToTimestampTZ,
  timestampToDateISOTZ,
} from "../../../utils/dates/formatDates";
import SelectSite from "../../Staff/EventForm/SelectSite";
import EmptyParagraph from "../../UI/Paragraphs/EmptyParagraph";
import LoadingParagraph from "../../UI/Paragraphs/LoadingParagraph";

const DashboardCardMeds = ({
  medications,
  rangeStartMeds,
  setRangeStartMeds,
  rangeEndMeds,
  setRangeEndMeds,
  loadingMeds,
  errMeds,
  sites,
}) => {
  const [siteSelectedIdMeds, setSiteSelectedIdMeds] = useState(-1);
  const { top10Meds } = useTop10Meds(medications, sites, siteSelectedIdMeds);

  const handleChangeStart = (e) => {
    const value = e.target.value;
    setRangeStartMeds(value === "" ? null : dateISOToTimestampTZ(value));
  };
  const handleChangeEnd = (e) => {
    const value = e.target.value;
    setRangeEndMeds(value === "" ? null : dateISOToTimestampTZ(value));
  };
  const handleSiteChangeMeds = (e) => {
    setSiteSelectedIdMeds(parseInt(e.target.value));
  };

  return (
    <div className="dashboard-card">
      <div className="dashboard-card__title">Medications</div>
      <div className="dashboard-card__filter">
        <div>
          <label htmlFor="">From</label>
          <input
            type="date"
            onChange={handleChangeStart}
            value={timestampToDateISOTZ(rangeStartMeds, "America/Toronto")}
          />
          <label htmlFor="">To</label>
          <input
            type="date"
            onChange={handleChangeEnd}
            value={timestampToDateISOTZ(rangeEndMeds, "America/Toronto")}
          />
        </div>
      </div>
      {errMeds && <p className="dashboard-card__err">{errMeds}</p>}
      {!errMeds &&
        (medications && medications.length > 0 ? (
          <div className="dashboard-card__content">
            <div className="dashboard-card__ranking">
              <p className="dashboard-card__ranking-title">Top medications</p>
              <SelectSite
                handleSiteChange={handleSiteChangeMeds}
                sites={sites}
                value={siteSelectedIdMeds}
                all={true}
              />
              {top10Meds.length > 0 ? (
                <ul className="dashboard-card__ranking-content">
                  {top10Meds.map((item, index) => (
                    <li key={item.id} className="dashboard-card__ranking-item">
                      <span className="dashboard-card__ranking-item-nbr">
                        {index + 1}:
                      </span>{" "}
                      <span>
                        {item.medication} ({item.frequency})
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <EmptyParagraph text="Not enough datas" />
              )}
            </div>
          </div>
        ) : (
          !loadingMeds && <EmptyParagraph text="No meds in this range" />
        ))}
      {loadingMeds && <LoadingParagraph />}
    </div>
  );
};

export default DashboardCardMeds;
