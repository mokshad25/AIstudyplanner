import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Clock, Book, AlertCircle, CheckCircle2 } from 'lucide-react';

const Dashboard = () => {
  const [schedule, setSchedule] = useState([]);
  const [revisions, setRevisions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [planRes, revisionRes] = await Promise.all([
          api.post('/study/generate-plan'),
          api.get('/study/revision-plan')
        ]);
        
        setSchedule(planRes.data.schedule || []);
        setRevisions(revisionRes.data.due_revisions || []);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
        <p className="text-dark-muted">Here is your AI-optimized study plan for today.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Schedule Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center space-x-2 text-xl font-semibold mb-4">
            <Clock className="text-brand-400" />
            <h2>Today's Priority Schedule</h2>
          </div>
          
          {schedule.length === 0 ? (
            <div className="glass-card p-8 flex flex-col items-center justify-center text-center">
              <Book className="w-12 h-12 text-dark-muted mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No subjects found</h3>
              <p className="text-dark-muted text-sm max-w-sm mb-6">Add subjects to generate your optimized study schedule.</p>
              <button className="btn-primary">Add Subjects</button>
            </div>
          ) : (
            <div className="space-y-4">
              {schedule.map((item, index) => (
                <div key={index} className="glass-card p-5 group hover:border-brand-500/30 transition-all duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-white group-hover:text-brand-400 transition-colors">{item.subject}</h3>
                    <span className="px-3 py-1 bg-brand-500/10 text-brand-400 text-xs font-medium rounded-full border border-brand-500/20">
                      {item.duration} mins
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-dark-muted space-x-4">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-400 mr-2" />
                      {item.cycles} Pomodoro Cycles
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-yellow-400 mr-2" />
                      {item.break} min Break
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar widgets */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <div className="flex items-center space-x-2 text-lg font-semibold mb-6">
              <AlertCircle className="text-red-400" />
              <h2>Spaced Repetition Due</h2>
            </div>
            
            {revisions.length === 0 ? (
              <div className="text-center py-6 text-dark-muted text-sm">
                <CheckCircle2 className="w-10 h-10 mx-auto text-brand-500/50 mb-3" />
                <p>You're all caught up on revisions!</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {revisions.map((rev, idx) => (
                  <li key={idx} className="p-3 bg-dark-bg rounded-lg border border-dark-border flex justify-between items-center text-sm">
                    <span className="font-medium">{rev.name}</span>
                    <span className="text-xs text-dark-muted">Due today</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
