import { CircularProgress, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { putPatientRecord } from "../../../../api/fetchRecords";
import { axiosXanoStaff } from "../../../../api/xanoStaff";
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
} from "../../../../datas/codesTables";
import useAuth from "../../../../hooks/useAuth";
import { emergencyContactCaption } from "../../../../utils/emergencyContactCaption";
import { enrolmentCaption } from "../../../../utils/enrolmentCaption";
import { firstLetterUpper } from "../../../../utils/firstLetterUpper";
import { toLocalDate, toLocalDateAndTime } from "../../../../utils/formatDates";
import { getAge } from "../../../../utils/getAge";
import { patientIdToName } from "../../../../utils/patientIdToName";
import { primaryPhysicianCaption } from "../../../../utils/primaryPhysicianCaption";
import {
  getLastUpdate,
  isUpdated,
} from "../../../../utils/socketHandlers/updates";
import { staffIdToTitleAndName } from "../../../../utils/staffIdToTitleAndName";
import { demographicsSchema } from "../../../../validation/demographicsValidation";
import ConfirmGlobal, {
  confirmAlert,
} from "../../../All/Confirm/ConfirmGlobal";
import GenericList from "../../../All/UI/Lists/GenericList";
import StaffList from "../../../All/UI/Lists/StaffList";
import FakeWindow from "../../../All/UI/Windows/FakeWindow";
import EnrolmentHistory from "../Topics/Demographics/EnrolmentHistory";
import NewEnrolmentForm from "../Topics/Demographics/NewEnrolmentForm";
var _ = require("lodash");

const BASE_URL = "https://xsjk-1rpe-2jnw.n7c.xano.io";

const DemographicsPU = ({ demographicsInfos, setPopUpVisible }) => {
  //============================= STATES ==============================//
  const [editVisible, setEditVisible] = useState(false);
  const [errMsgPost, setErrMsgPost] = useState("");
  const [formDatas, setFormDatas] = useState(null);
  const { auth, user, clinic, socket } = useAuth();
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [postalOrZip, setPostalOrZip] = useState(
    demographicsInfos.Address.find(({ _addressType }) => _addressType === "R")
      .Structured.PostalZipCode.PostalCode
      ? "postal"
      : "zip"
  );
  const emergencyContact = demographicsInfos.Contact.length
    ? demographicsInfos.Contact.find(
        (contact) => contact.ContactPurpose?.PurposeAsEnum === "EC"
      )
    : {};

  const [lastEnrolment, setLastEnrolment] = useState({});
  const [newEnrolmentVisible, setNewEnrolmentVisible] = useState(false);
  const [enrolmentHistoryVisible, setEnrolmentHistoryVisible] = useState(false);

  useEffect(() => {
    setFormDatas(demographicsInfos);
    setLastEnrolment(
      demographicsInfos.Enrolment.EnrolmentHistory.sort(
        (a, b) => a.EnrollmentDate - b.EnrollmentDate
      ).slice(-1)[0] || {}
    );
  }, [demographicsInfos]);

  const handleChangePostalOrZip = (e) => {
    setErrMsgPost("");
    setPostalOrZip(e.target.value);

    setFormDatas({
      ...formDatas,
      Address: formDatas.Address.map((item) => {
        return item._addressType === "R"
          ? {
              ...item,
              Structured: {
                ...item.Structured,
                PostalZipCode: { PostalCode: "", ZipCode: "" },
              },
            }
          : item;
      }),
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
    switch (name) {
      case "NamePrefix":
        setFormDatas({
          ...formDatas,
          Names: { ...formDatas.Names, NamePrefix: value },
        });
        break;
      case "LastNameSuffix":
        setFormDatas({
          ...formDatas,
          Names: { ...formDatas.Names, LastNameSuffix: value },
        });
        break;
      case "FirstName":
        setFormDatas({
          ...formDatas,
          Names: {
            ...formDatas.Names,
            LegalName: {
              ...formDatas.Names.LegalName,
              FirstName: {
                ...formDatas.Names.LegalName.FirstName,
                Part: value,
              },
            },
          },
        });
        break;
      case "LastName":
        setFormDatas({
          ...formDatas,
          Names: {
            ...formDatas.Names,
            LegalName: {
              ...formDatas.Names.LegalName,
              LastName: {
                ...formDatas.Names.LegalName.LastName,
                Part: value,
              },
            },
          },
        });
        break;
      case "OtherName":
        setFormDatas({
          ...formDatas,
          Names: {
            ...formDatas.Names,
            LegalName: {
              ...formDatas.Names.LegalName,
              OtherName: [
                {
                  ...formDatas.Names.LegalName.OtherName[0],
                  Part: value,
                },
              ],
            },
          },
        });
        break;
      case "NickName":
        setFormDatas({
          ...formDatas,
          Names: {
            ...formDatas.Names,
            OtherNames: [
              {
                ...formDatas.Names.OtherNames[0],
                OtherName: [
                  {
                    ...formDatas.Names.OtherNames[0].OtherName[0],
                    Part: value,
                  },
                ],
              },
            ],
          },
        });
        break;
      case "Gender":
        setFormDatas({ ...formDatas, Gender: value });
        break;
      case "DateOfBirth":
        setFormDatas({
          ...formDatas,
          DateOfBirth: Date.parse(new Date(value)),
        });
        break;
      case "HealthCardNumber":
        setFormDatas({
          ...formDatas,
          HealthCard: { ...formDatas.HealthCard, Number: value },
        });
        break;
      case "HealthCardVersion":
        setFormDatas({
          ...formDatas,
          HealthCard: { ...formDatas.HealthCard, Version: value },
        });
        break;
      case "HealthCardExpiry":
        setFormDatas({
          ...formDatas,
          HealthCard: {
            ...formDatas.HealthCard,
            ExpiryDate: Date.parse(new Date(value)),
          },
        });
        break;
      case "HealthCardProvince":
        setFormDatas({
          ...formDatas,
          HealthCard: { ...formDatas.HealthCard, ProvinceCode: value },
        });
        break;
      case "SIN":
        setFormDatas({
          ...formDatas,
          SIN: value,
        });
        break;

      case "Cellphone":
        setFormDatas({
          ...formDatas,
          PhoneNumber: formDatas.PhoneNumber.map((item) => {
            return item._phoneNumberType === "C"
              ? {
                  ...item,
                  phoneNumber: value,
                }
              : item;
          }),
        });
        break;
      case "CellphoneExt":
        setFormDatas({
          ...formDatas,
          PhoneNumber: formDatas.PhoneNumber.map((item) => {
            return item._phoneNumberType === "C"
              ? {
                  ...item,
                  extension: value,
                }
              : item;
          }),
        });
        break;
      case "Homephone":
        setFormDatas({
          ...formDatas,
          PhoneNumber: formDatas.PhoneNumber.map((item) => {
            return item._phoneNumberType === "R"
              ? {
                  ...item,
                  phoneNumber: value,
                }
              : item;
          }),
        });
        break;
      case "HomephoneExt":
        setFormDatas({
          ...formDatas,
          PhoneNumber: formDatas.PhoneNumber.map((item) => {
            return item._phoneNumberType === "R"
              ? {
                  ...item,
                  extension: value,
                }
              : item;
          }),
        });
        break;
      case "Workphone":
        setFormDatas({
          ...formDatas,
          PhoneNumber: formDatas.PhoneNumber.map((item) => {
            return item._phoneNumberType === "W"
              ? {
                  ...item,
                  phoneNumber: value,
                }
              : item;
          }),
        });
        break;
      case "WorkphoneExt":
        setFormDatas({
          ...formDatas,
          PhoneNumber: formDatas.PhoneNumber.map((item) => {
            return item._phoneNumberType === "W"
              ? {
                  ...item,
                  extension: value,
                }
              : item;
          }),
        });
        break;
      case "Address":
        setFormDatas({
          ...formDatas,
          Address: formDatas.Address.map((item) => {
            return item._addressType === "R"
              ? {
                  ...item,
                  Structured: {
                    ...item.Structured,
                    Line1: value,
                  },
                }
              : item;
          }),
        });
        break;
      case "City":
        setFormDatas({
          ...formDatas,
          Address: formDatas.Address.map((item) => {
            return item._addressType === "R"
              ? {
                  ...item,
                  Structured: {
                    ...item.Structured,
                    City: value,
                  },
                }
              : item;
          }),
        });
        break;
      case "Province":
        setFormDatas({
          ...formDatas,
          Address: formDatas.Address.map((item) => {
            return item._addressType === "R"
              ? {
                  ...item,
                  Structured: {
                    ...item.Structured,
                    CountrySubDivisionCode: value,
                  },
                }
              : item;
          }),
        });
        break;
      case "PostalCode":
        setFormDatas({
          ...formDatas,
          Address: formDatas.Address.map((item) => {
            return item._addressType === "R"
              ? {
                  ...item,
                  Structured: {
                    ...item.Structured,
                    PostalZipCode:
                      postalOrZip === "postal"
                        ? { PostalCode: value, ZipCode: "" }
                        : { PostalCode: "", ZipCode: value },
                  },
                }
              : item;
          }),
        });
        break;
      case "PreferredOfficialLanguage":
        setFormDatas({
          ...formDatas,
          PreferredOfficialLanguage: value,
        });
        break;

      case "PPFirstName":
        setFormDatas({
          ...formDatas,
          PrimaryPhysician: {
            ...formDatas.PrimaryPhysician,
            Name: { ...formDatas.PrimaryPhysician.Name, FirstName: value },
          },
        });
        break;
      case "PPLastName":
        setFormDatas({
          ...formDatas,
          PrimaryPhysician: {
            ...formDatas.PrimaryPhysician,
            Name: { ...formDatas.PrimaryPhysician.Name, LastName: value },
          },
        });
        break;
      case "PPOHIPPhysicianId":
        setFormDatas({
          ...formDatas,
          PrimaryPhysician: {
            ...formDatas.PrimaryPhysician,
            OHIPPhysicianId: value,
          },
        });
        break;
      case "PPCPSO":
        setFormDatas({
          ...formDatas,
          PrimaryPhysician: {
            ...formDatas.PrimaryPhysician,
            PrimaryPhysicianCPSO: value,
          },
        });
        break;
      case "RPFirstName":
        setFormDatas({
          ...formDatas,
          ReferredPhysician: {
            ...formDatas.ReferredPhysician,
            FirstName: value,
          },
        });
        break;
      case "RPLastName":
        setFormDatas({
          ...formDatas,
          ReferredPhysician: {
            ...formDatas.ReferredPhysician,
            LastName: value,
          },
        });
        break;
      case "FPFirstName":
        setFormDatas({
          ...formDatas,
          FamilyPhysician: {
            ...formDatas.FamilyPhysician,
            FirstName: value,
          },
        });
        break;
      case "FPLastName":
        setFormDatas({
          ...formDatas,
          FamilyPhysician: {
            ...formDatas.FamilyPhysician,
            LastName: value,
          },
        });
        break;
      case "CFirstName":
        setFormDatas({
          ...formDatas,
          Contact: formDatas.Contact.length
            ? formDatas.Contact.map((item) => {
                return item.ContactPurpose?.PurposeAsEnum === "EC"
                  ? {
                      ...item,
                      Name: {
                        ...item.Name,
                        FirstName: value,
                      },
                    }
                  : item;
              })
            : [
                {
                  ContactPurpose: {
                    PurposeAsEnum: "EC",
                  },
                  Name: { FirstName: value },
                },
              ],
        });
        break;
      case "CMiddleName":
        setFormDatas({
          ...formDatas,
          Contact: formDatas.Contact.length
            ? formDatas.Contact.map((item) => {
                return item.ContactPurpose?.PurposeAsEnum === "EC"
                  ? {
                      ...item,
                      Name: {
                        ...item.Name,
                        MiddleName: value,
                      },
                    }
                  : item;
              })
            : [
                {
                  ContactPurpose: {
                    PurposeAsEnum: "EC",
                  },
                  Name: { MiddleName: value },
                },
              ],
        });
        break;
      case "CLastName":
        setFormDatas({
          ...formDatas,
          Contact: formDatas.Contact.length
            ? formDatas.Contact.map((item) => {
                return item.ContactPurpose?.PurposeAsEnum === "EC"
                  ? {
                      ...item,
                      Name: {
                        ...item.Name,
                        LastName: value,
                      },
                    }
                  : item;
              })
            : [
                {
                  ContactPurpose: {
                    PurposeAsEnum: "EC",
                  },
                  Name: { LastName: value },
                },
              ],
        });
        break;
      case "CEmailAddress":
        setFormDatas({
          ...formDatas,
          Contact: formDatas.Contact.length
            ? formDatas.Contact.map((item) => {
                return item.ContactPurpose?.PurposeAsEnum === "EC"
                  ? {
                      ...item,
                      EmailAddress: value,
                    }
                  : item;
              })
            : [
                {
                  ContactPurpose: {
                    PurposeAsEnum: "EC",
                  },
                  EmailAddress: value,
                },
              ],
        });
        break;
      case "CPhone":
        setFormDatas({
          ...formDatas,
          Contact: formDatas.Contact.length
            ? formDatas.Contact.map((item) => {
                return item.ContactPurpose.PurposeAsEnum === "EC"
                  ? {
                      ...item,
                      PhoneNumber: item.PhoneNumber?.length
                        ? item.PhoneNumber.map((phone) => {
                            return phone._phoneNumberType === "C"
                              ? {
                                  ...phone,
                                  phoneNumber: value,
                                }
                              : phone;
                          })
                        : [
                            {
                              _phoneNumberType: "C",
                              phoneNumber: value,
                            },
                          ],
                    }
                  : item;
              })
            : [
                {
                  ContactPurpose: {
                    PurposeAsEnum: "EC",
                  },
                  PhoneNumber: [
                    {
                      _phoneNumberType: "C",
                      phoneNumber: value,
                    },
                  ],
                },
              ],
        });
        break;
      case "PersonStatusCode":
        setFormDatas({
          ...formDatas,
          PersonStatusCode: {
            PersonStatusAsEnum: value,
          },
        });
        break;
      case "assigned_staff_id":
        setFormDatas({ ...formDatas, assigned_staff_id: parseInt(value) });
        break;
      default:
        setFormDatas({ ...formDatas, [name]: value });
        break;
    }
    setErrMsgPost("");
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
    setIsLoadingFile(true);
    // setting up the reader
    let reader = new FileReader();
    reader.readAsDataURL(file);
    // here we tell the reader what to do when it's done reading...
    reader.onload = async (e) => {
      let content = e.target.result; // this is the content!
      try {
        let fileToUpload = await axiosXanoStaff.post(
          "/upload/attachment",
          {
            content: content,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth.authToken}`,
            },
          }
        );
        setFormDatas({ ...formDatas, avatar: fileToUpload.data });
        setIsLoadingFile(false);
      } catch (err) {
        toast.error(`Error: unable to load file: ${err.message}`, {
          containerId: "B",
        });
        setIsLoadingFile(false);
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
    setFormDatas(demographicsInfos);
    setEditVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Formatting
    const datasToPut = {
      ...formDatas,
    };

    // Validation
    try {
      await demographicsSchema.validate(datasToPut);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }

    //Formatting
    datasToPut.Names.LegalName.FirstName.Part = firstLetterUpper(
      datasToPut.Names.LegalName.FirstName.Part
    );
    datasToPut.Names.LegalName.LastName.Part = firstLetterUpper(
      datasToPut.Names.LegalName.LastName.Part
    );
    datasToPut.Names.LegalName.OtherName[0].Part = firstLetterUpper(
      datasToPut.Names.LegalName.OtherName[0].Part
    );
    datasToPut.Names.OtherNames[0].OtherName[0].Part = firstLetterUpper(
      datasToPut.Names.OtherNames[0].OtherName[0].Part
    );
    datasToPut.Email = datasToPut.Email.toLowerCase();
    datasToPut.Address.find(
      ({ _addressType }) => _addressType === "R"
    ).Structured.Line1 = firstLetterUpper(
      datasToPut.Address.find(({ _addressType }) => _addressType === "R")
        .Structured.Line1
    );
    datasToPut.Address.find(
      ({ _addressType }) => _addressType === "R"
    ).Structured.City = firstLetterUpper(
      datasToPut.Address.find(({ _addressType }) => _addressType === "R")
        .Structured.City
    );

    //Submission
    try {
      await putPatientRecord(
        "/demographics",
        demographicsInfos.id,
        user.id,
        auth.authToken,
        datasToPut,
        socket,
        "DEMOGRAPHICS"
      );
      setEditVisible(false);
      toast.success("Saved successfully", { containerId: "B" });
    } catch (err) {
      toast.error(
        `Error: unable to update patient demographics : ${err.message}`,
        {
          containerId: "B",
        }
      );
    }
  };

  return (
    <>
      {formDatas ? (
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
                    <button onClick={(e) => setEditVisible((v) => !v)}>
                      Edit
                    </button>
                    <button onClick={handleClose}>Close</button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      disabled={isLoadingFile}
                      onClick={handleSubmit}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      disabled={isLoadingFile}
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
            <form className="demographics-card__form">
              <div className="demographics-card__content">
                {errMsgPost && editVisible && (
                  <p className="demographics-card__err">{errMsgPost}</p>
                )}
                <p>
                  <label>Name Prefix: </label>
                  {editVisible ? (
                    <GenericList
                      name="NamePrefix"
                      list={namePrefixCT}
                      value={formDatas.Names.NamePrefix}
                      handleChange={handleChange}
                      placeHolder="Choose a name prefix..."
                    />
                  ) : (
                    demographicsInfos.Names.NamePrefix
                  )}
                </p>
                <p>
                  <label>First Name*: </label>
                  {editVisible ? (
                    <input
                      type="text"
                      required
                      value={formDatas.Names.LegalName.FirstName.Part}
                      onChange={handleChange}
                      name="FirstName"
                      autoComplete="off"
                    />
                  ) : (
                    demographicsInfos.Names.LegalName.FirstName.Part
                  )}
                </p>

                <p>
                  <label>Middle Name: </label>
                  {editVisible ? (
                    <input
                      type="text"
                      value={formDatas.Names.LegalName.OtherName[0].Part}
                      onChange={handleChange}
                      name="OtherName"
                      autoComplete="off"
                    />
                  ) : (
                    demographicsInfos.Names.LegalName.OtherName[0].Part
                  )}
                </p>
                <p>
                  <label>Last Name*: </label>
                  {editVisible ? (
                    <input
                      type="text"
                      required
                      value={formDatas.Names?.LegalName?.LastName?.Part}
                      onChange={handleChange}
                      name="LastName"
                      autoComplete="off"
                    />
                  ) : (
                    demographicsInfos.Names?.LegalName?.LastName?.Part
                  )}
                </p>
                <p>
                  <label>Name Suffix: </label>
                  {editVisible ? (
                    <GenericList
                      name="LastNameSuffix"
                      list={nameSuffixCT}
                      value={formDatas.Names?.LastNameSuffix}
                      handleChange={handleChange}
                      placeHolder="Choose a name suffix..."
                    />
                  ) : (
                    demographicsInfos.Names?.LastNameSuffix
                  )}
                </p>
                <p>
                  <label>Nick Name: </label>
                  {editVisible ? (
                    <input
                      type="text"
                      value={
                        formDatas.Names?.OtherNames?.length
                          ? formDatas.Names?.OtherNames[0].OtherName[0].Part
                          : ""
                      }
                      onChange={handleChange}
                      name="NickName"
                      autoComplete="off"
                    />
                  ) : demographicsInfos.Names.OtherNames.length ? (
                    demographicsInfos.Names.OtherNames[0].OtherName[0].Part
                  ) : (
                    ""
                  )}
                </p>
                <p>
                  <label>Chart#*: </label>
                  {demographicsInfos.ChartNumber}
                </p>
                <p>
                  <label>Date of birth*: </label>
                  {editVisible ? (
                    <input
                      type="date"
                      required
                      value={toLocalDate(formDatas.DateOfBirth)}
                      onChange={handleChange}
                      name="DateOfBirth"
                      max={toLocalDate(Date.now())}
                    />
                  ) : (
                    toLocalDate(formDatas.DateOfBirth)
                  )}
                </p>
                <p>
                  <label>Age: </label>
                  {getAge(toLocalDate(formDatas.DateOfBirth))}
                </p>
                <p>
                  <label>Health Card#</label>
                  {editVisible ? (
                    <input
                      type="text"
                      value={formDatas.HealthCard.Number}
                      onChange={handleChange}
                      name="HealthCardNumber"
                      autoComplete="off"
                    />
                  ) : (
                    demographicsInfos.HealthCard.Number
                  )}
                </p>
                <p>
                  <label>Health Card Version</label>
                  {editVisible ? (
                    <input
                      type="text"
                      value={formDatas.HealthCard.Version}
                      onChange={handleChange}
                      name="HealthCardVersion"
                      autoComplete="off"
                    />
                  ) : (
                    demographicsInfos.HealthCard.Version
                  )}
                </p>
                <p>
                  <label>Health Card Expiry: </label>
                  {editVisible ? (
                    <input
                      type="date"
                      value={toLocalDate(formDatas.HealthCard.ExpiryDate)}
                      onChange={handleChange}
                      name="HealthCardExpiry"
                    />
                  ) : (
                    toLocalDate(formDatas.HealthCard.ExpiryDate)
                  )}
                </p>
                <p>
                  <label>Health Card Province</label>
                  {editVisible ? (
                    <GenericList
                      list={provinceStateTerritoryCT}
                      value={formDatas.HealthCard.ProvinceCode}
                      name="HealthCardProvince"
                      handleChange={handleChange}
                      noneOption={false}
                    />
                  ) : (
                    toCodeTableName(
                      provinceStateTerritoryCT,
                      demographicsInfos.HealthCard.ProvinceCode
                    )
                  )}
                </p>
                <p>
                  <label>Gender: </label>
                  {editVisible ? (
                    <GenericList
                      list={genderCT}
                      value={formDatas.Gender}
                      name="Gender"
                      handleChange={handleChange}
                      noneOption={false}
                    />
                  ) : (
                    toCodeTableName(genderCT, demographicsInfos.Gender)
                  )}
                </p>
                <p>
                  <label>SIN: </label>
                  {editVisible ? (
                    <input
                      type="text"
                      value={formDatas.SIN}
                      onChange={handleChange}
                      name="SIN"
                      autoComplete="off"
                    />
                  ) : (
                    demographicsInfos.SIN
                  )}
                </p>
                <p>
                  <label>Email: </label>
                  {demographicsInfos.Email}
                </p>
                <p>
                  <label>Cell Phone: </label>
                  {editVisible ? (
                    <input
                      type="tel"
                      value={
                        formDatas.PhoneNumber.find(
                          ({ _phoneNumberType }) => _phoneNumberType === "C"
                        )?.phoneNumber
                      }
                      onChange={handleChange}
                      name="Cellphone"
                      autoComplete="off"
                    />
                  ) : (
                    demographicsInfos.PhoneNumber.find(
                      ({ _phoneNumberType }) => _phoneNumberType === "C"
                    ).phoneNumber
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
                        value={
                          formDatas.PhoneNumber.find(
                            ({ _phoneNumberType }) => _phoneNumberType === "C"
                          ).extension
                        }
                        onChange={handleChange}
                        name="CellphoneExt"
                        autoComplete="off"
                      />
                    </>
                  ) : (
                    <>
                      {formDatas.PhoneNumber.find(
                        ({ _phoneNumberType }) => _phoneNumberType === "C"
                      ).extension && (
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
                        demographicsInfos.PhoneNumber.find(
                          ({ _phoneNumberType }) => _phoneNumberType === "C"
                        ).extension
                      }
                    </>
                  )}
                </p>
                <p>
                  <label>Home Phone: </label>
                  {editVisible ? (
                    <input
                      type="tel"
                      value={
                        formDatas.PhoneNumber.find(
                          ({ _phoneNumberType }) => _phoneNumberType === "R"
                        ).phoneNumber
                      }
                      onChange={handleChange}
                      name="Homephone"
                      autoComplete="off"
                    />
                  ) : (
                    demographicsInfos.PhoneNumber.find(
                      ({ _phoneNumberType }) => _phoneNumberType === "R"
                    ).phoneNumber
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
                        value={
                          formDatas.PhoneNumber.find(
                            ({ _phoneNumberType }) => _phoneNumberType === "R"
                          ).extension
                        }
                        onChange={handleChange}
                        name="CellphoneExt"
                        autoComplete="off"
                      />
                    </>
                  ) : (
                    <>
                      {formDatas.PhoneNumber.find(
                        ({ _phoneNumberType }) => _phoneNumberType === "R"
                      ).extension && (
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
                        demographicsInfos.PhoneNumber.find(
                          ({ _phoneNumberType }) => _phoneNumberType === "R"
                        ).extension
                      }
                    </>
                  )}
                </p>
                <p>
                  <label>Work Phone: </label>
                  {editVisible ? (
                    <input
                      type="tel"
                      value={
                        formDatas.PhoneNumber.find(
                          ({ _phoneNumberType }) => _phoneNumberType === "W"
                        ).phoneNumber
                      }
                      onChange={handleChange}
                      name="Workphone"
                      autoComplete="off"
                    />
                  ) : (
                    demographicsInfos.PhoneNumber.find(
                      ({ _phoneNumberType }) => _phoneNumberType === "W"
                    ).phoneNumber
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
                        value={
                          formDatas.PhoneNumber.find(
                            ({ _phoneNumberType }) => _phoneNumberType === "W"
                          ).extension
                        }
                        onChange={handleChange}
                        name="CellphoneExt"
                        autoComplete="off"
                      />
                    </>
                  ) : (
                    <>
                      {formDatas.PhoneNumber.find(
                        ({ _phoneNumberType }) => _phoneNumberType === "W"
                      ).extension && (
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
                        demographicsInfos.PhoneNumber.find(
                          ({ _phoneNumberType }) => _phoneNumberType === "W"
                        ).extension
                      }
                    </>
                  )}
                </p>
                <p>
                  <label>Address*: </label>
                  {editVisible ? (
                    <input
                      type="text"
                      value={
                        formDatas.Address.find(
                          ({ _addressType }) => _addressType === "R"
                        ).Structured.Line1
                      }
                      onChange={handleChange}
                      name="Address"
                      autoComplete="off"
                    />
                  ) : (
                    demographicsInfos.Address.find(
                      ({ _addressType }) => _addressType === "R"
                    ).Structured.Line1
                  )}
                </p>
                <p>
                  <label>Province/State*: </label>
                  {editVisible ? (
                    <GenericList
                      list={provinceStateTerritoryCT}
                      value={
                        formDatas.Address.find(
                          ({ _addressType }) => _addressType === "R"
                        ).Structured.CountrySubDivisionCode
                      }
                      name="Province"
                      handleChange={handleChange}
                    />
                  ) : (
                    toCodeTableName(
                      provinceStateTerritoryCT,
                      demographicsInfos.Address.find(
                        ({ _addressType }) => _addressType === "R"
                      ).Structured.CountrySubDivisionCode
                    )
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
                            ? formDatas.Address.find(
                                ({ _addressType }) => _addressType === "R"
                              ).Structured.PostalZipCode.PostalCode
                            : formDatas.Address.find(
                                ({ _addressType }) => _addressType === "R"
                              ).Structured.PostalZipCode.ZipCode
                        }
                        onChange={handleChange}
                        name="PostalCode"
                        autoComplete="off"
                      />
                    </>
                  ) : postalOrZip === "postal" ? (
                    demographicsInfos.Address.find(
                      ({ _addressType }) => _addressType === "R"
                    ).Structured.PostalZipCode.PostalCode
                  ) : (
                    demographicsInfos.Address.find(
                      ({ _addressType }) => _addressType === "R"
                    )?.Structured.PostalZipCode.ZipCode
                  )}
                </p>
                <p>
                  <label>City: </label>
                  {editVisible ? (
                    <input
                      type="text"
                      value={
                        formDatas.Address.find(
                          ({ _addressType }) => _addressType === "R"
                        ).Structured.City
                      }
                      onChange={handleChange}
                      name="City"
                      autoComplete="off"
                    />
                  ) : (
                    demographicsInfos.Address.find(
                      ({ _addressType }) => _addressType === "R"
                    ).Structured.City
                  )}
                </p>
                <p>
                  <label>Preferred Official Language: </label>
                  {editVisible ? (
                    <GenericList
                      list={officialLanguageCT}
                      value={formDatas.PreferredOfficialLanguage}
                      name="PreferredOfficialLanguage"
                      handleChange={handleChange}
                      noneOption={false}
                    />
                  ) : (
                    toCodeTableName(
                      officialLanguageCT,
                      demographicsInfos.PreferredOfficialLanguage
                    )
                  )}
                </p>
                <p>
                  <label>Status: </label>
                  {editVisible ? (
                    <GenericList
                      name="PersonStatusCode"
                      list={personStatusCT}
                      value={formDatas.PersonStatusCode?.PersonStatusAsEnum}
                      handleChange={handleChange}
                      placeHolder="Choose a status..."
                      noneOption={false}
                    />
                  ) : (
                    toCodeTableName(
                      personStatusCT,
                      demographicsInfos.PersonStatusCode?.PersonStatusAsEnum
                    )
                  )}
                </p>
                <p>
                  <label>Assigned Clinic Practician: </label>
                  {editVisible ? (
                    <StaffList
                      value={formDatas.assigned_staff_id}
                      name="assigned_staff_id"
                      handleChange={handleChange}
                      staffInfos={clinic.staffInfos}
                    />
                  ) : (
                    staffIdToTitleAndName(
                      clinic.staffInfos,
                      demographicsInfos.assigned_staff_id,
                      true
                    )
                  )}
                </p>

                <p>
                  <label>Enrolled to physician: </label>
                  {enrolmentCaption(lastEnrolment)}
                  {"  "}
                  <Tooltip
                    title="Add new enrolment"
                    placement="top-start"
                    arrow
                  >
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
                  {toLocalDate(lastEnrolment?.EnrollmentDate)}
                </p>
                <p>
                  <label>Enrollment termination date: </label>
                  {toLocalDate(lastEnrolment?.EnrollmentTerminationDate)}
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
                        value={formDatas.PrimaryPhysician?.Name?.FirstName}
                        onChange={handleChange}
                        name="PPFirstName"
                        autoComplete="off"
                      />
                      <label>Last Name: </label>
                      <input
                        type="text"
                        value={formDatas.PrimaryPhysician?.Name?.LastName}
                        onChange={handleChange}
                        name="PPLastName"
                        autoComplete="off"
                      />
                    </p>
                    <p className="demographics-card__row-special">
                      <label>OHIP#: </label>
                      <input
                        type="text"
                        value={formDatas.PrimaryPhysician?.OHIPPhysicianId}
                        onChange={handleChange}
                        name="PPOHIPPhysicianId"
                        autoComplete="off"
                      />
                      <label>CPSO: </label>
                      <input
                        type="text"
                        value={formDatas.PrimaryPhysician?.PrimaryPhysicianCPSO}
                        onChange={handleChange}
                        name="PPCPSO"
                        autoComplete="off"
                      />
                    </p>
                  </fieldset>
                ) : (
                  <p>
                    <label>Primary Physician: </label>
                    {primaryPhysicianCaption(
                      demographicsInfos.PrimaryPhysician
                    )}
                  </p>
                )}
                {editVisible ? (
                  <fieldset>
                    <legend>Referred Physician</legend>
                    <p className="demographics-card__row-special">
                      <label>First Name: </label>
                      <input
                        type="text"
                        value={formDatas.ReferredPhysician?.FirstName}
                        onChange={handleChange}
                        name="RPFirstName"
                        autoComplete="off"
                      />
                      <label>Last Name: </label>
                      <input
                        type="text"
                        value={formDatas.ReferredPhysician?.LastName}
                        onChange={handleChange}
                        name="RPLastName"
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
                        value={formDatas.FamilyPhysician?.FirstName}
                        onChange={handleChange}
                        name="FPFirstName"
                        autoComplete="off"
                      />
                      <label>Last Name: </label>
                      <input
                        type="text"
                        value={formDatas.FamilyPhysician?.LastName}
                        onChange={handleChange}
                        name="FPLastName"
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
                        value={
                          formDatas.Contact?.length
                            ? formDatas.Contact.find(
                                (contact) =>
                                  contact.ContactPurpose?.PurposeAsEnum === "EC"
                              )?.Name?.FirstName || ""
                            : ""
                        }
                        onChange={handleChange}
                        name="CFirstName"
                        autoComplete="off"
                      />
                      <label>Middle Name: </label>
                      <input
                        type="text"
                        value={
                          formDatas.Contact?.length
                            ? formDatas.Contact.find(
                                (contact) =>
                                  contact.ContactPurpose?.PurposeAsEnum === "EC"
                              )?.Name?.MiddleName || ""
                            : ""
                        }
                        onChange={handleChange}
                        name="CMiddleName"
                        autoComplete="off"
                      />
                      <label>Last Name: </label>
                      <input
                        type="text"
                        value={
                          formDatas.Contact?.length
                            ? formDatas.Contact.find(
                                (contact) =>
                                  contact.ContactPurpose?.PurposeAsEnum === "EC"
                              )?.Name?.LastName || ""
                            : ""
                        }
                        onChange={handleChange}
                        name="CLastName"
                        autoComplete="off"
                      />
                    </p>
                    <p className="demographics-card__row-special">
                      <label>Email: </label>
                      <input
                        type="email"
                        value={
                          formDatas.Contact?.length
                            ? formDatas.Contact.find(
                                (contact) =>
                                  contact.ContactPurpose?.PurposeAsEnum === "EC"
                              )?.EmailAddress || ""
                            : ""
                        }
                        onChange={handleChange}
                        name="CEmailAddress"
                        autoComplete="off"
                      />
                      <label>Phone: </label>
                      <input
                        type="text"
                        value={
                          formDatas.Contact?.length
                            ? formDatas.Contact.find(
                                (contact) =>
                                  contact.ContactPurpose?.PurposeAsEnum === "EC"
                              ).PhoneNumber?.find(
                                ({ _phoneNumberType }) =>
                                  _phoneNumberType === "C"
                              ).phoneNumber || ""
                            : ""
                        }
                        onChange={handleChange}
                        name="CPhone"
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
                {isLoadingFile ? (
                  <CircularProgress size="1rem" style={{ margin: "5px" }} />
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
            <p className="demographics-card__sign">
              {isUpdated(demographicsInfos) ? (
                <em>
                  Updated by{" "}
                  {staffIdToTitleAndName(
                    clinic.staffInfos,
                    getLastUpdate(demographicsInfos).updated_by_id,
                    true
                  )}{" "}
                  on{" "}
                  {toLocalDateAndTime(
                    getLastUpdate(demographicsInfos).date_updated
                  )}
                </em>
              ) : (
                <em>
                  Created by{" "}
                  {staffIdToTitleAndName(
                    clinic.staffInfos,
                    demographicsInfos.created_by_id,
                    true
                  )}{" "}
                  on {toLocalDateAndTime(demographicsInfos.date_created)}
                </em>
              )}
            </p>
          </div>
        </>
      ) : (
        <CircularProgress size="1rem" style={{ margin: "5px" }} />
      )}
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
          title={`ENROLMENT HISTORY of ${patientIdToName(
            clinic.demographicsInfos,
            demographicsInfos.patient_id
          )}`}
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
      <ToastContainer
        enableMultiContainer
        containerId={"B"}
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={1}
      />
    </>
  );
};

export default DemographicsPU;
