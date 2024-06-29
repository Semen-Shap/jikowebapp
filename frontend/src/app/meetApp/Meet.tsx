import React, { useState, useEffect } from 'react';
import './Meet.css';
import { getUsers } from '../../shared/api/userApi';
import { getMeet, addMeet, updateMeet, deleteMeet } from '../../shared/api/meetApi';
import { MeetItem, UserItem } from '../../shared/interface/appInterface';
import { formatDate } from '../../utils/format';

const Meet = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [meets, setMeets] = useState<MeetItem[]>([]);
  const [newMeet, setNewMeet] = useState<string>('');
  const [newDate, setNewDate] = useState<string>('');
  const [newTime, setNewTime] = useState<string>('');
  const [newParticipant, setNewParticipant] = useState<string>('');
  const [participants, setParticipants] = useState<number[]>([]);
  const [userSuggestions, setUserSuggestions] = useState<UserItem[]>([]);
  const [editingMeet, setEditingMeet] = useState<MeetItem | null>(null);

  useEffect(() => {
    fetchMeets();
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchUserSuggestions(newParticipant)
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [newParticipant]);

  const fetchMeets = async () => {
    try {
      const fetchedMeets = await getMeet();
      setMeets(fetchedMeets);
    } catch (error) {
      console.error("Error fetching meets: ", error);
    }
  };

  const fetchUserSuggestions = async (query: string) => {
    if (query.trim() !== '') {
      try {
        const users = await getUsers(query, 'name');
        setUserSuggestions(users.slice(0, 5));
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

  const saveMeet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMeet.trim() !== '' && newDate.trim() !== '' && newTime.trim() !== '') {
      const meetData: MeetItem = {
        name: newMeet,
        date: newDate,
        time: parseInt(newTime),
        userIds: participants,
      };

      try {
        if (editingMeet) {
          await updateMeet(editingMeet.id!, meetData);
        } else {
          await addMeet(meetData);
        }
        await fetchMeets();
        cancelEditing();
      } catch (error) {
        console.error("Error saving meet: ", error);
      }
    }
  };

  const startEditing = (meet: MeetItem) => {
    setEditingMeet(meet);
    setNewMeet(meet.name);
    setNewDate(meet.date);
    setNewTime(meet.time.toString());
    setParticipants(meet.userIds);
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

  const deleteMeetHandler = async (id: number) => {
    try {
      await deleteMeet(id);
      await fetchMeets();
    } catch (error) {
      console.error("Error deleting meet: ", error);
    }
  };

  const handleParticipantInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewParticipant(value);
    fetchUserSuggestions(value);
  };

  const selectSuggestion = (user: UserItem) => {
    setParticipants([...participants, user.id]);
    setNewParticipant('');
    setUserSuggestions([]);
  };

  const removeParticipant = (participantId: number) => {
    setParticipants(participants.filter(p => p !== participantId));
  };

  const filteredMeets = meets.filter(meet =>
    meet.name.toLowerCase().includes(searchTerm.toLowerCase())
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
            {participants.map((participantId, index) => (
              <span key={index} className="tag">
                {participantId}
                <button type="button" onClick={() => removeParticipant(participantId)}>×</button>
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
            <span className="meet-title">{meet.name}</span>
            <span className="meet-date">{formatDate(meet.date)}</span>
            <span className="meet-time">{meet.time}</span>
            <div className="meet-participants">
              {meet.userIds.map((participantId, index) => (
                <span key={index} className="meet-participant">{participantId}</span>
              ))}
            </div>
            <div className="task-actions">
              <button onClick={() => startEditing(meet)}>Edit</button>
              <button onClick={() => deleteMeetHandler(meet.id!)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Meet;