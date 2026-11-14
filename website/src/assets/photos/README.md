# Clinic photos

Folder structure (put real photos only):

```
photos/
  home/                 hero + home "about" photo
  about/                story and patient-care photos
  services/             one photo per service (optional)
  branches/ibrahimia/   exterior, reception, treatment room
  branches/zagazig/
  branches/kafr-negm/
  doctors/              approved doctor portraits
  team/                 approved team photos
```

Then register each photo in `src/data/media.ts` (photo slots) or
`src/data/team.ts` (doctors). Until a slot is filled the site shows a neutral
designed placeholder, so the layout always looks complete.

Guidelines: JPG or PNG, at least 1600px wide, good natural light, no visible
patient faces or records without written consent. Astro produces optimised
AVIF/WebP versions automatically.

The official logo lives in `src/assets/brand/florida-logo-original.png`.
After replacing it, run `node scripts/make-brand-assets.mjs`.
