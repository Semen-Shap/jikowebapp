import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Team.css';
import { sendMessage } from '../../shared/api/sendMessageApi';

interface User {
  id: number;
  name: string;
  email: string;
  skills: string;    // Ensure skills is explicitly defined as an array
  softwares: string; // Ensure softwares is explicitly defined as an array
  renders: number;
  createdAt: string;
  updatedAt: string;
}

const apiUrl = process.env.REACT_APP_URL_BACKEND || 'https://example.com'; // Fallback URL

const Team: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    axios.post<User[]>(`${apiUrl}/api/users`)
      .then(response => {
        console.log("Response from server: ", response);
        setUsers(response.data);
      })
      .catch(error => {
        console.log("Error occurred: ", error);
        sendMessage(error);
      });
  }, []);

  const toggleUserDetails = (user: User) => {
    if (selectedUser && selectedUser.id === user.id) {
      setSelectedUser(null); // Collapse if already selected
    } else {
      setSelectedUser(user); // Expand if different user or no user selected
    }
  };

  return (
    <div className="team-container">
      {users.length > 0 ? (
        <div className="user-list">
          {users.map(user => (
            <div className="user-block" key={user.id}>
              <button className="user-name" onClick={() => toggleUserDetails(user)}>
                {user.name}
              </button>
              {selectedUser && selectedUser.id === user.id && (
                <div className="user-details">
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Skills:</strong> {user.skills.length > 0 ? user.skills : 'No skills listed'}</p>
                  <p><strong>Softwares:</strong> {user.softwares.length > 0 ? user.softwares : 'No softwares listed'}</p>
                  <p><strong>Renders:</strong> {user.renders}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No users found</p>
      )}
    </div>
  );
};

export default Team;
