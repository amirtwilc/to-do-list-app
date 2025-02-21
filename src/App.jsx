import { useState } from 'react'
import './App.css'


function Header(props) {  // Accept props as a parameter
  return <h1>{props.title}</h1>;  // Use props.title
}

function Button(props) {
  return <button onClick={props.onClick}>{props.text}</button>
}

function App() {

  const [taskName, setTaskName] = useState('');
  const [tasks, setTasks] = useState([]);
  

  function addTask(taskText) {
    const newTask = {
      id: tasks.length + 1,  // You can also use a better unique id method
      text: taskText,
      completed: false
    };
    setTasks([...tasks, newTask]);  // Add new task to the tasks list
    setTaskName("");
  }

  function removeTask(id) {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
  }


  function toggleTaskCompletion(id) {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  }

  return (
    <div>
      <Header title="To-Do List"/>
      
      <input value={taskName} placeholder="Add new task" onChange={e => setTaskName(e.target.value)}/>
      <Button text="Add Task" onClick={() => addTask(taskName)}/>

      <ul>
        {tasks.map(task => (
            <li key={task.id}>
              {task.text}
              <input 
                type="checkbox" 
                checked={task.completed} 
                onClick={() => toggleTaskCompletion(task.id)} 
              />
              <Button text="Delete" onClick={() => removeTask(task.id)} />

            </li>
          ))};
      </ul>
    </div>
  )
}

export default App
