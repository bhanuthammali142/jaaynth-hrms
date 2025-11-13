import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { TrendingUp, Users, Calendar, FileCheck, Plus } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, activityRes] = await Promise.all([
        api.get('/dashboard/overview'),
        api.get('/dashboard/recent-activity'),
      ]);
      setStats(statsRes.data);
      setRecentActivity(activityRes.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Active Jobs',
      value: stats?.jobs?.active_jobs || 0,
      icon: TrendingUp,
      color: 'bg-blue-500',
      link: '/jobs',
    },
    {
      title: 'Total Applications',
      value: stats?.applications?.total_applications || 0,
      icon: Users,
      color: 'bg-green-500',
      link: '/applications',
    },
    {
      title: 'Scheduled Interviews',
      value: stats?.interviews?.scheduled || 0,
      icon: Calendar,
      color: 'bg-purple-500',
      link: '/interviews',
    },
    {
      title: 'Offers Sent',
      value: stats?.offers?.sent || 0,
      icon: FileCheck,
      color: 'bg-orange-500',
      link: '/offers',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <Link to="/jobs/new" className="btn btn-primary flex items-center gap-2">
          <Plus size={20} />
          Create Job
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} to={stat.link} className="card hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon size={24} className="text-white" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Recent Applications</h2>
            <Link to="/applications" className="text-primary-600 text-sm hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentActivity?.recentApplications?.length > 0 ? (
              recentActivity.recentApplications.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{app.candidate_name}</p>
                    <p className="text-sm text-gray-600">{app.job_title}</p>
                  </div>
                  <span className={`badge badge-${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent applications</p>
            )}
          </div>
        </div>

        {/* Upcoming Interviews */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Upcoming Interviews</h2>
            <Link to="/interviews" className="text-primary-600 text-sm hover:underline">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentActivity?.upcomingInterviews?.length > 0 ? (
              recentActivity.upcomingInterviews.map((interview) => (
                <div key={interview.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{interview.candidate_name}</p>
                    <p className="text-sm text-gray-600">{interview.job_title}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-800">
                      {new Date(interview.scheduled_time).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-600">
                      {new Date(interview.scheduled_time).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No upcoming interviews</p>
            )}
          </div>
        </div>
      </div>

      {/* Application Status Breakdown */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Application Status Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-800">{stats?.applications?.new_applications || 0}</p>
            <p className="text-sm text-gray-600 mt-1">New</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{stats?.applications?.shortlisted || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Shortlisted</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">{stats?.applications?.interviewed || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Interviewed</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{stats?.applications?.offered || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Offered</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">{stats?.applications?.rejected || 0}</p>
            <p className="text-sm text-gray-600 mt-1">Rejected</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const getStatusColor = (status) => {
  const colors = {
    new: 'gray',
    shortlisted: 'info',
    interviewed: 'warning',
    offered: 'success',
    rejected: 'danger',
  };
  return colors[status] || 'gray';
};

export default Dashboard;
