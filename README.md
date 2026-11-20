# Gamut: a palette studio (Phase 3 of 3, final)

| Phase | What you get |
|---|---|
| 1. Studio (done) | Studio, contrast checker, color-blind preview, exports, shareable links, local library |
| 2. Accounts and cloud (done) | Landing page, email-code login, cloud library, public palette pages |
| **3. Community and launch (this zip)** | **Explore gallery, likes, image to palette, tab titles, deployment** |

## What changed since Phase 2

- **Explore** (/explore): public palettes, sorted by Most liked or Newest. Logged-in users can like and unlike. Click a palette to open it in the studio, or its name for its page.
- **Likes** are stored in the database with a counter kept by a trigger, so nobody can fake a count from the browser.
- **Image to palette:** in the Studio, press **From image** and pick a photo. Gamut reads it in your browser (the image is never uploaded) and builds a palette from its dominant colors.
- **Tab titles** for every page, a title for each public palette, and social-sharing tags.
- **Deployment files** for Vercel.

## 1. Update Supabase

If your Phase 2 setup is working, you only need one more script:

1. Supabase > **SQL Editor > New query**.
2. Paste all of `supabase/phase3.sql` and press **Run**.
3. In **Table Editor**, `palettes` now has a `like_count` column and there is a new `likes` table.

(Starting from nothing? Run `supabase/schema.sql` first, then `phase3.sql`, and follow the Phase 2 steps for email login: enable Email, and put `{{ .Token }}` in the Magic Link email template.)

Run `phase3.sql` only once. A second run will complain that things already exist, which is harmless.

## 2. Run it

    npm install
    npm test
    npm run dev

`npm test` runs two suites: color math, and the image color extractor. Both should pass.
Your `.env` from Phase 2 (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY) is still used.

## 3. Try these

1. Studio > **From image**: pick a photo. The five colors should echo it. Try a plain, one-color image: it should say the image has too few colors.
2. Library: make a palette Public. Open **Explore**: it appears.
3. Press the heart. The count goes up. Reload: the heart is still filled. Press again: it goes back down.
4. Log out and press a heart: it asks you to log in.
5. In Supabase Table Editor, open `palettes` and try to edit `like_count` by hand through the app: it is not possible from the browser (only the trigger changes it).
6. Open a public palette's page (/p/...): the tab title is the palette's name.

## 4. Deploy (free)

1. Put the project on GitHub:

       git init
       git add .
       git commit -m "Gamut"

   Create an empty repository on github.com and run the two lines it shows you (`git remote add origin ...` and `git push -u origin main`). The included `.gitignore` keeps `.env` out of GitHub. Check that no `.env` appears on the repository page.
2. vercel.com > **Add New > Project** > import the repository. Leave the framework as Vite.
3. Add two **Environment Variables**: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (same values as your `.env`). Deploy.
4. In Supabase > **Authentication > URL Configuration**, set the **Site URL** to your Vercel address (for example https://gamut.vercel.app). If that page also has a redirect URL list, add the same address.
5. Open your Vercel address and run the checks from section 3 again.

`vercel.json` makes direct links like /p/... and /studio work when opened or refreshed.

## Architecture (final)

    gamut/
    ├── index.html, vite.config.js, vercel.json, package.json, .env.example, .gitignore
    ├── supabase/
    │   ├── schema.sql           palettes table + security rules (Phase 2)
    │   └── phase3.sql           likes table, like counter trigger, column permissions (Phase 3)
    ├── public/favicon.svg
    └── src/
        ├── main.jsx             routes, AuthProvider, tab titles
        ├── index.css            design tokens, buttons, dark mode
        ├── lib/
        │   ├── color.js         color math, contrast, generation, color-blind simulation   (tested)
        │   ├── extract.js       dominant colors from image pixels                           (tested)
        │   ├── export.js        CSS / Tailwind v4 / JSON text, PNG download
        │   ├── library.js       browser-only saved palettes, used when logged out
        │   ├── supabase.js, auth.jsx, cloud.js    Supabase client, login, palette and like queries
        └── pages/               Landing, Studio, Library, Explore, PublicPalette, Login, NotFound

### Decisions worth knowing

- **No custom server.** Safety lives in the database (row-level security + column permissions):
  you can edit only your own palettes, change only their name and visibility, like only public palettes, and never touch a like count.
- **Image processing stays in the browser.** The photo is shrunk and read on your device.
- **Pure logic is tested.** Color math and image extraction are plain functions with tests, separate from the screens.

## Before you share it widely

- **Moderation:** anyone logged in can publish a palette with any name. There is no reporting or review yet. For a public launch, add a report button and a way to unpublish.
- **Email limits:** Supabase's built-in email sender allows only a few codes per hour. Set up your own provider (Authentication > SMTP) before real traffic.
- **Names:** public palettes are anonymous, with no profile pages.

## Ideas for later

Profile pages and display names, tags and search in Explore, palette collections, a "palette from website" tool, and Figma or Adobe export.
