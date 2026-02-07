import { useState, useEffect } from 'react'
import {
  Home,
  Search,
  Library,
  Play,
  Folder,
  Music,
  Film,
  ChevronLeft,
  ChevronRight,
  X,
  Volume2,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

const API_URL = import.meta.env.PROD ? '' : 'http://localhost:3000';

function App() {
  const [currentPath, setCurrentPath] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (searchQuery.trim() === '') {
      fetchItems(currentPath);
    } else {
      const delayDebounceFn = setTimeout(() => {
        handleSearch(searchQuery);
      }, 500);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [currentPath, searchQuery]);

  const fetchItems = async (path) => {
    setLoading(true);
    try {
      const url = `${API_URL}/api/files?path=${encodeURIComponent(path)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setLoading(true);
    try {
      const url = `${API_URL}/api/search?q=${encodeURIComponent(query)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (folderName) => {
    const newPath = currentPath ? `${currentPath}/${folderName}` : folderName;
    setCurrentPath(newPath);
    setSearchQuery('');
  };

  const goHome = () => {
    setCurrentPath('');
    setSearchQuery('');
  };

  const getMediaIcon = (type, name) => {
    if (type === 'directory') return <Folder size={64} className="text-sub" />;
    if (name.match(/\.(mp3|wav|flac|m4a)$/i)) return <Music size={64} style={{ color: '#1db954' }} />;
    if (name.match(/\.(mp4|mkv|webm|avi|mov)$/i)) return <Film size={64} style={{ color: '#a78bfa' }} />;
    return <Folder size={64} />;
  };

  const handleItemClick = (item) => {
    if (item.type === 'directory') {
      handleNavigate(item.name);
    } else if (item.name.match(/\.(mp3|wav|flac|m4a|mp4|webm|ogg|mov)$/i)) {
      setPlaying(item);
    }
  };

  const pathParts = currentPath ? currentPath.split('/') : [];

  return (
    <div className="main-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-nav">
          <div className={`nav-item ${!currentPath && !searchQuery ? 'active' : ''}`} onClick={goHome}>
            <Home size={24} />
            <span>Home</span>
          </div>
          <div className="nav-item">
            <Search size={24} />
            <span>Search</span>
          </div>
        </div>

        <div className="sidebar-library">
          <div className="nav-item">
            <Library size={24} />
            <span>Your Library</span>
          </div>
          <div style={{ padding: '0 12px', fontSize: '13px', color: '#b3b3b3', marginTop: '12px' }}>
            {pathParts.length > 0 ? (
              <div
                onClick={() => {
                  const parts = [...pathParts];
                  parts.pop();
                  setCurrentPath(parts.join('/'));
                }}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <ChevronLeft size={16} /> Back to parent
              </div>
            ) : 'All Collections'}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="content-area">
        <header className="top-bar">
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="nav-btn" onClick={() => window.history.back()}><ChevronLeft /></button>
            <button className="nav-btn" onClick={() => window.history.forward()}><ChevronRight /></button>
          </div>

          <div className="search-bar">
            <Search size={20} className="text-sub" />
            <input
              type="text"
              placeholder="What do you want to play?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && <X size={18} style={{ cursor: 'pointer' }} onClick={() => setSearchQuery('')} />}
          </div>

          <div style={{ width: '40px' }}></div> {/* Spacer */}
        </header>

        <div className="main-view">
          <h1 className="section-title">
            {searchQuery ? `Search results for "${searchQuery}"` : (pathParts[pathParts.length - 1] || 'Good evening')}
          </h1>

          <div className="media-grid">
            {items.map((item, idx) => (
              <motion.div
                key={item.path + idx}
                className="item-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.02 }}
                onClick={() => handleItemClick(item)}
              >
                <div className="card-image">
                  {getMediaIcon(item.type, item.name)}
                  <div className="play-button-floating">
                    <Play size={24} fill="black" color="black" />
                  </div>
                </div>
                <div className="card-title">{item.name}</div>
                <div className="card-sub">{item.type === 'directory' ? 'Folder' : 'Media File'}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Player Overlay */}
      <AnimatePresence>
        {playing && (
          <motion.div
            className="player-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setPlaying(null)}
          >
            <div className="player-content">
              <div className="player-header">
                <div>
                  <div style={{ fontWeight: 700 }}>{playing.name}</div>
                  <div style={{ fontSize: '12px', color: '#b3b3b3' }}>Now Playing</div>
                </div>
                <button
                  onClick={() => setPlaying(null)}
                  style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                >
                  <X size={24} />
                </button>
              </div>

              <div className="media-wrapper">
                {playing.name.match(/\.(mp4|mkv|webm|avi|mov)$/i) ? (
                  <video controls autoPlay src={`${API_URL}/media/${encodeURIComponent(playing.path)}`} />
                ) : (
                  <div className="audio-ui">
                    <Music size={120} style={{ color: '#1db954' }} />
                    <audio controls autoPlay src={`${API_URL}/media/${encodeURIComponent(playing.path)}`} />

                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                      <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
                        <Shuffle size={20} color="#b3b3b3" />
                        <SkipBack size={32} fill="white" />
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyCenter: 'center', paddingLeft: '4px' }}>
                          <Play size={24} fill="black" color="black" />
                        </div>
                        <SkipForward size={32} fill="white" />
                        <Repeat size={20} color="#b3b3b3" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Fake playback control bar for aesthetic */}
              {!playing.name.match(/\.(mp4|mkv|webm|avi|mov)$/i) && (
                <div style={{ padding: '20px 40px', background: '#121212', display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <Volume2 size={20} color="#b3b3b3" />
                  <div style={{ flex: 1, height: '4px', background: '#4d4d4d', borderRadius: '2px' }}>
                    <div style={{ width: '70%', height: '100%', background: '#1db954', borderRadius: '2px' }}></div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
