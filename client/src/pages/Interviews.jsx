import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Calendar as CalendarIcon, Clock, User } from 'lucide-react';

const Interviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchInterviews();
  }, [filter]);

  const fetchInterviews = async () => {
    try {
      const params = filter ? { status: filter } : {};
      const response = await api.get('/interviews', { params });
      setInterviews(response.data);
    } catch (error) {
      console.error('Failed to fetch interviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/interviews/${id}/status`, { status });
      fetchInterviews();
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      scheduled: 'info',
      completed: 'success',
      cancelled: 'danger',
    };
    return colors[status] || 'gray';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Interviews</h1>

      {/* Filter */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">Status</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input"
            >
              <option value="">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Interviews List */}
      <div className="grid gap-6">
        {interviews.length > 0 ? (
          interviews.map((interview) => (
            <div key={interview.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {interview.candidate_name}
                    </h3>
                    <span className={`badge badge-${getStatusColor(interview.status)}`}>
                      {interview.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <CalendarIcon size={16} />
                      <span>{new Date(interview.scheduled_time).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock size={16} />
                      <span>{new Date(interview.scheduled_time).toLocaleTimeString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <User size={16} />
                      <span>Interviewer: {interview.interviewer_name || 'Not assigned'}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Job:</strong> {interview.job_title}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Email:</strong> {interview.candidate_email}
                  </p>

                  {interview.meeting_link && (
                    <div className="mt-3">
                      <a
                        href={interview.meeting_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:underline text-sm"
                      >
                        Join Meeting →
                      </a>
                    </div>
                  )}

                  {interview.notes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{interview.notes}</p>
                    </div>
                  )}
                </div>

                {interview.status === 'scheduled' && (
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => updateStatus(interview.id, 'completed')}
                      className="btn btn-success"
                    >
                      Mark Completed
                    </button>
                    <button
                      onClick={() => updateStatus(interview.id, 'cancelled')}
                      className="btn btn-danger"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="card text-center py-12">
            <p className="text-gray-500">No interviews scheduled</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Interviews;
