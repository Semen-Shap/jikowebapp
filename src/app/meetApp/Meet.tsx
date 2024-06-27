import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Meet.css';

interface MeetItem {
  id: number;
  title: string;
  date: string;
  time: string;
  participants: string[];
}

interface User {
  id: number;
  name: string;
}

const Meet = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [meets, setMeets] = useState<MeetItem[]>([]);
  const [newMeet, setNewMeet] = useState<string>('');
  const [newDate, setNewDate] = useState<string>('');
  const [newTime, setNewTime] = useState<string>('');
  const [newParticipant, setNewParticipant] = useState<string>('');
  const [participants, setParticipants] = useState<string[]>([]);
  const [userSuggestions, setUserSuggestions] = useState<User[]>([]);
  const [editingMeet, setEditingMeet] = useState<MeetItem | null>(null);

  const apiUrl = process.env.REACT_APP_URL_BACKEND;

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchUserSuggestions(newParticipant);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [newParticipant]);

  const fetchUserSuggestions = async (value: string) => {
    if (value.trim() !== '') {
      try {
        const response = await axios.post<User[]>(`${apiUrl}/api/users`, { query: value });
        setUserSuggestions(response.data.slice(0, 5));
      } catch (error) {
        console.error("Error occurred: ", error);
      }
    } else {
      setUserSuggestions([]);
    }
  };

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const saveMeet = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMeet.trim() !== '' && newDate.trim() !== '' && newTime.trim() !== '') {
      if (editingMeet) {
        const updatedMeets = meets.map(meet =>
          meet.id === editingMeet.id
            ? { ...meet, title: newMeet, date: newDate, time: newTime, participants: participants }
            : meet
        );
        setMeets(updatedMeets);
        cancelEditing();
      } else {
        const newMeetItem: MeetItem = {
          id: meets.length + 1,
          title: newMeet,
          date: newDate,
          time: newTime,
          participants: participants,
        };
        setMeets([...meets, newMeetItem]);
        setNewMeet('');
        setNewDate('');
        setNewTime('');
        setParticipants([]);
        setIsPanelOpen(false);
      }
    }
  };

  const startEditing = (meet: MeetItem) => {
    setEditingMeet(meet);
    setNewMeet(meet.title);
    setNewDate(meet.date);
    setNewTime(meet.time);
    setParticipants(meet.participants);
    setIsPanelOpen(true);
  };

  const cancelEditing = () => {
    setEditingMeet(null);
    setNewMeet('');
    setNewDate('');
    setNewTime('');
    setParticipants([]);
    setIsPanelOpen(false);
  };

  const deleteMeet = (id: number) => {
    const updatedMeets = meets.filter(meet => meet.id !== id);
    setMeets(updatedMeets);
  };

  const handleParticipantInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewParticipant(value);
    fetchUserSuggestions(value);
  };

  const selectSuggestion = (user: User) => {
    setParticipants([...participants, user.name]);
    setNewParticipant('');
    setUserSuggestions([]);
  };

  const removeParticipant = (participant: string) => {
    setParticipants(participants.filter(p => p !== participant));
  };

  const filteredMeets = meets.filter(meet =>
    meet.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Meetings</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Поиск..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button 
          className={`add-button ${isPanelOpen ? 'active' : ''}`}
          onClick={togglePanel}>
            <span className="icon">+</span>
        </button>
      </div>

      {isPanelOpen && (
        <form onSubmit={saveMeet}>
          <input
            type="text"
            placeholder="Название встречи"
            value={newMeet}
            onChange={(e) => setNewMeet(e.target.value)}
          />
          <input
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
          />
          <input
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
          />
          <div className="participant-input-container">
            {participants.map((participant, index) => (
              <span key={index} className="tag">
                {participant}
                <button type="button" onClick={() => removeParticipant(participant)}>×</button>
              </span>
            ))}
            <input
              type="text"
              placeholder="Введите участника"
              value={newParticipant}
              onChange={handleParticipantInput}
            />
            {userSuggestions.length > 0 && (
              <ul className="suggestions-list">
                {userSuggestions.map(user => (
                  <li key={user.id} onClick={() => selectSuggestion(user)}>
                    {user.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="inline-container">
            <button type="submit">{editingMeet ? 'Save Meet' : 'Add Meet'}</button>
            {editingMeet && <button type="button" onClick={cancelEditing}>Cancel</button>}
          </div>
        </form>
      )}
      
      <div className="task-list">
        {filteredMeets.map(meet => (
          <div key={meet.id} className="task-item">
            <span className="meet-title">{meet.title}</span>
            <span className="meet-date">{meet.date}</span>
            <span className="meet-time">{meet.time}</span>
            <div className="meet-participants">
              {meet.participants.map((participant, index) => (
                <span key={index} className="meet-participant">{participant}</span>
              ))}
            </div>
            <div className="task-actions">
              <button onClick={() => startEditing(meet)}>Edit</button>
              <button onClick={() => deleteMeet(meet.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Meet;
