import userLogo from "../../../../../assets/img/doctorLogo.png";
import botLogo from "../../../../../assets/img/logoCarre.png";

const CalvinAIMessage = ({ role, message }) => {
  return (
    <div
      className="calvinai-discussion__card"
      style={{ background: role === "user" ? "#FEFEFE" : "#50B1C1" }}
    >
      {role === "user" ? (
        <img
          src={userLogo}
          alt="user logo"
          className="calvinai-discussion__img-user"
        />
      ) : (
        <img
          src={botLogo}
          alt="bot logo"
          className="calvinai-discussion__img-bot"
        />
      )}
      <p className="calvinai-discussion__message">{message.content}</p>
    </div>
  );
};

export default CalvinAIMessage;
