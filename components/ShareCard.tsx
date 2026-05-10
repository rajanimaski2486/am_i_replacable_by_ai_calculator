'use client';

import { AnalysisResult, UserInput } from '@/lib/types';

export default function ShareCard({ result, userInput }: { result: AnalysisResult, userInput: UserInput }) {
  // We use inline styles heavily here to ensure html-to-image renders it exactly as intended.
  // It should be 1200x630, common for Open Graph / sharing.
  
  const getRiskColorHex = () => {
    if (result.riskScore > 75) return '#ef4444'; // red-500
    if (result.riskScore > 50) return '#f97316'; // orange-500
    if (result.riskScore > 25) return '#eab308'; // yellow-500
    return '#22c55e'; // green-500
  };

  return (
    <div 
      id="share-card-node" 
      style={{
        width: '1200px',
        height: '630px',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
        color: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '60px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Blur */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        right: '-100px',
        width: '500px',
        height: '500px',
        background: 'rgba(59, 130, 246, 0.2)',
        filter: 'blur(100px)',
        borderRadius: '50%',
        zIndex: 0
      }} />

      <div style={{ zIndex: 1 }}>
        <div style={{ fontSize: '32px', color: '#94a3b8', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' }}>
          AI Automation Exposure
        </div>
        <div style={{ fontSize: '64px', fontWeight: 900, lineHeight: 1.1, maxWidth: '800px' }}>
          Role: <span style={{ color: '#60a5fa' }}>{userInput.jobTitle}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '40px', alignItems: 'center', zIndex: 1 }}>
        
        {/* Score Circle */}
        <div style={{
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          border: `16px solid ${getRiskColorHex()}40`,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 0 60px ${getRiskColorHex()}30`
        }}>
          {/* Mock progress arc - just using border for simple share card */}
          <div style={{
            position: 'absolute',
            inset: '-16px',
            borderRadius: '50%',
            border: `16px solid ${getRiskColorHex()}`,
            clipPath: result.riskScore > 50 ? 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 50%)' : 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%)',
          }} />
          <div style={{ fontSize: '72px', fontWeight: 900, zIndex: 2 }}>{result.riskScore}%</div>
          <div style={{ fontSize: '20px', color: getRiskColorHex(), fontWeight: 'bold', zIndex: 2, textTransform: 'uppercase', marginTop: '5px' }}>
            {result.riskLabel}
          </div>
        </div>

        {/* Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', flex: 1 }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '24px', color: '#94a3b8', marginBottom: '10px' }}>Human Advantage</div>
            <div style={{ fontSize: '40px', fontWeight: 'bold', background: 'linear-gradient(to right, #60a5fa, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {result.humanAdvantage}
            </div>
          </div>
          
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '30px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ fontSize: '24px', color: '#94a3b8', marginBottom: '10px' }}>Career Moat Score</div>
            <div style={{ fontSize: '40px', fontWeight: 'bold', color: 'white' }}>
              {result.careerMoatScore} / 100
            </div>
          </div>
        </div>

      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 1 }}>
        <div style={{ fontSize: '28px', color: '#94a3b8', fontWeight: 500 }}>
          <span style={{ color: 'white', fontWeight: 'bold' }}>amireplaceablebyai.vercel.app</span>
        </div>
        <div style={{ fontSize: '24px', color: '#64748b' }}>
          Not career advice.
        </div>
      </div>
    </div>
  );
}
