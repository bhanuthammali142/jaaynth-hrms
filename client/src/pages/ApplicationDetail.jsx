import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { ArrowLeft, Mail, Calendar, FileText, DollarSign } from 'lucide-react';

const ApplicationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const fetchApplication = async () => {
    try {
      const response = await api.get(`/applications/${id}`);
      setApplication(response.data);
    } catch (error) {
      console.error('Failed to fetch application:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status) => {
    try {
      await api.patch(`/applications/${id}/status`, { status });
      fetchApplication();
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!application) {
    return <div>Application not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/applications')} className="btn btn-secondary">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800">{application.candidate_name}</h1>
          <p className="text-gray-600">{application.job_title}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Candidate Info */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Candidate Information</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-gray-500">Email</dt>
                <dd className="text-gray-900">{application.candidate_email}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Score</dt>
                <dd className="text-gray-900 font-semibold">{application.score}/100</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Applied Date</dt>
                <dd className="text-gray-900">
                  {new Date(application.created_at).toLocaleString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Department</dt>
                <dd className="text-gray-900">{application.job_department}</dd>
              </div>
            </dl>
          </div>

          {/* Resume */}
          {application.resume_url && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Resume</h2>
              <a
                href={application.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary inline-flex items-center gap-2"
              >
                <FileText size={20} />
                View Resume
              </a>
            </div>
          )}

          {/* Application Answers */}
          {application.answers && Object.keys(application.answers).length > 0 && (
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Application Responses</h2>
              <dl className="space-y-4">
                {Object.entries(application.answers).map(([key, value]) => (
                  <div key={key}>
                    <dt className="text-sm font-medium text-gray-500 mb-1">{key}</dt>
                    <dd className="text-gray-900">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>

        {/* Actions Sidebar */}
        <div className="lg:col-span-1">
          <div className="card sticky top-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Actions</h2>
            
            {/* Status */}
            <div className="mb-6">
              <label className="label">Current Status</label>
              <select
                value={application.status}
                onChange={(e) => updateStatus(e.target.value)}
                className="input"
              >
                <option value="new">New</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="interviewed">Interviewed</option>
                <option value="offered">Offered</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              {application.status !== 'shortlisted' && (
                <button
                  onClick={() => updateStatus('shortlisted')}
                  className="w-full btn btn-success flex items-center justify-center gap-2"
                >
                  <Mail size={18} />
                  Shortlist Candidate
                </button>
              )}

              {application.status === 'shortlisted' && (
                <button
                  onClick={() => setShowScheduleModal(true)}
                  className="w-full btn btn-primary flex items-center justify-center gap-2"
                >
                  <Calendar size={18} />
                  Schedule Interview
                </button>
              )}

              {(application.status === 'interviewed' || application.status === 'shortlisted') && (
                <button
                  onClick={() => setShowOfferModal(true)}
                  className="w-full btn btn-success flex items-center justify-center gap-2"
                >
                  <DollarSign size={18} />
                  Send Offer
                </button>
              )}

              {application.status !== 'rejected' && (
                <button
                  onClick={() => updateStatus('rejected')}
                  className="w-full btn btn-danger"
                >
                  Reject Application
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Interview Modal */}
      {showScheduleModal && (
        <ScheduleInterviewModal
          applicationId={id}
          onClose={() => setShowScheduleModal(false)}
          onSuccess={() => {
            setShowScheduleModal(false);
            fetchApplication();
          }}
        />
      )}

      {/* Send Offer Modal */}
      {showOfferModal && (
        <SendOfferModal
          applicationId={id}
          candidateName={application.candidate_name}
          onClose={() => setShowOfferModal(false)}
          onSuccess={() => {
            setShowOfferModal(false);
            fetchApplication();
          }}
        />
      )}
    </div>
  );
};

const ScheduleInterviewModal = ({ applicationId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    scheduledTime: '',
    meetingLink: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/interviews', {
        applicationId,
        ...formData,
      });
      onSuccess();
    } catch (error) {
      console.error('Failed to schedule interview:', error);
      alert('Failed to schedule interview');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Schedule Interview</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Interview Date & Time *</label>
            <input
              type="datetime-local"
              value={formData.scheduledTime}
              onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Meeting Link</label>
            <input
              type="url"
              value={formData.meetingLink}
              onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
              placeholder="https://meet.google.com/..."
              className="input"
            />
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input"
              rows="3"
            />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 btn btn-primary">
              {loading ? 'Scheduling...' : 'Schedule'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SendOfferModal = ({ applicationId, candidateName, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    position: '',
    salary: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/offers', {
        applicationId,
        ...formData,
      });
      onSuccess();
    } catch (error) {
      console.error('Failed to send offer:', error);
      alert('Failed to send offer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Send Offer to {candidateName}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Position *</label>
            <input
              type="text"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              className="input"
              required
            />
          </div>
          <div>
            <label className="label">Annual Salary ($) *</label>
            <input
              type="number"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              className="input"
              required
            />
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 btn btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 btn btn-primary">
              {loading ? 'Sending...' : 'Send Offer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationDetail;
