import avatar from "../../../../../assets/img/avatar.png";
import {
  genderCT,
  personStatusCT,
  provinceStateTerritoryCT,
  toCodeTableName,
} from "../../../../../datas/codesTables";
import useStaffInfosContext from "../../../../../hooks/useStaffInfosContext";
import { emergencyContactCaption } from "../../../../../utils/emergencyContactCaption";
import { enrolmentCaption } from "../../../../../utils/enrolmentCaption";
import {
  getAgeTZ,
  timestampToDateISOTZ,
} from "../../../../../utils/formatDates";
import { isObjectEmpty } from "../../../../../utils/isObjectEmpty";
import { staffIdToTitleAndName } from "../../../../../utils/staffIdToTitleAndName";
import CircularProgressMedium from "../../../../All/UI/Progress/CircularProgressMedium";

const BASE_URL = "https://xsjk-1rpe-2jnw.n7c.xano.io";

const DemographicsContent = ({
  demographicsInfos,
  loadingPatient,
  errPatient,
}) => {
  const { staffInfos } = useStaffInfosContext();
  const emergencyContact = demographicsInfos.Contact?.find(
    (contact) => contact.ContactPurpose.PurposeAsEnum === "EC"
  );
  const residencialAddress = demographicsInfos.Address?.find(
    ({ _addressType }) => _addressType === "R"
  )?.Structured;
  const firstName = demographicsInfos.Names?.LegalName?.FirstName?.Part;
  const middleName = demographicsInfos.Names?.LegalName?.OtherName?.[0]?.Part;
  const lastName = demographicsInfos.Names?.LegalName?.LastName?.Part;
  const nickName =
    demographicsInfos.Names?.OtherNames?.[0]?.OtherName?.[0]?.Part;

  return !loadingPatient ? (
    errPatient ? (
      <p className="topic-content__err">{errPatient}</p>
    ) : (
      <div className="topic-content topic-content--demographics">
        {!isObjectEmpty(demographicsInfos) && !loadingPatient && (
          <>
            <div className="topic-content__infos">
              <p>
                <label>Name Prefix: </label>
                {demographicsInfos.Names?.NamePrefix || ""}
              </p>
              <p>
                <label>First Name: </label>
                {firstName || ""}
              </p>
              <p>
                <label>Middle Name: </label>
                {middleName || ""}
              </p>
              <p>
                <label>Last Name: </label>
                {lastName || ""}
              </p>
              <p>
                <label>Name Suffix: </label>
                {demographicsInfos.Names?.LastNameSuffix || ""}
              </p>
              <p>
                <label>Nick Name: </label>
                {nickName || ""}
              </p>
              <p>
                <label>Chart#: </label>
                {demographicsInfos.ChartNumber || ""}
              </p>
              <p>
                <label>Gender: </label>
                {toCodeTableName(genderCT, demographicsInfos.Gender)}
              </p>
              <p>
                <label>Date of birth: </label>
                {timestampToDateISOTZ(demographicsInfos.DateOfBirth)}
              </p>
              <p>
                <label>Age: </label>
                {getAgeTZ(demographicsInfos.DateOfBirth)}
              </p>
              <p>
                <label>Health Card#: </label>
                {demographicsInfos.HealthCard?.Number || ""}
              </p>
              <p>
                <label>Health Card Version: </label>
                {demographicsInfos.HealthCard?.Version || ""}
              </p>
              <p>
                <label>Health Card Province: </label>
                {toCodeTableName(
                  provinceStateTerritoryCT,
                  demographicsInfos.HealthCard?.ProvinceCode
                )}
              </p>
              <p>
                <label>Health Card Expiry: </label>
                {timestampToDateISOTZ(demographicsInfos.HealthCard?.ExpiryDate)}
              </p>
              <p>
                <label>SIN: </label>
                {demographicsInfos.SIN || ""}
              </p>
              <p>
                <label>Email: </label>
                {demographicsInfos.Email || ""}
              </p>
              <p>
                <label>Address: </label>
                {residencialAddress?.Line1 || ""}
              </p>
              <p>
                <label>City: </label>
                {residencialAddress?.City || ""}
              </p>
              <p>
                <label>Province/State: </label>
                {toCodeTableName(
                  provinceStateTerritoryCT,
                  residencialAddress?.CountrySubDivisionCode
                ) || ""}
              </p>
              <p>
                <label>Postal/Zip Code: </label>
                {residencialAddress?.PostalZipCode?.PostalCode ||
                  residencialAddress?.PostalZipCode?.ZipCode ||
                  ""}
              </p>

              <p>
                <label>Cell Phone: </label>
                {`${
                  demographicsInfos.PhoneNumber?.find(
                    ({ _phoneNumberType }) => _phoneNumberType === "C"
                  )?.phoneNumber || ""
                } ${
                  demographicsInfos.PhoneNumber?.find(
                    ({ _phoneNumberType }) => _phoneNumberType === "C"
                  )?.extension || ""
                }`}
              </p>
              <p>
                <label>Home Phone: </label>
                {`${
                  demographicsInfos.PhoneNumber?.find(
                    ({ _phoneNumberType }) => _phoneNumberType === "R"
                  )?.phoneNumber || ""
                } ${
                  demographicsInfos.PhoneNumber?.find(
                    ({ _phoneNumberType }) => _phoneNumberType === "R"
                  )?.extension || ""
                }`}
              </p>
              <p>
                <label>Work Phone: </label>
                {`${
                  demographicsInfos.PhoneNumber?.find(
                    ({ _phoneNumberType }) => _phoneNumberType === "W"
                  )?.phoneNumber || ""
                } ${
                  demographicsInfos.PhoneNumber?.find(
                    ({ _phoneNumberType }) => _phoneNumberType === "W"
                  )?.extension || ""
                }`}
              </p>
              <p>
                <label>Preferred Official Language: </label>
                {demographicsInfos.PreferredOfficialLanguage}
              </p>
              <p>
                <label>Assigned clinic physician: </label>
                {staffIdToTitleAndName(
                  staffInfos,
                  demographicsInfos.assigned_staff_id
                )}
              </p>
              <p>
                <label>Enrolment: </label>
                {enrolmentCaption(
                  demographicsInfos.Enrolment?.EnrolmentHistory?.sort(
                    (a, b) => a.EnrollmentDate - b.EnrollmentDate
                  ).slice(-1)[0]
                )}
              </p>
              <p>
                <label>Primary Physician: </label>
                {demographicsInfos.PrimaryPhysician?.Name?.FirstName ||
                  "" +
                    " " +
                    demographicsInfos.PrimaryPhysician?.Name?.LastName ||
                  ""}
              </p>
              <p>
                <label>Referred Physician: </label>
                {demographicsInfos.ReferredPhysician?.FirstName ||
                  "" + " " + demographicsInfos.ReferredPhysician?.LastName ||
                  ""}
              </p>
              <p>
                <label>Family Physician: </label>
                {demographicsInfos.FamilyPhysician?.FirstName ||
                  "" + " " + demographicsInfos.FamilyPhysician?.LastName ||
                  ""}
              </p>
              <p>
                <label>Emergency Contact: </label>
                {emergencyContactCaption(emergencyContact)}
              </p>
              <p>
                <label>Status: </label>
                {demographicsInfos.PersonStatusCode?.PersonStatusAsPlainText ||
                  toCodeTableName(
                    personStatusCT,
                    demographicsInfos.PersonStatusCode?.PersonStatusAsEnum
                  )}
              </p>
            </div>
            <div className="topic-content__avatar">
              {demographicsInfos.avatar ? (
                <img
                  src={`${BASE_URL}${demographicsInfos.avatar.path}`}
                  alt="user-avatar"
                />
              ) : (
                <img src={avatar} alt="user-avatar-placeholder" />
              )}
            </div>
          </>
        )}
      </div>
    )
  ) : (
    <CircularProgressMedium />
  );
};

export default DemographicsContent;
