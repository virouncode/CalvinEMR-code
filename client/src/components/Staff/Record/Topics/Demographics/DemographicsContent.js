import { CircularProgress } from "@mui/material";
import avatar from "../../../../../assets/img/avatar.png";
import {
  genderCT,
  personStatusCT,
  provinceStateTerritoryCT,
  toCodeTableName,
} from "../../../../../datas/codesTables";
import useAuth from "../../../../../hooks/useAuth";
import { enrolmentCaption } from "../../../../../utils/enrolmentCaption";
import { toLocalDate } from "../../../../../utils/formatDates";
import { getAge } from "../../../../../utils/getAge";
import { staffIdToTitleAndName } from "../../../../../utils/staffIdToTitleAndName";

const BASE_URL = "https://xsjk-1rpe-2jnw.n7c.xano.io";

const DemographicsContent = ({ demographicsInfos }) => {
  const { clinic } = useAuth();
  const emergencyContact = demographicsInfos.Contact.find(
    (contact) => contact.ContactPurpose.PurposeAsEnum === "EC"
  );
  return demographicsInfos ? (
    <div className="topic-content topic-content--demographics">
      <div className="topic-content__infos">
        <p>
          <label>Name Prefix: </label>
          {demographicsInfos.Names.NamePrefix}
        </p>
        <p>
          <label>First Name: </label>
          {demographicsInfos.Names.LegalName.FirstName.Part}
        </p>
        <p>
          <label>Middle Name: </label>
          {demographicsInfos.Names.LegalName.OtherName[0].Part}
        </p>
        <p>
          <label>Last Name: </label>
          {demographicsInfos.Names.LegalName.LastName.Part}
        </p>
        <p>
          <label>Name Suffix: </label>
          {demographicsInfos.Names.LastNameSuffix}
        </p>
        <p>
          <label>Nick Name: </label>
          {demographicsInfos.Names.OtherNames[0].OtherName[0].Part}
        </p>
        <p>
          <label>Chart#: </label>
          {demographicsInfos.ChartNumber}
        </p>
        <p>
          <label>Gender: </label>
          {toCodeTableName(genderCT, demographicsInfos.Gender)}
        </p>
        <p>
          <label>Date of birth: </label>
          {toLocalDate(demographicsInfos.DateOfBirth)}
        </p>
        <p>
          <label>Age: </label>
          {getAge(demographicsInfos.DateOfBirth)}
        </p>
        <p>
          <label>Health Card#: </label>
          {demographicsInfos.HealthCard.Number}
        </p>
        <p>
          <label>Health Card Version: </label>
          {demographicsInfos.HealthCard.Version}
        </p>
        <p>
          <label>Health Card Province: </label>
          {toCodeTableName(
            provinceStateTerritoryCT,
            demographicsInfos.HealthCard.ProvinceCode
          )}
        </p>
        <p>
          <label>Health Card Expiry: </label>
          {toLocalDate(demographicsInfos.HealthCard.ExpiryDate)}
        </p>
        <p>
          <label>SIN: </label>
          {demographicsInfos.SIN}
        </p>
        <p>
          <label>Email: </label>
          {demographicsInfos.Email}
        </p>
        <p>
          <label>Cell Phone: </label>
          {`${
            demographicsInfos.PhoneNumber.find(
              ({ _phoneNumberType }) => _phoneNumberType === "C"
            )?.phoneNumber
          } ${
            demographicsInfos.PhoneNumber.find(
              ({ _phoneNumberType }) => _phoneNumberType === "C"
            )?.extension
          }`}
        </p>
        <p>
          <label>Home Phone: </label>
          {`${
            demographicsInfos.PhoneNumber.find(
              ({ _phoneNumberType }) => _phoneNumberType === "R"
            )?.phoneNumber
          } ${
            demographicsInfos.PhoneNumber.find(
              ({ _phoneNumberType }) => _phoneNumberType === "R"
            )?.extension
          }`}
        </p>
        <p>
          <label>Work Phone: </label>
          {`${
            demographicsInfos.PhoneNumber.find(
              ({ _phoneNumberType }) => _phoneNumberType === "W"
            )?.phoneNumber
          } ${
            demographicsInfos.PhoneNumber.find(
              ({ _phoneNumberType }) => _phoneNumberType === "W"
            )?.extension
          }`}
        </p>
        <p>
          <label>Address: </label>
          {
            demographicsInfos.Address.find(
              ({ _addressType }) => _addressType === "R"
            ).Structured.Line1
          }
        </p>
        <p>
          <label>Postal/Zip Code: </label>
          {demographicsInfos.Address.find(
            ({ _addressType }) => _addressType === "R"
          ).Structured.PostalZipCode.PostalCode ||
            demographicsInfos.Address.find(
              ({ _addressType }) => _addressType === "R"
            ).Structured.PostalZipCode.ZipCode}
        </p>
        <p>
          <label>Province/State: </label>
          {toCodeTableName(
            provinceStateTerritoryCT,
            demographicsInfos.Address.find(
              ({ _addressType }) => _addressType === "R"
            ).Structured.CountrySubDivisionCode
          )}
        </p>
        <p>
          <label>City: </label>
          {
            demographicsInfos.Address.find(
              ({ _addressType }) => _addressType === "R"
            ).Structured.City
          }
        </p>
        <p>
          <label>Preferred Official Language: </label>
          {demographicsInfos.PreferredOfficialLanguage}
        </p>
        <p>
          <label>Assigned clinic physician: </label>
          {staffIdToTitleAndName(
            clinic.staffInfos,
            demographicsInfos.assigned_staff_id,
            true
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
          {demographicsInfos.PrimaryPhysician.Name.FirstName +
            " " +
            demographicsInfos.PrimaryPhysician.Name.LastName}
        </p>
        <p>
          <label>Referred Physician: </label>
          {demographicsInfos.ReferredPhysician.FirstName +
            " " +
            demographicsInfos.ReferredPhysician.LastName}
        </p>
        <p>
          <label>Family Physician: </label>
          {demographicsInfos.FamilyPhysician.FirstName +
            " " +
            demographicsInfos.FamilyPhysician.LastName}
        </p>
        <p>
          <label>Emergency Contact: </label>
          {emergencyContact?.Name?.FirstName}{" "}
          {emergencyContact?.Name?.MiddleName}{" "}
          {emergencyContact?.Name?.LastName}
          {emergencyContact?.EmailAddress
            ? `${emergencyContact?.EmailAddress}, `
            : ""}
          {emergencyContact?.PhoneNumber.length !== 0
            ? emergencyContact?.PhoneNumber?.map(
                ({ phoneNumber }) => phoneNumber
              ).join(", ")
            : ""}
        </p>
        <p>
          <label>Status: </label>
          {demographicsInfos.PersonStatusCode.PersonStatusAsPlainText ||
            toCodeTableName(
              personStatusCT,
              demographicsInfos.PersonStatusCode.PersonStatusAsEnum
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
    </div>
  ) : (
    <CircularProgress size="1rem" style={{ margin: "5px" }} />
  );
};

export default DemographicsContent;
