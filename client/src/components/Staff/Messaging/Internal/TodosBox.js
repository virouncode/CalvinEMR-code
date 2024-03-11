import React, { useState } from "react";
import useFetchTodos from "../../../../hooks/useFetchTodos";
import useIntersection from "../../../../hooks/useIntersection";
import useTodosSocket from "../../../../hooks/useTodosSocket";
import useUserContext from "../../../../hooks/useUserContext";
import EmptyParagraph from "../../../All/UI/Paragraphs/EmptyParagraph";
import LoadingParagraph from "../../../All/UI/Tables/LoadingParagraph";
import TodoForm from "./TodoForm";
import TodoItem from "./TodoItem";

const TodosBox = ({ search, newTodoVisible, setNewTodoVisible }) => {
  const { user } = useUserContext();
  const [pagingTodos, setPagingTodos] = useState({
    page: 1,
    perPage: 10,
    offset: 0,
  });

  const { todos, setTodos, loadingTodos, errMsgTodos, hasMoreTodos } =
    useFetchTodos(pagingTodos, search, user.id);
  //INTERSECTION OBSERVER
  const { rootRef, lastItemRef } = useIntersection(
    loadingTodos,
    hasMoreTodos,
    setPagingTodos
  );
  useTodosSocket(todos, setTodos);

  return (
    <>
      <div className="todos__box" ref={rootRef}>
        {errMsgTodos && <div className="todos__err">{errMsgTodos}</div>}
        {newTodoVisible && <TodoForm setNewTodoVisible={setNewTodoVisible} />}
        {!errMsgTodos &&
          (todos && todos.length > 0
            ? todos.map((item, index) =>
                index === todos.length - 1 ? (
                  <TodoItem todo={item} lastItemRef={lastItemRef} />
                ) : (
                  <TodoItem todo={item} />
                )
              )
            : !loadingTodos && <EmptyParagraph text="No to dos" />)}
        {loadingTodos && <LoadingParagraph />}
      </div>
      {/* {newToDoVisible && (
        <FakeWindow
          title="NEW MESSAGE"
          width={1000}
          height={600}
          x={(window.innerWidth - 1000) / 2}
          y={(window.innerHeight - 600) / 2}
          color={"#94bae8"}
          setPopUpVisible={setNewVisible}
        >
          <NewMessage setNewVisible={setNewVisible} />
        </FakeWindow>
      )} */}
    </>
  );
};

export default TodosBox;
