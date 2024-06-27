import React, { useState } from 'react';
import './Task.css';

interface TaskItem {
  id: number;
  title: string;
  completed: boolean;
  deadline: string;
  tags: string[];
  status: string;
}

const Task = () => {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [newTask, setNewTask] = useState<string>('');
  const [newDeadline, setNewDeadline] = useState<string>('');
  const [newTag, setNewTag] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [newStatus, setNewStatus] = useState<string>('Pending');
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };
  
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addTask = () => {
    if (newTask.trim() !== '') {
      const newTaskItem: TaskItem = {
        id: tasks.length + 1,
        title: newTask,
        completed: false,
        deadline: newDeadline,
        tags: tags,
        status: newStatus,
      };
      setTasks([...tasks, newTaskItem]);
      setNewTask('');
      setNewDeadline('');
      setTags([]);
      setNewStatus('Pending');
      setIsPanelOpen(false);
    }
  };

  const deleteTask = (id: number) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
  };

  const toggleTaskStatus = (id: number) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const startEditing = (task: TaskItem) => {
    setEditingTask(task);
    setNewTask(task.title);
    setNewDeadline(task.deadline);
    setTags(task.tags);
    setNewStatus(task.status);
    setIsPanelOpen(true);
  };

  const saveTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTask) {
      const updatedTasks = tasks.map(task =>
        task.id === editingTask.id
          ? { ...task, title: newTask, deadline: newDeadline, tags: tags, status: newStatus }
          : task
      );
      setTasks(updatedTasks);
      cancelEditing();
    }
  };

  const cancelEditing = () => {
    setEditingTask(null);
    setNewTask('');
    setNewDeadline('');
    setTags([]);
    setNewStatus('Pending');
    setIsPanelOpen(false);
  };


  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim() !== '') {
      e.preventDefault(); // Предотвращает отправку формы
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  return (
    <div className="container">
      <h1>Task Manager</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search tasks"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button 
          className={`add-button ${isPanelOpen ? 'active' : ''}`}
          onClick={togglePanel}>
            <span className="icon">+</span>
        </button>
      </div>

      {isPanelOpen && (
        <form onSubmit={editingTask ? saveTask : (e) => { e.preventDefault(); addTask(); }}>
          <input
            type="text"
            placeholder="Enter task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <input
            type="date"
            value={newDeadline}
            onChange={(e) => setNewDeadline(e.target.value)}
          />
          <div className="tag-input-container">
            {tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
                <button type="button" onClick={() => removeTag(tag)}>×</button>
              </span>
            ))}
            <input
              type="text"
              placeholder="Enter tag and press Enter"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleTagInput}
            />
          </div>
          <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          {editingTask ? (
            <div className={`inline-container`}>
              <button type="submit">Save</button>
              <button type="button" onClick={cancelEditing}>Cancel</button>
            </div>
          ) : (
            <button type="submit">Add Task</button>
          )}
        </form>
      )}

      <div className="task-list">
        {filteredTasks.map(task => (
          <div key={task.id} className="task-item">
            <span
              className={task.completed ? 'task-title completed' : 'task-title'}
              onClick={() => toggleTaskStatus(task.id)}
            >
              {task.title}
            </span>
            <span className="task-deadline">{task.deadline}</span>
            <span className="task-status">{task.status}</span>
            <div className="task-tags">
              {task.tags.map((tag, index) => (
                <span key={index} className="task-tag">
                  {tag}
                </span>
              ))}
            </div>
            <div className="task-actions">
              <button onClick={() => startEditing(task)}>Edit</button>
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Task;
