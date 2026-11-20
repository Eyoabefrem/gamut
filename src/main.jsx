import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import { AuthProvider } from './lib/auth'
import Landing from './pages/Landing'
import Studio from './pages/Studio'
import Library from './pages/Library'
import Login from './pages/Login'
import PublicPalette from './pages/PublicPalette'
import NotFound from './pages/NotFound'
import Explore from './pages/Explore'
import Titles from './components/Titles'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <BrowserRouter>
      <Titles />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/studio" element={<Studio />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/library" element={<Library />} />
        <Route path="/login" element={<Login />} />
        <Route path="/p/:id" element={<PublicPalette />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
)
