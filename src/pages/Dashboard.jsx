import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // API Data
  const [metrics, setMetrics] = useState([]);
  const [serviceSummary, setServiceSummary] = useState(null);
  const [sharing, setSharing] = useState({ link: '', code: '' });
  const [referrals, setReferrals] = useState([]);

  // Filter States
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('desc'); // default: newest first

  // Clipboard States for Visual Confirmation
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Pagination States (handled client-side)
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Fetch referrals data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      const token = Cookies.get('jwt_token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const queryParams = new URLSearchParams();
        if (search) {
          queryParams.append('search', search);
        }
        queryParams.append('sort', sortBy);

        const url = `https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals?${queryParams.toString()}`;
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          let errMsg = `Request failed with status ${response.status}`;
          try {
            const errJson = await response.json();
            if (errJson?.message) {
              errMsg = `${errJson.message} (Status ${response.status})`;
            }
          } catch (e) {
            // response is not JSON
          }
          throw new Error(errMsg);
        }

        const responseJson = await response.json();
        
        const responseData = responseJson?.data || responseJson;
        
        setMetrics(responseData?.metrics || []);
        setServiceSummary(responseData?.serviceSummary || null);
        setSharing({
          link: responseData?.referral?.link || '',
          code: responseData?.referral?.code || ''
        });
        setReferrals(responseData?.referrals || []);
        
        setCurrentPage(1);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [search, sortBy, navigate]);

  // Copy helpers
  const handleCopyLink = () => {
    if (sharing.link) {
      navigator.clipboard.writeText(sharing.link);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopyCode = () => {
    if (sharing.code) {
      navigator.clipboard.writeText(sharing.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  // Pagination calculation
  const totalEntries = referrals.length;
  const totalPages = Math.ceil(totalEntries / rowsPerPage) || 1;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = referrals.slice(indexOfFirstRow, indexOfLastRow);

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Render Page Number Buttons
  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          type="button"
          className={`btn-page ${currentPage === i ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  // Currency format helper
  const formatProfit = (val) => {
    const num = Number(val) || 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  // Date format helper (YYYY-MM-DD -> YYYY/MM/DD)
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return dateStr.replace(/-/g, '/');
  };

  // Convert label to Title Case
  const toTitleCase = (str) => {
    if (!str) return '';
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  // Matching metric SVG icons
  const getMetricIcon = (id) => {
    switch (id) {
      case 'balance':
        return (
          <svg className="metric-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'discountPct':
        return (
          <svg className="metric-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        );
      case 'totalRef':
        return (
          <svg className="metric-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        );
      case 'discountAmt':
        return (
          <svg className="metric-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'commissionAmt':
        return (
          <svg className="metric-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9l6 6m0-6L9 15m12-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'totalEarn':
        return (
          <svg className="metric-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v.75H10.5a.75.75 0 000 1.5h.75v3h-.75a.75.75 0 000 1.5h.75V15h-1.5a.75.75 0 000 1.5h1.5v.75a.75.75 0 001.5 0v-.75h.75a.75.75 0 000-1.5h-.75v-3h.75a.75.75 0 000-1.5h-.75V7.5h1.5a.75.75 0 000-1.5h-1.5V6z" />
          </svg>
        );
      case 'commissionDisc':
        return (
          <svg className="metric-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'bankTransfer':
        return (
          <svg className="metric-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        );
      default:
        return (
          <svg className="metric-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <>
      <Navbar />
      
      <main className="main-content container">
        <header className="dashboard-header">
          <h1 className="dashboard-title">Referral Dashboard</h1>
          <p className="dashboard-subtitle">
            Track your referrals, earnings, and partner activity in one place.
          </p>
        </header>

        {error && (
          <div className="alert-error error-container" role="alert">
            {error}
          </div>
        )}

        {loading && (
          <div className="loading-indicator">
            Loading dashboard...
          </div>
        )}

        {!loading && (
          <>
            {/* Overview Section */}
            {metrics && metrics.length > 0 && (
              <section className="card" aria-label="Overview metrics">
                <h2 className="card-title">Overview</h2>
                <div className="overview-grid">
                  {metrics.map((metric) => (
                    <div key={metric.id} className="metric-card-video">
                      <div className="metric-icon-container">
                        {getMetricIcon(metric.id)}
                      </div>
                      <div className="metric-info-container">
                        <div className="metric-value-video">{metric.value}</div>
                        <div className="metric-label-video">{toTitleCase(metric.label)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Service Summary Section */}
            {serviceSummary && (
              <section className="card" aria-label="Service summary">
                <h2 className="card-title">Service summary</h2>
                <div className="summary-table-wrapper">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>SERVICE</th>
                        <th>YOUR REFERRALS</th>
                        <th>ACTIVE REFERRALS</th>
                        <th>TOTAL REF. EARNINGS</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="service-value-blue">{serviceSummary.service}</td>
                        <td>{serviceSummary.yourReferrals}</td>
                        <td>{serviceSummary.activeReferrals}</td>
                        <td>{serviceSummary.totalRefEarnings}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Share Referral Section */}
            <section className="card" aria-label="Share referral">
              <h2 className="card-title">Refer friends and earn more</h2>
              <div className="share-grid">
                <div className="share-field">
                  <label className="share-field-label" htmlFor="referral-link-input">
                    YOUR REFERRAL LINK
                  </label>
                  <div className="share-input-group">
                    <input
                      id="referral-link-input"
                      type="text"
                      className="share-input"
                      readOnly
                      value={sharing.link}
                    />
                    <button
                      type="button"
                      className={`btn-copy ${copiedLink ? 'copied' : ''}`}
                      onClick={handleCopyLink}
                    >
                      {copiedLink ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                <div className="share-field">
                  <label className="share-field-label" htmlFor="referral-code-input">
                    YOUR REFERRAL CODE
                  </label>
                  <div className="share-input-group">
                    <input
                      id="referral-code-input"
                      type="text"
                      className="share-input"
                      readOnly
                      value={sharing.code}
                    />
                    <button
                      type="button"
                      className={`btn-copy ${copiedCode ? 'copied' : ''}`}
                      onClick={handleCopyCode}
                    >
                      {copiedCode ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* All Referrals Section */}
            <section className="card">
              <h2 className="card-title">All referrals</h2>
              
              {/* Search & Sort Controls */}
              <div className="table-controls">
                <div className="search-wrapper">
                  <input
                    type="search"
                    placeholder="Search Name or service..."
                    className="search-input"
                    aria-label="Search referrals"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="sort-wrapper">
                  <label className="sort-label">
                    Sort by date
                    <select
                      className="sort-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="desc">Newest first</option>
                      <option value="asc">Oldest first</option>
                    </select>
                  </label>
                </div>
              </div>

              {/* Referrals Table */}
              <div className="summary-table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>NAME</th>
                      <th>SERVICE</th>
                      <th>DATE</th>
                      <th>PROFIT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRows.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="empty-state">
                          No matching entries
                        </td>
                      </tr>
                    ) : (
                      currentRows.map((ref) => (
                        <tr 
                          key={ref.id} 
                          className="clickable-row"
                          onClick={() => navigate(`/referral/${ref.id}`)}
                        >
                          <td>{ref.name}</td>
                          <td>{ref.serviceName}</td>
                          <td>{formatDate(ref.date)}</td>
                          <td className="profit-cell">{formatProfit(ref.profit)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="pagination-container">
                <div className="pagination-info">
                  {totalEntries > 0 ? (
                    `Showing ${indexOfFirstRow + 1}–${Math.min(indexOfLastRow, totalEntries)} of ${totalEntries} entries`
                  ) : (
                    "Showing 0–0 of 0 entries"
                  )}
                </div>
                
                {totalPages > 0 && (
                  <div className="pagination-controls">
                    <button
                      type="button"
                      className="btn-page"
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Previous
                    </button>
                    
                    {renderPageNumbers()}
                    
                    <button
                      type="button"
                      className="btn-page"
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>

      <Footer />
    </>
  );
}

export default Dashboard;
