# 🎶 Zyngliss Media Box: V2 Product Strategy

## 1. Executive Summary
The **Zyngliss Media Box V2** is a state-of-the-art personal streaming ecosystem. It has been evolved from a simple file explorer into a sophisticated **Playlists-First** platform. It combines the power of local hardware with a globally accessible, high-performance web interface.

### Core Value Proposition (V2):
- **User-Centric Library**: 1:1 mapping of users to playlists. Your music is yours.
- **Bulk Utility**: High-efficiency bulk selection for rapid library organization.
- **Activity Intelligence**: Local storage of browsing and activity history for quick re-access to favorite content.
- **Smart Queueing**: Support for continuous auto-play, playlist sequencing, and hardware-mapped media controls (Prev/Next).

---

## 2. Technical Architecture & Data Lifecycle
The system is built on a high-concurrency Node.js core with a React-Vite frontend.

- **Storage Engine**: Flat-file JSON database (`/data/`) for zero-latency metadata retrieval.
- **Session Management**: Hardware-hashed session persistence (1-week TTL).
- **Activity Logging**: Local telemetry stored per-user at `/data/history/` to maintain high levels of privacy.
- **Streaming Pipeline**: Dynamic byte-range streaming for both High-Fidelity Audio and 4K Video.

---

## 3. Security & Compliance (GDPR Hub)
We have formalized the legal and security framework to meet international standards.

### GDPR Compliance Implementation:
1. **Right to Privacy**: Hashed credential storage. No plain-text passwords ever touch the disk.
2. **Local History**: Telemetry is stored **locally on YOUR server**, not in the cloud.
3. **Data Security**: Session data is encrypted; credentials utilize Base64 vaulting for legacy compatibility.
4. **Transparency**: Built-in Legal Footer with clear links to Terms and Privacy declarations.

### System Constraints:
- **Upload Hard-Limit**: Strictly enforced at **100MB per batch** to align with Cloudflare Tunnel buffering limits.
- **Admin Root**: The `admin` account (`songku@123`) maintains global pruning (deletion) authority.

---

## 4. UX & Navigation Paradigm
The interface follows the **"Air-Lite Dark"** design system:
- **Base Color**: `#0a0a0f` (Deep Night)
- **Primary Accent**: `#3b82f6` (Electric Blue)
- **Typography**: Inter (System Default) for high readability across 4K displays and mobile.
- **Mobile Mode**: Bottom-anchored touch navigation (Home, Files, Playlists, User).

---

## 5. Deployment Guide (Replication)

### Environment Prerequisites
1. Node.js v22+
2. `cloudflared` CLI installed and authenticated.

### Installation
```bash
npm install
npm run build
node server.js
```

### Tunneling to dipayan.shop
Ensure your `tunnel-config.yml` is correctly pointed to your UUID.
```bash
npm run domain-share
```

---

## 6. Functional Roadmap (V2 Features)
- **Bulk Select**: Toggle "Bulk Select" in the library to select multiple tracks and create a playlist in one click.
- **Auto-Play**: The player automatically advances to the next track in the current folder or playlist.
- **History**: Access the "Recents" tab to see exactly what has been played on the server.

---
*V2 Product Specification - Developed by Antigravity AI for ddsd1991@gmail.com*
