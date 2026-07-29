---
title: 'Nuxt UI Theme Studio WIP'
description: A live theme editor built into the Nuxt UI docs, and the curve-based palette editor at its heart.
navigation: false
image: /assets/blog/theme-studio-screenshot.png
authors:
  - name: Mike Newbon
    avatar:
      src: https://github.com/mikenewbon.png
    to: https://github.com/mikenewbon
date: 2026-07-28T10:00:00.000Z
category: Article
---

::warning
**Work in progress.** The writing and the screenshots here aren't final - the images are placeholders standing in for short clips, and the copy is still being worked on.
::

Nuxt UI now has a proper theme editor built into the docs, over at [/theme](/theme). Colours, type, icons, shadows, borders, spacing and component defaults, previewing live across ten layouts, exporting only the bits you actually changed.

![The Theme Studio open over a dashboard, editing the neutral ramp's lightness curve](/assets/blog/theme-studio-screenshot.png){class="rounded-lg shadow-2xl ring ring-default"}

It started as a much smaller complaint. Nuxt UI's dark mode is lovely and its light mode always felt a bit colourless to me - washed out where dark mode is rich, and not always contrasty enough to be comfortable. I wanted to fix my own light mode, which meant getting at the neutral ramp, which meant building something to get at it with. The palette editor is about the fourth answer to that.

## The first attempt

It worked the way most palette tools do. You place a few stops and it blends between them.

I was quite pleased with it, and it did fix my light mode. The trouble starts when you want a more specific transition. The blend is whatever the tool decided it should be, so your only move is to drop another stop in and drag it somewhere better. Then there are two new gaps either side with the same problem, so you add more - and every stop you add leaves less of the ramp free to blend.

![The first prototype: a stop every ten percent, a slider each, and a blend you had no say in](/assets/blog/custom-stops.png){class="rounded-lg ring ring-default"}

It traded precision against coherence, a stop at a time. The more exactly I described a ramp, the less it behaved like one.

## Curves

I shouldn't have been editing the ends of a transition. I should have been editing its shape.

So lightness, chroma and hue each get a curve - the sort you drag around in a devtools easing editor - sampled at eleven points in OKLCH. Muddy middle? Grab the middle of the curve. Move a handle and every stop moves with it, so there's no way left to express the mess I kept making.

That it's OKLCH and not HSL is doing more work than it sounds. Equal steps in OKLCH look like equal steps, so the shape you draw is the ramp you get. The same curve in HSL gives you shouting yellows and muddy blues, and you go back to nudging individual stops to fix what the space broke.

![The lightness curve for the primary ramp, with the eleven swatches it produces below it](/assets/blog/theme-studio/curve-drag.png){class="rounded-lg ring ring-default"}<!-- placeholder: swap for a gif of one handle being dragged, site restyling behind -->

`fitPalette()` runs it backwards for ramps you already have - Tailwind's, a preset's, a few hexes out of a brand doc - and fits curves through them. Everything's editable, rather than sat there being looked at.

The gradient behind the curve came to me halfway through a conversation with Benjamin, and it's my favourite bit of the whole thing. The plot draws the colour you'd get at every point in it, so the background is every option and the curve is just the line you took through them. You stop reading the graph and start aiming at the picture.

![The hue curve sitting over its colour field - every hue you could pick, and the line taken through them](/assets/blog/theme-studio/curve-field.png){class="rounded-lg ring ring-default"}

## Too fiddly

Curves are great when you want precision. Most of the time you don't. You want it warmer, or a bit less punchy, or the whole thing hue-shifted a few degrees.

So there are modifier sliders - lightness, contrast, saturation, hue - that layer over the curve rather than rewriting it. Push saturation to the top, drag it back, and you land exactly where you started. A taste pass never costs you the shape underneath.

![The modifier sliders open under the curve: lightness, contrast, saturation and hue, with an overall amount](/assets/blog/theme-studio/modifiers.png){class="rounded-lg ring ring-default"}<!-- placeholder: swap for a gif of saturation pushed up and dragged back -->

Eleven stops is just a convention too. If the gap between 100 and 200 is where your UI actually lives, drop the ramp to steps of 50, 25 or 10 and take up to ninety-one stops off the same curves. The curve doesn't change - you're only choosing how often to sample it.

## They wouldn't let me fix the brand colour either

There's one good reason to nail down a single stop: when it isn't a decision you get to make. Your brand blue is *that* blue, it lives at 500, and no curve is going to override it.

So the first prototype's idea comes back round - anchoring was never the wrong instinct, only ruinous as the *only* control I had. Pins sit on top of the curves rather than instead of them: lock a stop and all three curves bend to go through it, and stay through it while you drag everything else about. Clicking a stop opens its readout in OKLCH, hex and rgb, all editable.

![A stop's readout open on 500, showing the same colour as OKLCH, hex and rgb, all three editable](/assets/blog/theme-studio/pin-brand-colour.png){class="rounded-lg ring ring-default"}<!-- placeholder: swap for a gif of a brand hex being pasted and the curve bending to meet the pin -->

## The rest of the theme

Colour was the hard part, but it isn't the part people notice first.

Type is wired straight into Google Fonts, so the picker loads each family as you scroll it - you choose by looking rather than by imagining. Headings get their own treatment separate from body text, and since Tailwind v4 exposes weights as live variables, remapping them reaches every component instead of only inherited text.

Icons swap as a whole set, so you never end up half-changed.

Then shadows, borders, radius, spacing density and per-component defaults - the things that separate two themes using identical colours.

## Maybe in your own app, later

For now the studio is a page on this site: you theme Nuxt UI here, export, and paste the result into your project.

There's an obvious next step, though, which is running the same thing inside your own app - the whole editor while you're building it, or a curated version you hand your users so they can pick their own colours without you exposing your design system's internals. The engine already works that way; it doesn't much care whose theme it's editing. Whether that ships, and in what shape, is undecided. If it's something you'd use, say so - that's the sort of thing that decides it.

## On palettes

None of the individual pieces here are new. Perceptual colour spaces are standard now. [Leonardo](https://leonardocolor.io), [ColorBox](https://colorbox.io) and [Huetone](https://huetone.ardov.me) have generated ramps for years, and Material's HCT does contrast-first colour properly. Draggable curves are just an easing editor.

What I haven't come across is the combination: curves you can edit *and* reverse-fit from a palette you already own, non-destructive taste sliders layered over them, and pins the curves bend through rather than break at - all previewing against real components instead of a row of swatches. That last part matters more than I expected: a ramp on its own tells you very little, but the same ramp behind a form, a table and a chart tells you straight away.

Mostly I just like working this way. Editing a shape feels far more intuitive than maintaining eleven colours and hoping they still agree with each other, because the relationship between the stops is the thing you're actually adjusting. Whether that's the right model for everyone I genuinely don't know. It's made picking colours enjoyable, which it hadn't been before.

## Have a go

Fast enough to muck about with, exact enough to match a spec someone's handed you. That was the whole aim. Open [/theme](/theme), bend some curves about, and export whatever you end up with.

If you make something good, or something gloriously horrible, I'd love to see it.
