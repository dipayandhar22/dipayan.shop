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
  const [showLegal, setShowLegal] = useState(null); // 'privacy', 'terms', 'gdpr'
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

  const logActivity = async (action, details) => {
    try {
      await fetch(`${API_URL}/api/history`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, details })
      });
      fetchHistory();
    } catch (e) { console.error(e); }
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
        logActivity('Create Playlist', playlistForm.name);
      }
    } catch (e) { alert("Error creating playlist"); }
  };

  const handleDeletePlaylist = async (id) => {
    if (!confirm("Are you sure you want to delete this playlist?")) return;
    try {
      const res = await fetch(`${API_URL}/api/playlists/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchPlaylists();
        logActivity('Delete Playlist', id);
      }
    } catch (e) { alert("Error deleting playlist"); }
  };

  const playMedia = (item, currentQueue = []) => {
    setPlaying(item);
    setQueue(currentQueue);
    const idx = currentQueue.findIndex(i => i.path === item.path);
    setQueueIndex(idx !== -1 ? idx : 0);
    logActivity('Play', item.name);
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
      {/* Sidebar - Premium White */}
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
          <div className="nav-item" style={{ fontSize: '11px', opacity: 0.5, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Your Playlists</div>
          <div className="library-scroll">
            {playlists.map(p => (
              <div key={p.id} className="nav-item" style={{ padding: '8px 16px' }} onClick={() => playMedia(p.tracks[0], p.tracks)}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Music size={14} /></div>
                <span style={{ fontSize: '13px' }}>{p.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="user-section" style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
          {user ? (
            <div className="nav-item" style={{ color: 'var(--danger)' }} onClick={() => { logActivity('Logout', ''); fetch(`${API_URL}/api/logout`, { method: 'POST' }).then(() => setUser(null)); }}>
              <LogOut size={20} /> <span style={{ fontWeight: 800 }}>LOGOUT ({user.name.toUpperCase()})</span>
            </div>
          ) : (
            <div className="nav-item" onClick={() => setShowAuthModal('login')}>
              <LogIn size={20} /> <span>Sign In / Register</span>
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
            {user && <button className="action-btn-primary" onClick={() => setShowUploadModal(true)} style={{ background: 'black', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '50px', fontWeight: 800, cursor: 'pointer' }}><Upload size={18} /> <span>Upload</span></button>}
          </div>
        </header>

        <div className="main-view">
          {view === 'create-playlist' ? (
            <div className="create-playlist-container">
              <h1 className="section-title"><PlusCircle size={32} /> Create New Playlist</h1>
              <form onSubmit={handleCreatePlaylist}>
                <div className="form-group">
                  <label>Playlist Name</label>
                  <input required placeholder="e.g. My Favorite Tracks" value={playlistForm.name} onChange={e => setPlaylistForm({ ...playlistForm, name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Privacy</label>
                  <select style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border)', background: '#f8fafc' }} onChange={e => setPlaylistForm({ ...playlistForm, isPrivate: e.target.value === 'true' })}>
                    <option value="false">Public (Everyone can see)</option>
                    <option value="true">Private (Only me)</option>
                  </select>
                </div>
                <div style={{ marginTop: '20px', padding: '24px', border: '2px dashed #e2e8f0', borderRadius: '16px', textAlign: 'center', background: '#f8fafc' }}>
                  {selectedItems.length > 0 ? (
                    <div style={{ fontWeight: 700, color: 'var(--accent)' }}>{selectedItems.length} tracks ready to be added</div>
                  ) : (
                    <div style={{ color: 'var(--text-sub)' }}>First go to "My Library", click "Bulk Select" and pick your songs.</div>
                  )}
                </div>
                <button type="submit" className="login-btn-sidebar" style={{ marginTop: '32px', background: 'var(--accent-gradient)', color: 'white' }}>Save Playlist</button>
              </form>
            </div>
          ) : (
            <>
              <div className="section-header">
                <h1 className="section-title">
                  {view === 'library' && currentPath && (
                    <button onClick={() => setCurrentPath(currentPath.includes('/') ? currentPath.split('/').slice(0, -1).join('/') : '')} style={{ background: '#f1f5f9', border: 'none', padding: '10px', borderRadius: '50%', cursor: 'pointer', marginRight: '16px' }}>
                      <ChevronLeft size={24} />
                    </button>
                  )}
                  {view === 'home' && 'Welcome Home'}
                  {view === 'library' && (currentPath ? currentPath.split('/').pop() : 'My Library')}
                  {view === 'playlists' && 'Playlists'}
                  {view === 'history' && 'Recently Played'}
                  {view === 'search' && `Results for "${searchQuery}"`}
                  {view === 'profile' && 'User Account'}
                </h1>
                {view === 'library' && user && (
                  <button className={`ghost-btn ${selectionMode ? 'active' : ''}`} onClick={() => { setSelectionMode(!selectionMode); setSelectedItems([]); }} style={{ borderRadius: '50px', padding: '10px 24px', border: '1px solid #e2e8f0', background: 'white', fontWeight: 700, cursor: 'pointer' }}>
                    {selectionMode ? 'Cancel Selection' : 'Bulk Select'}
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
                      {item.type === 'directory' ? <Folder size={64} color="#3b82f6" fill="rgba(59,130,246,0.1)" /> : <Music size={64} color="#94a3b8" />}
                      {selectionMode && item.type === 'file' && (
                        <div className="selection-overlay" style={{ position: 'absolute', top: '12px', right: '12px', width: '24px', height: '24px', borderRadius: '50%', background: selectedItems.find(i => i.path === item.path) ? 'var(--accent)' : 'rgba(0,0,0,0.1)', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {selectedItems.find(i => i.path === item.path) && <CheckCircle2 size={16} color="white" />}
                        </div>
                      )}
                      {!selectionMode && <div className="play-button-floating"><Play size={24} fill="currentColor" /></div>}
                    </div>
                    <div className="card-title" style={{ fontSize: '15px', fontWeight: 700 }}>{item.name}</div>
                    <div className="card-sub">{item.type === 'directory' ? 'Folder' : 'Audio Track'}</div>
                  </motion.div>
                ))}

                {(view === 'home' || view === 'playlists') && playlists.map(p => (
                  <div key={p.id} className="item-card">
                    <div className="card-image" style={{ background: 'var(--accent-gradient)' }} onClick={() => playMedia(p.tracks[0], p.tracks)}>
                      <Play size={48} color="white" fill="white" />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
                      <div onClick={() => playMedia(p.tracks[0], p.tracks)}>
                        <div className="card-title" style={{ fontWeight: 800 }}>{p.name}</div>
                        <div className="card-sub">{p.tracks.length} tracks • {p.ownerName}</div>
                      </div>
                      {(user && (user.username === p.owner || user.role === 'admin')) && (
                        <button onClick={(e) => { e.stopPropagation(); handleDeletePlaylist(p.id); }} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '8px' }}>
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {view === 'history' && history.map((h, i) => (
                  <div key={i} className="item-card">
                    <div className="card-image" style={{ background: '#f1f5f9' }}><HistoryIcon size={48} color="var(--accent)" /></div>
                    <div className="card-title">{h.details}</div>
                    <div className="card-sub">{h.action} • {new Date(h.timestamp).toLocaleTimeString()}</div>
                  </div>
                ))}

                {view === 'profile' && user && (
                  <div style={{ gridColumn: '1 / -1', background: 'white', padding: '40px', borderRadius: '32px', textAlign: 'center', border: '1px solid var(--border)' }}>
                    <div style={{ width: '100px', height: '100px', background: 'var(--accent-gradient)', borderRadius: '50%', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '40px', fontWeight: 900 }}>
                      {user.name[0].toUpperCase()}
                    </div>
                    <h2 style={{ fontWeight: 900, fontSize: '28px', marginBottom: '8px' }}>{user.name.toUpperCase()}</h2>
                    <p style={{ color: 'var(--text-sub)', marginBottom: '40px', fontWeight: 700 }}>{user.username}</p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '300px', margin: '0 auto' }}>
                      <button className="login-btn-sidebar" style={{ background: 'var(--danger)', color: 'white' }} onClick={() => { logActivity('Logout', ''); fetch(`${API_URL}/api/logout`, { method: 'POST' }).then(() => setUser(null)); setView('home'); }}>
                        LOGOUT FROM ALL DEVICES
                      </button>
                      <button className="ghost-btn" style={{ padding: '16px', borderRadius: '50px', border: '1px solid #e2e8f0', fontWeight: 800 }} onClick={() => setView('history')}>
                        VIEW RECENT ACTIVITY
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {selectionMode && selectedItems.length > 0 && (
                <div className="bulk-toolbar" style={{ position: 'fixed', bottom: '100px', left: '50%', transform: 'translateX(-50%)', background: 'black', padding: '16px 32px', borderRadius: '50px', display: 'flex', gap: '24px', alignItems: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', zIndex: 1000 }}>
                  <span style={{ color: 'white', fontWeight: 800 }}>{selectedItems.length} Tracks Selected</span>
                  <button onClick={() => setView('create-playlist')} style={{ background: 'var(--accent)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '50px', fontWeight: 800, cursor: 'pointer' }}>Create Playlist</button>
                  <button onClick={() => { setSelectionMode(false); setSelectedItems([]); }} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '50px', fontWeight: 800, cursor: 'pointer' }}>Cancel</button>
                </div>
              )}
            </>
          )}

          <footer className="legal-footer" style={{ marginTop: '80px', borderTop: '1px solid #e2e8f0', padding: '48px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginBottom: '16px', fontWeight: 800 }}>
              <span onClick={() => setShowLegal('copyright')} style={{ color: 'var(--text-main)', cursor: 'pointer' }}>Copyright &copy; 2026</span>
              <span onClick={() => setShowLegal('privacy')} style={{ color: 'var(--accent)', cursor: 'pointer' }}>Privacy</span>
              <span onClick={() => setShowLegal('terms')} style={{ color: 'var(--accent)', cursor: 'pointer' }}>Terms</span>
              <span onClick={() => setShowLegal('gdpr')} style={{ color: 'var(--accent)', cursor: 'pointer' }}>GDPR</span>
            </div>
            <p style={{ color: 'var(--text-sub)', fontSize: '13px' }}>Zyngliss Media Box: Digital Architecture & Strategy by Dipayan.</p>
          </footer>
        </div>
      </main>

      {/* Mobile Nav */}
      <nav className="mobile-nav" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: '70px', background: 'white', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-around', alignItems: 'center', zIndex: 1000 }}>
        <div onClick={() => setView('home')} style={{ color: view === 'home' ? 'var(--accent)' : '#94a3b8' }}><Home size={24} /></div>
        <div onClick={() => setView('library')} style={{ color: view === 'library' ? 'var(--accent)' : '#94a3b8' }}><Library size={24} /></div>
        <div onClick={() => setView('playlists')} style={{ color: view === 'playlists' ? 'var(--accent)' : '#94a3b8' }}><Play size={24} /></div>
        <div onClick={() => user ? setView('profile') : setShowAuthModal('login')} style={{ color: view === 'profile' ? 'var(--accent)' : '#94a3b8' }}><User size={24} /></div>
      </nav>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowAuthModal(null)}>
          <div className="modal-content" style={{ width: '100%', maxWidth: '400px', background: 'white', padding: '40px', borderRadius: '32px', boxShadow: '0 40px 100px rgba(0,0,0,0.1)' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ textAlign: 'center', fontWeight: 900, fontSize: '28px', marginBottom: '32px' }}>Welcome</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input placeholder="Email" style={{ padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '16px' }} onChange={e => setAuthForm({ ...authForm, username: e.target.value })} />
              <input placeholder="Password" type="password" style={{ padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '16px' }} onChange={e => setAuthForm({ ...authForm, password: e.target.value })} />
              <button className="login-btn-sidebar" style={{ background: 'var(--accent-gradient)', color: 'white', border: 'none', padding: '16px', borderRadius: '50px', fontWeight: 800, cursor: 'pointer', fontSize: '16px' }} onClick={async () => {
                const res = await fetch(`${API_URL}/api/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(authForm) });
                if (res.ok) { const data = await res.json(); setUser(data.user); setShowAuthModal(null); logActivity('Login', ''); } else { alert("Login Failed"); }
              }}>Sign In</button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(12px)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowUploadModal(false)}>
          <div className="modal-content" style={{ width: '100%', maxWidth: '500px', background: 'white', padding: '40px', borderRadius: '32px', textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontWeight: 900, marginBottom: '12px' }}>Upload Media</h3>
            <p style={{ color: 'var(--text-sub)', marginBottom: '32px' }}>Upload tracks directly to {currentPath || 'Root'}</p>
            <div className="upload-area" style={{ border: '2px dashed #e2e8f0', padding: '48px', borderRadius: '24px', cursor: 'pointer' }} onClick={() => fileInputRef.current.click()}>
              <Upload size={48} color="var(--accent)" />
              <p style={{ fontWeight: 700, marginTop: '16px' }}>Click to Browse Files</p>
              <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={async (e) => {
                const f = e.target.files[0]; if (!f) return;
                if (f.size > 100 * 1024 * 1024) return alert("Warning: Cloudflare limits uploads to 100MB.");
                const fd = new FormData(); fd.append('file', f); fd.append('path', currentPath);
                const res = await fetch(`${API_URL}/api/upload`, { method: 'POST', body: fd });
                if (res.ok) fetchItems(currentPath); setShowUploadModal(false);
              }} />
            </div>
            <div style={{ marginTop: '24px', padding: '16px', background: '#fef2f2', color: '#ef4444', borderRadius: '12px', fontSize: '13px', display: 'flex', gap: '8px', alignItems: 'center', fontWeight: 600 }}>
              <AlertCircle size={16} /> Max upload size is 100MB per batch.
            </div>
          </div>
        </div>
      )}

      {/* Player Overlay */}
      <AnimatePresence>
        {playing && (
          <motion.div className="player-overlay" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25 }} style={{ position: 'fixed', inset: 0, background: 'white', zIndex: 4000, display: 'flex', flexDirection: 'column' }}>
            <div className="player-header" style={{ padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 900, fontSize: '26px', color: 'black' }}>{playing.name}</div>
                <div style={{ color: 'var(--accent)', fontWeight: 800, fontSize: '14px' }}>STREAMING DIRECT FROM SERVER</div>
              </div>
              <button onClick={() => setPlaying(null)} style={{ background: '#f1f5f9', border: 'none', padding: '16px', borderRadius: '50%', cursor: 'pointer' }}><X size={24} /></button>
            </div>

            <div className="media-container" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: '300px', height: '300px', borderRadius: '48px', background: '#f8fafc', margin: '0 auto 48px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 30px 60px rgba(0,0,0,0.05)' }}>
                  <Music size={120} color="#cbd5e1" />
                </div>
                <audio controls autoPlay src={`${API_URL}/media/${encodeURIComponent(playing.path)}`} onEnded={onNext} style={{ width: '450px' }} />
              </div>
            </div>

            <div className="player-controls" style={{ padding: '48px', background: '#f8fafc', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'center' }}>
              <div style={{ display: 'flex', gap: '64px', alignItems: 'center' }}>
                <SkipBack size={36} onClick={onPrev} style={{ cursor: 'pointer', color: queueIndex === 0 ? '#cbd5e1' : 'black' }} />
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'black', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}><Pause size={36} fill="currentColor" /></div>
                <SkipForward size={36} onClick={onNext} style={{ cursor: 'pointer', color: queueIndex === queue.length - 1 ? '#cbd5e1' : 'black' }} />
              </div>
            </div>
          </motion.div>
        )}
        {/* Legal Modals */}
        {showLegal && (
          <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', zIndex: 5000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setShowLegal(null)}>
            <div className="modal-content" style={{ width: '100%', maxWidth: '700px', maxHeight: '80vh', overflowY: 'auto', padding: '60px' }} onClick={e => e.stopPropagation()}>
              <button onClick={() => setShowLegal(null)} style={{ position: 'absolute', top: '30px', right: '30px', background: '#f1f5f9', border: 'none', padding: '10px', borderRadius: '50%', cursor: 'pointer' }}><X size={24} /></button>

              {showLegal === 'privacy' && (
                <article>
                  <h2 style={{ fontWeight: 900, fontSize: '32px', marginBottom: '24px' }}>Privacy Policy</h2>
                  <p>At Zyngliss Media Box, we prioritize your privacy. All activity logs and history are stored <strong>locally on your hardware</strong>. We do not transmit your personal playback habits to any third-party cloud services.</p>
                  <p style={{ marginTop: '16px' }}>Your account data is hashed and stored securely. You can request all data associated with your username by contacting the system administrator.</p>
                </article>
              )}

              {showLegal === 'terms' && (
                <article>
                  <h2 style={{ fontWeight: 900, fontSize: '32px', marginBottom: '24px' }}>Terms of Service</h2>
                  <p>By using Zyngliss Media Box, you agree to host and stream only media that you have the legal right to possess. This platform is designed for personal use and infrastructure ownership.</p>
                  <p style={{ marginTop: '16px' }}>The administrator reserves the right to remove content that violates bandwidth limits or regional regulations.</p>
                </article>
              )}

              {showLegal === 'gdpr' && (
                <article>
                  <h2 style={{ fontWeight: 900, fontSize: '32px', marginBottom: '24px' }}>GDPR Compliance</h2>
                  <p>We strictly adhere to GDPR principles: The Right to be Informed, the Right of Access, and the Right to Erasure. Your data is your own.</p>
                  <p style={{ marginTop: '16px' }}>User authentication utilizes industry-standard hashing to protect personal identifiers.</p>
                </article>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
