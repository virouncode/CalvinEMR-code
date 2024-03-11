import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import xanoDelete from "../../../../api/xanoCRUD/xanoDelete";
import xanoPut from "../../../../api/xanoCRUD/xanoPut";
import useSocketContext from "../../../../hooks/useSocketContext";

const TodoItem = ({ todo, lastItemRef = null }) => {
  const { socket } = useSocketContext();
  const [editVisible, setEditVisible] = useState(false);
  const [formDatas, setFormDatas] = useState({});

  useEffect(() => {
    setFormDatas(todo);
  }, [todo]);

  const handleChange = (e) => {
    const value = e.target.value;
    setFormDatas({ ...formDatas, description: value });
  };
  const handleCheckTodo = async (e) => {
    const checked = e.target.checked;
    setFormDatas({ ...formDatas, checked: checked });
    try {
      const response = await xanoPut(`/todos/${todo.id}`, "staff", {
        ...formDatas,
        checked: checked,
      });
      socket.emit("message", {
        route: "TODOS",
        action: "update",
        content: { id: todo.id, data: response.data },
      });
      toast.success(`To do item changed successfully`, {
        containerId: "A",
      });
    } catch (err) {
      toast.error(`Unable to save to do item: ${err.message}`, {
        containerId: "A",
      });
    }
  };
  const handleEdit = () => {
    setEditVisible(true);
  };
  const handleDelete = async () => {
    try {
      await xanoDelete(`/todos/${todo.id}`, "staff");
      socket.emit("message", {
        route: "TODOS",
        action: "delete",
        content: { id: todo.id },
      });
      toast.success(`To do item deleted successfully`, {
        containerId: "A",
      });
    } catch (err) {
      toast.error(`Unable to delete to do item: ${err.message}`, {
        containerId: "A",
      });
    }
  };
  const handleSave = async () => {
    try {
      const response = await xanoPut(`/todos/${todo.id}`, "staff", formDatas);
      socket.emit("message", {
        route: "TODOS",
        action: "update",
        content: { id: todo.id, data: response.data },
      });
      toast.success(`To do item changed successfully`, {
        containerId: "A",
      });
      setEditVisible(false);
    } catch (err) {
      toast.error(`Unable to save to do item: ${err.message}`, {
        containerId: "A",
      });
    }
  };
  const handleCancel = () => {
    setEditVisible(false);
  };
  return (
    <div className="todos__item" ref={lastItemRef}>
      <div className="todos__item-content">
        <input
          type="checkbox"
          id={todo.id}
          checked={formDatas.checked}
          onChange={handleCheckTodo}
        />
        {editVisible ? (
          <input
            type="text"
            value={formDatas.description}
            onChange={handleChange}
          />
        ) : (
          <div>{todo.description}</div>
        )}
      </div>
      {editVisible ? (
        <div className="todos__btn-container">
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      ) : (
        <div className="todos__btn-container">
          <button onClick={handleEdit}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default TodoItem;
