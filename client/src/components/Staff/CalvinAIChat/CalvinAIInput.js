import SendIcon from "@mui/icons-material/Send";
import { Button, TextField } from "@mui/material";
import TypingDots from "../../UI/Buttons/TypingDots";

const CalvinAIInput = ({ handleChangeInput, value, handleAskGPT, loading }) => {
  return (
    <div className="calvinai-chat__input">
      <TextField
        className="calvinai-chat__textarea"
        placeholder="Type a message..."
        variant="outlined"
        onChange={handleChangeInput}
        value={value}
        multiline
        rows={2}
        sx={{
          "& fieldset": { border: "none" },
        }}
      />
      {loading ? (
        <TypingDots text="" />
      ) : (
        <Button
          className="calvinai-chat__send-btn"
          variant="contained"
          color="primary"
          onClick={handleAskGPT}
        >
          <SendIcon />
        </Button>
      )}
    </div>
  );
};

export default CalvinAIInput;
