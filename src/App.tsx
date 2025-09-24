import { useState, ChangeEvent } from 'react'
import './App.css'

interface Task{
  id: number;
  name: string;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: Date;
}

function App() {
  const [data, setData] = useState <Task[]>([]);

  const [task, setTask] = useState <string>('');

  const [editId, setEditId] = useState <number | null>(null);

  const addTask = () => {

    if (editId !== null) {
      const updated = data.map((t) => 
      t.id === editId ? { ...t, name: task } : t)
      setData(updated);
      setEditId(null);
    } else {
      setData([...data, {
        id: Date.now(),
        name: task,
        status: 'pending',
        createdAt: new Date()
      }]);
    }
    setTask('');
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTask(e.target.value);
  };
  const deleteTask = (id: number) => {
    const filtered = data.filter((task) => task.id !== id);
    setData(filtered);
  };

  const editTask = (id: number) => {
    const taskToEdit = data.find((task) => task.id === id);
   
    if (taskToEdit) {
      setTask(taskToEdit.name);
      setEditId(id);
    }
  };

  const updateTaskStatus = (id: number, newStatus: 'pending' | 'in-progress' | 'completed') => {
    const updated = data.map((task) => 
      task.id === id ? { ...task, status: newStatus } : task
    );
    setData(updated);
  };

  const getTasksByStatus = (status: 'pending' | 'in-progress' | 'completed') => {
    return data.filter(task => task.status === status);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#28a745';
      case 'in-progress': return '#ffc107';
      case 'pending': return '#6c757d';
      default: return '#6c757d';
    }
  };



  return (
    <div className="App">
      
      <h1>To-Do List</h1>
      
      {/* Add Task Input */}
      <div className="input-wrapper">
        <input 
          type="text" 
          value={task}
          onChange={handleInputChange} 
          placeholder='Add a new task'
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
        />
        <button onClick={addTask}>{editId ? 'Update' : 'Add'}</button>
      </div>

      {/* Task Statistics */}
      <div className="task-stats">
        <div className="stat">
          <span className="stat-number">{getTasksByStatus('pending').length}</span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="stat">
          <span className="stat-number">{getTasksByStatus('in-progress').length}</span>
          <span className="stat-label">In Progress</span>
        </div>
        <div className="stat">
          <span className="stat-number">{getTasksByStatus('completed').length}</span>
          <span className="stat-label">Completed</span>
        </div>
      </div>

      {/* Task Sections */}
      {['pending', 'in-progress', 'completed'].map((status) => {
        const taskList = getTasksByStatus(status as 'pending' | 'in-progress' | 'completed');
        if (taskList.length === 0) return null;
        
        return (
          <div key={status} className="task-section">
            <h3 className="section-title">
              {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')} 
              ({taskList.length})
            </h3>
            <ul>
              {taskList.map((taskItem) => (
                <li key={taskItem.id} className={`task-item ${taskItem.status}`}>
                  <div className="task-content">
                    <span className={`task-name ${taskItem.status === 'completed' ? 'completed' : ''}`}>
                      {taskItem.name}
                    </span>
                    <div className="task-meta">
                      <span 
                        className="status-badge" 
                        style={{ backgroundColor: getStatusColor(taskItem.status) }}
                      >
                        {taskItem.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="manage-btn">
                    {/* Status Change Buttons */}
                    {taskItem.status === 'pending' && (
                      <button 
                        className="status-btn start-btn"
                        onClick={() => updateTaskStatus(taskItem.id, 'in-progress')}
                      >
                        Start
                      </button>
                    )}
                    {taskItem.status === 'in-progress' && (
                      <>
                        <button 
                          className="status-btn complete-btn"
                          onClick={() => updateTaskStatus(taskItem.id, 'completed')}
                        >
                          Complete
                        </button>
                        <button 
                          className="status-btn pause-btn"
                          onClick={() => updateTaskStatus(taskItem.id, 'pending')}
                        >
                          Pause
                        </button>
                      </>
                    )}
                    {taskItem.status === 'completed' && (
                      <button 
                        className="status-btn reopen-btn"
                        onClick={() => updateTaskStatus(taskItem.id, 'pending')}
                      >
                        Reopen
                      </button>
                    )}
                    
                    {/* Edit and Delete Buttons */}
                    <button 
                      className="edit-btn"
                      onClick={() => editTask(taskItem.id)}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => deleteTask(taskItem.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      {data.length === 0 && (
        <div className="empty-state">
          <p>No tasks yet. Add your first task above! 📝</p>
        </div>
      )}
    </div>
  );
}

export default App;
