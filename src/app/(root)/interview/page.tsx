'use client'
import React, { useState } from 'react';

const experienceLevels = [
  'Intern',
  'Junior',
  'Mid',
  'Senior',
  'Lead',
];

const avatars = [
  '/avatar-ai.png', // Placeholder for AI Interviewer
  '/avatar-user.png', // Placeholder for User (replace with actual image if available)
];

const InterviewPage = () => {
  const [selectedLevel, setSelectedLevel] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);

  React.useEffect(() => {
    setTimeout(() => setShowPrompt(true), 400);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center pattern animate-fadeIn">
      <h1 className="text-4xl font-bold mb-8 text-primary-200 animate-fadeIn">Frontend Developer Interview</h1>
      <div className="call-view w-full max-w-4xl animate-fadeIn">
        {/* AI Interviewer Card */}
        <div className="card-interviewer shadow-lg relative animate-fadeIn">
          <div className="avatar mb-4">
            <div className="animate-speak" />
            <img src={avatars[0]} alt="AI Interviewer" className="rounded-full size-[100px] object-cover border-4 border-primary-200" />
          </div>
          <h2 className="text-xl font-semibold text-primary-100 mb-2">AI Interviewer</h2>
          <p className="text-light-100 text-center">Ready to challenge your frontend skills with real-world questions and instant feedback!</p>
        </div>
        {/* User Card */}
        <div className="card-interviewer shadow-lg relative animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <div className="avatar mb-4">
            <img src={avatars[1]} alt="You" className="rounded-full size-[100px] object-cover border-4 border-primary-200" />
          </div>
          <h2 className="text-xl font-semibold text-primary-100 mb-2">Adrian (You)</h2>
          <p className="text-light-100 text-center">Showcase your expertise and land your dream frontend job!</p>
        </div>
      </div>
      {/* Experience Level Prompt */}
      <div className={`mt-10 w-full max-w-xl transition-opacity duration-700 ${showPrompt ? 'opacity-100' : 'opacity-0'}`}>
        <div className="card-border">
          <div className="card-content flex flex-col items-center gap-6 p-8">
            <span className="text-lg text-primary-200 font-semibold animate-fadeIn">What job <span className="text-primary-100">experience level</span> are you targeting?</span>
            <div className="flex flex-wrap gap-4 justify-center animate-fadeIn">
              {experienceLevels.map((level) => (
                <button
                  key={level}
                  className={`btn-primary px-6 py-2 rounded-full transition-all duration-200 shadow-md ${selectedLevel === level ? 'ring-2 ring-primary-200 scale-105' : ''}`}
                  onClick={() => setSelectedLevel(level)}
                >
                  {level}
                </button>
              ))}
            </div>
            {selectedLevel && (
              <div className="w-full flex justify-center animate-fadeIn">
                <button className="btn-secondary px-8 py-2 mt-4" onClick={() => alert(`Starting interview for ${selectedLevel} level!`)}>
                  Start Interview
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Progress Bar Animation */}
        <div className="progress mt-6 w-full animate-fadeIn">
          <div className="h-full bg-primary-200 rounded-full transition-all duration-700" style={{ width: selectedLevel ? '100%' : '40%' }} />
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;