import React, { useEffect, useRef, useState } from "react";
import { provinceStateTerritoryCT } from "../../../../datas/codesTables";
import useAuth from "../../../../hooks/useAuth";
import { toLocalDate } from "../../../../utils/formatDates";
import { onMessageSearchPatients } from "../../../../utils/socketHandlers/onMessageSearchPatients";
import PatientSearchForm from "./PatientSearchForm";
import PatientSearchResult from "./PatientSearchResult";

const SearchPatient = () => {
  const direction = useRef(false);
  const { clinic, socket, setClinic } = useAuth();
  const [sortedPatientsInfos, setSortedPatientsInfos] = useState(
    clinic.demographicsInfos
  );
  const [search, setSearch] = useState({
    name: "",
    email: "",
    phone: "",
    birth: "",
    chart: "",
    health: "",
  });

  useEffect(() => {
    if (!socket) return;
    const onMessage = (message) =>
      onMessageSearchPatients(
        message,
        sortedPatientsInfos,
        setSortedPatientsInfos,
        clinic,
        setClinic
      );
    socket.on("message", onMessage);
    return () => {
      socket.off("message", onMessage);
    };
  }, [clinic, setClinic, socket, sortedPatientsInfos]);

  const handleSort = (columnName) => {
    const sortedPatientsInfosUpdated = [...sortedPatientsInfos];
    direction.current = !direction.current;
    switch (columnName) {
      case "last_name":
        direction.current
          ? sortedPatientsInfosUpdated.sort((a, b) =>
              a.Names.LegalName.LastName.Part.localeCompare(
                b.Names.LegalName.LastName.Part
              )
            )
          : sortedPatientsInfosUpdated.sort((a, b) =>
              b.Names.LegalName.LastName.Part.localeCompare(
                a.Names.LegalName.LastName.Part
              )
            );
        break;
      case "first_name":
        direction.current
          ? sortedPatientsInfosUpdated.sort((a, b) =>
              a.Names.LegalName.FirstName.Part.localeCompare(
                b.Names.LegalName.FirstName.Part
              )
            )
          : sortedPatientsInfosUpdated.sort((a, b) =>
              b.Names.LegalName.FirstName.Part.localeCompare(
                a.Names.LegalName.FirstName.Part
              )
            );
        break;
      case "middle_name":
        direction.current
          ? sortedPatientsInfosUpdated.sort((a, b) =>
              a.Names.LegalName.OtherName?.Part.localeCompare(
                b.Names.LegalName.OtherName?.Part
              )
            )
          : sortedPatientsInfosUpdated.sort((a, b) =>
              b.Names.LegalName.OtherName?.Part.localeCompare(
                a.Names.LegalName.OtherName?.Part
              )
            );
        break;
      case "date_of_birth":
        direction.current
          ? sortedPatientsInfosUpdated.sort((a, b) =>
              toLocalDate(a.DateOfBirth).localeCompare(
                toLocalDate(b.DateOfBirth)
              )
            )
          : sortedPatientsInfosUpdated.sort((a, b) =>
              toLocalDate(b.DateOfBirth).localeCompare(
                toLocalDate(a.DateOfBirth)
              )
            );
        break;
      case "email":
        direction.current
          ? sortedPatientsInfosUpdated.sort((a, b) =>
              a.Email.localeCompare(b.Email)
            )
          : sortedPatientsInfosUpdated.sort((a, b) =>
              b.Email.localeCompare(a.Email)
            );

        break;
      case "cell_phone":
        direction.current
          ? sortedPatientsInfosUpdated.sort((a, b) =>
              a.PhoneNumber.find(
                ({ _phoneNumberType }) => _phoneNumberType === "C"
              )?.phoneNumber.localeCompare(
                b.PhoneNumber.find(
                  ({ _phoneNumberType }) => _phoneNumberType === "C"
                )?.phoneNumber
              )
            )
          : sortedPatientsInfosUpdated.sort((a, b) =>
              b.PhoneNumber.find(
                ({ _phoneNumberType }) => _phoneNumberType === "C"
              )?.phoneNumber.localeCompare(
                a.PhoneNumber.find(
                  ({ _phoneNumberType }) => _phoneNumberType === "C"
                )?.phoneNumber
              )
            );
        break;
      case "home_phone":
        direction.current
          ? sortedPatientsInfosUpdated.sort((a, b) =>
              a.PhoneNumber.find(
                ({ _phoneNumberType }) => _phoneNumberType === "C"
              )?.phoneNumber.localeCompare(
                b.PhoneNumber.find(
                  ({ _phoneNumberType }) => _phoneNumberType === "R"
                )?.phoneNumber
              )
            )
          : sortedPatientsInfosUpdated.sort((a, b) =>
              b.PhoneNumber.find(
                ({ _phoneNumberType }) => _phoneNumberType === "C"
              )?.phoneNumber.localeCompare(
                a.PhoneNumber.find(
                  ({ _phoneNumberType }) => _phoneNumberType === "R"
                )?.phoneNumber
              )
            );
        break;
      case "work_phone":
        direction.current
          ? sortedPatientsInfosUpdated.sort((a, b) =>
              a.PhoneNumber.find(
                ({ _phoneNumberType }) => _phoneNumberType === "C"
              )?.phoneNumber.localeCompare(
                b.PhoneNumber.find(
                  ({ _phoneNumberType }) => _phoneNumberType === "W"
                )?.phoneNumber
              )
            )
          : sortedPatientsInfosUpdated.sort((a, b) =>
              b.PhoneNumber.find(
                ({ _phoneNumberType }) => _phoneNumberType === "C"
              )?.phoneNumber.localeCompare(
                a.PhoneNumber.find(
                  ({ _phoneNumberType }) => _phoneNumberType === "W"
                )?.phoneNumber
              )
            );
        break;
      case "sin":
        direction.current
          ? sortedPatientsInfosUpdated.sort((a, b) =>
              a.SIN.localeCompare(b.SIN)
            )
          : sortedPatientsInfosUpdated.sort((a, b) =>
              b.SIN.localeCompare(a.SIN)
            );

        break;
      case "address":
        direction.current
          ? sortedPatientsInfosUpdated.sort((a, b) =>
              a.Address[0].Structured.Line1.localeCompare(
                b.Address[0].Structured.Line1
              )
            )
          : sortedPatientsInfosUpdated.sort((a, b) =>
              b.Address[0].Structured.Line1.localeCompare(
                a.Address[0].Structured.Line1
              )
            );
        break;
      case "postal_code":
        direction.current
          ? sortedPatientsInfosUpdated.sort((a, b) =>
              (
                a.Address[0].Structured.PostalZipCode.PostalCode ||
                a.Address[0].Structured.PostalZipCode.ZipCode
              ).localeCompare(
                b.Address[0].Structured.PostalZipCode.PostalCode ||
                  b.Address[0].Structured.PostalZipCode.ZipCode
              )
            )
          : sortedPatientsInfosUpdated.sort((a, b) =>
              (
                b.Address[0].Structured.PostalZipCode.PostalCode ||
                b.Address[0].Structured.PostalZipCode.ZipCode
              ).localeCompare(
                a.Address[0].Structured.PostalZipCode.PostalCode ||
                  a.Address[0].Structured.PostalZipCode.ZipCode
              )
            );
        break;
      case "province_state":
        direction.current
          ? sortedPatientsInfosUpdated.sort((a, b) =>
              provinceStateTerritoryCT
                .find(
                  ({ code }) =>
                    code === a.Address[0].Structured.CountrySubDivisionCode
                )
                ?.name.localeCompare(
                  provinceStateTerritoryCT.find(
                    ({ code }) =>
                      code === b.Address[0].Structured.CountrySubDivisionCode
                  )?.name
                )
            )
          : sortedPatientsInfosUpdated.sort((a, b) =>
              provinceStateTerritoryCT
                .find(
                  ({ code }) =>
                    code === b.Address[0].Structured.CountrySubDivisionCode
                )
                ?.name.localeCompare(
                  provinceStateTerritoryCT.find(
                    ({ code }) =>
                      code === a.Address[0].Structured.CountrySubDivisionCode
                  )?.name
                )
            );
        break;
      case "city":
        direction.current
          ? sortedPatientsInfosUpdated.sort((a, b) =>
              a.Address[0].Structured.City.localeCompare(
                b.Address[0].Structured.City
              )
            )
          : sortedPatientsInfosUpdated.sort((a, b) =>
              b.Address[0].Structured.City.localeCompare(
                a.Address[0].Structured.City
              )
            );
        break;
      default:
        break;
    }
  };
  return (
    <>
      <PatientSearchForm setSearch={setSearch} search={search} />
      <PatientSearchResult
        search={search}
        sortedPatientsInfos={sortedPatientsInfos}
        handleSort={handleSort}
      />
    </>
  );
};

export default SearchPatient;
