import userLogo from "../../../assets/img/doctorLogo.png";
import botLogo from "../../../assets/img/logoCarre.png";

const CalvinAIChatMessage = ({ role, message }) => {
  return (
    <div
      className="calvinai-chat__card"
      style={{ background: role === "user" ? "#FEFEFE" : "#50B1C1" }}
    >
      {role === "user" ? (
        <img
          src={userLogo}
          alt="user logo"
          className="calvinai-chat__img-user"
        />
      ) : (
        <img src={botLogo} alt="bot logo" className="calvinai-chat__img-bot" />
      )}
      <p className="calvinai-chat__message">{message.content}</p>
    </div>
  );
};

export default CalvinAIChatMessage;
