export const onMessageTodos = (message, todos, setTodos, staffId) => {
  if (message.route !== "TO-DOS") return;
  switch (message.action) {
    case "create":
      if (message.content.data.staff_id === staffId) {
        setTodos([message.content.data, ...todos]);
      }
      break;
    case "update":
      setTodos(
        todos.map((item) =>
          item.id === message.content.id ? message.content.data : item
        )
      );
      break;
    case "delete":
      setTodos(todos.filter((item) => item.id !== message.content.id));
      break;
    default:
      break;
  }
};
