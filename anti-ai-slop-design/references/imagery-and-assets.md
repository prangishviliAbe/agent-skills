# Imagery, icons, and assets

Read when choosing, briefing, generating, or implementing images, illustration, icons, video, or data visuals. Every asset needs a job: evidence, atmosphere, instruction, recognition, or deliberate expression. If you cannot name the job, drop the slot.

## Sources, in order of preference

1. **Real material:** the product in use, real people and places with consent, real screenshots, real data. It carries information no stock can.
2. **Constructed visuals that explain:** diagrams, annotated screenshots, process drawings, charts and tables rendered as the hero. Data can be the image.
3. **Type and layout as imagery:** a strong typographic or color-block composition needs no photograph.
4. **Illustration or generated imagery** with a written system (palette, line weight, perspective, subject rules) so a series looks like one family.
5. **Stock** when it fits the subject and context. Choose by subject accuracy and treatment, not by availability.

## Brief an asset

Specify subject, context, composition, crop and focal point at each breakpoint, treatment (color grading, duotone, grain only if it serves the brand), where text sits over it, and the fallback when it fails to load. A brief such as "warehouse robot arm lifting a pallet, shot at eye level, cool daylight, subject in the left third so the right stays quiet for text" is usable; "futuristic automation image" is not.

## Generated and sourced images: inspect before use

At final display size look for distorted hands and faces, broken or invented text and logos, impossible geometry, repeated or melted objects, and mismatched series style. A generated image is not a defect in itself; a misleading one is. Do not use an image to imply a real person, event, endorsement, or product capability that does not exist. Label conceptual imagery. Confirm license and attribution for anything sourced, and do not invent provenance.

## Icons and illustration

- One icon set with one stroke weight and corner style; align icons optically with adjacent text. Avoid emoji as interface icons unless the brand is built on them.
- Icon-only controls need an accessible name; ambiguous icons need a visible label.
- Decorative icons repeated above every heading rarely add meaning; use them where recognition speeds scanning.
- Give illustrations a role (explaining, welcoming, filling an empty state) and keep them consistent in style and level of detail.

## Delivery

- Responsive sources (`srcset`, `sizes`), modern formats (AVIF, WebP) with a fallback, intrinsic `width` and `height` to prevent layout shift, and lazy loading below the fold only.
- Preserve the focal point when cropping with `object-fit` and `object-position`, and verify text contrast over the image in the worst region.
- Informative images get a useful `alt`; decorative images get an empty one. Complex charts need their values or takeaway in text.
- Budget weight and animation cost; a small visual gain is not worth a large dependency or a heavy video.
- Placeholders must be visibly placeholders and tracked as missing assets, never presented as final evidence.
