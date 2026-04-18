import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Plus, Trash2, Folder, FileText } from 'lucide-react';

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [newSubject, setNewSubject] = useState({ name: '', difficulty: 3, exam_date: '', syllabus_total: 10 });
  const [newTopic, setNewTopic] = useState({ name: '', subject_id: '' });

  const fetchData = async () => {
    try {
      const [subsRes, topsRes] = await Promise.all([
        api.get('/subjects/'),
        api.get('/topics/')
      ]);
      setSubjects(subsRes.data);
      setTopics(topsRes.data);
      if (subsRes.data.length > 0 && !newTopic.subject_id) {
        setNewTopic(prev => ({ ...prev, subject_id: subsRes.data[0].id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddSubject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/subjects/', newSubject);
      setNewSubject({ name: '', difficulty: 3, exam_date: '', syllabus_total: 10 });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTopic = async (e) => {
    e.preventDefault();
    try {
      await api.post('/topics/', newTopic);
      setNewTopic({ ...newTopic, name: '' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteSubject = async (id) => {
    try {
      await api.delete(`/subjects/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-center text-dark-muted">Loading subjects...</div>;

  return (
    <div className="max-w-6xl mx-auto animate-fade-in space-y-8">
      <h1 className="text-3xl font-bold">Subjects & Topics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ADD SUBJECT FORM */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center"><Folder className="mr-2 text-brand-400" /> Add Subject</h2>
          <form onSubmit={handleAddSubject} className="space-y-4">
            <input 
              required className="input-field" placeholder="Subject Name (e.g., Calculus)"
              value={newSubject.name} onChange={e => setNewSubject({...newSubject, name: e.target.value})}
            />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-dark-muted ml-1 mb-1 block">Difficulty (1-5)</label>
                <input 
                  type="number" min="1" max="5" required className="input-field"
                  value={newSubject.difficulty} onChange={e => setNewSubject({...newSubject, difficulty: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <label className="text-xs text-dark-muted ml-1 mb-1 block">Total Chapters/Topics</label>
                <input 
                  type="number" min="1" required className="input-field"
                  value={newSubject.syllabus_total} onChange={e => setNewSubject({...newSubject, syllabus_total: parseInt(e.target.value)})}
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-dark-muted ml-1 mb-1 block">Exam Date</label>
              <input 
                type="date" required className="input-field"
                value={newSubject.exam_date} onChange={e => setNewSubject({...newSubject, exam_date: e.target.value})}
              />
            </div>
            <button type="submit" className="btn-primary w-full flex justify-center items-center"><Plus size={18} className="mr-2"/> Add Subject</button>
          </form>
        </div>

        {/* ADD TOPIC FORM */}
        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center"><FileText className="mr-2 text-blue-400" /> Add Topic</h2>
          {subjects.length === 0 ? (
            <div className="p-4 bg-dark-bg/50 border border-dark-border rounded-lg text-dark-muted text-sm text-center">
              Add a subject first to create topics.
            </div>
          ) : (
            <form onSubmit={handleAddTopic} className="space-y-4">
              <select 
                required className="input-field"
                value={newTopic.subject_id} onChange={e => setNewTopic({...newTopic, subject_id: parseInt(e.target.value)})}
              >
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <input 
                required className="input-field" placeholder="Topic Name (e.g., Derivatives)"
                value={newTopic.name} onChange={e => setNewTopic({...newTopic, name: e.target.value})}
              />
              <button type="submit" className="btn-secondary w-full">Add Topic</button>
            </form>
          )}
        </div>
      </div>

      {/* LIST SUBJECTS */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Curriculum</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjects.map(subject => (
            <div key={subject.id} className="glass-card p-5 group flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-brand-400 transition-colors">{subject.name}</h3>
                  <button onClick={() => deleteSubject(subject.id)} className="text-dark-muted hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 text-xs mb-4">
                  <span className="px-2 py-1 bg-dark-bg rounded border border-dark-border">Diff: {subject.difficulty}</span>
                  <span className="px-2 py-1 bg-dark-bg rounded border border-dark-border">Exam: {subject.exam_date}</span>
                </div>
              </div>
              
              <div className="pt-3 border-t border-dark-border/50">
                <p className="text-xs text-dark-muted mb-2 font-medium w-full flex justify-between">
                  <span>Topics</span>
                  <span>{topics.filter(t => t.subject_id === subject.id).length}/{subject.syllabus_total}</span>
                </p>
                <div className="flex flex-wrap gap-1">
                  {topics.filter(t => t.subject_id === subject.id).map(topic => (
                    <span key={topic.id} className="text-[10px] px-2 py-1 bg-brand-500/10 text-brand-300 rounded-md">
                      {topic.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Subjects;
