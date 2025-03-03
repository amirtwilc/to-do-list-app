import { useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import './App.css'


function Header(props) {  // Accept props as a parameter
  return <h1>{props.title}</h1>;  // Use props.title
}

function Button(props) {
  return <button onClick={props.onClick}>{props.text}</button>
}

function isValidDate(str) {
  if (!str) return false;  // Handle empty string
  
  // Check if the string matches the expected date format (YYYY-MM-DD)
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  if (!datePattern.test(str)) return false;
  
  const date = new Date(str); 
  return !isNaN(date.getTime());  // Check if it's a valid date
}

function formatISODate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

function App() {

  const [taskName, setTaskName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [importantFlag, setImportantFlag] = useState(false);
  const [tasks, setTasks] = useState(() => {
    // Initialize state with localStorage data
    const savedTasks = localStorage.getItem("tasks");
    return savedTasks ? JSON.parse(savedTasks) : [];
  });


  useEffect(() => {
    // Only update localStorage if there are tasks
    // This prevents clearing localStorage when tasks is empty on initial load
    if (tasks && tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    } else if (tasks.length === 0 && localStorage.getItem("tasks")) {
      // Only clear localStorage if we explicitly deleted all tasks
      // (not on initial page load)
      localStorage.setItem("tasks", JSON.stringify([]));
    }
  }, [tasks]);
  

  function addTask(taskText, dueDate) {
    console.log("dueDate is: "+ dueDate);
    if (!taskText.trim() || !isValidDate(dueDate)) {
      alert("Both task and valid due date are required.");
      return; // Prevent empty tasks
    }
    const newTask = {
      id: Date.now(),  // You can also use a better unique id method
      text: taskText,
      dueDate: new Date(dueDate).toISOString(),
      completed: false
    };
    setTasks([...tasks, newTask]);  // Add new task to the tasks list
    setTaskName("");
    setDueDate('');
  }

  function removeTask(id) {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
  }

  function handleDragEnd(result) {
    if (!result.destination) return;

    const reorderedTasks = Array.from(tasks);
    const [movedTask] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, movedTask);

    setTasks(reorderedTasks);
  }

  function handleDoubleClick(taskId) {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, importantFlag: !task.importantFlag }  // Toggle the importantFlag
        : task
    ));
  }

  return (
    <div>
      <Header title="To-Do List"/>
      
      <input 
        value={taskName} 
        placeholder="Add new task" 
        onChange={e => setTaskName(e.target.value)}
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <Button text="Add Task" onClick={() => addTask(taskName, dueDate)}/>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                  {(provided) => (
                    <li 
                      onDoubleClick={() => handleDoubleClick(task.id)}
                      className={`task-item ${task.importantFlag ? 'important' : ''}`}
                      ref={provided.innerRef} 
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      //className="task-item"
                      >
                    {task.text}
                    {task.dueDate && <span>{formatISODate(task.dueDate)}</span>}
                    <input 
                      type="checkbox" 
                      checked={task.completed} 
                      onChange={() => {
                        setTasks(tasks.map(t => 
                          t.id === task.id ? { ...t, completed: !t.completed } : t
                        ));
                      }}
                    />
                    <Button text="Delete" onClick={() => removeTask(task.id)} />
                  </li>
                  )}
                </Draggable>

              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>

    </div>
  )
}

export default App
