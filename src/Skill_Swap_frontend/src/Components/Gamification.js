import React, { useState, useEffect } from 'react';
import { Award, Trophy, Star } from 'lucide-react';

const Gamification = () => {
  const [userPoints, setUserPoints] = useState(0);
  const [level, setLevel] = useState(1);
  const [achievements, setAchievements] = useState([]);

  const LEVEL_THRESHOLDS = [
    { level: 1, points: 0 },
    { level: 2, points: 100 },
    { level: 3, points: 250 },
    { level: 4, points: 500 },
    { level: 5, points: 1000 }
  ];

  const ACHIEVEMENTS = [
    { 
      id: 'first-exchange', 
      title: 'First Skill Exchange', 
      points: 50,
      icon: <Award className="text-yellow-500" />
    },
    { 
      id: 'forum-contributor', 
      title: 'Active Forum Contributor', 
      points: 75,
      icon: <Trophy className="text-blue-500" />
    },
    { 
      id: 'master-exchanger', 
      title: 'Master Skill Exchanger', 
      points: 200,
      icon: <Star className="text-green-500" />
    }
  ];

  useEffect(() => {
    // Determine current level based on points
    const currentLevel = LEVEL_THRESHOLDS.reverse().find(
      threshold => userPoints >= threshold.points
    )?.level || 1;

    setLevel(currentLevel);
  }, [userPoints]);

  const earnPoints = (action) => {
    let pointsEarned = 0;
    switch(action) {
      case 'skillExchange': pointsEarned = 25; break;
      case 'forumPost': pointsEarned = 10; break;
      case 'successfulMeeting': pointsEarned = 50; break;
    }

    setUserPoints(prev => prev + pointsEarned);
    checkAchievements(pointsEarned);
  };

  const checkAchievements = (newPoints) => {
    const unlockedAchievements = ACHIEVEMENTS.filter(
      achievement => !achievements.includes(achievement.id) 
      && newPoints >= achievement.points
    );

    if (unlockedAchievements.length) {
      setAchievements(prev => [
        ...prev, 
        ...unlockedAchievements.map(a => a.id)
      ]);
    }
  };

  return (
    <div className="bg-midnight-blue text-white p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Skill Exchange Points</h2>
        <div className="text-xl">
          Points: {userPoints} | Level: {level}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-xl mb-2">Achievements</h3>
        <div className="grid grid-cols-3 gap-4">
          {ACHIEVEMENTS.map(achievement => (
            <div 
              key={achievement.id}
              className={`p-4 rounded ${
                achievements.includes(achievement.id)
                  ? 'bg-green-800'
                  : 'bg-blue-700 opacity-50'
              }`}
            >
              {achievement.icon}
              <h4>{achievement.title}</h4>
              <p>{achievement.points} Points</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-xl mb-2">Level Progression</h3>
        {LEVEL_THRESHOLDS.map(threshold => (
          <div 
            key={threshold.level}
            className={`p-2 ${
              level >= threshold.level 
                ? 'bg-green-700' 
                : 'bg-blue-900 opacity-50'
            }`}
          >
            Level {threshold.level}: {threshold.points} points
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gamification;