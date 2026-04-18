import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Play, Square, Settings, Coffee, BrainCircuit } from 'lucide-react';

const Timer = () => {
  const [mode, setMode] = useState('pomodoro'); // pomodoro, deep_work
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  
  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      // Auto save on finish
      handleSessionComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleSessionComplete = async () => {
    setIsRunning(false);
    try {
      const duration = mode === 'pomodoro' ? 25 : 60; // default assumptions
      await api.post('/study/session', {
        duration,
        type: mode
      });
      alert('Session completed and saved!');
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'pomodoro' ? 25 * 60 : 60 * 60);
  };

  const switchMode = (newMode) => {
    if (isRunning) {
      if(!confirm('Running timer will reset. Continue?')) return;
    }
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(newMode === 'pomodoro' ? 25 * 60 : 60 * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex items-center justify-center animate-fade-in">
      <div className="glass-card max-w-lg w-full p-10 text-center relative overflow-hidden">
        
        {/* Decorative background glow based on mode */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 blur-[100px] -z-10 rounded-full transition-colors duration-1000 ${
          mode === 'pomodoro' ? 'bg-brand-500/20' : 'bg-purple-500/20'
        }`} />

        <div className="flex justify-center space-x-2 mb-10 bg-dark-bg/50 p-1 rounded-lg border border-dark-border inline-flex mx-auto">
          <button 
            className={`px-4 py-2 rounded-md font-medium text-sm transition-all flex items-center space-x-2 ${mode === 'pomodoro' ? 'bg-brand-500 text-white shadow-lg' : 'text-dark-muted hover:text-white'}`}
            onClick={() => switchMode('pomodoro')}
          >
            <Coffee size={16} /> <span>Pomodoro</span>
          </button>
          <button 
            className={`px-4 py-2 rounded-md font-medium text-sm transition-all flex items-center space-x-2 ${mode === 'deep_work' ? 'bg-purple-500 text-white shadow-lg' : 'text-dark-muted hover:text-white'}`}
            onClick={() => switchMode('deep_work')}
          >
            <BrainCircuit size={16} /> <span>Deep Work</span>
          </button>
        </div>

        <div className="font-sans text-[100px] font-bold tracking-tight text-white leading-none mb-10 tabular-nums drop-shadow-lg">
          {formatTime(timeLeft)}
        </div>

        <div className="flex justify-center space-x-4">
          <button 
            onClick={toggleTimer}
            className={`flex items-center space-x-2 px-8 py-4 rounded-full font-bold text-lg transition-all shadow-xl active:scale-95 ${
              isRunning ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30' : 
              mode === 'pomodoro' ? 'bg-brand-500 hover:bg-brand-400 text-white border-transparent' : 'bg-purple-500 hover:bg-purple-400 text-white border-transparent'
            }`}
          >
            {isRunning ? <><Square size={20} /> <span>Pause</span></> : <><Play size={20} /> <span>Start Focus</span></>}
          </button>
          <button onClick={resetTimer} className="p-4 rounded-full bg-dark-border/50 text-dark-muted border border-dark-border hover:text-white hover:bg-dark-border transition-all active:scale-95">
            <Settings size={22} className="rotate-90 hover:rotate-180 transition-transform duration-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Timer;
