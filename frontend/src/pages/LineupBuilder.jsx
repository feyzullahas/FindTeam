import React, { useState, useEffect, useRef } from 'react';
import { lineupAPI } from '../api/lineups';
import { useAuth } from '../context/AuthContext';
import { Save, Trash2, Plus, Users } from 'lucide-react';

const LineupBuilder = () => {
  const { user } = useAuth();
  const fieldRef = useRef(null);
  
  const [activeTab, setActiveTab] = useState('home'); // 'home' or 'away'
  const [lineupName, setLineupName] = useState('');
  const [homeTeam, setHomeTeam] = useState([]);
  const [awayTeam, setAwayTeam] = useState([]);
  const [notes, setNotes] = useState('');
  const [savedLineups, setSavedLineups] = useState([]);
  const [selectedLineupId, setSelectedLineupId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [draggedPlayer, setDraggedPlayer] = useState(null);

  useEffect(() => {
    loadLineups();
  }, []);

  const loadLineups = async () => {
    try {
      console.log('📥 Kadrolar yükleniyor...');
      const data = await lineupAPI.getLineups();
      console.log('✅ Alınan kadrolar:', data);
      setSavedLineups(data.lineups || []);
      console.log(`📋 ${data.lineups?.length || 0} kadro bulundu`);
    } catch (err) {
      console.error('❌ Kadrolar yüklenemedi:', err);
      console.error('Hata detayı:', err.response?.data);
      setMessage('Kadrolar yüklenirken hata oluştu: ' + (err.response?.data?.detail || err.message));
    }
  };

  const getCurrentTeam = () => activeTab === 'home' ? homeTeam : awayTeam;
  const setCurrentTeam = (team) => activeTab === 'home' ? setHomeTeam(team) : setAwayTeam(team);

  const handleFieldClick = (e) => {
    const currentTeam = getCurrentTeam();
    if (currentTeam.length >= 7) {
      alert('Maksimum 7 oyuncu ekleyebilirsiniz!');
      return;
    }

    const rect = fieldRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const playerName = prompt('Oyuncu ismini girin:');
    if (playerName && playerName.trim()) {
      const newPlayer = {
        name: playerName.trim(),
        x: Math.max(5, Math.min(95, x)),
        y: Math.max(5, Math.min(95, y))
      };
      setCurrentTeam([...currentTeam, newPlayer]);
    }
  };

  const handlePlayerDragStart = (e, index) => {
    setDraggedPlayer(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handlePlayerDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handlePlayerDrop = (e) => {
    e.preventDefault();
    if (draggedPlayer === null) return;

    const rect = fieldRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const currentTeam = getCurrentTeam();
    const updatedTeam = [...currentTeam];
    updatedTeam[draggedPlayer] = {
      ...updatedTeam[draggedPlayer],
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(5, Math.min(95, y))
    };
    setCurrentTeam(updatedTeam);
    setDraggedPlayer(null);
  };

  const handleRemovePlayer = (index) => {
    const currentTeam = getCurrentTeam();
    setCurrentTeam(currentTeam.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!lineupName.trim()) {
      alert('Lütfen kadro adı girin');
      return;
    }

    if (homeTeam.length === 0) {
      alert('En az bir oyuncu eklemelisiniz');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const lineupData = {
        name: lineupName,
        formation: '7v7',
        home_team: homeTeam,
        away_team: awayTeam.length > 0 ? awayTeam : null,
        notes: notes || null
      };

      console.log('📤 Kadro kaydediliyor:', lineupData);

      if (selectedLineupId) {
        console.log(`🔄 Güncelleniyor: ID ${selectedLineupId}`);
        const result = await lineupAPI.updateLineup(selectedLineupId, lineupData);
        console.log('✅ Kadro güncellendi:', result);
        setMessage('Kadro başarıyla güncellendi!');
      } else {
        console.log('➕ Yeni kadro oluşturuluyor...');
        const result = await lineupAPI.createLineup(lineupData);
        console.log('✅ Kadro kaydedildi:', result);
        setMessage('Kadro başarıyla kaydedildi!');
        setSelectedLineupId(result.id);
      }

      console.log('🔄 Kadrolar yeniden yükleniyor...');
      await loadLineups();
      console.log('✅ Kadrolar yüklendi');
    } catch (err) {
      console.error('❌ Kadro kaydedilemedi:', err);
      console.error('Hata detayı:', err.response?.data);
      const errorMsg = err.response?.data?.detail || err.message || 'Bilinmeyen hata';
      setMessage('Kadro kaydedilemedi: ' + errorMsg);
      alert('Hata: ' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadLineup = (lineup) => {
    setSelectedLineupId(lineup.id);
    setLineupName(lineup.name);
    setHomeTeam(lineup.home_team || []);
    setAwayTeam(lineup.away_team || []);
    setNotes(lineup.notes || '');
  };

  const handleNewLineup = () => {
    setSelectedLineupId(null);
    setLineupName('');
    setHomeTeam([]);
    setAwayTeam([]);
    setNotes('');
  };

  const handleDeleteLineup = async (id) => {
    if (!confirm('Bu kadroyu silmek istediğinizden emin misiniz?')) return;

    try {
      await lineupAPI.deleteLineup(id);
      await loadLineups();
      if (selectedLineupId === id) {
        handleNewLineup();
      }
      setMessage('Kadro silindi');
    } catch (err) {
      console.error('Kadro silinemedi:', err);
      setMessage('Kadro silinemedi');
    }
  };

  return (
    <div className="max-w-4xl mx-auto pt-8 px-4">
      <h1 className="text-3xl font-bold text-white drop-shadow-lg mb-6">Kadro Oluşturucu</h1>

      {/* Ana Kadro Kartı - Ortada */}
      <div className="card">
        {/* Kadro Bilgileri */}
        <div className="mb-4">
              <input
                type="text"
                placeholder="Kadro Adı (örn: Cumartesi Maçı)"
                value={lineupName}
                onChange={(e) => setLineupName(e.target.value)}
                className="form-input w-full mb-3"
              />
              
              {/* Takım Seçimi */}
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => setActiveTab('home')}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                    activeTab === 'home'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <Users className="inline mr-2" size={18} />
                  Benim Takımım ({homeTeam.length}/7)
                </button>
                <button
                  onClick={() => setActiveTab('away')}
                  className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
                    activeTab === 'away'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  <Users className="inline mr-2" size={18} />
                  Karşı Takım ({awayTeam.length}/7)
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-2">
                <strong>Nasıl kullanılır:</strong> "Oyuncu Ekle" butonuna tıklayın veya saha üzerine tıklayarak oyuncu ekleyin. 
                Oyuncuları sürükleyerek hareket ettirebilirsiniz. Maksimum 7 oyuncu.
              </p>

              {/* Oyuncu Ekleme Bölümü */}
              <div className="grid grid-cols-[1fr_auto] gap-2 mb-3">
                <input
                  type="text"
                  placeholder="Oyuncu adı girin..."
                  className="form-input w-full"
                  id="playerNameInput"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      document.getElementById('addPlayerBtn').click();
                    }
                  }}
                />
                <button
                  id="addPlayerBtn"
                  onClick={() => {
                    const input = document.getElementById('playerNameInput');
                    const playerName = input.value.trim();
                    
                    if (!playerName) {
                      alert('Lütfen oyuncu adı girin');
                      return;
                    }

                    const currentTeam = getCurrentTeam();
                    if (currentTeam.length >= 7) {
                      alert('Maksimum 7 oyuncu ekleyebilirsiniz!');
                      return;
                    }

                    // Otomatik pozisyon belirleme (grid layout)
                    const positions = [
                      { x: 50, y: 85 },  // Kaleci
                      { x: 30, y: 65 },  // Sol Defans
                      { x: 50, y: 65 },  // Orta Defans
                      { x: 70, y: 65 },  // Sağ Defans
                      { x: 30, y: 40 },  // Sol Orta
                      { x: 70, y: 40 },  // Sağ Orta
                      { x: 50, y: 20 },  // Forvet
                    ];

                    const newPlayer = {
                      name: playerName,
                      x: positions[currentTeam.length].x,
                      y: positions[currentTeam.length].y
                    };

                    setCurrentTeam([...currentTeam, newPlayer]);
                    input.value = '';
                    input.focus();
                  }}
                  className="btn btn-primary flex items-center gap-1 px-4 whitespace-nowrap"
                >
                  <Plus size={18} />
                  Oyuncu Ekle
                </button>
              </div>
            </div>

            {/* Futbol Sahası */}
            <div
              ref={fieldRef}
              className="relative w-full bg-cover bg-center rounded-lg overflow-hidden cursor-crosshair"
              style={{
                backgroundImage: 'url(/field-tactical.jpg)',
                paddingBottom: '133%', // 3:4 aspect ratio for vertical field
                minHeight: '600px'
              }}
              onClick={handleFieldClick}
              onDragOver={handlePlayerDragOver}
              onDrop={handlePlayerDrop}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-green-900/20"></div>

              {/* Benim Takımım Oyuncuları (Mavi) */}
              {activeTab === 'home' && homeTeam.map((player, index) => (
                <div
                  key={`home-${index}`}
                  draggable
                  onDragStart={(e) => handlePlayerDragStart(e, index)}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-move group"
                  style={{
                    left: `${player.x}%`,
                    top: `${player.y}%`
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-blue-600 border-4 border-white shadow-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xs text-center leading-tight px-1">
                        {player.name}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemovePlayer(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-bold"
                      title="Oyuncuyu sil"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}

              {/* Karşı Takım Oyuncuları (Kırmızı) */}
              {activeTab === 'away' && awayTeam.map((player, index) => (
                <div
                  key={`away-${index}`}
                  draggable
                  onDragStart={(e) => handlePlayerDragStart(e, index)}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-move group"
                  style={{
                    left: `${player.x}%`,
                    top: `${player.y}%`
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-red-600 border-4 border-white shadow-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xs text-center leading-tight px-1">
                        {player.name}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemovePlayer(index)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-800 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-bold"
                      title="Oyuncuyu sil"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Notlar */}
            <div className="mt-4">
              <label className="form-label">Notlar (Opsiyonel)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="form-input w-full"
                rows="3"
                placeholder="Taktik notları, önemli hatırlatmalar..."
              />
            </div>

            {/* Kaydet Butonu */}
            <div className="mt-4 flex gap-3">
              <button
                onClick={handleSave}
                disabled={loading}
                className="btn btn-primary flex items-center gap-2 flex-1"
              >
                <Save size={18} />
                {loading ? 'Kaydediliyor...' : selectedLineupId ? 'Kadroyu Güncelle' : 'Kadroyu Kaydet'}
              </button>
              {selectedLineupId && (
                <button
                  onClick={handleNewLineup}
                  className="btn btn-secondary flex items-center gap-2"
                >
                  <Plus size={18} />
                  Yeni Kadro
                </button>
              )}
            </div>

            {message && (
              <div className={`mt-3 p-3 rounded-lg ${
                message.includes('başarı') || message.includes('güncellendi') || message.includes('kaydedildi')
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {message}
              </div>
            )}
          </div>
    </div>
  );
};

export default LineupBuilder;
