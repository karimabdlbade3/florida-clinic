# Clinic photos

Drop real, professionally shot clinic photos here (JPG/PNG, at least 1600px wide).
Then pass them to `<PhotoSlot src={...}>` in the views, for example in
`src/views/HomeView.astro`:

```astro
import heroPhoto from '../assets/photos/hero.jpg';
<PhotoSlot src={heroPhoto} alt="Treatment room at the Ibrahimia branch" shape="arch" loading="eager" />
```

Astro converts them to AVIF/WebP in several sizes automatically.

Do not use photos of identifiable patients without their written consent.
Suggested shots: reception, treatment room, sterilisation area, team (with consent),
building exterior/signage for each branch (helps patients find it).
