import React, { useEffect, useState } from 'react';
import './Team.css';
import { getUsers } from '../../shared/api/userApi';
import { UserItem } from '../../shared/interface/appInterface';
import { sendMessage } from '../../shared/api/debug/sendMessageApi';


const Team: React.FC = () => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [sortCriteria, setSortCriteria] = useState<string>('Name'); // По умолчанию сортировка по имени
  const [searchTerm, setSearchTerm] = useState<string>(''); // Строка для поиска или фильтрации пользователей


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers(searchTerm, sortCriteria);
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setUsers([]);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchUsers();
    }, 100);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, sortCriteria]); // Запускаем запрос при изменении searchTerm или sortCriteria



  const toggleUserDetails = (user: UserItem) => {
    if (selectedUser && selectedUser.id === user.id) {
      setSelectedUser(null); // Collapse if already selected
    } else {
      setSelectedUser(user); // Expand if different user or no user selected
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortCriteria(event.target.value);
  };

  return (
    <div className="container">
      <div className="inline-container">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}

        />
        
        <select value={sortCriteria} onChange={handleSortChange}>
          <option value="Name">Name</option>
          <option value="Renders">Renders</option>
          <option value="Softwares">Softwares</option>
          <option value="Skills">Skills</option>
        </select>
      </div>
      {users.length > 0 ? (
        <div className="user-list">
          {users.map(user => {
            const { id, name, email, skills, renders, softwares } = user;
            
            /* const skillsArray = user.skills;
            const softwaresArray = user.softwares;
            const rendersArray = user.renders; */

            return (
              <div className="user-block" key={id}>
                <button className="user-name" onClick={() => toggleUserDetails(user)}>
                  {name}
                </button>
                {selectedUser && selectedUser.id === id && (
                  <div className="user-details">
                    <p><strong>Email:</strong> {email}</p>
                    <p><strong>Skills:</strong> 
                      {skills.length > 0 ? skills.map((skill, index) => (
                        <span key={index} className="tag-team">{skill}</span>
                      )) : 'empty'}
                    </p>
                    <p><strong>Softwares:</strong> 
                      {softwares.length > 0 ? softwares.map((software, index) => (
                        <span key={index} className="tag-team">{software}</span>
                      )) : 'empty'}
                    </p>
                    <p><strong>Renders:</strong> 
                      {renders.length > 0 ? renders.map((render, index) => (
                        <span key={index} className="tag-team">{render}</span>
                      )) : 'empty'}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p>No users found</p>
      )}
    </div>
  );
};

export default Team;
