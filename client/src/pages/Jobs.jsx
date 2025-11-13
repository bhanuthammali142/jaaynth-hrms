import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Plus, Search, Edit, Trash2, ExternalLink } from 'lucide-react';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', department: '' });

  useEffect(() => {
    fetchJobs();
  }, [filter]);

  const fetchJobs = async () => {
    try {
      const params = {};
      if (filter.status) params.status = filter.status;
      if (filter.department) params.department = filter.department;
      
      const response = await api.get('/jobs', { params });
      setJobs(response.data);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      await api.delete(`/jobs/${id}`);
      fetchJobs();
    } catch (error) {
      console.error('Failed to delete job:', error);
      alert('Failed to delete job');
    }
  };

  const copyApplicationLink = (jobId) => {
    const link = `${window.location.origin}/apply/${jobId}`;
    navigator.clipboard.writeText(link);
    alert('Application link copied to clipboard!');
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Job Postings</h1>
        <Link to="/jobs/new" className="btn btn-primary flex items-center gap-2">
          <Plus size={20} />
          Create New Job
        </Link>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="label">Status</label>
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              className="input"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div>
            <label className="label">Department</label>
            <input
              type="text"
              value={filter.department}
              onChange={(e) => setFilter({ ...filter, department: e.target.value })}
              placeholder="Filter by department"
              className="input"
            />
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="grid gap-6">
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <div key={job.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-800">{job.title}</h3>
                    <span className={`badge badge-${job.status === 'active' ? 'success' : 'gray'}`}>
                      {job.status}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{job.department}</p>
                  <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>📋 {job.applications_count || 0} applications</span>
                    <span>👤 Created by {job.created_by_name}</span>
                    <span>📅 {new Date(job.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => copyApplicationLink(job.id)}
                    className="btn btn-secondary flex items-center gap-2"
                    title="Copy application link"
                  >
                    <ExternalLink size={16} />
                    Share Link
                  </button>
                  <Link to={`/jobs/edit/${job.id}`} className="btn btn-secondary">
                    <Edit size={16} />
                  </Link>
                  <button onClick={() => handleDelete(job.id)} className="btn btn-danger">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card text-center py-12">
            <p className="text-gray-500 mb-4">No jobs found</p>
            <Link to="/jobs/new" className="btn btn-primary inline-flex items-center gap-2">
              <Plus size={20} />
              Create Your First Job
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
