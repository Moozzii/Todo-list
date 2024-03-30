import Navbar from "./Components/Navbar";
import { FaEdit } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";


function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingId, setEditingId] = useState(null); 
  const [showfinished, setshowfinished ] = useState(true); 
  
  useEffect(() => {
    let todoString = localStorage.getItem("todos")
    if(todoString){
      let todos = JSON.parse(todoString)
      setTodos(todos)

    }
  }, [])
  

  const SaveToLS = () => {
    localStorage.setItem("todos", JSON.stringify(todos));
    
    
  }
  const toggleFinished = () => {
    setshowfinished(!showfinished)
    
  }
  
  

  const HandleCheckbox = (e) => {
    const id = e.target.name;
    const updatedTodos = todos.map((item) =>
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    );
    setTodos(updatedTodos);
    SaveToLS();
  };

  const HandleChange = (e) => {
    setTodo(e.target.value);
  };

  const HandleEdit = (id) => {
    // Find the todo item to edit
    const todoToEdit = todos.find((item) => item.id === id);
    // Set the todo state to the text of the todo item being edited
    setTodo(todoToEdit.todo);
    // Set the editingId state to the id of the todo being edited
    setEditingId(id);
  };

  const HandleDelete = (id) => {
    const confirmation = window.confirm("Are you sure you want to delete this?");
    if (confirmation) {
      const updatedTodos = todos.filter((item) => item.id !== id);
      setTodos(updatedTodos);
      SaveToLS();
    }
  };

  const HandleAdd = () => {
    if (!todo.trim()) {
      
      alert("Please enter something!");
      return; 
  }
    if (editingId !== null) {
      // If editingId is not null, update the existing todo item
      const updatedTodos = todos.map((item) =>
        item.id === editingId ? { ...item, todo } : item
      );
      setTodos(updatedTodos);
      // Reset editingId and todo state
      setEditingId(null);
      setTodo("");
    } else {
      // If editingId is null, add a new todo item
      setTodos([...todos, { id: uuidv4(), todo, isCompleted: false }]);
      setTodo("");
      SaveToLS();
    }
  };

  return (
    <>
      <Navbar />
      <div className="mx-3 md:container md:mx-auto bg-violet-100 text-black p-5 rounded-xl my-5 min-h-[80vh] md:w-[38%]">
        <h1 className="font-bold text-center text-3xl">iTask - Manage your todos at one place</h1>
        <div className="addtodo my-8 flex flex-col ">
          <h2 className="text-2xl font-bold ">Add a Todo</h2>
          <div className="flex">

          <input
            onChange={HandleChange}
            value={todo}
            type="text"
            className="w-full my-2 rounded-lg py-3 mx-2 px-2"
            placeholder="Enter your todo"
          />
          <button
            onClick={HandleAdd}
            disabled={todo.length<=3}
            
            className="text-white font-bold text-md bg-violet-800 disabled:hover:cursor-not-allowed my-2 hover:bg-violet-950 p-4 py-1 rounded-md "
          >
            {editingId !== null ? "Update" : "Save"}
          </button>
          </div>
        </div>
        <input className="text-xl  font-bold " id="show" type="checkbox" onChange={toggleFinished}  checked={showfinished} /> 
        <label className="mx-2" htmlFor="show">Show Finished</label>
        <div className="h-1 bg-black my-2 opacity-15">
        <hr />

        </div>
        <h2 className="font-bold text-2xl my-2">Your Todos</h2>
        <div className="todos">
          {todos.length === 0 && (
            <div className="mx-6 text-xl my-6">No todos to display</div>
          )}

          {todos.map((item) => (

            (showfinished || !item.isCompleted) && <div key={item.id} className="flex todo  justify-between md:w-full my-3 ">
              <div className="flex gap-5 my-2 ">
                <input
                
                  onChange={HandleCheckbox}
                  type="checkbox"
                  checked={item.isCompleted}
                  name={item.id}
                />
                <div  className={item.isCompleted ? "line-through" : ""} >{item.todo}</div>
              </div>
              <div className="buttons flex h-full">
                <button
                  onClick={() => HandleEdit(item.id)}
                  className="text-white font-bold text-md bg-violet-800 hover:bg-violet-950 p-3 py-2 rounded-md m-1"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => HandleDelete(item.id)}
                  className="text-white font-bold text-md bg-violet-800 hover:bg-violet-950 p-3 py-2 rounded-md m-1"
                >
                  <MdDelete />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
