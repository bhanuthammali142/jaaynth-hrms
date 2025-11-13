import { useState, useEffect } from 'react';
import api from '../utils/api';
import { DollarSign, User, Briefcase } from 'lucide-react';

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchOffers();
  }, [filter]);

  const fetchOffers = async () => {
    try {
      const params = filter ? { status: filter } : {};
      const response = await api.get('/offers', { params });
      setOffers(response.data);
    } catch (error) {
      console.error('Failed to fetch offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      sent: 'info',
      accepted: 'success',
      rejected: 'danger',
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
      <h1 className="text-3xl font-bold text-gray-800">Offers</h1>

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
              <option value="sent">Sent</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Offers Grid */}
      <div className="grid gap-6">
        {offers.length > 0 ? (
          offers.map((offer) => (
            <div key={offer.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {offer.candidate_name}
                    </h3>
                    <span className={`badge badge-${getStatusColor(offer.status)}`}>
                      {offer.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Briefcase size={16} />
                      <div>
                        <p className="text-xs text-gray-500">Position</p>
                        <p className="font-medium text-gray-900">{offer.position}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <DollarSign size={16} />
                      <div>
                        <p className="text-xs text-gray-500">Salary</p>
                        <p className="font-medium text-gray-900">
                          ${Number(offer.salary).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <User size={16} />
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="font-medium text-gray-900">{offer.candidate_email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>📋 Job: {offer.job_title}</span>
                    <span>📅 Sent: {new Date(offer.sent_at).toLocaleDateString()}</span>
                  </div>

                  {offer.offer_letter_url && (
                    <div className="mt-4">
                      <a
                        href={offer.offer_letter_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary inline-flex items-center gap-2"
                      >
                        View Offer Letter →
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card text-center py-12">
            <p className="text-gray-500">No offers sent yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Offers;
