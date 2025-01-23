import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Forums = () => {
  const { user } = useAuth();
  const [forums, setForums] = useState([]);
  const [newTopic, setNewTopic] = useState('');
  const [selectedForum, setSelectedForum] = useState(null);

  useEffect(() => {
    const fetchForums = async () => {
      const categories = [
        'Web Development',
        'Design',
        'Language Learning',
        'Business Skills',
        'Creative Arts'
      ];
      
      // Simulate forum data fetch
      const forumsData = categories.map(category => ({
        id: category.toLowerCase().replace(' ', '-'),
        name: category,
        topics: []
      }));

      setForums(forumsData);
    };

    fetchForums();
  }, []);

  const createTopic = () => {
    if (!newTopic || !selectedForum) return;

    const newTopicObj = {
      id: Date.now(),
      title: newTopic,
      author: user.username,
      timestamp: new Date(),
      replies: []
    };

    setForums(prev => 
      prev.map(forum => 
        forum.id === selectedForum.id 
          ? {...forum, topics: [...forum.topics, newTopicObj]} 
          : forum
      )
    );

    setNewTopic('');
  };

  return (
    <div className="bg-midnight-blue text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Skill Exchange Forums</h1>
      
      <div className="grid grid-cols-3 gap-4">
        {forums.map(forum => (
          <div 
            key={forum.id} 
            className="bg-blue-800 p-4 rounded"
            onClick={() => setSelectedForum(forum)}
          >
            <h2 className="font-bold text-xl">{forum.name}</h2>
            <p>{forum.topics.length} Topics</p>
          </div>
        ))}
      </div>

      {selectedForum && (
        <div className="mt-6">
          <div className="flex mb-4">
            <input 
              value={newTopic}
              onChange={(e) => setNewTopic(e.target.value)}
              placeholder="Create new topic"
              className="flex-grow p-2 text-black"
            />
            <button 
              onClick={createTopic}
              className="bg-blue-500 p-2 ml-2"
            >
              Create Topic
            </button>
          </div>

          {selectedForum.topics.map(topic => (
            <div 
              key={topic.id} 
              className="bg-blue-700 p-4 mb-2 rounded"
            >
              <h3 className="font-bold">{topic.title}</h3>
              <p>By {topic.author} at {topic.timestamp.toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Forums;