import { useState, useEffect } from 'react';
import { lineupAPI } from '../api/lineups';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const LineupBuilder = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State
  const [lineupName, setLineupName] = useState('Yeni Kadro');
  const [homeTeam, setHomeTeam] = useState({
    gk: '', def1: '', def2: '', def3: '', fw1: '', fw2: '', fw3: ''
  });
  const [awayTeam, setAwayTeam] = useState({
    gk: '', def1: '', def2: '', def3: '', fw1: '', fw2: '', fw3: ''
  });
  const [notes, setNotes] = useState('');
  const [savedLineups, setSavedLineups] = useState([]);
  const [selectedLineupId, setSelectedLineupId] = useState(null);
  const [showAwayTeam, setShowAwayTeam] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    loadLineups();
  }, [user, navigate]);

  const loadLineups = async () => {
    try {
      const data = await lineupAPI.getLineups();
      setSavedLineups(data.lineups || []);
      setError('');
    } catch (err) {
      console.error('Kadrolar yüklenemedi:', err);
      setError('Kadrolar yüklenirken hata oluştu');
    }
  };

  const handlePlayerChange = (team, position, value) => {
    if (team === 'home') {
      setHomeTeam({ ...homeTeam, [position]: value });
    } else {
      setAwayTeam({ ...awayTeam, [position]: value });
    }
  };

  const handleSave = async () => {
    if (!lineupName.trim()) {
      alert('Lütfen kadro adı girin');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const lineupData = {
        name: lineupName,
        formation: '3-3-1',
        home_team: homeTeam,
        away_team: showAwayTeam ? awayTeam : null,
        notes: notes || null
      };

      if (selectedLineupId) {
        await lineupAPI.updateLineup(selectedLineupId, lineupData);
        alert('Kadro güncellendi!');
      } else {
        await lineupAPI.createLineup(lineupData);
        alert('Kadro kaydedildi!');
      }
      
      await loadLineups();
    } catch (err) {
      console.error('Kadro kaydedilemedi:', err);
      setError('Kadro kaydedilemedi: ' + (err.response?.data?.detail || err.message));
      alert('Kadro kaydedilemedi. Konsolu kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoad = async (lineup) => {
    setSelectedLineupId(lineup.id);
    setLineupName(lineup.name);
    setHomeTeam(lineup.home_team);
    setAwayTeam(lineup.away_team || {
      gk: '', def1: '', def2: '', def3: '', fw1: '', fw2: '', fw3: ''
    });
    setNotes(lineup.notes || '');
    setShowAwayTeam(!!lineup.away_team);
  };

  const handleNew = () => {
    setSelectedLineupId(null);
    setLineupName('Yeni Kadro');
    setHomeTeam({ gk: '', def1: '', def2: '', def3: '', fw1: '', fw2: '', fw3: '' });
    setAwayTeam({ gk: '', def1: '', def2: '', def3: '', fw1: '', fw2: '', fw3: '' });
    setNotes('');
    setShowAwayTeam(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu kadroyu silmek istediğinize emin misiniz?')) return;
    
    try {
      await lineupAPI.deleteLineup(id);
      alert('Kadro silindi!');
      await loadLineups();
      if (selectedLineupId === id) {
        handleNew();
      }
    } catch (err) {
      console.error('Kadro silinemedi:', err);
      alert('Kadro silinemedi');
    }
  };

  if (!user) return null;

  return (
    <div style={{ minHeight: '100vh', padding: '2rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', color: 'white', fontSize: '2.5rem', marginBottom: '2rem' }}>
          ⚽ Kadro Dizilişi
        </h1>

        {error && (
          <div style={{ background: '#fee', color: '#c00', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        {/* Kontroller */}
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
          <input
            type="text"
            value={lineupName}
            onChange={(e) => setLineupName(e.target.value)}
            placeholder="Kadro Adı"
            style={{ width: '100%', padding: '0.75rem', fontSize: '1.25rem', border: '2px solid #e2e8f0', borderRadius: '8px', marginBottom: '1rem' }}
          />
          
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <button onClick={handleNew} style={{ padding: '0.75rem 1.5rem', background: '#718096', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              🆕 Yeni
            </button>
            <button onClick={handleSave} disabled={loading} style={{ padding: '0.75rem 1.5rem', background: loading ? '#ccc' : '#667eea', color: 'white', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
              {loading ? '⏳ Kaydediliyor...' : selectedLineupId ? '💾 Güncelle' : '💾 Kaydet'}
            </button>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
              <input type="checkbox" checked={showAwayTeam} onChange={(e) => setShowAwayTeam(e.target.checked)} />
              Karşı Takımı Göster
            </label>
          </div>
        </div>

        {/* Futbol Sahası */}
        <div style={{ background: '#2d8b3c', border: '4px solid white', borderRadius: '12px', padding: '2rem', marginBottom: '2rem' }}>
          {/* Ev Sahibi */}
          <div style={{ marginBottom: showAwayTeam ? '2rem' : 0 }}>
            <h3 style={{ textAlign: 'center', color: 'white', background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
              Ev Sahibi
            </h3>
            
            {/* Kaleci */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
              <div style={{ textAlign: 'center' }}>
                <input
                  type="text"
                  value={homeTeam.gk}
                  onChange={(e) => handlePlayerChange('home', 'gk', e.target.value)}
                  placeholder="Kaleci"
                  style={{ width: '120px', padding: '0.75rem', border: '3px solid white', borderRadius: '50%', textAlign: 'center', background: 'white', fontWeight: 'bold' }}
                />
                <div style={{ color: 'white', fontSize: '0.75rem', marginTop: '0.5rem', background: 'rgba(0,0,0,0.5)', padding: '0.25rem 0.75rem', borderRadius: '12px' }}>
                  Kaleci
                </div>
              </div>
            </div>

            {/* Defans */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '3rem' }}>
              {[
                { key: 'def1', label: 'Sol Bek' },
                { key: 'def2', label: 'Stoper' },
                { key: 'def3', label: 'Sağ Bek' }
              ].map(pos => (
                <div key={pos.key} style={{ textAlign: 'center' }}>
                  <input
                    type="text"
                    value={homeTeam[pos.key]}
                    onChange={(e) => handlePlayerChange('home', pos.key, e.target.value)}
                    placeholder={pos.label}
                    style={{ width: '120px', padding: '0.75rem', border: '3px solid white', borderRadius: '50%', textAlign: 'center', background: 'white', fontWeight: 'bold' }}
                  />
                  <div style={{ color: 'white', fontSize: '0.75rem', marginTop: '0.5rem', background: 'rgba(0,0,0,0.5)', padding: '0.25rem 0.75rem', borderRadius: '12px' }}>
                    {pos.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Forvet */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
              {[
                { key: 'fw1', label: 'Sol Kanat' },
                { key: 'fw2', label: 'Santrafor' },
                { key: 'fw3', label: 'Sağ Kanat' }
              ].map(pos => (
                <div key={pos.key} style={{ textAlign: 'center' }}>
                  <input
                    type="text"
                    value={homeTeam[pos.key]}
                    onChange={(e) => handlePlayerChange('home', pos.key, e.target.value)}
                    placeholder={pos.label}
                    style={{ width: '120px', padding: '0.75rem', border: '3px solid white', borderRadius: '50%', textAlign: 'center', background: 'white', fontWeight: 'bold' }}
                  />
                  <div style={{ color: 'white', fontSize: '0.75rem', marginTop: '0.5rem', background: 'rgba(0,0,0,0.5)', padding: '0.25rem 0.75rem', borderRadius: '12px' }}>
                    {pos.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Orta Çizgi */}
          {showAwayTeam && (
            <div style={{ height: '3px', background: 'white', margin: '2rem 0' }}></div>
          )}

          {/* Konuk Takım */}
          {showAwayTeam && (
            <div>
              <h3 style={{ textAlign: 'center', color: 'white', background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
                Konuk Takım
              </h3>
              
              {/* Forvet */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '3rem' }}>
                {[
                  { key: 'fw1', label: 'Sol Kanat' },
                  { key: 'fw2', label: 'Santrafor' },
                  { key: 'fw3', label: 'Sağ Kanat' }
                ].map(pos => (
                  <div key={pos.key} style={{ textAlign: 'center' }}>
                    <input
                      type="text"
                      value={awayTeam[pos.key]}
                      onChange={(e) => handlePlayerChange('away', pos.key, e.target.value)}
                      placeholder={pos.label}
                      style={{ width: '120px', padding: '0.75rem', border: '3px solid white', borderRadius: '50%', textAlign: 'center', background: 'white', fontWeight: 'bold' }}
                    />
                    <div style={{ color: 'white', fontSize: '0.75rem', marginTop: '0.5rem', background: 'rgba(0,0,0,0.5)', padding: '0.25rem 0.75rem', borderRadius: '12px' }}>
                      {pos.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Defans */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '3rem' }}>
                {[
                  { key: 'def1', label: 'Sol Bek' },
                  { key: 'def2', label: 'Stoper' },
                  { key: 'def3', label: 'Sağ Bek' }
                ].map(pos => (
                  <div key={pos.key} style={{ textAlign: 'center' }}>
                    <input
                      type="text"
                      value={awayTeam[pos.key]}
                      onChange={(e) => handlePlayerChange('away', pos.key, e.target.value)}
                      placeholder={pos.label}
                      style={{ width: '120px', padding: '0.75rem', border: '3px solid white', borderRadius: '50%', textAlign: 'center', background: 'white', fontWeight: 'bold' }}
                    />
                    <div style={{ color: 'white', fontSize: '0.75rem', marginTop: '0.5rem', background: 'rgba(0,0,0,0.5)', padding: '0.25rem 0.75rem', borderRadius: '12px' }}>
                      {pos.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Kaleci */}
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <input
                    type="text"
                    value={awayTeam.gk}
                    onChange={(e) => handlePlayerChange('away', 'gk', e.target.value)}
                    placeholder="Kaleci"
                    style={{ width: '120px', padding: '0.75rem', border: '3px solid white', borderRadius: '50%', textAlign: 'center', background: 'white', fontWeight: 'bold' }}
                  />
                  <div style={{ color: 'white', fontSize: '0.75rem', marginTop: '0.5rem', background: 'rgba(0,0,0,0.5)', padding: '0.25rem 0.75rem', borderRadius: '12px' }}>
                    Kaleci
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notlar */}
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>📝 Notlar</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Maç notları, taktikler vs..."
            rows={3}
            style={{ width: '100%', padding: '0.75rem', border: '2px solid #e2e8f0', borderRadius: '8px', resize: 'vertical' }}
          />
        </div>

        {/* Kaydedilmiş Kadrolar */}
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px' }}>
          <h3 style={{ marginBottom: '1rem' }}>📋 Kaydedilmiş Kadrolar</h3>
          {savedLineups.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#a0aec0', padding: '2rem' }}>Henüz kaydedilmiş kadro yok.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {savedLineups.map((lineup) => (
                <div 
                  key={lineup.id} 
                  style={{ 
                    border: selectedLineupId === lineup.id ? '2px solid #667eea' : '2px solid #e2e8f0',
                    background: selectedLineupId === lineup.id ? '#f7fafc' : 'white',
                    borderRadius: '8px', 
                    padding: '1rem' 
                  }}
                >
                  <h4 style={{ marginBottom: '0.25rem' }}>{lineup.name}</h4>
                  <p style={{ color: '#a0aec0', fontSize: '0.875rem', marginBottom: '1rem' }}>
                    {new Date(lineup.created_at).toLocaleDateString('tr-TR')}
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => handleLoad(lineup)}
                      style={{ flex: 1, padding: '0.5rem 1rem', background: '#718096', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      📂 Yükle
                    </button>
                    <button 
                      onClick={() => handleDelete(lineup.id)}
                      style={{ flex: 1, padding: '0.5rem 1rem', background: '#f56565', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      🗑️ Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LineupBuilder;

const LineupBuilder = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [lineupName, setLineupName] = useState('Yeni Kadro');
  const [homeTeam, setHomeTeam] = useState({
    gk: '',
    def1: '',
    def2: '',
    def3: '',
    fw1: '',
    fw2: '',
    fw3: ''
  });
  const [awayTeam, setAwayTeam] = useState({
    gk: '',
    def1: '',
    def2: '',
    def3: '',
    fw1: '',
    fw2: '',
    fw3: ''
  });
  const [notes, setNotes] = useState('');
  const [savedLineups, setSavedLineups] = useState([]);
  const [selectedLineupId, setSelectedLineupId] = useState(null);
  const [showAwayTeam, setShowAwayTeam] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    loadLineups();
  }, [user, navigate]);

  const loadLineups = async () => {
    try {
      const data = await lineupAPI.getLineups();
      setSavedLineups(data.lineups || []);
    } catch (error) {
      console.error('Kadrolar yüklenemedi:', error);
    }
  };

  const handlePlayerChange = (team, position, value) => {
    if (team === 'home') {
      setHomeTeam({ ...homeTeam, [position]: value });
    } else {
      setAwayTeam({ ...awayTeam, [position]: value });
    }
  };

  const handleSave = async () => {
    if (!lineupName.trim()) {
      alert('Lütfen kadro adı girin');
      return;
    }

    setLoading(true);
    try {
      const lineupData = {
        name: lineupName,
        formation: '3-3-1',
        home_team: homeTeam,
        away_team: showAwayTeam ? awayTeam : null,
        notes: notes
      };

      if (selectedLineupId) {
        await lineupAPI.updateLineup(selectedLineupId, lineupData);
        alert('Kadro güncellendi!');
      } else {
        await lineupAPI.createLineup(lineupData);
        alert('Kadro kaydedildi!');
      }
      
      loadLineups();
    } catch (error) {
      console.error('Kadro kaydedilemedi:', error);
      alert('Kadro kaydedilemedi. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoad = async (lineup) => {
    setSelectedLineupId(lineup.id);
    setLineupName(lineup.name);
    setHomeTeam(lineup.home_team);
    setAwayTeam(lineup.away_team || {
      gk: '', def1: '', def2: '', def3: '', fw1: '', fw2: '', fw3: ''
    });
    setNotes(lineup.notes || '');
    setShowAwayTeam(!!lineup.away_team);
  };

  const handleNew = () => {
    setSelectedLineupId(null);
    setLineupName('Yeni Kadro');
    setHomeTeam({ gk: '', def1: '', def2: '', def3: '', fw1: '', fw2: '', fw3: '' });
    setAwayTeam({ gk: '', def1: '', def2: '', def3: '', fw1: '', fw2: '', fw3: '' });
    setNotes('');
    setShowAwayTeam(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu kadroyu silmek istediğinize emin misiniz?')) return;
    
    try {
      await lineupAPI.deleteLineup(id);
      alert('Kadro silindi!');
      loadLineups();
      if (selectedLineupId === id) {
        handleNew();
      }
    } catch (error) {
      console.error('Kadro silinemedi:', error);
      alert('Kadro silinemedi. Lütfen tekrar deneyin.');
    }
  };

  const PlayerSlot = ({ position, value, onChange, label, side }) => (
    <div className={`player-slot ${side}`}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={label}
        className="player-input"
        maxLength={20}
      />
      <div className="position-label">{label}</div>
    </div>
  );

  const TeamHalf = ({ team, teamName, positions, onPlayerChange }) => (
    <div className={`team-half ${team === 'away' ? 'away-half' : ''}`}>
      <h3 className="team-name">{teamName}</h3>
      
      {/* Kaleci */}
      <div className="formation-row goalkeeper">
        <PlayerSlot 
          position="gk"
          value={positions.gk}
          onChange={(val) => onPlayerChange(team, 'gk', val)}
          label="Kaleci"
          side={team}
        />
      </div>

      {/* Defans */}
      <div className="formation-row defense">
        <PlayerSlot 
          position="def1"
          value={positions.def1}
          onChange={(val) => onPlayerChange(team, 'def1', val)}
          label="Sol Bek"
          side={team}
        />
        <PlayerSlot 
          position="def2"
          value={positions.def2}
          onChange={(val) => onPlayerChange(team, 'def2', val)}
          label="Stoper"
          side={team}
        />
        <PlayerSlot 
          position="def3"
          value={positions.def3}
          onChange={(val) => onPlayerChange(team, 'def3', val)}
          label="Sağ Bek"
          side={team}
        />
      </div>

      {/* Forvet */}
      <div className="formation-row forward">
        <PlayerSlot 
          position="fw1"
          value={positions.fw1}
          onChange={(val) => onPlayerChange(team, 'fw1', val)}
          label="Sol Kanat"
          side={team}
        />
        <PlayerSlot 
          position="fw2"
          value={positions.fw2}
          onChange={(val) => onPlayerChange(team, 'fw2', val)}
          label="Santrafor"
          side={team}
        />
        <PlayerSlot 
          position="fw3"
          value={positions.fw3}
          onChange={(val) => onPlayerChange(team, 'fw3', val)}
          label="Sağ Kanat"
          side={team}
        />
      </div>
    </div>
  );

  if (!user) return null;

  return (
    <div className="lineup-builder">
      <div className="container">
        <h1 className="page-title">⚽ Kadro Dizilişi</h1>

        {/* Üst Kontroller */}
        <div className="lineup-controls">
          <input
            type="text"
            value={lineupName}
            onChange={(e) => setLineupName(e.target.value)}
            placeholder="Kadro Adı"
            className="lineup-name-input"
          />
          
          <div className="button-group">
            <button onClick={handleNew} className="btn btn-secondary">
              🆕 Yeni
            </button>
            <button onClick={handleSave} className="btn btn-primary" disabled={loading}>
              {loading ? '⏳ Kaydediliyor...' : selectedLineupId ? '💾 Güncelle' : '💾 Kaydet'}
            </button>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={showAwayTeam}
                onChange={(e) => setShowAwayTeam(e.target.checked)}
              />
              Karşı Takımı Göster
            </label>
          </div>
        </div>

        {/* Futbol Sahası */}
        <div className={`football-field ${showAwayTeam ? 'two-teams' : ''}`}>
          <TeamHalf 
            team="home"
            teamName="Ev Sahibi"
            positions={homeTeam}
            onPlayerChange={handlePlayerChange}
          />
          
          {showAwayTeam && (
            <>
              <div className="midfield-line"></div>
              <TeamHalf 
                team="away"
                teamName="Konuk Takım"
                positions={awayTeam}
                onPlayerChange={handlePlayerChange}
              />
            </>
          )}
        </div>

        {/* Notlar */}
        <div className="notes-section">
          <h3>📝 Notlar</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Maç notları, taktikler vs..."
            rows={3}
            className="notes-textarea"
          />
        </div>

        {/* Kaydedilmiş Kadrolar */}
        <div className="saved-lineups">
          <h3>📋 Kaydedilmiş Kadrolar</h3>
          {savedLineups.length === 0 ? (
            <p className="empty-message">Henüz kaydedilmiş kadro yok.</p>
          ) : (
            <div className="lineup-list">
              {savedLineups.map((lineup) => (
                <div 
                  key={lineup.id} 
                  className={`lineup-card ${selectedLineupId === lineup.id ? 'active' : ''}`}
                >
                  <div className="lineup-card-header">
                    <h4>{lineup.name}</h4>
                    <span className="lineup-date">
                      {new Date(lineup.created_at).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                  <div className="lineup-card-actions">
                    <button 
                      onClick={() => handleLoad(lineup)}
                      className="btn btn-sm btn-secondary"
                    >
                      📂 Yükle
                    </button>
                    <button 
                      onClick={() => handleDelete(lineup.id)}
                      className="btn btn-sm btn-danger"
                    >
                      🗑️ Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .lineup-builder {
          min-height: 100vh;
          padding: 2rem 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .page-title {
          text-align: center;
          color: white;
          font-size: 2.5rem;
          margin-bottom: 2rem;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }

        .lineup-controls {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          margin-bottom: 2rem;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .lineup-name-input {
          width: 100%;
          padding: 0.75rem;
          font-size: 1.25rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .button-group {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          margin-left: auto;
        }

        .football-field {
          background: linear-gradient(180deg, #2d8b3c 0%, #2d8b3c 48%, #fff 48%, #fff 52%, #2d8b3c 52%, #2d8b3c 100%);
          border: 4px solid white;
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 8px 16px rgba(0,0,0,0.2);
          position: relative;
        }

        .football-field.two-teams {
          min-height: 900px;
        }

        .team-half {
          position: relative;
          padding: 2rem;
          min-height: 400px;
        }

        .away-half {
          transform: rotate(180deg);
        }

        .team-name {
          text-align: center;
          color: white;
          font-size: 1.5rem;
          margin-bottom: 2rem;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
          background: rgba(0,0,0,0.3);
          padding: 0.5rem;
          border-radius: 8px;
        }

        .formation-row {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .formation-row.goalkeeper {
          margin-bottom: 4rem;
        }

        .player-slot {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .player-input {
          width: 120px;
          padding: 0.75rem;
          border: 3px solid white;
          border-radius: 50%;
          text-align: center;
          background: rgba(255, 255, 255, 0.95);
          font-weight: bold;
          font-size: 0.9rem;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          transition: all 0.3s ease;
        }

        .player-input:focus {
          outline: none;
          border-color: #667eea;
          transform: scale(1.05);
          box-shadow: 0 6px 12px rgba(102, 126, 234, 0.4);
        }

        .player-input::placeholder {
          color: #a0aec0;
          font-size: 0.85rem;
        }

        .position-label {
          color: white;
          font-size: 0.75rem;
          font-weight: bold;
          background: rgba(0,0,0,0.5);
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }

        .midfield-line {
          height: 3px;
          background: white;
          margin: 2rem 0;
          box-shadow: 0 0 10px rgba(255,255,255,0.5);
        }

        .notes-section {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          margin-bottom: 2rem;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .notes-section h3 {
          margin-bottom: 1rem;
          color: #2d3748;
        }

        .notes-textarea {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          resize: vertical;
        }

        .saved-lineups {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .saved-lineups h3 {
          margin-bottom: 1rem;
          color: #2d3748;
        }

        .empty-message {
          text-align: center;
          color: #a0aec0;
          padding: 2rem;
        }

        .lineup-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
        }

        .lineup-card {
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          padding: 1rem;
          transition: all 0.3s ease;
        }

        .lineup-card.active {
          border-color: #667eea;
          background: #f7fafc;
        }

        .lineup-card-header {
          margin-bottom: 1rem;
        }

        .lineup-card-header h4 {
          color: #2d3748;
          margin-bottom: 0.25rem;
        }

        .lineup-date {
          color: #a0aec0;
          font-size: 0.875rem;
        }

        .lineup-card-actions {
          display: flex;
          gap: 0.5rem;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-primary {
          background: #667eea;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #5568d3;
          transform: translateY(-2px);
        }

        .btn-secondary {
          background: #718096;
          color: white;
        }

        .btn-secondary:hover {
          background: #4a5568;
        }

        .btn-danger {
          background: #f56565;
          color: white;
        }

        .btn-danger:hover {
          background: #e53e3e;
        }

        .btn-sm {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
        }

        @media (max-width: 768px) {
          .formation-row {
            gap: 1rem;
          }

          .player-input {
            width: 90px;
            padding: 0.5rem;
            font-size: 0.8rem;
          }

          .position-label {
            font-size: 0.7rem;
          }
        }
      `}</style>
    </div>
  );
};

export default LineupBuilder;
