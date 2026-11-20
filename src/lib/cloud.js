import { supabase } from './supabase'

// Palettes in Supabase. Row-level security means you can only change your own.
export const HEX = /^#[0-9a-f]{6}$/
const must = ({ data, error }) => { if (error) throw new Error(error.message); return data }

// Public palettes of other people are readable too, so always filter by owner here.
export const listMine = async (userId) => must(await supabase.from('palettes').select('*').eq('owner_id', userId).order('created_at', { ascending: false }))
export const saveCloud = async (name, colors) => must(await supabase.from('palettes').insert({ name: name.trim().slice(0, 60) || 'Untitled', colors }).select().single())
export const removeCloud = async (id) => must(await supabase.from('palettes').delete().eq('id', id))
export const setPublic = async (id, value) => must(await supabase.from('palettes').update({ is_public: value }).eq('id', id).select().single())
export const getOne = async (id) => must(await supabase.from('palettes').select('*').eq('id', id).maybeSingle())

// Explore and likes. Counts come from palettes.like_count (kept by a database trigger).
export const listPublic = async (sort) => must(await supabase.from('palettes').select('id,name,colors,like_count,created_at').eq('is_public', true)
  .order(sort === 'new' ? 'created_at' : 'like_count', { ascending: false }).order('created_at', { ascending: false }).limit(60))
export const myLikes = async (userId) => must(await supabase.from('likes').select('palette_id').eq('user_id', userId)).map((r) => r.palette_id)
export const like = async (id) => must(await supabase.from('likes').insert({ palette_id: id }))
export const unlike = async (id, userId) => must(await supabase.from('likes').delete().eq('palette_id', id).eq('user_id', userId))
