import React from "react";
import { getVaccinationInterval } from "../../../../../utils/getVaccinationInterval";
import RecImmunizationItemDouble from "./RecImmunizationItemDouble";
import RecImmunizationItemMultiple from "./RecImmunizationItemMultiple";
import RecImmunizationItemSingle from "./RecImmunizationItemSingle";

const RecImmunizationCell = ({
  age,
  type,
  route,
  immunizationId,
  dose,
  immunizationInfos,
  demographicsInfos,
  patientId,
}) => {
  return (
    immunizationInfos && (
      <td
        colSpan={
          immunizationId === 16
            ? "5"
            : immunizationId === 17
            ? "10"
            : immunizationId === 13
            ? "2"
            : "0"
        }
      >
        {dose === "single" ? ( //single dose
          <RecImmunizationItemSingle
            age={age}
            type={type}
            route={route}
            immunizationInfos={immunizationInfos[0] || {}}
            rangeStart={
              getVaccinationInterval(age, demographicsInfos.DateOfBirth)
                .rangeStart
            }
            rangeEnd={
              getVaccinationInterval(age, demographicsInfos.DateOfBirth)
                .rangeEnd
            }
            patientId={patientId}
          />
        ) : //double dose
        dose === "double" ? (
          <RecImmunizationItemDouble
            age={age}
            type={type}
            route={route}
            immunizationInfos={immunizationInfos}
            demographicsInfos={demographicsInfos}
            rangeStart={
              getVaccinationInterval(age, demographicsInfos.DateOfBirth)
                .rangeStart
            }
            rangeEnd={
              getVaccinationInterval(age, demographicsInfos.DateOfBirth)
                .rangeEnd
            }
            patientId={patientId}
          />
        ) : (
          <RecImmunizationItemMultiple
            age={age}
            type={type}
            route={route}
            immunizationInfos={immunizationInfos}
            demographicsInfos={demographicsInfos}
            patientId={patientId}
          />
        )}
      </td>
    )
  );
};
export default RecImmunizationCell;
