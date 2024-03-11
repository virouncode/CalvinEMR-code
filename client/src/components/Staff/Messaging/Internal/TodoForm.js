import React, { useState } from "react";
import { toast } from "react-toastify";
import xanoPost from "../../../../api/xanoCRUD/xanoPost";
import useSocketContext from "../../../../hooks/useSocketContext";
import useUserContext from "../../../../hooks/useUserContext";

const TodoForm = ({ setNewTodoVisible }) => {
  const { user } = useUserContext();
  const { socket } = useSocketContext();
  const [formDatas, setFormDatas] = useState({
    staff_id: user.id,
    description: "",
    checked: false,
  });

  const handleChange = (e) => {
    const value = e.target.value;
    setFormDatas({ ...formDatas, description: value });
  };
  const handleCheckTodo = async (e) => {
    const checked = e.target.checked;
    setFormDatas({ ...formDatas, checked: checked });
  };
  const handleSave = async () => {
    try {
      const datasToPost = { ...formDatas, date_created: Date.now() };
      const response = await xanoPost("/todos", "staff", datasToPost);
      socket.emit("message", {
        route: "TODOS",
        action: "create",
        content: { id: response.data.id, data: response.data },
      });
      toast.success(`To do item saved successfully`, {
        containerId: "A",
      });
      setNewTodoVisible(false);
    } catch (err) {
      toast.error(`Unable to save to do item: ${err.message}`, {
        containerId: "A",
      });
    }
  };
  const handleCancel = () => {
    setNewTodoVisible(false);
  };
  return (
    <div className="todos__item">
      <div className="todos__item-content">
        <input
          type="checkbox"
          checked={formDatas.checked}
          onChange={handleCheckTodo}
        />
        <input
          type="text"
          value={formDatas.description}
          onChange={handleChange}
        />
      </div>
      <div className="todos__btn-container">
        <button onClick={handleSave}>Save</button>
        <button onClick={handleCancel}>Cancel</button>
      </div>
    </div>
  );
};

export default TodoForm;
