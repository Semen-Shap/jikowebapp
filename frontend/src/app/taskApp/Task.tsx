import React, { useState, useEffect } from 'react';
import './Task.css';
import { getTasks, addTask, updateTask, deleteTask } from '../../shared/api/taskApi';
import { TaskItem } from '../../shared/interface/appInterface';
import { formatDate } from '../../utils/format';


const Task: React.FC = () => {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [newTask, setNewTask] = useState<string>('');
  const [newDeadline, setNewDeadline] = useState<string>('');
  const [newTag, setNewTag] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]); // tags как массив строк
  const [newStatus, setNewStatus] = useState<string>('Pending');
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksData = await getTasks();
        setTasks(Array.isArray(tasksData) ? tasksData : []);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setTasks([]);
      }
    };
    fetchTasks();
  }, []);

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const filteredTasks = tasks.filter(task => task.title && task.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const addNewTask = async () => {
    if (newTask.trim() !== '') {
      const newTaskItem: TaskItem = {
        id: tasks.length + 1,
        title: newTask,
        completed: false,
        deadline: newDeadline,
        tags: tags,
        status: newStatus,
      };
      try {
        const addedTask = await addTask(newTaskItem);
        setTasks([...tasks, addedTask]);
        setNewTask('');
        setNewDeadline('');
        setTags([]);
        setNewStatus('Pending');
        setIsPanelOpen(false);
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  const deleteTaskById = async (id: number) => {
    try {
      await deleteTask(id);
      const updatedTasks = tasks.filter(task => task.id !== id);
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const toggleTaskStatus = async (id: number) => {
    const task = tasks.find(task => task.id === id);
    if (task) {
      const updatedTask = { ...task, completed: !task.completed };
      try {
        const savedTask = await updateTask(id, updatedTask);
        const updatedTasks = tasks.map(task =>
          task.id === id ? savedTask : task
        );
        setTasks(updatedTasks);
      } catch (error) {
        console.error('Error updating task status:', error);
      }
    }
  };

  const startEditing = (task: TaskItem) => {
    setEditingTask(task);
    setNewTask(task.title);
    setNewDeadline(task.deadline);
    setTags([...task.tags]); // Копируем массив тегов для избежания мутации исходного объекта
    setNewStatus(task.status);
    setIsPanelOpen(true);
  };

  const saveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTask) {
      const updatedTask = {
        ...editingTask,
        title: newTask,
        deadline: newDeadline,
        tags: tags,
        status: newStatus,
      };
      try {
        const savedTask = await updateTask(editingTask.id, updatedTask);
        const updatedTasks = tasks.map(task =>
          task.id === editingTask.id ? savedTask : task
        );
        setTasks(updatedTasks);
        cancelEditing();
      } catch (error) {
        console.error('Error saving task:', error);
      }
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
      e.preventDefault();
      const trimmedTag = newTag.trim();
      if (!tags.includes(trimmedTag)) {
        setTags([...tags, trimmedTag]);
        setNewTag('');
      }
    }
  };

  const removeTag = (tag: string) => {
    const updatedTags = tags.filter(t => t !== tag);
    setTags(updatedTags);
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
        <form onSubmit={editingTask ? saveTask : (e) => { e.preventDefault(); addNewTask(); }}>
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
            <option value="Not started">Not started</option>
            <option value="In progress">In progress</option>
            <option value="Done">Done</option>
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
        {filteredTasks.length > 0 ? filteredTasks.map(task => (
          <div key={task.id} className="task-item">
            <span
              className={task.completed ? 'task-title completed' : 'task-title'}
              onClick={() => toggleTaskStatus(task.id)}
            >
              {task.title}
            </span>
            <span className="task-deadline">{formatDate(task.deadline)}</span>
            <span className="task-status">{task.status}</span>
            <div className="task-tags">
              {task.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                </span>
              ))}
            </div>
            <div className="task-actions">
              <button onClick={() => startEditing(task)}>Edit</button>
              <button onClick={() => deleteTaskById(task.id)}>Delete</button>
            </div>
          </div>
        )) : (
          <p>No tasks found.</p>
        )}
      </div>
    </div>
  );
};

export default Task;
