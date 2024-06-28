import React, { useState, useCallback, useEffect } from 'react';
import './Reg.css';
import { createUser } from '../../shared/api/regApi';
import { renderList, skillsList, softwaresList } from '../../shared/interface/autocompliteVars';

const tg = window.Telegram.WebApp;
const user = tg.initDataUnsafe.user;
const id = user?.id;
const username = `${user?.first_name} ${user?.last_name}`;

const Registration: React.FC = () => {
  const [name, setName] = useState(username);
  const [email, setEmail] = useState('');
  
  const [skillTags, setSkillTags] = useState<{ id: string, name: string }[]>([]);
  const [skillTagInput, setSkillTagInput] = useState('');
  const [skillSuggestions, setSkillSuggestions] = useState<string[]>([]);

  const [softwareTags, setSoftwareTags] = useState<{ id: string, name: string }[]>([]);
  const [softwareTagInput, setSoftwareTagInput] = useState('');
  const [softwareSuggestions, setSoftwareSuggestions] = useState<string[]>([]);

  const [renderTags, setRenderTags] = useState<{ id: string, name: string }[]>([]);
  const [renderTagInput, setRenderTagInput] = useState('');
  const [renderSuggestions, setRenderSuggestions] = useState<string[]>([]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const skills = skillTags.map(tag => tag.name);
    const softwares = softwareTags.map(tag => tag.name);
    const renders = renderTags.map(tag => tag.name);

    
    if (!id) return;

    createUser({
      id, 
      name, 
      email, 
      skills, 
      softwares, 
      renders
    });
    
    setName('');
    setEmail('');
    setSkillTags([]);
    setSoftwareTags([]);
    setRenderTags([]);

    window.location.reload();
  }, [id, name, email, skillTags, softwareTags, renderTags]);

  const handleTagInputKeyDown = useCallback((
    e: React.KeyboardEvent<HTMLInputElement>, 
    setTags: React.Dispatch<React.SetStateAction<{ id: string, name: string }[]>>, 
    tagInput: string, 
    setTagInput: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (e.key === 'Enter' && tagInput.trim() !== '') {
      e.preventDefault();
      const newTag = { id: Date.now().toString(), name: tagInput.trim() };
      setTags(prevTags => [...prevTags, newTag]);
      setTagInput('');
    }
  }, []);

  const handleTagRemove = useCallback((
    tagId: string, 
    setTags: React.Dispatch<React.SetStateAction<{ id: string, name: string }[]>>
  ) => {
    setTags(prevTags => prevTags.filter(tag => tag.id !== tagId));
  }, []);

  const updateSuggestions = useCallback((
    input: string,
    itemList: string[],
    currentTags: { id: string, name: string }[]
  ) => {
    const inputLower = input.toLowerCase();
    const currentTagNames = currentTags.map(tag => tag.name.toLowerCase());
    return itemList
      .filter(item => 
        item.toLowerCase().includes(inputLower) && 
        !currentTagNames.includes(item.toLowerCase())
      )
      .slice(0, 5);
  }, []);

  useEffect(() => {
    setSkillSuggestions(updateSuggestions(skillTagInput, skillsList, skillTags));
  }, [skillTagInput, skillTags, updateSuggestions]);

  useEffect(() => {
    setSoftwareSuggestions(updateSuggestions(softwareTagInput, softwaresList, softwareTags));
  }, [softwareTagInput, softwareTags, updateSuggestions]);

  useEffect(() => {
    setRenderSuggestions(updateSuggestions(renderTagInput, renderList, renderTags));
  }, [renderTagInput, renderTags, updateSuggestions]);

  return (
    <form onSubmit={handleSubmit}>
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
  
      <div className='reg-container'>
        <legend>Skills</legend>
        <div className='reg-wrap-container'>
          {skillTags.map(tag => (
            <div key={tag.id} className="tag">
              {tag.name}
              <button type="button" onClick={() => handleTagRemove(tag.id, setSkillTags)}>x</button>
            </div>
          ))}
        </div>
        <input
          type="text"
          placeholder="Type to add skills..."
          value={skillTagInput}
          onChange={(e) => setSkillTagInput(e.target.value)}
          onKeyDown={(e) => handleTagInputKeyDown(e, setSkillTags, skillTagInput, setSkillTagInput)}
        />
        {skillSuggestions.length > 0 && (
          <ul className="reg-wrap-container">
            {skillSuggestions.map((suggestion, index) => (
              <li className='reg-sug-button' key={index} onClick={() => {
                setSkillTags(prevTags => [...prevTags, { id: Date.now().toString(), name: suggestion }]);
                setSkillTagInput('');
              }}>
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
  
      <div className='reg-container'>
        <legend>Softwares</legend>
        <div className='reg-wrap-container'>
          {softwareTags.map(tag => (
            <div key={tag.id} className="tag">
              {tag.name}
              <button type="button" onClick={() => handleTagRemove(tag.id, setSoftwareTags)}>x</button>
            </div>
          ))}
        </div>
          <input
            type="text"
            placeholder="Type to add softwares..."
            value={softwareTagInput}
            onChange={(e) => setSoftwareTagInput(e.target.value)}
            onKeyDown={(e) => handleTagInputKeyDown(e, setSoftwareTags, softwareTagInput, setSoftwareTagInput)}
          />
          {softwareSuggestions.length > 0 && (
            <ul className='reg-wrap-container'>
              {softwareSuggestions.map((suggestion, index) => (
                <li className='reg-sug-button' key={index} onClick={() => {
                  setSoftwareTags(prevTags => [...prevTags, { id: Date.now().toString(), name: suggestion }]);
                  setSoftwareTagInput('');
                }}>
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
      </div>
  
      <div className='reg-container'>
        <legend>Render</legend>
        <div className="reg-wrap-container">
          {renderTags.map(tag => (
            <div key={tag.id} className="tag">
              {tag.name}
              <button type="button" onClick={() => handleTagRemove(tag.id, setRenderTags)}>x</button>
            </div>
          ))}
        </div>
          <input
            type="text"
            placeholder="Type to add renders..."
            value={renderTagInput}
            onChange={(e) => setRenderTagInput(e.target.value)}
            onKeyDown={(e) => handleTagInputKeyDown(e, setRenderTags, renderTagInput, setRenderTagInput)}
          />
          {renderSuggestions.length > 0 && (
            <ul className="reg-wrap-container">
              {renderSuggestions.map((suggestion, index) => (
                <li className='reg-sug-button' key={index} onClick={() => {
                  setRenderTags(prevTags => [...prevTags, { id: Date.now().toString(), name: suggestion }]);
                  setRenderTagInput('');
                }}>
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
      </div>
  
      <button type="submit">Register</button>
    </form>
  );
};

export default Registration;
