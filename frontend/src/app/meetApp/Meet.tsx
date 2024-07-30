import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './Meet.css';
import { getUserName, getUsers } from '../../shared/api/userApi';
import { getMeet, addMeet, updateMeet, deleteMeet } from '../../shared/api/meetApi';
import { MeetItem, UserItem } from '../../shared/interface/appInterface';
import { formatDate } from '../../utils/format';
import { sendMessage } from '../../shared/api/debug/sendMessageApi';
import debounce from 'lodash/debounce';

const Meet = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [meets, setMeets] = useState<MeetItem[]>([]);
  const [newMeet, setNewMeet] = useState<string>('');
  const [newDate, setNewDate] = useState<string>('');
  const [newTime, setNewTime] = useState<string>('');
  const [newParticipant, setNewParticipant] = useState<string>('');
  const [participants, setParticipants] = useState<UserItem[]>([]);
  const [userSuggestions, setUserSuggestions] = useState<UserItem[]>([]);
  const [editingMeet, setEditingMeet] = useState<MeetItem | null>(null);

  const fetchMeets = useCallback(async () => {
    try {
      const fetchedMeets = await getMeet();
      const updatedMeets = await Promise.all(fetchedMeets.map(async (meet) => {
        const userNames = await Promise.all(meet.users.map(userId => getUserName(userId)));
        return {
          ...meet,
          users: userNames.map((userName, index) => ({
            id: meet.users[index],
            page_id: meet.users[index],
            name: userName.name
          }))
        };
      }));
      setMeets(updatedMeets);
    } catch (error) {
      console.error("Error fetching meets: ", error);
    }
  }, []);

  useEffect(() => {
    fetchMeets();
  }, [fetchMeets]);

  const debouncedFetchUserSuggestions = useCallback(
    debounce((query: string) => {
      if (query.trim() !== '') {
        getUsers(query, 'Name')
          .then(users => setUserSuggestions(users.slice(0, 5)))
          .catch(error => console.error("Error occurred: ", error));
      } else {
        setUserSuggestions([]);
      }
    }, 300),
    []
  );

  useEffect(() => {
    debouncedFetchUserSuggestions(newParticipant);
  }, [newParticipant, debouncedFetchUserSuggestions]);

  const handleParticipantInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewParticipant(e.target.value);
  }, []);

  const togglePanel = useCallback(() => {
    setIsPanelOpen(prev => !prev);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const saveMeet = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMeet.trim() !== '' && newDate.trim() !== '' && newTime.trim() !== '') {
      const dateTime = `${newDate}T${newTime}:00`;

      const meetData: MeetItem = {
        name: newMeet,
        date: dateTime,
        users: participants.map(p => (p.page_id)),
      };

      sendMessage(meetData);
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
  }, [newMeet, newDate, newTime, participants, editingMeet, fetchMeets]);

  const startEditing = useCallback((meet: MeetItem) => {
    setEditingMeet(meet);
    setNewMeet(meet.name);
    setNewDate(meet.date.split('T')[0]);
    setNewTime(meet.date.split('T')[1].substring(0, 5));
    setParticipants(meet.users);
    setIsPanelOpen(true);
  }, []);

  const cancelEditing = useCallback(() => {
    setEditingMeet(null);
    setNewMeet('');
    setNewDate('');
    setNewTime('');
    setParticipants([]);
    setIsPanelOpen(false);
  }, []);

  const selectSuggestion = useCallback((user: UserItem) => {
    setParticipants(prev => [...prev, user]);
    setNewParticipant('');
    setUserSuggestions([]);
  }, []);

  const removeParticipant = useCallback((participantId: string) => {
    setParticipants(prev => prev.filter(p => p.id !== participantId));
  }, []);

  const filteredMeets = useMemo(() => 
    meets.filter(meet =>
      meet.name.toLowerCase().includes(searchTerm.toLowerCase())
    ),
    [meets, searchTerm]
  );

  const deleteMeetHandler = useCallback(async (id: string) => {
    try {
      await deleteMeet(id);
      await fetchMeets();
    } catch (error) {
      console.error("Error deleting meet: ", error);
    }
  }, [fetchMeets]);

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
                {participant.name}
                <button type="button" onClick={() => removeParticipant(participant.id)}>×</button>
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
            <div className="meet-participants">
              {meet.users.map((participant, index) => (
                <span key={index} className="meet-participant">{participant.name}</span>
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

export default React.memo(Meet);