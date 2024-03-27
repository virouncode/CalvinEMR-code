import { Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { putPatientRecord } from "../../../../api/fetchRecords";
import xanoPost from "../../../../api/xanoCRUD/xanoPost";
import useSocketContext from "../../../../hooks/context/useSocketContext";
import useStaffInfosContext from "../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import {
  enrollmentStatusCT,
  genderCT,
  namePrefixCT,
  nameSuffixCT,
  officialLanguageCT,
  personStatusCT,
  provinceStateTerritoryCT,
  terminationReasonCT,
  toCodeTableName,
} from "../../../../omdDatas/codesTables";
import {
  dateISOToTimestampTZ,
  getAgeTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
  timestampToDateTimeSecondsStrTZ,
} from "../../../../utils/dates/formatDates";
import { getLastUpdate, isUpdated } from "../../../../utils/dates/updates";
import { isObjectEmpty } from "../../../../utils/js/isObjectEmpty";
import { emergencyContactCaption } from "../../../../utils/names/emergencyContactCaption";
import { enrolmentCaption } from "../../../../utils/names/enrolmentCaption";
import { primaryPhysicianCaption } from "../../../../utils/names/primaryPhysicianCaption";
import { staffIdToTitleAndName } from "../../../../utils/names/staffIdToTitleAndName";
import { toPatientName } from "../../../../utils/names/toPatientName";
import { firstLetterUpper } from "../../../../utils/strings/firstLetterUpper";
import { demographicsSchema } from "../../../../validation/record/demographicsValidation";
import ConfirmGlobal, {
  confirmAlert,
} from "../../../All/Confirm/ConfirmGlobal";
import GenericList from "../../../UI/Lists/GenericList";
import StaffList from "../../../UI/Lists/StaffList";
import LoadingParagraph from "../../../UI/Paragraphs/LoadingParagraph";
import CircularProgressMedium from "../../../UI/Progress/CircularProgressMedium";
import ToastCalvin from "../../../UI/Toast/ToastCalvin";
import FakeWindow from "../../../UI/Windows/FakeWindow";
import EnrolmentHistory from "../Topics/Demographics/EnrolmentHistory";
import NewEnrolmentForm from "../Topics/Demographics/NewEnrolmentForm";

const BASE_URL = "https://xsjk-1rpe-2jnw.n7c.xano.io";

const DemographicsPU = ({
  demographicsInfos,
  setPopUpVisible,
  loadingPatient,
  errPatient,
}) => {
  //============================= STATES ==============================//
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const { staffInfos } = useStaffInfosContext();
  const [editVisible, setEditVisible] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");
  const [progress, setProgress] = useState(false);
  const residencialAddress = demographicsInfos.Address?.find(
    ({ _addressType }) => _addressType === "R"
  )?.Structured;
  const lastEnrolment = isObjectEmpty(
    demographicsInfos.Enrolment?.EnrolmentHistory?.sort(
      (a, b) => a.EnrollmentDate - b.EnrollmentDate
    ).slice(-1)[0]
  )
    ? {}
    : demographicsInfos.Enrolment?.EnrolmentHistory?.sort(
        (a, b) => a.EnrollmentDate - b.EnrollmentDate
      ).slice(-1)[0];
  const emergencyContact = demographicsInfos.Contact?.find(
    (contact) => contact.ContactPurpose?.PurposeAsEnum === "EC"
  );
  const [formDatas, setFormDatas] = useState({});
  const [loadingFile, setLoadingFile] = useState(false);
  const [postalOrZip, setPostalOrZip] = useState(
    residencialAddress?.PostalZipCode?.PostalCode ? "postal" : "zip"
  );
  const [newEnrolmentVisible, setNewEnrolmentVisible] = useState(false);
  const [enrolmentHistoryVisible, setEnrolmentHistoryVisible] = useState(false);

  useEffect(() => {
    setFormDatas({
      prefix: demographicsInfos.Names?.NamePrefix || "",
      firstName: demographicsInfos.Names?.LegalName?.FirstName?.Part || "",
      middleName:
        demographicsInfos.Names?.LegalName?.OtherName?.[0]?.Part || "",
      lastName: demographicsInfos.Names?.LegalName?.LastName?.Part || "",
      suffix: demographicsInfos.Names?.LastNameSuffix || "",
      nickName:
        demographicsInfos.Names?.OtherNames?.[0]?.OtherName?.[0]?.Part || "",
      chart: demographicsInfos.ChartNumber || "",
      dob: timestampToDateISOTZ(demographicsInfos.DateOfBirth),
      age: getAgeTZ(demographicsInfos.DateOfBirth),
      healthNbr: demographicsInfos.HealthCard?.Number || "",
      healthVersion: demographicsInfos.HealthCard?.Version || "",
      healthExpiry: timestampToDateISOTZ(
        demographicsInfos.HealthCard?.ExpiryDate,
        "America/Toronto"
      ),
      healthProvince: demographicsInfos.HealthCard?.ProvinceCode || "",
      gender: demographicsInfos.Gender || "",
      sin: demographicsInfos.SIN || "",
      email: demographicsInfos.Email || "",
      cellphone:
        demographicsInfos.PhoneNumber?.find(
          ({ _phoneNumberType }) => _phoneNumberType === "C"
        )?.phoneNumber || "",
      cellphoneExt:
        demographicsInfos.PhoneNumber?.find(
          ({ _phoneNumberType }) => _phoneNumberType === "C"
        )?.extension || "",
      homephone:
        demographicsInfos.PhoneNumber?.find(
          ({ _phoneNumberType }) => _phoneNumberType === "R"
        )?.phoneNumber || "",
      homephoneExt:
        demographicsInfos.PhoneNumber?.find(
          ({ _phoneNumberType }) => _phoneNumberType === "R"
        )?.extension || "",
      workphone:
        demographicsInfos.PhoneNumber?.find(
          ({ _phoneNumberType }) => _phoneNumberType === "W"
        )?.phoneNumber || "",
      workphoneExt:
        demographicsInfos.PhoneNumber?.find(
          ({ _phoneNumberType }) => _phoneNumberType === "W"
        )?.extension || "",
      line1: residencialAddress?.Line1 || "",
      province: residencialAddress?.CountrySubDivisionCode || "",
      postalCode: residencialAddress?.PostalZipCode?.PostalCode || "",
      zipCode: residencialAddress?.PostalZipCode?.ZipCode || "",
      city: residencialAddress?.City || "",
      preferredOff: demographicsInfos.PreferredOfficialLanguage || "",
      status:
        demographicsInfos.PersonStatusCode?.PersonStatusAsEnum ||
        demographicsInfos.PersonStatusCode?.PersonStatusAsPlainText ||
        "",
      assignedMd: demographicsInfos.assigned_staff_id,
      enrolled: "", // A GERER
      pPhysicianFirstName:
        demographicsInfos.PrimaryPhysician?.Name?.FirstName || "",
      pPhysicianLastName:
        demographicsInfos.PrimaryPhysician?.Name?.LastName || "",
      pPhysicianOHIP: demographicsInfos.PrimaryPhysician?.OHIPPhysicianId || "",
      pPhysicianCPSO:
        demographicsInfos.PrimaryPhysician?.PrimaryPhysicianCPSO || "",
      rPhysicianFirstName: demographicsInfos.ReferredPhysician?.FirstName || "",
      rPhysicianLastName: demographicsInfos.ReferredPhysician?.LastName || "",
      fPhysicianFirstName: demographicsInfos.FamilyPhysician?.FirstName || "",
      fPhysicianLastName: demographicsInfos.FamilyPhysician?.LastName || "",
      emergencyFirstName: emergencyContact?.Name?.FirstName || "",
      emergencyMiddleName: emergencyContact?.Name?.MiddleName || "",
      emergencyLastName: emergencyContact?.Name?.LastName || "",
      emergencyEmail: emergencyContact?.EmailAddress || "",
      emergencyPhone:
        emergencyContact?.PhoneNumber?.find(
          ({ _phoneNumberType }) => _phoneNumberType === "C"
        )?.phoneNumber || "",
      avatar: demographicsInfos.avatar || null,
    });
  }, [demographicsInfos]);

  const handleChangePostalOrZip = (e) => {
    setErrMsgPost("");
    setPostalOrZip(e.target.value);
    setFormDatas({
      ...formDatas,
      postalCode: "",
      zipCode: "",
    });
  };
  const handleClickNewEnrolment = (e) => {
    setNewEnrolmentVisible(true);
  };
  const handleClickHistory = (e) => {
    setEnrolmentHistoryVisible(true);
  };
  const handleChange = (e) => {
    setErrMsgPost("");
    let value = e.target.value;
    const name = e.target.name;
    if (name === "postalCode") {
      postalOrZip === "postal"
        ? setFormDatas({ ...formDatas, postalCode: value })
        : setFormDatas({ ...formDatas, zipCode: value });
      return;
    }
    setFormDatas({ ...formDatas, [name]: value });
  };
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 20000000) {
      toast.error("File size exceeds 20Mbs, please choose another file", {
        containerId: "B",
      });
      return;
    }
    setLoadingFile(true);
    // setting up the reader
    let reader = new FileReader();
    reader.readAsDataURL(file);
    // here we tell the reader what to do when it's done reading...
    reader.onload = async (e) => {
      let content = e.target.result; // this is the content!
      try {
        let fileToUpload = await xanoPost(
          "/upload/attachment",
          "staff",

          { content }
        );
        setFormDatas({ ...formDatas, avatar: fileToUpload.data });
        setLoadingFile(false);
      } catch (err) {
        toast.error(`Error: unable to load file: ${err.message}`, {
          containerId: "B",
        });
        setLoadingFile(false);
      }
    };
  };
  const handleClose = async (e) => {
    if (!editVisible) {
      setPopUpVisible(false);
    } else if (
      editVisible &&
      (await confirmAlert({
        content:
          "Do you really want to close the window ? Your changes will be lost",
      }))
    ) {
      setPopUpVisible(false);
    }
  };
  const handleCancel = (e) => {
    setErrMsgPost("");
    setFormDatas({
      prefix: demographicsInfos.Names?.NamePrefix || "",
      firstName: demographicsInfos.Names?.LegalName?.FirstName?.Part || "",
      middleName:
        demographicsInfos.Names?.LegalName?.OtherName?.[0]?.Part || "",
      lastName: demographicsInfos.Names?.LegalName?.LastName?.Part || "",
      suffix: demographicsInfos.Names?.LastNameSuffix || "",
      nickName:
        demographicsInfos.Names?.OtherNames?.[0]?.OtherName?.[0]?.Part || "",
      chart: demographicsInfos.ChartNumber || "",
      dob: timestampToDateISOTZ(demographicsInfos.DateOfBirth),
      age: getAgeTZ(demographicsInfos.DateOfBirth),
      healthNbr: demographicsInfos.HealthCard?.Number || "",
      healthVersion: demographicsInfos.HealthCard?.Version || "",
      healthExpiry: timestampToDateISOTZ(
        demographicsInfos.HealthCard?.ExpiryDate,
        "America/Toronto"
      ),
      healthProvince: demographicsInfos.HealthCard?.ProvinceCode || "",
      gender: demographicsInfos.Gender || "",
      sin: demographicsInfos.SIN || "",
      email: demographicsInfos.Email || "",
      cellphone:
        demographicsInfos.PhoneNumber?.find(
          ({ _phoneNumberType }) => _phoneNumberType === "C"
        )?.phoneNumber || "",
      cellphoneExt:
        demographicsInfos.PhoneNumber?.find(
          ({ _phoneNumberType }) => _phoneNumberType === "C"
        )?.extension || "",
      homephone:
        demographicsInfos.PhoneNumber?.find(
          ({ _phoneNumberType }) => _phoneNumberType === "R"
        )?.phoneNumber || "",
      homephoneExt:
        demographicsInfos.PhoneNumber?.find(
          ({ _phoneNumberType }) => _phoneNumberType === "R"
        )?.extension || "",
      workphone:
        demographicsInfos.PhoneNumber?.find(
          ({ _phoneNumberType }) => _phoneNumberType === "W"
        )?.phoneNumber || "",
      workphoneExt:
        demographicsInfos.PhoneNumber?.find(
          ({ _phoneNumberType }) => _phoneNumberType === "W"
        )?.extension || "",
      line1: residencialAddress?.Line1 || "",
      province: residencialAddress?.CountrySubDivisionCode || "",
      postalCode: residencialAddress?.PostalZipCode.PostalCode || "",
      zipCode: residencialAddress?.PostalZipCode.ZipCode || "",
      city: residencialAddress?.City || "",
      preferredOff: demographicsInfos.PreferredOfficialLanguage || "",
      status:
        demographicsInfos.PersonStatusCode?.PersonStatusAsEnum ||
        demographicsInfos.PersonStatusCode?.PersonStatusAsPlainText ||
        "",
      assignedMd: demographicsInfos.assigned_staff_id,
      enrolled: "", // A GERER
      pPhysicianFirstName:
        demographicsInfos.PrimaryPhysician?.Name?.FirstName || "",
      pPhysicianLastName:
        demographicsInfos.PrimaryPhysician?.Name?.LastName || "",
      pPhysicianOHIP: demographicsInfos.PrimaryPhysician?.OHIPPhysicianId || "",
      pPhysicianCPSO:
        demographicsInfos.PrimaryPhysician?.PrimaryPhysicianCPSO || "",
      rPhysicianFirstName: demographicsInfos.ReferredPhysician?.FirstName || "",
      rPhysicianLastName: demographicsInfos.ReferredPhysician?.LastName || "",
      fPhysicianFirstName: demographicsInfos.FamilyPhysician?.FirstName || "",
      fPhysicianLastName: demographicsInfos.FamilyPhysician?.LastName || "",
      emergencyFirstName: emergencyContact?.Name?.FirstName || "",
      emergencyMiddleName: emergencyContact?.Name?.MiddleName || "",
      emergencyLastName: emergencyContact?.Name?.LastName || "",
      emergencyEmail: emergencyContact?.EmailAddress || "",
      emergencyPhone:
        emergencyContact?.PhoneNumber?.find(
          ({ _phoneNumberType }) => _phoneNumberType === "C"
        )?.phoneNumber || "",
      avatar: demographicsInfos.avatar || null,
    });
    setEditVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validation
    try {
      await demographicsSchema.validate(formDatas);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    //Formatting
    setFormDatas({
      ...formDatas,
      firstName: firstLetterUpper(formDatas.firstName),
      lastName: firstLetterUpper(formDatas.lastName),
      middleName: firstLetterUpper(formDatas.middleName),
      nickName: firstLetterUpper(formDatas.nickName),
      line1: firstLetterUpper(formDatas.line1),
      city: firstLetterUpper(formDatas.city),
      emergencyFirstName: firstLetterUpper(formDatas.emergencyFirstName),
      emergencyMiddleName: firstLetterUpper(formDatas.emergencyMiddleName),
      emergencyLastName: firstLetterUpper(formDatas.emergencyLastName),
      emergencyEmail: formDatas.emergencyEmail.toLowerCase(),
      pPhysicianFirstName: firstLetterUpper(formDatas.pPhysicianFirstName),
      pPhysicianLastName: firstLetterUpper(formDatas.pPhysicianLastName),
      rPhysicianFirstName: firstLetterUpper(formDatas.rPhysicianFirstName),
      rPhysicianLastName: firstLetterUpper(formDatas.rPhysicianLastName),
      fPhysicianFirstName: firstLetterUpper(formDatas.fPhysicianFirstName),
      fPhysicianLastName: firstLetterUpper(formDatas.fPhysicianLastName),
    });
    const datasToPut = {
      ...demographicsInfos,
      avatar: formDatas.avatar,
      assigned_staff_id: parseInt(formDatas.assignedMd),
      Names: {
        NamePrefix: formDatas.prefix,
        LegalName: {
          ...demographicsInfos.Names?.LegalName,
          FirstName: {
            ...demographicsInfos.Names?.LegalName?.FirstName,
            Part: firstLetterUpper(formDatas.firstName),
          },
          LastName: {
            ...demographicsInfos.Names?.LegalName?.LastName,
            Part: firstLetterUpper(formDatas.lastName),
          },
          OtherName: [
            {
              ...demographicsInfos.Names?.LegalName?.OtherName?.[0],
              Part: firstLetterUpper(formDatas.middleName),
            },
          ],
        },
        OtherNames: [
          {
            ...demographicsInfos.Names?.OtherNames?.[0],
            OtherName: [
              {
                ...demographicsInfos.Names?.OtherNames?.[0]?.OtherName?.[0],
                Part: firstLetterUpper(formDatas.nickName),
              },
            ],
          },
        ],
        LastNameSuffix: formDatas.suffix,
      },
      DateOfBirth: dateISOToTimestampTZ(formDatas.dob),
      HealthCard: {
        Number: formDatas.healthNbr,
        Version: formDatas.healthVersion,
        ExpiryDate: dateISOToTimestampTZ(formDatas.healthExpiry),
        ProvinceCode: formDatas.healthProvince,
      },
      ChartNumber: formDatas.chart,
      Gender: formDatas.gender,
      Address: demographicsInfos.Address?.map((address) => {
        return address._addressType !== "R"
          ? address
          : {
              ...residencialAddress,
              Structured: {
                ...residencialAddress?.Structured,
                Line1: firstLetterUpper(formDatas.line1),
                City: firstLetterUpper(formDatas.city),
                CountrySubDivisionCode: formDatas.province,
                PostalZipCode: {
                  PostalCode: formDatas.postalCode,
                  ZipCode: formDatas.zipCode,
                },
              },
              _addressType: "R",
            };
      }),
      PhoneNumber: [
        {
          extension: formDatas.cellphoneExt,
          phoneNumber: formDatas.cellphone,
          _phoneNumberType: "C",
        },
        {
          extension: formDatas.homephoneExt,
          phoneNumber: formDatas.homephone,
          _phoneNumberType: "R",
        },
        {
          extension: formDatas.workphoneExt,
          phoneNumber: formDatas.workphone,
          _phoneNumberType: "W",
        },
      ],
      PreferredOfficialLanguage: formDatas.preferredOff,
      Contact: demographicsInfos.Contact?.map((contact) => {
        return contact.ContactPurpose?.PurposeAsEnum !== "EC"
          ? contact
          : {
              ContactPurpose: {
                ...contact?.ContactPurpose,
                PurposeAsEnum: "EC",
              },
              Name: {
                FirstName: firstLetterUpper(formDatas.emergencyFirstName),
                MiddleName: firstLetterUpper(formDatas.emergencyMiddleName),
                LastName: firstLetterUpper(formDatas.emergencyLastName),
              },
              EmailAddress: formDatas.emergencyEmail.toLowerCase(),
              PhoneNumber: [
                {
                  ...contact?.PhoneNumber?.[0],
                  phoneNumber: formDatas.emergencyPhone,
                },
              ],
              PrimaryPhysician: {
                Name: {
                  FirstName: firstLetterUpper(formDatas.pPhysicianFirstName),
                  LastName: firstLetterUpper(formDatas.pPhysicianLastName),
                },
                OHIPPhysicianId: formDatas.pPhysicianOHIP,
                PrimaryPhysicianCPSO: formDatas.pPhysicianCPSO,
              },
              Email: formDatas.email,
              PersonStatusCode: {
                ...demographicsInfos.PersonStatusCode,
                PersonStatusAsEnum: formDatas.status,
              },
              SIN: formDatas.sin,
              ReferredPhysician: {
                FirstName: firstLetterUpper(formDatas.rPhysicianFirstName),
                LastName: firstLetterUpper(formDatas.rPhysicianLastName),
              },
              FamilyPhysician: {
                FirstName: firstLetterUpper(formDatas.fPhysicianFirstName),
                LastName: firstLetterUpper(formDatas.fPhysicianLastName),
              },
              PreferredPharmacy: demographicsInfos.PreferredPharmacy,
            };
      }),
    };
    //Submission
    try {
      setProgress(true);
      await putPatientRecord(
        `/demographics/${demographicsInfos.id}`,
        user.id,
        datasToPut,
        socket,
        "DEMOGRAPHICS"
      );
      setEditVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
      setProgress(false);
    } catch (err) {
      toast.error(
        `Error: unable to update patient demographics : ${err.message}`,
        {
          containerId: "B",
        }
      );
      setProgress(false);
    }
  };

  return (
    <>
      <div
        className="demographics-card"
        style={{ border: errMsgPost && "solid 1px red" }}
      >
        <div className="demographics-card__header">
          <h1>
            Patient demographics <i className="fa-regular fa-id-card"></i>
          </h1>
          <div className="demographics-card__btns">
            {!editVisible ? (
              <>
                <button
                  onClick={(e) => setEditVisible((v) => !v)}
                  disabled={progress}
                >
                  Edit
                </button>
                <button onClick={handleClose} disabled={progress}>
                  Close
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  disabled={loadingFile || progress}
                  onClick={handleSubmit}
                >
                  Save
                </button>
                <button
                  type="button"
                  disabled={loadingFile || progress}
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
        {errPatient && <p className="demographics-card__err">{errPatient}</p>}
        {loadingPatient && <LoadingParagraph />}
        {!loadingPatient && !errPatient && (
          <form className="demographics-card__form">
            <div className="demographics-card__content">
              {errMsgPost && editVisible && (
                <p className="demographics-card__err">{errMsgPost}</p>
              )}
              <p>
                <label>Name Prefix: </label>
                {editVisible ? (
                  <GenericList
                    name="prefix"
                    list={namePrefixCT}
                    value={formDatas.prefix}
                    handleChange={handleChange}
                    placeHolder="Choose a name prefix..."
                  />
                ) : (
                  formDatas.prefix
                )}
              </p>
              <p>
                <label>First Name*: </label>
                {editVisible ? (
                  <input
                    type="text"
                    required
                    value={formDatas.firstName}
                    onChange={handleChange}
                    name="firstName"
                    autoComplete="off"
                  />
                ) : (
                  formDatas.firstName
                )}
              </p>
              <p>
                <label>Middle Name: </label>
                {editVisible ? (
                  <input
                    type="text"
                    value={formDatas.middleName}
                    onChange={handleChange}
                    name="middleName"
                    autoComplete="off"
                  />
                ) : (
                  formDatas.middleName
                )}
              </p>
              <p>
                <label>Last Name*: </label>
                {editVisible ? (
                  <input
                    type="text"
                    required
                    value={formDatas.lastName}
                    onChange={handleChange}
                    name="lastName"
                    autoComplete="off"
                  />
                ) : (
                  formDatas.lastName
                )}
              </p>
              <p>
                <label>Name Suffix: </label>
                {editVisible ? (
                  <GenericList
                    name="suffix"
                    list={nameSuffixCT}
                    value={formDatas.suffix}
                    handleChange={handleChange}
                    placeHolder="Choose a name suffix..."
                  />
                ) : (
                  formDatas.suffix
                )}
              </p>
              <p>
                <label>Nick Name: </label>
                {editVisible ? (
                  <input
                    type="text"
                    value={formDatas.nickName}
                    onChange={handleChange}
                    name="nickName"
                    autoComplete="off"
                  />
                ) : (
                  formDatas.nickName
                )}
              </p>
              <p>
                <label>Chart#*: </label>
                {formDatas.chart}
              </p>
              <p>
                <label>Date of birth*: </label>
                {editVisible ? (
                  <input
                    type="date"
                    required
                    value={formDatas.dob}
                    onChange={handleChange}
                    name="dob"
                    max={timestampToDateISOTZ(nowTZTimestamp())}
                  />
                ) : (
                  formDatas.dob
                )}
              </p>
              <p>
                <label>Age: </label>
                {getAgeTZ(dateISOToTimestampTZ(formDatas.dob))}
              </p>
              <p>
                <label>Health Card#</label>
                {editVisible ? (
                  <input
                    type="text"
                    value={formDatas.healthNbr}
                    onChange={handleChange}
                    name="healthNbr"
                    autoComplete="off"
                  />
                ) : (
                  formDatas.healthNbr
                )}
              </p>
              <p>
                <label>Health Card Version</label>
                {editVisible ? (
                  <input
                    type="text"
                    value={formDatas.healthVersion}
                    onChange={handleChange}
                    name="healthVersion"
                    autoComplete="off"
                  />
                ) : (
                  formDatas.healthVersion
                )}
              </p>
              <p>
                <label>Health Card Expiry: </label>
                {editVisible ? (
                  <input
                    type="date"
                    value={formDatas.healthExpiry}
                    onChange={handleChange}
                    name="healthExpiry"
                  />
                ) : (
                  formDatas.healthExpiry
                )}
              </p>
              <p>
                <label>Health Card Province</label>
                {editVisible ? (
                  <GenericList
                    list={provinceStateTerritoryCT}
                    value={formDatas.healthProvince}
                    name="healthProvince"
                    handleChange={handleChange}
                    noneOption={false}
                  />
                ) : (
                  toCodeTableName(
                    provinceStateTerritoryCT,
                    formDatas.healthProvince
                  )
                )}
              </p>
              <p>
                <label>Gender: </label>
                {editVisible ? (
                  <GenericList
                    list={genderCT}
                    value={formDatas.gender}
                    name="gender"
                    handleChange={handleChange}
                    noneOption={false}
                  />
                ) : (
                  toCodeTableName(genderCT, formDatas.gender)
                )}
              </p>
              <p>
                <label>SIN: </label>
                {editVisible ? (
                  <input
                    type="text"
                    value={formDatas.sin}
                    onChange={handleChange}
                    name="sin"
                    autoComplete="off"
                  />
                ) : (
                  formDatas.sin
                )}
              </p>
              <p>
                <label>Email: </label>
                {formDatas.email}
              </p>
              <p>
                <label>Address*: </label>
                {editVisible ? (
                  <input
                    type="text"
                    value={formDatas.line1}
                    onChange={handleChange}
                    name="line1"
                    autoComplete="off"
                  />
                ) : (
                  formDatas.line1
                )}
              </p>
              <p>
                <label>City: </label>
                {editVisible ? (
                  <input
                    type="text"
                    value={formDatas.city}
                    onChange={handleChange}
                    name="city"
                    autoComplete="off"
                  />
                ) : (
                  formDatas.city
                )}
              </p>
              <p>
                <label>Province/State*: </label>
                {editVisible ? (
                  <GenericList
                    list={provinceStateTerritoryCT}
                    value={formDatas.province}
                    name="province"
                    handleChange={handleChange}
                  />
                ) : (
                  toCodeTableName(provinceStateTerritoryCT, formDatas.province)
                )}
              </p>
              <p>
                <label>Postal/Zip Code*: </label>
                {editVisible ? (
                  <>
                    <select
                      style={{ width: "60px", marginRight: "10px" }}
                      name="postalOrZip"
                      id="postalOrZip"
                      value={postalOrZip}
                      onChange={handleChangePostalOrZip}
                    >
                      <option value="postal">Postal</option>
                      <option value="zip">Zip</option>
                    </select>
                    <input
                      style={{ width: "90px", marginRight: "10px" }}
                      type="text"
                      value={
                        postalOrZip === "postal"
                          ? formDatas.postalCode
                          : formDatas.zipCode
                      }
                      onChange={handleChange}
                      name="postalCode"
                      autoComplete="off"
                    />
                  </>
                ) : postalOrZip === "postal" ? (
                  formDatas.postalCode
                ) : (
                  formDatas.zipCode
                )}
              </p>
              <p>
                <label>Cell Phone: </label>
                {editVisible ? (
                  <input
                    type="tel"
                    value={formDatas.cellphone}
                    onChange={handleChange}
                    name="cellphone"
                    autoComplete="off"
                  />
                ) : (
                  formDatas.cellphone
                )}
                {editVisible ? (
                  <>
                    <label
                      style={{
                        marginLeft: "30px",
                        marginRight: "10px",
                        minWidth: "auto",
                      }}
                    >
                      Ext
                    </label>
                    <input
                      style={{ width: "15%" }}
                      type="text"
                      value={formDatas.cellphoneExt}
                      onChange={handleChange}
                      name="cellphoneExt"
                      autoComplete="off"
                    />
                  </>
                ) : (
                  <>
                    {formDatas.cellphoneExt && (
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
                    {formDatas.cellphoneExt}
                  </>
                )}
              </p>
              <p>
                <label>Home Phone: </label>
                {editVisible ? (
                  <input
                    type="tel"
                    value={formDatas.homephone}
                    onChange={handleChange}
                    name="homephone"
                    autoComplete="off"
                  />
                ) : (
                  formDatas.homephone
                )}
                {editVisible ? (
                  <>
                    <label
                      style={{
                        marginLeft: "30px",
                        marginRight: "10px",
                        minWidth: "auto",
                      }}
                    >
                      Ext
                    </label>
                    <input
                      style={{ width: "15%" }}
                      type="text"
                      value={formDatas.homephoneExt}
                      onChange={handleChange}
                      name="homephoneExt"
                      autoComplete="off"
                    />
                  </>
                ) : (
                  <>
                    {formDatas.homephoneExt && (
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
                    {formDatas.homephoneExt}
                  </>
                )}
              </p>
              <p>
                <label>Work Phone: </label>
                {editVisible ? (
                  <input
                    type="tel"
                    value={formDatas.workphone}
                    onChange={handleChange}
                    name="workphone"
                    autoComplete="off"
                  />
                ) : (
                  formDatas.workphone
                )}
                {editVisible ? (
                  <>
                    <label
                      style={{
                        marginLeft: "30px",
                        marginRight: "10px",
                        minWidth: "auto",
                      }}
                    >
                      Ext
                    </label>
                    <input
                      style={{ width: "15%" }}
                      type="text"
                      value={formDatas.workphoneExt}
                      onChange={handleChange}
                      name="workphoneExt"
                      autoComplete="off"
                    />
                  </>
                ) : (
                  <>
                    {formDatas.workphoneExt && (
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
                    {formDatas.workphoneExt}
                  </>
                )}
              </p>
              <p>
                <label>Preferred Official Language: </label>
                {editVisible ? (
                  <GenericList
                    list={officialLanguageCT}
                    value={formDatas.preferredOff}
                    name="preferredOff"
                    handleChange={handleChange}
                    noneOption={false}
                  />
                ) : (
                  toCodeTableName(officialLanguageCT, formDatas.preferredOff)
                )}
              </p>
              <p>
                <label>Status: </label>
                {editVisible ? (
                  <GenericList
                    name="status"
                    list={personStatusCT}
                    value={formDatas.status}
                    handleChange={handleChange}
                    placeHolder="Choose a status..."
                    noneOption={false}
                  />
                ) : (
                  toCodeTableName(personStatusCT, formDatas.status)
                )}
              </p>
              <p>
                <label>Assigned Clinic Physician: </label>
                {editVisible ? (
                  <StaffList
                    value={formDatas.assignedMd}
                    name="assignedMd"
                    handleChange={handleChange}
                  />
                ) : (
                  staffIdToTitleAndName(staffInfos, formDatas.assignedMd)
                )}
              </p>
              <p>
                <label>Enrolled to physician: </label>
                {enrolmentCaption(lastEnrolment)}
                {"  "}
                <Tooltip title="Add new enrolment" placement="top-start" arrow>
                  <i
                    className="fa-regular fa-square-plus"
                    onClick={handleClickNewEnrolment}
                    style={{ marginLeft: "5px", cursor: "pointer" }}
                  ></i>
                </Tooltip>
                <Tooltip
                  title="See enrolment history"
                  placement="top-start"
                  arrow
                >
                  <i
                    className="fa-solid fa-clock-rotate-left"
                    onClick={handleClickHistory}
                    style={{ marginLeft: "5px", cursor: "pointer" }}
                  ></i>
                </Tooltip>
              </p>
              <p>
                <label>Enrollment status: </label>
                {toCodeTableName(
                  enrollmentStatusCT,
                  lastEnrolment?.EnrollmentStatus
                )}
              </p>
              <p>
                <label>Enrollment date: </label>
                {timestampToDateISOTZ(lastEnrolment?.EnrollmentDate)}
              </p>
              <p>
                <label>Enrollment termination date: </label>
                {timestampToDateISOTZ(lastEnrolment?.EnrollmentTerminationDate)}
              </p>
              <p>
                <label>Termination reason: </label>
                {toCodeTableName(
                  terminationReasonCT,
                  lastEnrolment?.TerminationReason
                )}
              </p>
              {editVisible ? (
                <fieldset>
                  <legend>Primary Physician</legend>
                  <p className="demographics-card__row-special">
                    <label>First Name: </label>
                    <input
                      type="text"
                      value={formDatas.pPhysicianFirstName}
                      onChange={handleChange}
                      name="pPhysicianFirstName"
                      autoComplete="off"
                    />
                    <label>Last Name: </label>
                    <input
                      type="text"
                      value={formDatas.pPhysicianLastName}
                      onChange={handleChange}
                      name="pPhysicianLastName"
                      autoComplete="off"
                    />
                  </p>
                  <p className="demographics-card__row-special">
                    <label>OHIP#: </label>
                    <input
                      type="text"
                      value={formDatas.pPhysicianOHIP}
                      onChange={handleChange}
                      name="pPhysicianOHIP"
                      autoComplete="off"
                    />
                    <label>CPSO: </label>
                    <input
                      type="text"
                      value={formDatas.pPhysicianCPSO}
                      onChange={handleChange}
                      name="pPhysicianCPSO"
                      autoComplete="off"
                    />
                  </p>
                </fieldset>
              ) : (
                <p>
                  <label>Primary Physician: </label>
                  {primaryPhysicianCaption(demographicsInfos.PrimaryPhysician)}
                </p>
              )}
              {editVisible ? (
                <fieldset>
                  <legend>Referred Physician</legend>
                  <p className="demographics-card__row-special">
                    <label>First Name: </label>
                    <input
                      type="text"
                      value={formDatas.rPhysicianFirstName}
                      onChange={handleChange}
                      name="rPhysicianFirstName"
                      autoComplete="off"
                    />
                    <label>Last Name: </label>
                    <input
                      type="text"
                      value={formDatas.rPhysicianLastName}
                      onChange={handleChange}
                      name="rPhysicianLastName"
                      autoComplete="off"
                    />
                  </p>
                </fieldset>
              ) : (
                <p>
                  <label>Referred Physician: </label>
                  {demographicsInfos.ReferredPhysician?.FirstName}{" "}
                  {demographicsInfos.ReferredPhysician?.LastName}
                </p>
              )}
              {editVisible ? (
                <fieldset>
                  <legend>Family Physician</legend>
                  <p className="demographics-card__row-special">
                    <label>First Name: </label>
                    <input
                      type="text"
                      value={formDatas.fPhysicianFirstName}
                      onChange={handleChange}
                      name="fPhysicianFirstName"
                      autoComplete="off"
                    />
                    <label>Last Name: </label>
                    <input
                      type="text"
                      value={formDatas.fPhysicianLastName}
                      onChange={handleChange}
                      name="fPhysicianLastName"
                      autoComplete="off"
                    />
                  </p>
                </fieldset>
              ) : (
                <p>
                  <label>Family Physician: </label>
                  {demographicsInfos.FamilyPhysician?.FirstName}{" "}
                  {demographicsInfos.FamilyPhysician?.LastName}
                </p>
              )}
              {editVisible ? (
                <fieldset>
                  <legend>Emergency Contact</legend>
                  <p className="demographics-card__row-special">
                    <label>First Name: </label>
                    <input
                      type="text"
                      value={formDatas.emergencyFirstName}
                      onChange={handleChange}
                      name="emergencyFirstName"
                      autoComplete="off"
                    />
                    <label>Middle Name: </label>
                    <input
                      type="text"
                      value={formDatas.emergencyMiddleName}
                      onChange={handleChange}
                      name="emergencyMiddleName"
                      autoComplete="off"
                    />
                    <label>Last Name: </label>
                    <input
                      type="text"
                      value={formDatas.emergencyLastName}
                      onChange={handleChange}
                      name="emergencyLastName"
                      autoComplete="off"
                    />
                  </p>
                  <p className="demographics-card__row-special">
                    <label>Email: </label>
                    <input
                      type="email"
                      value={formDatas.emergencyEmail}
                      onChange={handleChange}
                      name="emergencyEmail"
                      autoComplete="off"
                    />
                    <label>Phone: </label>
                    <input
                      type="text"
                      value={formDatas.emergencyPhone}
                      onChange={handleChange}
                      name="emergencyPhone"
                      autoComplete="off"
                    />
                  </p>
                </fieldset>
              ) : (
                <p>
                  <label>Emergency Contact: </label>
                  {emergencyContactCaption(emergencyContact)}
                </p>
              )}
            </div>

            <div className="demographics-card__img">
              {loadingFile ? (
                <CircularProgressMedium />
              ) : formDatas.avatar ? (
                <img
                  src={`${BASE_URL}${formDatas.avatar.path}`}
                  alt="user-avatar"
                />
              ) : (
                <img
                  src="https://placehold.co/300x500/png?font=roboto&text=Profile\nPic"
                  alt="user-avatar-placeholder"
                />
              )}
              {editVisible && (
                <>
                  <p>Choose a picture</p>
                  <input
                    name="avatar"
                    type="file"
                    accept=".jpeg, .jpg, .png, .gif, .tif, .pdf, .svg"
                    onChange={handleAvatarChange}
                  />
                </>
              )}
            </div>
          </form>
        )}
        <p className="demographics-card__sign">
          {isUpdated(demographicsInfos) ? (
            <em>
              Updated by{" "}
              {staffIdToTitleAndName(
                staffInfos,
                getLastUpdate(demographicsInfos).updated_by_id
              )}{" "}
              on{" "}
              {timestampToDateTimeSecondsStrTZ(
                getLastUpdate(demographicsInfos).date_updated
              )}
            </em>
          ) : (
            <em>
              Created by{" "}
              {staffIdToTitleAndName(
                staffInfos,
                demographicsInfos.created_by_id
              )}{" "}
              on{" "}
              {timestampToDateTimeSecondsStrTZ(demographicsInfos.date_created)}
            </em>
          )}
        </p>
      </div>
      {newEnrolmentVisible && (
        <FakeWindow
          title={`NEW ENROLMENT`}
          width={500}
          height={400}
          x={(window.innerWidth - 500) / 2}
          y={(window.innerHeight - 400) / 2}
          color="#495867"
          setPopUpVisible={setNewEnrolmentVisible}
        >
          <NewEnrolmentForm
            setNewEnrolmentVisible={setNewEnrolmentVisible}
            demographicsInfos={demographicsInfos}
          />
        </FakeWindow>
      )}
      {enrolmentHistoryVisible && (
        <FakeWindow
          title={`ENROLMENT HISTORY of ${toPatientName(demographicsInfos)}`}
          width={1100}
          height={400}
          x={(window.innerWidth - 1100) / 2}
          y={(window.innerHeight - 400) / 2}
          color="#495867"
          setPopUpVisible={setEnrolmentHistoryVisible}
        >
          <EnrolmentHistory
            enrolmentHistory={demographicsInfos.Enrolment.EnrolmentHistory.sort(
              (a, b) => b.EnrollmentDate - a.EnrollmentDate
            )}
            demographicsInfos={demographicsInfos}
          />
        </FakeWindow>
      )}
      <ConfirmGlobal isPopUp={true} />
      <ToastCalvin id="B" />
    </>
  );
};

export default DemographicsPU;
