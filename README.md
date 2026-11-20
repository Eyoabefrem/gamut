# Gamut

<div align="center">

**A precision color studio, accessibility validator, and community palette platform for modern web design.**

[![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0.0-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%2015+-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Node Tests](https://img.shields.io/badge/Tests-Passing-brightgreen)](package.json)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)

[Live Studio](#-studio-features) • [Accessibility & CVD](#-wcag-accessibility--cvd-simulation) • [Image Extraction](#-client-side-image-to-palette) • [Architecture](#-architecture--security-model) • [Getting Started](#-getting-started) • [Deployment](#-production-deployment)

</div>

---

## Overview

**Gamut** is a zero-dependency, mathematical color palette generator and sharing ecosystem. Designed with a strict focus on usability, accessibility, and client-side privacy, Gamut empowers designers and engineers to:

- Generate mathematically balanced color harmonies in real-time.
- Test WCAG 2.1 contrast ratios and simulate color vision deficiencies with clinical accuracy.
- Extract dominant palettes from local imagery without sending a single byte to an external server.
- Export production-ready color code across CSS variables, Tailwind CSS v4 `@theme`, clean JSON, and high-resolution PNG asset cards.
- Synchronize and curate palettes in the cloud, publish work to the community Explore gallery, and engage with tamper-proof community likes.

---

## Key Features

### 🎨 Studio Features
- **Algorithmic Harmony Generation:** Uses tuned hue-angle offsets (analogous, complementary, triadic, split-complementary, and tetradic) combined with balanced lightness distribution to ensure every generated palette provides functional contrast.
- **Lock & Shuffle Workflow:** Lock favorite color swatches while re-rolling unlocked slots with a single press of the `Space` bar.
- **Dynamic Palette Sizing:** Scale palettes seamlessly between 2 and 8 swatches.
- **Precision Color Adjustments:** Fine-tune hex codes directly or adjust individual RGB and HSL channels in real time.
- **URL-Hash State Encoding:** Palettes are instantly encoded into the address bar hash (e.g., `#264653-2a9d8f-e76f51`). Share links instantly with zero authentication or database persistence required.

### ♿ WCAG Accessibility & CVD Simulation
- **Real-Time Contrast Ratios:** Computes WCAG 2.1 relative luminance and contrast ratios (ranging from 1:1 to 21:1) between any two swatches in the palette.
- **Compliance Badges:** Instant feedback indicating compliance with WCAG Level AA (4.5:1 / 3:1) and AAA (7:1 / 4.5:1) standards for both normal body and large text.
- **Automatic Readability:** Built-in calculation (`readableOn`) guarantees accessible contrast for text overlaid on any color swatch.
- **Color Vision Deficiency (CVD) Simulation:** Clinical-grade linear RGB matrix transformations (Machado et al. 2009) simulate how your palette appears under:
  - **Protanopia** (Long-wavelength / Red deficiency)
  - **Deuteranopia** (Medium-wavelength / Green deficiency)
  - **Tritanopia** (Short-wavelength / Blue deficiency)

### 🖼️ Client-Side Image-to-Palette
- **Privacy-First Processing:** Drag-and-drop or select photos (up to 15 MB). The browser scales images on an internal HTML5 Canvas and extracts dominant color vectors directly in memory.
- **Zero Server Uploads:** Your images never leave your local machine.
- **Adaptive Clustering Algorithm:** Uses 16-level RGB color quantization combined with Euclidean distance thresholding to extract distinct, vibrant colors while discarding low-variance noise.

### 🚀 Developer-Ready Exports
- **CSS Custom Properties:** Clean `:root` variable definitions ready for direct stylesheet inclusion.
- **Tailwind CSS v4 `@theme`:** Modern CSS `@theme` tokens designed specifically for the latest Tailwind engine.
- **JSON Schema:** Clean JSON array of hex values for programmatic pipelines and design tokens.
- **High-Res PNG Swatch Cards:** Generates a 1200x500 high-resolution canvas render with overlaid readable hex annotations for presentation slides, mockups, and client reviews.

### 🌐 Cloud Library & Community Explore
- **Passwordless Authentication:** Secure, frictionless authentication powered by Supabase OTP / Magic Link.
- **Dual-Storage Engine:** Fully functional in guest/offline mode using `localStorage`. Seamlessly syncs to cloud storage upon logging in.
- **Community Showcase (`/explore`):** Browse public palettes sorted by **Most Liked** or **Newest**.
- **Social Metadata & Clean URLs:** Dedicated public URLs (`/p/:id`) featuring dynamic document titles and OpenGraph tags for rich social unfurling.

---

## Architecture & Security Model

```mermaid
flowchart TD
    subgraph Client["Browser (React 18 + Vite)"]
        UI[Studio / Explore / Library]
        ColorEngine[Pure Math Engine<br/>color.js & extract.js]
        LocalStorage[(Local Storage<br/>Guest Mode)]
        Canvas[HTML5 Canvas<br/>Local Image Processing]
    end

    subgraph Supabase["Supabase Cloud Infrastructure"]
        Auth[GoTrue Auth<br/>OTP / Magic Link]
        Postgres[(PostgreSQL 15+)]
        subgraph Security["Database-Enforced Security"]
            RLS[Row-Level Security Policies]
            ColPrivs[Column-Level Grants]
            Trigger[bump_likes() Function & Trigger]
        end
    end

    UI --> ColorEngine
    UI --> Canvas
    UI --> LocalStorage
    UI -- "JWT (Authenticated Session)" --> Auth
    UI -- "REST / PostgREST" --> Postgres
    Postgres --> RLS
    Postgres --> ColPrivs
    Postgres --> Trigger
```

### Security Highlights
- **Zero Custom Server Attack Surface:** Relies entirely on client-side compilation and Supabase's hardened PostgreSQL gateway.
- **Database-Level Counter Integrity:** Palette `like_count` cannot be modified via client API requests. Column-level permissions (`REVOKE UPDATE, INSERT`) prevent spoofing; counts are maintained exclusively via the `bump_likes()` PostgreSQL trigger upon authorized insertions into the `likes` relation.
- **Strict Row-Level Security (RLS):**
  - Users can read all palettes flagged `is_public = true`.
  - Users can only mutate or delete palettes where `owner_id = auth.uid()`.
  - Users can only like public palettes and can only toggle their own like records.

---

## Tech Stack

| Domain | Technology | Description |
|---|---|---|
| **Framework** | [React 18](https://react.dev/) | Component architecture with hooks and concurrent rendering |
| **Tooling & Build** | [Vite 5](https://vitejs.dev/) | Instant HMR and optimized production bundling |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Modern utility-first styling with `@tailwindcss/vite` |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) | Smooth UI transitions and micro-interactions |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, consistent SVG icon set |
| **Routing** | [React Router v6](https://reactrouter.com/) | Client-side routing with hash-sync and deep links |
| **Backend & DB** | [Supabase](https://supabase.com/) | PostgreSQL database, Auth, and Row-Level Security |
| **Testing** | Node.js Test Runner | Zero-dependency native unit tests for mathematical models |

---

## Repository Structure

```
gamut/
├── .env.example              # Sample environment template
├── index.html                # Application entrypoint & SEO metadata
├── package.json              # Project scripts & dependency manifest
├── vercel.json               # SPA routing rewrite configuration for Vercel
├── vite.config.js            # Vite bundler configuration & plugins
├── supabase/
│   ├── schema.sql            # Base palettes schema, constraints & RLS policies
│   └── phase3.sql            # Likes table, trigger functions & column permissions
├── public/
│   └── favicon.svg           # Application SVG icon
└── src/
    ├── main.jsx              # App root, React Router routes & Auth provider
    ├── index.css             # Design tokens, color system & base styles
    ├── components/
    │   ├── ColorBar.jsx      # Individual interactive color swatch in the Studio
    │   ├── Header.jsx        # Navigation bar & responsive menu
    │   ├── Logo.jsx          # SVG logo brand mark
    │   ├── PaletteStrip.jsx  # Compact visual preview of a color palette
    │   ├── Reveal.jsx        # Viewport reveal transition container
    │   ├── ThemeToggle.jsx   # Dark / light theme toggle
    │   ├── Titles.jsx        # Dynamic document title & metadata manager
    │   └── Words.jsx         # Typographic display elements
    ├── lib/
    │   ├── auth.jsx          # Supabase authentication context & hook
    │   ├── cloud.js          # Cloud queries (palettes, likes, public feed)
    │   ├── color.js          # Color math: HSL, RGB, luminance, contrast, CVD (tested)
    │   ├── color.test.js     # Unit test suite for color calculations
    │   ├── export.js         # Serializers: CSS, Tailwind v4, JSON, and PNG canvas
    │   ├── extract.js        # Pixel quantization and dominant color clustering (tested)
    │   ├── extract.test.js   # Unit test suite for image color extraction
    │   ├── library.js        # Browser localStorage client for guest sessions
    │   └── supabase.js       # Supabase client instantiation & fallback handling
    └── pages/
        ├── Explore.jsx       # Public palette showcase with likes & sorting
        ├── Landing.jsx       # Marketing landing page
        ├── Library.jsx       # User palette collection & visibility management
        ├── Login.jsx         # Magic link / OTP authentication screen
        ├── NotFound.jsx      # 404 error page
        ├── PublicPalette.jsx # Dedicated permalink view for public palettes
        └── Studio.jsx        # Core interactive color creation studio
```

---

## Getting Started

### Prerequisites
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 9.0.0 or higher
- *(Optional)* A free [Supabase](https://supabase.com/) account for cloud persistence and user accounts. (Gamut works fully offline in local mode without Supabase).

### 1. Clone & Install
```bash
git clone https://github.com/your-username/gamut.git
cd gamut
npm install
```

### 2. Configure Environment Variables
Copy the sample environment file:
```bash
cp .env.example .env
```
Open `.env` and supply your Supabase project credentials (located in **Supabase Dashboard > Project Settings > API**):
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here
```
> **Note:** If you leave these variables blank, Gamut will automatically run in **Local-First Mode**, saving all palettes directly to the browser's `localStorage`.

### 3. Initialize the Database (Supabase)
If connecting to Supabase:
1. Navigate to your Supabase project's **SQL Editor**.
2. Run the base schema from [supabase/schema.sql](file:///c:/Users/Eyoab/Desktop/gamut/supabase/schema.sql):
   - Sets up the `palettes` table, foreign keys to `auth.users`, and base RLS policies.
3. Run the social extension from [supabase/phase3.sql](file:///c:/Users/Eyoab/Desktop/gamut/supabase/phase3.sql):
   - Adds the `like_count` column, creates the `likes` table, registers the `bump_likes()` trigger, and hardens column permissions.
4. In **Authentication > Providers > Email**:
   - Ensure the Email provider is enabled.
   - Under **Email Templates > Magic Link**, verify or include `{{ .Token }}` to support 6-digit OTP codes.

### 4. Run the Test Suites
Validate the color mathematics and pixel extraction logic:
```bash
npm test
```
*Executes `color.test.js` and `extract.test.js` using the native Node.js test runner.*

### 5. Launch the Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

---

## Production Deployment

### Deploying to Vercel

Gamut is pre-configured with [vercel.json](file:///c:/Users/Eyoab/Desktop/gamut/vercel.json) to handle single-page application (SPA) client-side routing on Vercel.

1. Push your repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit of Gamut studio"
   git branch -M main
   git remote add origin https://github.com/your-username/gamut.git
   git push -u origin main
   ```
2. In the [Vercel Dashboard](https://vercel.com/):
   - Click **Add New > Project** and import your `gamut` repository.
   - Framework preset will automatically detect **Vite**.
   - Under **Environment Variables**, add:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
   - Click **Deploy**.
3. In **Supabase Dashboard > Authentication > URL Configuration**:
   - Update **Site URL** with your production Vercel domain (e.g. `https://gamut.vercel.app`).
   - Add your domain to the **Redirect URLs** list.

---

## Algorithmic & Scientific Details

### Color Harmonies & Lightness Distribution
Gamut avoids muddy, low-contrast palettes by pairing geometric hue offsets with intentional lightness distribution:
```javascript
// Hue harmony offsets
const HARMONIES = [
  [0, 20, 40, -20, -40],    // Analogous
  [0, 180, 30, 210, -30],   // Split-Complementary
  [0, 120, 240, 20, 140],   // Triadic / Extended
  [0, 150, 210, 30, -30],   // Accented Analogous
  [0, 60, 120, 180, 240]    // Tetradic
];
```
Lightness is systematically distributed across the interval $[20\%, 80\%]$ and shuffled, guaranteeing that generated palettes naturally provide functional foreground/background contrasts.

### WCAG 2.1 Contrast Calculation
Gamut strictly implements the W3C WCAG 2.1 relative luminance formula:
$$L = 0.2126 \cdot R_{lin} + 0.7152 \cdot G_{lin} + 0.0722 \cdot B_{lin}$$
where linear sRGB components are calculated by gamma expansion:
$$C_{lin} = \begin{cases} \frac{C}{12.92} & \text{if } C \le 0.03928 \\ \left(\frac{C + 0.055}{1.055}\right)^{2.4} & \text{otherwise} \end{cases}$$
The contrast ratio between two colors with luminances $L_1$ and $L_2$ ($L_1 > L_2$) is:
$$\text{Ratio} = \frac{L_1 + 0.05}{L_2 + 0.05}$$

### CVD Simulation Matrix Transformation
Color deficiency simulation converts sRGB to linear RGB, applies the Machado et al. (2009) transformation matrix for the selected condition, clamps values to $[0, 1]$, and reconverts back to gamma-corrected sRGB.

---

## Roadmap

- [ ] **Figma & Adobe Swatch Exchange (.ase) Exporter:** Export directly to design system formats.
- [ ] **Tagging & Search in Explore:** Search community palettes by keyword, theme, or specific hex ranges.
- [ ] **Palette Collections:** Group palettes into themed design systems and projects.
- [ ] **URL Palette Extraction:** Pull brand color tokens directly from any live website URL.
- [ ] **User Profile Pages:** Public creator profiles displaying curated collections and aggregate like statistics.

---

## License

This project is licensed under the [MIT License](LICENSE). Feel free to use it for personal and commercial projects.
