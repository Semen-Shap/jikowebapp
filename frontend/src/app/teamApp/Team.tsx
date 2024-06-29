import React, { useEffect, useState } from 'react';
import './Team.css';
import { getUsers } from '../../shared/api/userApi';
import { UserItem } from '../../shared/interface/appInterface';


const Team: React.FC = () => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [sortCriteria, setSortCriteria] = useState<string>('name'); // По умолчанию сортировка по имени
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
    fetchUsers();
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
          <option value="name">Name</option>
          <option value="renders">Renders</option>
          <option value="softwares">Softwares</option>
          <option value="skills">Skills</option>
        </select>
      </div>
      {users.length > 0 ? (
        <div className="user-list">
          {users.map(user => {
            const skillsArray = user.skills;
            const softwaresArray = user.softwares;
            const rendersArray = user.renders;

            return (
              <div className="user-block" key={user.id}>
                <button className="user-name" onClick={() => toggleUserDetails(user)}>
                  {user.name}
                </button>
                {selectedUser && selectedUser.id === user.id && (
                  <div className="user-details">
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Skills:</strong> 
                      {skillsArray.length > 0 ? skillsArray.map((skill, index) => (
                        <span key={index} className="tag-team">{skill}</span>
                      )) : 'empty'}
                    </p>
                    <p><strong>Softwares:</strong> 
                      {softwaresArray.length > 0 ? softwaresArray.map((software, index) => (
                        <span key={index} className="tag-team">{software}</span>
                      )) : 'empty'}
                    </p>
                    <p><strong>Renders:</strong> 
                      {rendersArray.length > 0 ? rendersArray.map((render, index) => (
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
