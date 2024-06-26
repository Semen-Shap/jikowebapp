import React, { useState } from 'react';
import axios from 'axios';
import { sendMessage } from '../../shared/api/sendMessageApi';
import './Reg.css';

const tg = window.Telegram.WebApp;
const user = tg.initDataUnsafe.user;
const user_id = user?.id;
const username = `${user?.first_name} ${user?.last_name}`;
const apiUrl = process.env.PUBLIC_URL_BACKEND;

const Registration: React.FC = () => {
  const [name, setName] = useState(username);
  const [email, setEmail] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [softwares, setSoftwares] = useState<string[]>([]);
  const [renders, setRenders] = useState<string[]>([]);
  const [otherSkill, setOtherSkill] = useState('');
  const [otherSoftware, setOtherSoftware] = useState('');
  const [otherRender, setOtherRender] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSkills = otherSkill ? [...skills, otherSkill] : skills;
    const finalSoftwares = otherSoftware ? [...softwares, otherSoftware] : softwares;
    const finalRenders = otherRender ? [...renders, otherRender] : renders;

    const data = { 
      user_id, 
      name, 
      email, 
      skills: finalSkills, 
      softwares: finalSoftwares, 
      renders: finalRenders
    };

    sendMessage(apiUrl)

    axios.post(`${apiUrl}/api/users/create`, data)
      .then(res => {
        sendMessage(`${res.data}`)
      })
      .catch(error => {
        sendMessage('create command')
        sendMessage(error)
      });
    
    // Reset form fields
    setName('');
    setEmail('');
    setSkills([]);
    setSoftwares([]);
    setRenders([]);
    setOtherSkill('');
    setOtherSoftware('');
    setOtherRender('');
  };

  const handleCheckboxChange = (setState: React.Dispatch<React.SetStateAction<string[]>>, value: string) => {
    setState((prev) => 
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  return (
    <form className='form-inline' onSubmit={handleSubmit}>
      <input
        type="name"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <fieldset>
        <legend>Skills</legend>
        {['Graphic designer', 'Concept artist', 'Simulation artist', 'Compositing artist', 'Character animator'].map(skill => (
          <label key={skill}>
            <input
              type="checkbox"
              checked={skills.includes(skill)}
              onChange={() => handleCheckboxChange(setSkills, skill)}
            />
            {skill}
          </label>
        ))}
        <label>
          <input
            type="text"
            placeholder="Other"
            value={otherSkill}
            onChange={(e) => setOtherSkill(e.target.value)}
          />
        </label>
      </fieldset>

      <fieldset>
        <legend>Softwares</legend>
        {['Cinema 4d', 'Houdini', 'Maya', 'Unreal Engine', 'Marvelous Designer'].map(software => (
          <label key={software}>
            <input
              type="checkbox"
              checked={softwares.includes(software)}
              onChange={() => handleCheckboxChange(setSoftwares, software)}
            />
            {software}
          </label>
        ))}
        <label>
          <input
            type="text"
            placeholder="Other"
            value={otherSoftware}
            onChange={(e) => setOtherSoftware(e.target.value)}
          />
        </label>
      </fieldset>

      <fieldset>
        <legend>Render</legend>
        {['Octane', 'Redshift', 'Arnold'].map(render => (
          <label key={render}>
            <input
              type="checkbox"
              checked={renders.includes(render)}
              onChange={() => handleCheckboxChange(setRenders, render)}
            />
            {render}
          </label>
        ))}
        <label>
          <input
            type="text"
            placeholder="Other"
            value={otherRender}
            onChange={(e) => setOtherRender(e.target.value)}
          />
        </label>
      </fieldset>

      <button type="submit">Register</button>
    </form>
  );
};

export default Registration;