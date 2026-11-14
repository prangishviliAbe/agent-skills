# Imagery and icons

Read when: Choosing, cropping, or placing photographs, illustrations, product shots, generated images, or icons.

Imagery is where generated pages are spotted fastest: abstract gradient art, stock scenes, fabricated dashboards, and an icon above every heading. The rule is simple. An image must show something true about the subject that words cannot show as well. Otherwise it is filler, and an honest empty space is better.

## What to show

| Subject | Strong image | Weak image |
| --- | --- | --- |
| Software | A real, legible capture cropped to the feature being discussed, with a caption | A full-window shot shrunk until unreadable, or an invented dashboard |
| Physical product | The product itself, large, well lit, with scale and detail | Lifestyle scene where the product is incidental |
| Service or place | The real premises, people, and work | Stock handshake or skyline |
| Process or system | A diagram drawn for this explanation | Isometric decoration |
| Data | The real chart with labeled axes and a stated period | A decorative sparkline |
| Nothing available | Typography and a strong layout | A generated picture standing in for the real thing |

When nothing real exists, design the page to work without imagery and say which assets would improve it. Do not fill the gap with abstract art.

## Truthfulness

- Never present a mockup, generated image, or synthetic data as a real product, customer, place, or result.
- Sample data in a product capture is acceptable when it is realistic and either obviously illustrative or labeled as sample.
- Generated images: allowed only when the user wants them, never for people presented as real staff or customers, and always inspected for the usual defects (hands, text, repeated patterns, impossible geometry). Label conceptual art as conceptual where it could be mistaken for documentation.
- Use only logos, photos, and marks the project has the right to use.

## Product captures

1. Capture the real interface at a known size with realistic data and the product's real fonts.
2. Crop to the region that proves the point. A capture is evidence; it must be readable at the size displayed.
3. Place it flat. No perspective tilt, no glow, no fake browser bar or device frame unless the device context is the point.
4. Add a caption or annotation that tells the reader what to notice.
5. Provide a version for dark theme and for high-density screens, and set explicit dimensions to avoid layout shift.

## Photography

- Choose one treatment and hold it across the page: similar light, color temperature, and distance. A mix of unrelated stock styles looks assembled.
- Crop on purpose. Set `object-fit: cover` together with an `object-position` that keeps the subject in frame at every aspect ratio, and check the narrow layout, where crops usually fail.
- Let scale follow importance: one large image carries more than six small ones.
- Aspect ratios come from a short list (for example 3:2, 4:5, 1:1, 16:9), chosen per use, not one ratio for everything.
- Text over a photo needs a calm region or a solid panel. A blanket dark overlay that flattens the photo is a last resort.
- Real but imperfect photos beat perfect stock. If quality is poor, use them smaller, in monochrome, or in a consistent duotone derived from the palette.

```css
.figure img {
  inline-size: 100%;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: 50% 35%;   /* keep faces in frame when cropped */
}
```

Deliver responsive sources (`srcset` and `sizes`), a modern format, explicit dimensions, lazy loading below the first view, and `alt` text that states what the image shows or an empty `alt` when it is purely decorative.

## Illustration

Illustration is justified when it explains (a diagram, a map, a cutaway) or when the brand owns a distinct illustration style. It is not justified as a default empty-state or hero filler. One hand, one line weight, one palette drawn from the tokens. Flat-vector people, isometric offices, and blob backgrounds are stock and read as such.

## Icons

Icons are for recognition at a glance, not for decoration.

| Use an icon when | Do not use an icon when |
| --- | --- |
| It replaces or reinforces a label on a frequent control (search, close, download) | It sits above a heading only to make a card feel designed |
| It marks a state alongside text (error, success, warning) | No conventional symbol exists and one had to be invented to fill the slot |
| It helps scanning in a dense list of unlike items | Every item gets a different icon of roughly equal vagueness |
| Space is too tight for a word and the meaning is universal | The meaning needs the label to be understood anyway |

Rules:

- One icon set, one stroke weight, one corner style. Mixing sets is visible immediately.
- Size icons to the text they accompany: about the cap height to line height of the label, typically 16 to 20px in UI, aligned to the text's optical center, not the box center.
- Icons take the text color. Accent-colored icons in tinted bubbles are the generated look.
- Icon-only buttons need an accessible name and a tooltip, and enough hit area.
- No emoji as interface icons: they render differently per platform and carry a casual tone that is rarely intended.
- No sparkles, wands, rockets, or lightning bolts as stand-ins for "AI", "new", "fast", or "powerful". Use the word.
- Default icons from a popular library, left at default size and stroke, look like a starter kit. Adjust stroke weight to match the type weight, or choose a set that fits the type.

## Checks

| Check | Pass |
| --- | --- |
| Truth | Every image shows the real thing or is clearly a diagram or sample |
| Reason | Each image and icon can be named for what it tells the reader |
| Legibility | Captures are readable at displayed size |
| Crop | Subject in frame at narrow, middle, and wide layouts |
| Consistency | One photo treatment, one icon set, one illustration hand |
| Performance | Dimensions set, sources responsive, nothing shifts on load |
