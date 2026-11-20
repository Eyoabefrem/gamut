// Phase 1: palettes are saved in this browser. Phase 2 moves them to Supabase.
const KEY = 'gamut-library'
export const getLibrary = () => { try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] } }
const put = (list) => { try { localStorage.setItem(KEY, JSON.stringify(list)) } catch {} return list }
export const savePalette = (name, colors) => put([{ id: Math.random().toString(36).slice(2, 9), name: name.trim() || 'Untitled', colors, createdAt: Date.now() }, ...getLibrary()])
export const deletePalette = (id) => put(getLibrary().filter((p) => p.id !== id))
export const clearLibrary = () => put([])
