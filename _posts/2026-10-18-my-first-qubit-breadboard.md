---
layout: single
title: "My First Qubit: the breadboard comes to life"
date: 2026-10-18 22:30:00 -0400
permalink: /blog/my-first-qubit-breadboard/
author_profile: true
excerpt: "Two round screens, seven buttons, and two knobs now work together as a physical single-qubit simulator."
description: "A build update on My First Qubit, from animated state displays to working physical controls."
tags: [Quantum Computing, Circle Notation, My First Qubit, Making]
---

<style>
.mfq-demo{display:block;width:auto;max-width:100%;height:auto;max-height:460px;margin:0 auto;border-radius:12px}
.mfq-photos{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem;margin:1.5rem 0}
.mfq-photos figure{display:block;margin:0;min-width:0}
.mfq-photos a{display:block}
.mfq-photos img{display:block;width:auto;max-width:100%;height:auto;max-height:340px;margin:0 auto;border-radius:10px}
.mfq-photos figcaption{font-size:.82em;line-height:1.5;margin-top:.6rem}
@media(max-width:540px){.mfq-photos{grid-template-columns:1fr}.mfq-photos img{max-height:300px}.mfq-demo{max-height:420px}}
</style>

My First Qubit now works on the breadboard. I can turn a knob to change the chances of measuring 0 or 1, turn another to change phase, and press real buttons to apply quantum gates. Two small, round screens show what happens.

It started as a question: could a child explore a qubit through something they could touch? The [browser simulator](/learn/my-first-qubit/) gave me a way to try the idea. This build puts those same ideas into physical controls.

<figure>
  <video class="mfq-demo" controls playsinline preload="metadata" width="512" height="910" poster="/assets/images/my-first-qubit/breadboard-controls-oct18.jpg" aria-label="My First Qubit breadboard demonstration" aria-describedby="breadboard-demo-caption">
    <source src="/assets/images/my-first-qubit/breadboard-demo-oct18.mp4" type="video/mp4">
    <a href="/assets/images/my-first-qubit/breadboard-demo-oct18.mp4">Watch the breadboard demonstration.</a>
  </video>
  <figcaption id="breadboard-demo-caption">A 50-second bench demo: pressing the buttons and turning the knobs changes the circle sizes and phase hands. Use the player controls to start playback.</figcaption>
</figure>

<div class="mfq-photos">
<figure>
  <a href="/assets/images/my-first-qubit/breadboard-controls-oct18.jpg" aria-label="Open the full prototype photo"><img src="/assets/images/my-first-qubit/breadboard-controls-oct18.jpg" alt="My First Qubit breadboard with two illuminated round state displays, an ESP32, tactile buttons, and two metal-shaft rotary encoders" width="768" height="1024" loading="lazy"></a>
  <figcaption>The working breadboard prototype, October 18, 2026. The wiring is still exposed, but the displays and controls now work together.</figcaption>
</figure>
<figure>
  <a href="/assets/images/my-first-qubit/breadboard-reset-oct18.jpg" aria-label="Open the full state display photo"><img src="/assets/images/my-first-qubit/breadboard-reset-oct18.jpg" alt="The same breadboard prototype with the left state circle full and the right circle empty" width="768" height="1024" loading="lazy"></a>
  <figcaption>A state with the left circle full and the right empty. Circle size and hand direction carry different parts of the state.</figcaption>
</figure>
</div>

## Two circles, one qubit

The circles represent the two possible measurement results, 0 and 1. They show one qubit, not two.

Each circle's filled area shows the chance of getting that result. When both areas are equal, each result has a 50% chance. Each clock hand shows the phase of its complex amplitude. The difference between the hands matters for interference. Turning both by the same amount changes global phase, which does not change measurement results.

When a circle is empty, its phase is undefined, so its hand disappears.

The board runs a mathematical simulation on an ESP32-S3. It does not contain quantum hardware. The point is to make the state and its changes easier to explore.

## Buttons and knobs that work

The prototype has seven buttons: X, Y, Z, H, Measure, Reset, and Colors. The first four apply quantum gates. Measure picks an outcome using the current probabilities and leaves the state at that result. Reset returns to 0.

Two rotary encoders control probability balance and relative phase. The balance knob makes one circle grow as the other shrinks. The phase knob changes the difference between the hands. These knobs let me explore many more states than the gate buttons alone.

The screens also have three color schemes: Woodland, Garden, and Night. Changing colors leaves the qubit state alone. That small detour was fun, and it gives the board another simple interaction.

## The small bugs taught us something

Getting both screens to light up was only the start. Each display needed its own reset pin. Drawing each frame in memory before sending it to the screen removed the black wipes between updates.

The gate animations now follow the same complex-amplitude path as the browser version. The hardware shows fewer frames, but the probabilities and phases follow the same math.

The knobs revealed two useful bugs. At full 1, turning the probability knob farther could rotate the surviving hand. The software was rebuilding the state at a limit and adding the saved phase again. Now, an extra turn at either limit leaves the state untouched.

The first click after changing direction could also go missing. Counting a complete encoder cycle at its resting click position fixed that. Both fixes are now tested on the bench.

## A checkpoint before the wood

I have saved this as the V0.2 breadboard milestone, with the [tested firmware and wiring](https://github.com/thequantumturtle/my-first-qubit). The core interaction works: turn, press, and watch the state change.

The next step is to make the assembly easier to handle. That means a front-panel layout, secure controls, protected screens, and wiring that can stay put. Longer bench tests still need to happen. This exposed prototype is for adult development, not for a child to play with yet.

The aim is a wooden learning instrument that invites exploration first, with explanations for parents and older learners when they want them. The breadboard gives me something concrete to build around.

[Try the browser version](/learn/my-first-qubit/) or [follow the build journal](/work/building-my-first-qubit/).
