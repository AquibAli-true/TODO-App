import React, { useRef } from "react";
import { useState, useEffect } from "react";
import plusIcon from "./assets/svg/add-svgrepo-com.svg";
import checkButton from "./assets/svg/checked.svg";
import uncheckButton from "./assets/svg/unchecked.svg";
import editButton from "./assets/svg/editButton.svg";
import editSubmitButton from "./assets/svg/editSubmit.svg";
import removeButton from "./assets/svg/remove.svg";

const TodoMain = () => {
  const [task, setTask] = useState("");
  const [taskList, setTaskList] = useState(new Map());
  const [editId, setEditId] = useState(null);
  const [editVar, setEditVar] = useState("");


  useEffect(() => {
      let resTask=null;
      let resHistory=null;
      let taskArray=null;
      let historyArray=null;
    const initiator = async ()=>{
      try{
      resTask = await fetch('http://localhost:3333/data');
      resHistory = await fetch('http://localhost:3333/history');
      taskArray=await resTask.json();
      historyArray= await resHistory.json();
      } catch(err){
        console.log(err);
      }
    }

    const manager = async () =>{
      await initiator();
    if (taskArray.length!== 0) {
      const taskMap = new Map(taskArray.map(({id,...rest})=>[id,rest]));
      setTaskList(taskMap);
    }
    if(historyArray.length!==0){
      const historyMap=new Map(historyArray.map(({id,...rest})=>[id,rest]));
    }
  if(!(resTask.ok || resHistory.ok)){
      console.log(resTask.statusText)
      console.log(resHistory.statusText)
    }
    }
    manager();

  }, []);

  const handleInput=async(e)=>{
    setTask(e);
  }


  const handleSubmit = async () => {
    const trimmedText = task.trim();
    const id = Date.now();
    const createdAt = new Date().toLocaleString("sv-SE");
    if (!trimmedText) return;
    const newMap = new Map(taskList);
    newMap.set(id, {
      completed: false,
      text: trimmedText,
      createdAt: createdAt,
    });
    setTaskList(newMap);
    setTask("");
    const response = await fetch("http://localhost:3333/task", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        id: id,
        completed: false,
        text: trimmedText,
        createdAt: createdAt,
      }),
    });
    if (!response.ok) {
      console.log(response.status);
      console.log(response.statusText);
    }
  };

  const handleEdit = (value) => {
    setEditVar(value);
  };

  const handleEditButton = async (id, originTime) => {
    if (editId === null) {
      setEditId(id);
      return;
    } else {
      const trimmedText = editVar.trim();
      if (!trimmedText) {
        setEditId(null);
        return;
      }
      const newMap = new Map(taskList);
      newMap.set(id, {
        completed: false,
        text: trimmedText,
        createdAt: originTime,
      });
      setTaskList(newMap);
      setEditId(null);
      setEditVar("");
      const response = await fetch("http://localhost:3333/edit", {
        method: "PATCH",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          id: id,
          text: trimmedText,
        }),
      });
      if (!response.ok) {
        console.log(response.status);
        console.log(response.statusText);
      }
    }
  };

  const handleDoneButton = async (id, text, originTime, done) => {
    const newMap = new Map(taskList);
    newMap.set(id, {
      completed: !done,
      text: text,
      createdAt: originTime,
    });
    setTaskList(newMap);
      const response = await fetch("http://localhost:3333/check", {
        method: "PATCH",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          id: id,
          completed: !done,
        }),
      });
      if (!response.ok) {
        console.log(response.status);
        console.log(response.statusText);
      }
  };

  const handleTaskDeletion = async (id) => {
    const newMap = new Map(taskList);
    newMap.delete(id);
    setTaskList(newMap);
    const response = await fetch("http://localhost:3333/delete", {
      method: "DELETE",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        id: id,
      }),
    });
    if (!response.ok) {
      console.log(response.status);
      console.log(response.statusText);
    }
  };

  return (
    <section className="flex flex-col items-center gap-5 fixed top-[24vh] lg:top-[12vh] left-[10vw] md:left-[11vw] lg:left-[25vw]">
      <div className="flex justify-between w-[60vw] sm:w-[70vw] lg:w-[50vw] rounded-xl bg-[#25273D] p-2 sm:p-5">
        <input
          className="focus:outline-none font-inter text-white box-border w-[90%]"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSubmit();
            }
          }}
          type="text"
          value={task}
          onChange={(e) => {
            handleInput(e.target.value);
          }}
        />
        <button
          onClick={handleSubmit}
          type="button"
          className="bg-[#009CDB] cursor-pointer hover:duration-400 hover:bg-blue-400 rounded-md p-1"
        >
          <img className="w-3.5 h-3.5 sm:w-5 sm:h-5" src={plusIcon} alt="Create a new task" />
        </button>
      </div>
      <div className="bg-[#25273D] flex flex-col overflow-y-scroll scrollbar-thin scrollbar-thumb-[#9C77C4] scrollbar-track-[#25273D] items-center gap-3 w-[80vw] lg:w-[50vw] h-[60vh] lg:h-[70vh] p-3 rounded-xl text-white">
        {[...taskList].map(([id, object]) => (
          <div className="w-[99%] px-3 py-2 flex justify-between items-center border-b border-gray-400 bg-[#25273D]">
            {editId === id ? (
              <input
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleEditButton(id, object.createdAt);
                  }
                }}
                className="focus:outline-none font-inter text-white box-border w-[90%]"
                type="text"
                value={editVar}
                onChange={(e) => {
                  handleEdit(e.target.value);
                }}
              />
            ) : (
              <div className="md:w-[80%] w-[60%] overflow-x-clip">
                {object.completed ? <s>{object.text}</s> : <p>{object.text}</p>}
              </div>
            )}
            <div className="flex gap-3">
              <button
                className="cursor-pointer hover:rounded-full hover:bg-gray-400/20 hover:duration-400 p-1"
                onClick={() => {
                  handleEditButton(id, object.createdAt);
                }}
              >
                {editId === id ? (
                  <img
                    className="w-3.5 h-3.5 sm:w-5 sm:h-5"
                    src={editSubmitButton}
                    alt="Click to edit"
                  />
                ) : (
                  <img
                    className="w-3.5 h-3.5 sm:w-5 sm:h-5"
                    src={editButton}
                    alt="edit submit button"
                  />
                )}
              </button>
              <button
                className="cursor-pointer hover:rounded-full hover:bg-gray-400/20 hover:duration-400 p-1"
                onClick={() => {
                  handleTaskDeletion(id);
                }}
              >
                <img className="w-3.5 h-3.5 sm:w-5 sm:h-5" src={removeButton} alt="delete task" />
              </button>
              <button
                className="cursor-pointer hover:rounded-full hover:bg-gray-400/20 hover:duration-400 p-1"
                onClick={() => {
                  handleDoneButton(
                    id,
                    object.text,
                    object.createdAt,
                    object.completed,
                  );
                }}
              >
                {" "}
                {object.completed ? (
                  <img
                    className="w-3.5 h-3.5 sm:w-5 sm:h-5"
                    src={checkButton}
                    alt="task not finished"
                  />
                ) : (
                  <img
                    className="w-3.5 h-3.5 sm:w-5 sm:h-5"
                    src={uncheckButton}
                    alt="task finished"
                  />
                )}{" "}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TodoMain;
