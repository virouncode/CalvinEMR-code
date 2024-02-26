import { toPatientName } from "../../../../utils/toPatientName";
import MessagesAttachments from "../MessagesAttachments";
import Message from "./Message";

const MessagesPrintPU = ({ message, previousMsgs, attachments }) => {
  const handleClickPrint = (e) => {
    e.nativeEvent.view.print();
  };
  return (
    <div className="messages-print__container">
      <div className="messages-print__section">
        <div className="messages-print__title">
          <p className="messages-print__subject">
            <strong>Subject:{"\u00A0"}</strong>
            {message.subject}
          </p>
          {message.related_patient_id ? (
            <p className="messages-print__patient">
              <strong>Patient:{"\u00A0"}</strong>
              {toPatientName(message.patient_infos)}
            </p>
          ) : null}
        </div>
        <div className="messages-print__content">
          <Message message={message} key={message.id} index={0} />
          {previousMsgs &&
            previousMsgs.map(
              (message, index) =>
                (message.type = "Internal" ? (
                  <Message
                    message={message}
                    key={message.id}
                    index={index + 1}
                  />
                ) : (
                  <Message
                    message={message}
                    key={message.id}
                    index={index + 1}
                  />
                ))
            )}
          <MessagesAttachments
            attachments={attachments}
            deletable={false}
            cardWidth="20%"
            addable={false}
          />
        </div>
        <div className="messages-print__btn">
          <button onClick={handleClickPrint}>Print</button>
        </div>
      </div>
    </div>
  );
};

export default MessagesPrintPU;
