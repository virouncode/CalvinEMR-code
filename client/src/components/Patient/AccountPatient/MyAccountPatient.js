import React from "react";
import {
  officialLanguageCT,
  personStatusCT,
  provinceStateTerritoryCT,
  toCodeTableName,
} from "../../../datas/codesTables";
import { emergencyContactCaption } from "../../../utils/emergencyContactCaption";
import { toLocalDate } from "../../../utils/formatDates";
import { getAge } from "../../../utils/getAge";
// import { onMessageUser } from "../../../utils/socketHandlers/onMessageUser";
import { useNavigate } from "react-router-dom";
import useStaffInfosContext from "../../../hooks/useStaffInfosContext";
import useUserContext from "../../../hooks/useUserContext";
import { staffIdToTitleAndName } from "../../../utils/staffIdToTitleAndName";
const BASE_URL = "https://xsjk-1rpe-2jnw.n7c.xano.io";

const MyAccountPatient = () => {
  //HOOKS
  const { user } = useUserContext();
  const { staffInfos } = useStaffInfosContext();
  const navigate = useNavigate();

  const emergencyContact = user.demographics?.Contact?.length
    ? user.demographics?.Contact?.find(
        (contact) => contact.ContactPurpose?.PurposeAsEnum === "EC"
      ) || {}
    : {};

  const handleChangeCredentials = (e) => {
    navigate("/patient/credentials");
  };

  return (
    <div className="patient-account__container">
      {user.demographics && (
        <form className="patient-account__form">
          <div className="patient-account__form-content">
            <div className="patient-account__form-content-column">
              <div className="patient-account__form-content-column-img">
                {user.demographics.avatar ? (
                  <img
                    src={`${BASE_URL}${user.demographics.avatar.path}`}
                    alt="user-avatar"
                  />
                ) : (
                  <img
                    src="https://placehold.co/300x500/png?font=roboto&text=Profile\nPic"
                    alt="user-avatar-placeholder"
                  />
                )}
              </div>
            </div>
            <div className="patient-account__form-content-column">
              <div className="patient-account__form-content-row">
                <label>Name Prefix: </label>
                {user.demographics.Names?.NamePrefix || ""}
              </div>
              <div className="patient-account__form-content-row">
                <label>First Name*: </label>
                {user.demographics.Names?.LegalName?.FirstName?.Part || ""}
              </div>
              <div className="patient-account__form-content-row">
                <label>Middle Name: </label>
                {user.demographics.Names?.LegalName?.OtherName?.[0]?.Part || ""}
              </div>
              <div className="patient-account__form-content-row">
                <label>Last Name*: </label>
                {user.demographics.Names?.LegalName?.LastName?.Part || ""}
              </div>
              <div className="patient-account__form-content-row">
                <label>Name Suffix: </label>
                {user.demographics.Names?.LastNameSuffix || ""}
              </div>
              <div className="patient-account__form-content-row">
                <label>Nick Name: </label>
                {user.demographics.Names?.OtherNames?.[0]?.OtherName?.[0]
                  ?.Part || ""}
              </div>
              <div className="patient-account__form-content-row">
                <label>Chart#*: </label>
                {user.demographics.ChartNumber || ""}
              </div>
              <div className="patient-account__form-content-row">
                <label>Date of birth*: </label>
                {toLocalDate(user.demographics.DateOfBirth)}
              </div>
              <div className="patient-account__form-content-row">
                <label>Age: </label>
                {getAge(toLocalDate(user.demographics.DateOfBirth))}
              </div>
              <div className="patient-account__form-content-row">
                <label>Health Card#: </label>
                {user.demographics.HealthCard?.Number || ""}
              </div>
              <div className="patient-account__form-content-row">
                <label>Health Card Version: </label>
                {user.demographics.HealthCard?.Version || ""}
              </div>
              <div className="patient-account__form-content-row">
                <label>Health Card Expiry: </label>
                {toLocalDate(user.demographics.HealthCard?.ExpiryDate)}
              </div>
              <div className="patient-account__form-content-row">
                <label>Health Card Province: </label>
                {toCodeTableName(
                  provinceStateTerritoryCT,
                  user.demographics.HealthCard?.ProvinceCode
                )}
              </div>
              <div className="patient-account__form-content-row">
                <label>Gender*: </label>
                {user.demographics.Gender || ""}
              </div>
              <div className="patient-account__form-content-row">
                <label>SIN: </label>
                {user.demographics.SIN || ""}
              </div>
              <div className="patient-account__form-content-row">
                <label>Email*: </label>
                {user.demographics.Email || ""}
              </div>
            </div>
            <div className="patient-account__form-content-column">
              <div className="patient-account__form-content-row">
                <label>Address*: </label>
                {user.demographics.Address?.find(
                  ({ _addressType }) => _addressType === "R"
                )?.Structured?.Line1 || ""}
              </div>
              <div className="patient-account__form-content-row">
                <label>City*: </label>
                {user.demographics.Address?.find(
                  ({ _addressType }) => _addressType === "R"
                )?.Structured?.City || ""}
              </div>
              <div className="patient-account__form-content-row">
                <label>Province/State*: </label>
                {toCodeTableName(
                  provinceStateTerritoryCT,
                  user.demographics.Address?.find(
                    ({ _addressType }) => _addressType === "R"
                  )?.Structured?.CountrySubDivisionCode
                )}
              </div>
              <div className="patient-account__form-content-row patient-account__form-content-row--postal">
                <label>Postal/Zip Code*: </label>
                {user.demographics.Address?.find(
                  ({ _addressType }) => _addressType === "R"
                )?.Structured?.PostalZipCode?.PostalCode ||
                  user.demographics.Address?.find(
                    ({ _addressType }) => _addressType === "R"
                  )?.Structured?.PostalZipCode?.ZipCode ||
                  ""}
              </div>
              <div className="patient-account__form-content-row">
                <label>Cell Phone: </label>
                {
                  user.demographics.PhoneNumber?.find(
                    ({ _phoneNumberType }) => _phoneNumberType === "C"
                  )?.phoneNumber
                }
                {user.demographics.PhoneNumber?.find(
                  ({ _phoneNumberType }) => _phoneNumberType === "C"
                )?.extension && (
                  <label
                    style={{
                      marginLeft: "30px",
                      marginRight: "10px",
                      minWidth: "auto",
                    }}
                  >
                    Ext
                  </label>
                )}
                {
                  user.demographics.PhoneNumber?.find(
                    ({ _phoneNumberType }) => _phoneNumberType === "C"
                  )?.extension
                }
              </div>
              <div className="patient-account__form-content-row">
                <label>Home Phone: </label>
                {
                  user.demographics.PhoneNumber?.find(
                    ({ _phoneNumberType }) => _phoneNumberType === "R"
                  )?.phoneNumber
                }
                {user.demographics.PhoneNumber?.find(
                  ({ _phoneNumberType }) => _phoneNumberType === "R"
                )?.extension && (
                  <label
                    style={{
                      marginLeft: "30px",
                      marginRight: "10px",
                      minWidth: "auto",
                    }}
                  >
                    Ext
                  </label>
                )}
                {
                  user.demographics.PhoneNumber?.find(
                    ({ _phoneNumberType }) => _phoneNumberType === "R"
                  )?.extension
                }
              </div>
              <div className="patient-account__form-content-row">
                <label>Work Phone: </label>
                {
                  user.demographics.PhoneNumber?.find(
                    ({ _phoneNumberType }) => _phoneNumberType === "W"
                  )?.phoneNumber
                }
                {user.demographics.PhoneNumber?.find(
                  ({ _phoneNumberType }) => _phoneNumberType === "W"
                )?.extension && (
                  <label
                    style={{
                      marginLeft: "30px",
                      marginRight: "10px",
                      minWidth: "auto",
                    }}
                  >
                    Ext
                  </label>
                )}
                {
                  user.demographics.PhoneNumber?.find(
                    ({ _phoneNumberType }) => _phoneNumberType === "W"
                  )?.extension
                }
              </div>
              <div className="patient-account__form-content-row">
                <label>Preferred Official Language: </label>
                {toCodeTableName(
                  officialLanguageCT,
                  user.demographics.PreferredOfficialLanguage
                )}
              </div>
              <div className="patient-account__form-content-row">
                <label>Status: </label>
                {toCodeTableName(
                  personStatusCT,
                  user.demographics.PersonStatusCode?.PersonStatusAsEnum
                )}
              </div>
              <div className="patient-account__form-content-row">
                <label>Assigned Clinic Practitioner*: </label>
                {staffIdToTitleAndName(
                  staffInfos,
                  user.demographics.assigned_staff_id,
                  true
                )}
              </div>
              <div className="patient-account__form-content-row">
                <label>Emergency Contact: </label>
                {emergencyContactCaption(emergencyContact)}
              </div>
              <div className="patient-account__form-content-sign">
                <em>
                  If you wish to update your personal information, please ask a
                  staff member for assistance.
                </em>
              </div>
            </div>
          </div>
        </form>
      )}
      <div className="patient-account__btns">
        <button onClick={handleChangeCredentials}>Change email/password</button>
      </div>
    </div>
  );
};

export default MyAccountPatient;
