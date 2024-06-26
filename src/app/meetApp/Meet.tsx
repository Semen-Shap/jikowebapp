import React, { useState } from 'react';
import './Meet.css';

interface MeetItem {
  id: number;
  title: string;
  date: string;
  time: string;
  participants: string[];
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

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const addMeet = () => {
    if (newMeet.trim() !== '' && newDate.trim() !== '' && newTime.trim() !== '') {
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
    }
  };

  const handleParticipantInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newParticipant.trim() !== '') {
      setParticipants([...participants, newParticipant.trim()]);
      setNewParticipant('');
    }
  };

  const removeParticipant = (participant: string) => {
    setParticipants(participants.filter(p => p !== participant));
  };

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
        <form onSubmit={(e) => { e.preventDefault(); addMeet(); }}>
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
          <div className="tag-input-container">
            {participants.map((participant, index) => (
              <span key={index} className="task-tag">
                {participant}
                <button type="button" onClick={() => removeParticipant(participant)}>×</button>
              </span>
            ))}
            <input
              type="text"
              placeholder="Введите участника и нажмите Enter"
              value={newParticipant}
              onChange={(e) => setNewParticipant(e.target.value)}
              onKeyDown={handleParticipantInput}
            />
          </div>
          <button type="submit">Создать встречу</button>
        </form>
      )}
      
      <div className="meet-list">
        {meets.filter(meet => meet.title.toLowerCase().includes(searchTerm.toLowerCase())).map(meet => (
          <div key={meet.id} className="meet-item">
            <span className="meet-title">{meet.title}</span>
            <span className="meet-date">{meet.date}</span>
            <span className="meet-time">{meet.time}</span>
            <div className="meet-participants">
              {meet.participants.map((participant, index) => (
                <span key={index} className="meet-participant">{participant}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Meet;
