import { useState, useEffect, useRef } from 'react'
import {
  Home, Search, Library, Play, Pause, Folder, Music, Film, ChevronLeft,
  ChevronRight, X, Volume2, SkipBack, SkipForward, Repeat, Shuffle,
  Monitor, Plus, Upload, LogOut, LogIn, PlusCircle, UserPlus, Trash2,
  Lock, Mail, User, History as HistoryIcon, CheckCircle2, AlertCircle, Info, Settings
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

const API_URL = import.meta.env.PROD ? '' : 'http://localhost:3000';

function App() {
  const [view, setView] = useState('home');
  const [currentPath, setCurrentPath] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(null);
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [playlists, setPlaylists] = useState([]);

  // Selection & Forms
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [playlistForm, setPlaylistForm] = useState({ name: '', isPrivate: false });

  // Auth Form
  const [showAuthModal, setShowAuthModal] = useState(null);
  const [authForm, setAuthForm] = useState({ name: '', username: '', password: '' });
  const [authError, setAuthError] = useState('');

  const [showUploadModal, setShowUploadModal] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    checkAuth();
    fetchPlaylists();
    fetchHistory();
  }, []);

  useEffect(() => {
    if (view === 'home' || view === 'library') fetchItems(currentPath);
  }, [currentPath, view]);

  const checkAuth = async () => {
    try {
      const res = await fetch(`${API_URL}/api/me`);
      const data = await res.json();
      setUser(data.user);
    } catch (e) { console.error(e); }
  };

  const fetchItems = async (path) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/files?path=${encodeURIComponent(path)}`);
      if (res.ok) setItems(await res.json());
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const fetchPlaylists = async () => {
    try {
      const res = await fetch(`${API_URL}/api/playlists`);
      if (res.ok) setPlaylists(await res.json());
    } catch (e) { console.error(e); }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_URL}/api/history`);
      if (res.ok) setHistory(await res.json());
    } catch (e) { console.error(e); }
  };

  const handleNavigate = (path) => {
    setCurrentPath(path);
    setView('library');
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!playlistForm.name) return;
    try {
      const res = await fetch(`${API_URL}/api/playlists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: playlistForm.name, tracks: selectedItems, isPrivate: playlistForm.isPrivate })
      });
      if (res.ok) {
        alert("Playlist Created Successfully!");
        setPlaylistForm({ name: '', isPrivate: false });
        setSelectedItems([]);
        setSelectionMode(false);
        fetchPlaylists();
        setView('playlists');
      }
    } catch (e) { alert("Error creating playlist"); }
  };

  const playMedia = (item, currentQueue = []) => {
    setPlaying(item);
    setQueue(currentQueue);
    const idx = currentQueue.findIndex(i => i.path === item.path);
    setQueueIndex(idx !== -1 ? idx : 0);
  };

  const onNext = () => {
    if (queueIndex < queue.length - 1) {
      const nextIdx = queueIndex + 1;
      setQueueIndex(nextIdx);
      setPlaying(queue[nextIdx]);
    }
  };

  const onPrev = () => {
    if (queueIndex > 0) {
      const prevIdx = queueIndex - 1;
      setQueueIndex(prevIdx);
      setPlaying(queue[prevIdx]);
    }
  };

  return (
    <div className="main-layout">
      {/* Sidebar - Clean White */}
      <aside className="sidebar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', marginBottom: '16px' }}>
          <div className="avatar" style={{ background: 'var(--accent-gradient)', color: 'white' }}>Z</div>
          <span style={{ fontWeight: 900, fontSize: '22px', letterSpacing: '-1px' }}>ZYNGLISS</span>
        </div>

        <div className="sidebar-nav">
          <div className={`nav-item ${view === 'home' ? 'active' : ''}`} onClick={() => setView('home')}>
            <Home size={20} /> <span>Home</span>
          </div>
          <div className={`nav-item ${view === 'library' ? 'active' : ''}`} onClick={() => { setView('library'); setCurrentPath(''); }}>
            <Library size={20} /> <span>My Library</span>
          </div>
          <div className={`nav-item ${view === 'playlists' ? 'active' : ''}`} onClick={() => setView('playlists')}>
            <Play size={20} /> <span>Playlists</span>
          </div>
          <div className={`nav-item ${view === 'create-playlist' ? 'active' : ''}`} onClick={() => setView('create-playlist')}>
            <PlusCircle size={20} /> <span>Create Playlist</span>
          </div>
          <div className={`nav-item ${view === 'history' ? 'active' : ''}`} onClick={() => setView('history')}>
            <HistoryIcon size={20} /> <span>Recents</span>
          </div>
        </div>

        <div className="sidebar-library">
          <div className="nav-item" style={{ fontSize: '12px', opacity: 0.5, fontWeight: 800, textTransform: 'uppercase' }}>Playlists</div>
          <div className="library-scroll">
            {playlists.map(p => (
              <div key={p.id} className="nav-item" style={{ padding: '8px 16px' }} onClick={() => { setQueue(p.tracks); setPlaying(p.tracks[0]); }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Music size={14} /></div>
                <span style={{ fontSize: '13px' }}>{p.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="user-section">
          {user ? (
            <div className="nav-item" onClick={() => { fetch(`${API_URL}/api/logout`, { method: 'POST' }).then(() => setUser(null)); }}>
              <LogOut size={20} /> <span>Logout ({user.name})</span>
            </div>
          ) : (
            <div className="nav-item" onClick={() => setShowAuthModal('login')}>
              <LogIn size={20} /> <span>Sign In</span>
            </div>
          )}
        </div>
      </aside>

      <main className="content-area">
        <header className="top-bar">
          <div className="search-bar">
            <Search size={18} color="#94a3b8" />
            <input placeholder="Search tracks, artists, albums..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setView(e.target.value ? 'search' : 'home'); }} />
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            {user && <button className="action-btn-primary" onClick={() => setShowUploadModal(true)} style={{ background: 'black' }}><Upload size={18} /> <span>Upload</span></button>}
          </div>
        </header>

        <div className="main-view">
          {view === 'create-playlist' ? (
            <div className="create-playlist-container">
              <h1 className="section-title"><PlusCircle size={32} /> Create New Playlist</h1>
              <form onSubmit={handleCreatePlaylist}>
                <div className="form-group">
                  <label>Playlist Name</label>
                  <input required placeholder="e.g. Summer Hits 2026" value={playlistForm.name} onChange={e => setPlaylistForm({ ...playlistForm, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Privacy</label>
                  <select style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border)' }} onChange={e => setPlaylistForm({ ...playlistForm, isPrivate: e.target.value === 'true' })}>
                    <option value="false">Public (Everyone can see)</option>
                    <option value="true">Private (Only me)</option>
                  </select>
                </div>
                <div style={{ marginTop: '20px', padding: '16px', border: '1px dashed var(--border)', borderRadius: '12px', textAlign: 'center' }}>
                  <span style={{ fontSize: '14px', color: 'var(--text-sub)' }}>
                    {selectedItems.length > 0 ? `${selectedItems.length} tracks selected for this playlist` : 'Use "Bulk Select" in Library to add tracks'}
                  </span>
                </div>
                <button type="submit" className="login-btn-sidebar" style={{ marginTop: '32px' }}>Save Playlist</button>
              </form>
            </div>
          ) : (
            <>
              <div className="section-header">
                <h1 className="section-title">
                  {view === 'home' && 'Good Evening'}
                  {view === 'library' && (currentPath ? currentPath.split('/').pop() : 'My Library')}
                  {view === 'playlists' && 'Playlists'}
                  {view === 'history' && 'Recently Played'}
                  {view === 'search' && `Results for "${searchQuery}"`}
                </h1>
                {view === 'library' && user && (
                  <button className={`ghost-btn ${selectionMode ? 'active' : ''}`} onClick={() => { setSelectionMode(!selectionMode); setSelectedItems([]); }} style={{ borderRadius: '50px', padding: '8px 24px' }}>
                    {selectionMode ? 'Cancel' : 'Bulk Select'}
                  </button>
                )}
              </div>

              <div className="media-grid">
                {view === 'library' && items.map((item, idx) => (
                  <motion.div key={item.path + idx} className={`item-card ${selectedItems.find(i => i.path === item.path) ? 'selected' : ''}`} onClick={() => {
                    if (selectionMode && item.type === 'file') {
                      const exists = selectedItems.find(i => i.path === item.path);
                      setSelectedItems(exists ? selectedItems.filter(i => i.path !== item.path) : [...selectedItems, item]);
                    } else {
                      if (item.type === 'directory') setCurrentPath(item.path);
                      else playMedia(item, items.filter(i => i.type === 'file'));
                    }
                  }}>
                    <div className="card-image">
                      {item.type === 'directory' ? <Folder size={64} color="#3b82f6" /> : <Music size={64} color="#94a3b8" />}
                      {selectionMode && item.type === 'file' && <div className="selection-overlay" style={{ background: selectedItems.find(i => i.path === item.path) ? 'var(--accent)' : 'transparent' }}>{selectedItems.find(i => i.path === item.path) && <CheckCircle2 size={16} color="white" />}</div>}
                    </div>
                    <div className="card-title" style={{ fontSize: '15px' }}>{item.name}</div>
                    <div className="card-sub">{item.type === 'directory' ? 'Folder' : 'Audio Track'}</div>
                  </motion.div>
                ))}

                {view === 'playlists' && playlists.map(p => (
                  <div key={p.id} className="item-card" onClick={() => playMedia(p.tracks[0], p.tracks)}>
                    <div className="card-image" style={{ background: 'var(--accent-gradient)' }}><Play size={48} color="white" fill="white" /></div>
                    <div className="card-title">{p.name}</div>
                    <div className="card-sub">{p.tracks.length} tracks • By {p.ownerName}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          <footer className="legal-footer">
            <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginBottom: '16px', fontWeight: 700 }}>
              <a href="#">Copyright &copy; 2026</a>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">GDPR</a>
            </div>
            <p>Designed for professional media delivery from local infrastructure.</p>
          </footer>
        </div>
      </main>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="modal-overlay" style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)' }} onClick={() => setShowAuthModal(null)}>
          <div className="modal-content" style={{ maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ marginBottom: '32px', textAlign: 'center', fontWeight: 900 }}>WELCOME</h2>
            <div className="auth-form" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input placeholder="Email" style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }} onChange={e => setAuthForm({ ...authForm, username: e.target.value })} />
              <input placeholder="Password" type="password" style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }} onChange={e => setAuthForm({ ...authForm, password: e.target.value })} />
              <button className="login-btn-sidebar" onClick={async () => {
                const res = await fetch(`${API_URL}/api/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(authForm) });
                if (res.ok) { const data = await res.json(); setUser(data.user); setShowAuthModal(null); } else { alert("Login Failed"); }
              }}>SIGN IN</button>
            </div>
          </div>
        </div>
      )}

      {/* Global Player */}
      <AnimatePresence>
        {playing && (
          <motion.div className="player-overlay" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25 }}>
            <div className="player-content">
              <div className="player-header">
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 900, fontSize: '24px' }}>{playing.name}</div>
                  <div style={{ color: 'var(--accent)', fontWeight: 700 }}>NOW STREAMING</div>
                </div>
                <button onClick={() => setPlaying(null)} style={{ background: '#f1f5f9', border: 'none', padding: '12px', borderRadius: '50%' }}><X size={24} /></button>
              </div>

              <div className="media-container">
                {playing.name.match(/\.(mp4|mkv|webm|avi|mov)$/i) ? (
                  <video controls autoPlay src={`${API_URL}/media/${encodeURIComponent(playing.path)}`} />
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '280px', height: '280px', borderRadius: '40px', background: '#f1f5f9', margin: '0 auto 40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Music size={120} color="#cbd5e1" />
                    </div>
                    <audio controls autoPlay src={`${API_URL}/media/${encodeURIComponent(playing.path)}`} onEnded={onNext} style={{ width: '400px' }} />
                  </div>
                )}
              </div>

              <div className="player-controls">
                <div style={{ display: 'flex', gap: '48px', alignItems: 'center' }}>
                  <SkipBack size={32} onClick={onPrev} style={{ cursor: 'pointer' }} />
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'black', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => { }}><Pause size={32} fill="currentColor" /></div>
                  <SkipForward size={32} onClick={onNext} style={{ cursor: 'pointer' }} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
