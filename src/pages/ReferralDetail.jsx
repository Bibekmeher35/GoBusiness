import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function ReferralDetail() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [referral, setReferral] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      
      const token = Cookies.get('jwt_token');
      if (!token) {
        setError('Unauthorized');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`https://v9fes04dwf.execute-api.eu-north-1.amazonaws.com/api/referrals?id=${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Detail fetch failed with status ${response.status}`);
        }

        const responseJson = await response.json();
        
        // Find matching referral using robust check logic
        const found = findReferral(responseJson, id);
        
        if (found) {
          setReferral(found);
        } else {
          setReferral(null);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const findReferral = (json, targetId) => {
      if (!json) return null;
      
      if (json.data && String(json.data.id) === String(targetId)) {
        return json.data;
      }
      
      if (String(json.id) === String(targetId)) {
        return json;
      }
      
      if (json.data?.referral && String(json.data.referral.id) === String(targetId)) {
        return json.data.referral;
      }
      if (json.referral && String(json.referral.id) === String(targetId)) {
        return json.referral;
      }
      
      const array = json.data?.referrals || json.referrals || [];
      if (Array.isArray(array)) {
        const item = array.find(r => String(r.id) === String(targetId));
        if (item) return item;
      }
      
      return null;
    };

    fetchDetail();
  }, [id]);

  // Formatting helpers
  const formatProfit = (val) => {
    const num = Number(val) || 0;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return dateStr.replace(/-/g, '/');
  };

  return (
    <>
      <Navbar />
      
      <main className="main-content container">
        {error && (
          <div className="alert-error" role="alert">
            {error}
          </div>
        )}

        {loading && (
          <div className="loading-indicator">
            Loading referral details...
          </div>
        )}
      <div className='ref'>
        {!loading && !referral && (
          <div className="detail-card">
            <div style={{ marginBottom: '1rem' }}>
              <Link to="/" className="link-back" aria-label="Back to dashboard">
                ← Back to dashboard
              </Link>
            </div>
            <div className="card">
              <h1 className="detail-title">Referral not found</h1>
              <p style={{ color: '#64748b' }}>
                The requested referral details could not be found or do not exist.
              </p>
            </div>
          </div>
        )}

        {!loading && referral && (
          <div className="detail-card">
            <div style={{ marginBottom: '1.5rem' }}>
              <Link to="/" className="link-back" aria-label="Back to dashboard">
                ← Back to dashboard
              </Link>
            </div>
            
            <div className="ref-card">
              <div className="detail-header">
                <h1 className="detail-title">Referral Details</h1>
                <p style={{ color: '#64748b', margin: '0.25rem 0 1.25rem 0' }}>
                  Full information for this referral partner.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <h2 className="detail-partner-name" style={{ margin: 0 }}>
                    {referral.name}
                  </h2>
                  <span className="service-badge">
                    {referral.serviceName}
                  </span>
                </div>
              </div>

              <div className="detail-info-list">
                <div className="detail-row">
                  <span className="detail-label">REFERRAL ID</span>
                  <span className="detail-value">{referral.id}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">NAME</span>
                  <span className="detail-value">{referral.name}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">SERVICE NAME</span>
                  <span className="detail-value">{referral.serviceName}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">DATE</span>
                  <span className="detail-value">{formatDate(referral.date)}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">PROFIT</span>
                  <span className="detail-value profit-value-blue">{formatProfit(referral.profit)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      </main>

      <Footer />
    </>
  );
}

export default ReferralDetail;
