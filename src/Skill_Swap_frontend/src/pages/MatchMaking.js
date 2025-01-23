import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const MatchMaking = () => {
    const { user, authClient } = useAuth();
    const [matches, setMatches] = useState([]);
    const [filters, setFilters] = useState({
        location: '',
        skillLevel: 'any',
        category: 'all'
    });

    useEffect(() => {
        const fetchMatches = async () => {
            if (!user) return;

            try {
                // Fetch user's profile and potential matches from backend
                const userProfile = await fetchUserProfile(user);
                const potentialMatches = await findMatchingProfiles(userProfile, filters);

                setMatches(potentialMatches);
            } catch (error) {
                console.error('Matchmaking error:', error);
            }
        };

        fetchMatches();
    }, [user, filters]);

    const findMatchingProfiles = async (userProfile, filters) => {
        // Sophisticated matching algorithm
        const matches = await fetchAllProfiles();

        return matches.filter(profile => {
            // Match desired skills with offered skills
            const skillMatch = profile.offeredSkills.some(skill =>
                userProfile.desiredSkills.some(desiredSkill =>
                    desiredSkill.name === skill.name
                )
            );

            // Apply additional filters
            const locationMatch = !filters.location ||
                profile.location === filters.location;

            const skillLevelMatch = filters.skillLevel === 'any' ||
                skill.experienceLevel >= parseInt(filters.skillLevel);

            const categoryMatch = filters.category === 'all' ||
                profile.offeredSkills.some(skill =>
                    skill.category === filters.category
                );

            return skillMatch && locationMatch && skillLevelMatch && categoryMatch;
        });
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Skill Matches</h1>

            <div className="flex space-x-4 mb-4">
                <select
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    className="p-2 border rounded"
                >
                    <option value="">All Locations</option>
                    {/* Populate with actual locations */}
                </select>

                <select
                    value={filters.skillLevel}
                    onChange={(e) => setFilters({ ...filters, skillLevel: e.target.value })}
                    className="p-2 border rounded"
                >
                    <option value="any">Any Skill Level</option>
                    <option value="1">Beginner</option>
                    <option value="2">Intermediate</option>
                    <option value="3">Advanced</option>
                </select>
            </div>

            <div className="grid gap-4">
                {matches.map(match => (
                    <MatchCard key={match.principal} profile={match} />
                ))}
            </div>
        </div>
    );
};

const MatchCard = ({ profile }) => (
    <div className="bg-white p-4 rounded shadow">
        <h2 className="font-bold">{profile.username}</h2>
        <p>{profile.bio}</p>
        <div>
            <h3>Offered Skills:</h3>
            {profile.offeredSkills.map(skill => (
                <span key={skill.name} className="mr-2 badge">
                    {skill.name}
                </span>
            ))}
        </div>
    </div>
);

export default MatchMaking;