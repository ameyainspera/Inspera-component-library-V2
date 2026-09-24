# Setup

Execute these steps before generating any UI.

1. **Import the kit stylesheet** once at the app root (e.g. `src/main.tsx` or the global CSS entry). This defines every token as a CSS custom property:

   ```ts
   import '@inspera/kit/styles.css'
   ```

2. **Register fonts.** The kit assumes Inter, Noto Sans Mono, Noto Serif, and Material Symbols Outlined. In a Vite/CSS project, add these **before all other CSS statements** (they are public Google Fonts):

   ```css
   @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
   @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Mono:wght@400;500;600&display=swap');
   @import url('https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;500;600&display=swap');
   @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-25..200&display=swap');
   ```

   The declared font families are also listed in `.figma/make/kit.json`.

3. **Import components** from the kit barrel:

   ```tsx
   import { Button, TextInput, Card } from '@inspera/kit'
   ```

Verify: the app renders in Inter (not a fallback), Material Symbols render as glyphs (not ligature text), and `var(--primary)` resolves to `#004080`.
