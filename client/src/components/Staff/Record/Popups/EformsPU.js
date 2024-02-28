import { PDFDocument } from "pdf-lib";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { postPatientRecord } from "../../../../api/fetchRecords";
import { axiosXanoStaff } from "../../../../api/xanoStaff";
import useAuthContext from "../../../../hooks/useAuthContext";
import useIntersection from "../../../../hooks/useIntersection";
import useSocketContext from "../../../../hooks/useSocketContext";
import useUserContext from "../../../../hooks/useUserContext";
import ConfirmGlobal from "../../../All/Confirm/ConfirmGlobal";
import EmptyRow from "../../../All/UI/Tables/EmptyRow";
import LoadingRow from "../../../All/UI/Tables/LoadingRow";
import ToastCalvin from "../../../All/UI/Toast/ToastCalvin";
import Eform from "../Topics/Eforms/Eform";
import EformItem from "../Topics/Eforms/EformItem";
const BASE_URL = "https://xsjk-1rpe-2jnw.n7c.xano.io";

const EformsPU = ({
  topicDatas,
  hasMore,
  loading,
  errMsg,
  setPaging,
  patientId,
  setPopUpVisible,
  demographicsInfos,
}) => {
  //HOOKS
  const { user } = useUserContext();
  const { auth } = useAuthContext();
  const { socket } = useSocketContext();
  const [addVisible, setAddVisible] = useState(false);
  const [isLoadingFile, setIsLoadingFile] = useState(false);

  //INTERSECTION OBSERVER
  const { rootRef, lastItemRef } = useIntersection(loading, hasMore, setPaging);

  //HANDLERS
  const handleAdd = (e) => {
    setAddVisible((v) => !v);
  };

  const handleClose = async (e) => {
    setPopUpVisible(false);
  };

  const handleAddToRecord = (e) => {
    let input = e.nativeEvent.view.document.createElement("input");
    input.type = "file";
    input.accept = ".pdf";
    input.onchange = (e) => {
      // getting a hold of the file reference
      let file = e.target.files[0];
      if (file.size > 25000000) {
        toast.error("The file is over 25Mb, please choose another one", {
          containerId: "B",
        });
        return;
      }
      setIsLoadingFile(true);
      // setting up the reader`
      let reader = new FileReader();
      reader.readAsDataURL(file);
      // here we tell the reader what to do when it's done reading...
      reader.onload = async (e) => {
        let content = e.target.result;
        try {
          const response = await axiosXanoStaff.post(
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
          //flatten the pdf
          const formUrl = `${BASE_URL}${response.data.path}`;
          const formPdfBytes = await fetch(formUrl).then((res) =>
            res.arrayBuffer()
          );
          const pdfDoc = await PDFDocument.load(formPdfBytes);
          const form = pdfDoc.getForm();
          form.flatten();
          const pdfBytes = await pdfDoc.save();
          //read the new flattened pdf
          let reader2 = new FileReader();
          reader2.readAsDataURL(
            new Blob([pdfBytes], { type: "application/pdf" })
          );
          // here we tell the reader what to do when it's done reading...
          reader2.onload = async (e) => {
            let content = e.target.result;
            try {
              const response2 = await axiosXanoStaff.post(
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
              const datasToPost = {
                patient_id: patientId,
                name: file.name,
                file: response2.data,
              };
              const response = await postPatientRecord(
                "/eforms",
                user.id,
                auth.authToken,
                datasToPost
              );
              socket.emit("message", {
                route: "E-FORMS",
                action: "create",
                content: { data: response.data },
              });

              toast.success(`Form successfully added to patient record`, {
                containerId: "B",
              });
              setIsLoadingFile(false);
              setAddVisible(false);
            } catch (err) {}
          };
        } catch (err) {
          toast.error(`Error: unable to save file: ${err.message}`, {
            containerId: "B",
          });
          setIsLoadingFile(false);
        }
      };
    };
    input.click();
  };

  return (
    <>
      <h1 className="eforms__title">
        Patient e-forms <i className="fa-regular fa-newspaper"></i>
      </h1>
      {errMsg && <div className="eforms__err">{errMsg}</div>}
      {!errMsg && (
        <>
          <div className="eforms__table-container" ref={rootRef}>
            <table className="eforms__table">
              <thead>
                <tr>
                  <th>Action</th>
                  <th>Name</th>
                  <th>Created By</th>
                  <th>Created On</th>
                </tr>
              </thead>
              <tbody>
                {topicDatas && topicDatas.length > 0
                  ? topicDatas.map((item, index) =>
                      index === topicDatas.length - 1 ? (
                        <EformItem
                          item={item}
                          key={item.id}
                          lastItemRef={lastItemRef}
                        />
                      ) : (
                        <EformItem item={item} key={item.id} />
                      )
                    )
                  : !loading &&
                    !addVisible && (
                      <EmptyRow colSpan="4" text="No risk factors" />
                    )}
                {loading && <LoadingRow colSpan="4" />}
              </tbody>
            </table>
          </div>

          <div className="eforms__btn-container">
            <button onClick={handleAdd} disabled={addVisible}>
              Add e-form
            </button>
            <button onClick={handleClose} disabled={isLoadingFile}>
              Close
            </button>
          </div>
        </>
      )}

      {addVisible && (
        <Eform
          setAddVisible={setAddVisible}
          patientId={patientId}
          handleAddToRecord={handleAddToRecord}
          isLoadingFile={isLoadingFile}
          setIsLoadingFile={setIsLoadingFile}
          demographicsInfos={demographicsInfos}
        />
      )}

      <ConfirmGlobal isPopUp={true} />
      <ToastCalvin id="B" />
    </>
  );
};

export default EformsPU;
