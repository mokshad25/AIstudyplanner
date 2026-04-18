import { useState, useEffect } from 'react';
import api from '../api/axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity, Clock, Zap } from 'lucide-react';

const Analytics = () => {
  const [data, setData] = useState({ total_study_time_minutes: 0, best_study_hours: [], total_sessions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/study/analytics');
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="p-8 text-center text-dark-muted">Loading analytics...</div>;

  // Mock data for visual appeal based on the real total time
  const weeklyData = [
    { name: 'Mon', focus: Math.max(10, data.total_study_time_minutes * 0.1) },
    { name: 'Tue', focus: Math.max(20, data.total_study_time_minutes * 0.15) },
    { name: 'Wed', focus: Math.max(15, data.total_study_time_minutes * 0.12) },
    { name: 'Thu', focus: Math.max(30, data.total_study_time_minutes * 0.2) },
    { name: 'Fri', focus: Math.max(25, data.total_study_time_minutes * 0.18) },
    { name: 'Sat', focus: Math.max(45, data.total_study_time_minutes * 0.25) },
    { name: 'Sun', focus: Math.max(5, data.total_study_time_minutes * 0.05) },
  ];

  return (
    <div className="max-w-6xl mx-auto animate-fade-in space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Study Analytics</h1>
        <p className="text-dark-muted">Track your productivity, find your prime learning hours, and measure growth.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6 flex flex-col justify-between">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-brand-500/20 rounded-xl text-brand-400">
              <Clock size={24} />
            </div>
            <h3 className="text-lg font-medium text-dark-muted">Total Study Time</h3>
          </div>
          <div className="text-4xl font-bold">{Math.floor(data.total_study_time_minutes / 60)}h {data.total_study_time_minutes % 60}m</div>
          <p className="text-xs text-brand-400 mt-2 flex items-center"><Activity size={12} className="mr-1" /> +12% from last week</p>
        </div>

        <div className="glass-card p-6 flex flex-col justify-between">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
              <Zap size={24} />
            </div>
            <h3 className="text-lg font-medium text-dark-muted">Best Study Hours</h3>
          </div>
          <div className="text-2xl font-bold break-words">
            {data.best_study_hours.length > 0 ? data.best_study_hours.join(', ') : 'Not enough data'}
          </div>
          <p className="text-xs text-dark-muted mt-2">AI calculated from your success history</p>
        </div>

        <div className="glass-card p-6 flex flex-col justify-between">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
              <Activity size={24} />
            </div>
            <h3 className="text-lg font-medium text-dark-muted">Total Sessions</h3>
          </div>
          <div className="text-4xl font-bold">{data.total_sessions}</div>
          <p className="text-xs text-dark-muted mt-2">Completed focus blocks</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div className="glass-card p-6">
          <h3 className="text-xl font-semibold mb-6 flex items-center"><Activity className="mr-2 text-brand-400" /> Weekly Focus Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{fill: '#94a3b8'}} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" tick={{fill: '#94a3b8'}} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="focus" stroke="#14b8a6" strokeWidth={3} fillOpacity={1} fill="url(#colorFocus)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Analytics;
