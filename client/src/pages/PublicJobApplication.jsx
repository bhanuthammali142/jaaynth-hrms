import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PublicJobApplication = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    candidateName: '',
    candidateEmail: '',
    answers: {},
  });
  const [resume, setResume] = useState(null);

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  const fetchJob = async () => {
    try {
      const response = await axios.get(`/api/jobs/${jobId}`);
      setJob(response.data);
    } catch (error) {
      console.error('Failed to fetch job:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const submitData = new FormData();
      submitData.append('candidateName', formData.candidateName);
      submitData.append('candidateEmail', formData.candidateEmail);
      submitData.append('answers', JSON.stringify(formData.answers));
      if (resume) {
        submitData.append('resume', resume);
      }

      await axios.post(`/api/applications/apply/${jobId}`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFieldChange = (fieldId, value) => {
    setFormData({
      ...formData,
      answers: {
        ...formData.answers,
        [fieldId]: value,
      },
    });
  };

  const renderField = (field) => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
      case 'number':
      case 'date':
        return (
          <input
            type={field.type}
            required={field.required}
            placeholder={field.placeholder}
            onChange={(e) => handleFieldChange(field.label, e.target.value)}
            className="input"
          />
        );
      case 'textarea':
        return (
          <textarea
            required={field.required}
            placeholder={field.placeholder}
            onChange={(e) => handleFieldChange(field.label, e.target.value)}
            className="input"
            rows="4"
          />
        );
      case 'select':
        return (
          <select
            required={field.required}
            onChange={(e) => handleFieldChange(field.label, e.target.value)}
            className="input"
          >
            <option value="">Select an option</option>
            {field.options?.map((option, idx) => (
              <option key={idx} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((option, idx) => (
              <label key={idx} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={field.label}
                  value={option}
                  required={field.required}
                  onChange={(e) => handleFieldChange(field.label, e.target.value)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );
      case 'checkbox':
        return (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              required={field.required}
              onChange={(e) => handleFieldChange(field.label, e.target.checked)}
            />
            <span>{field.placeholder}</span>
          </label>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Job Not Found</h1>
          <p className="text-gray-600">This job posting is not available.</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Application Submitted!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for applying. We'll review your application and get back to you soon.
            </p>
            <p className="text-sm text-gray-500">
              A confirmation email has been sent to {formData.candidateEmail}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Apply for {job.title}</h1>
          <p className="text-gray-600">{job.department}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Job Description</h2>
          <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">Application Form</h2>

          {/* Basic Info */}
          <div>
            <label className="label">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.candidateName}
              onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
              className="input"
              required
            />
          </div>

          <div>
            <label className="label">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.candidateEmail}
              onChange={(e) => setFormData({ ...formData, candidateEmail: e.target.value })}
              className="input"
              required
            />
          </div>

          <div>
            <label className="label">
              Resume/CV <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResume(e.target.files[0])}
              className="input"
              required
            />
            <p className="text-sm text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
          </div>

          {/* Custom Fields */}
          {job.form_schema && job.form_schema.length > 0 && (
            <>
              <hr className="my-6" />
              {job.form_schema.map((field) => (
                <div key={field.id}>
                  <label className="label">
                    {field.label}
                    {field.required && <span className="text-red-500">*</span>}
                  </label>
                  {renderField(field)}
                </div>
              ))}
            </>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full btn btn-primary"
          >
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PublicJobApplication;
