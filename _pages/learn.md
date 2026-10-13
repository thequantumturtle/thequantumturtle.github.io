---
layout: single
title: ""
permalink: /learn/
author_profile: false
---

<style>
.qt-play-hero{padding:clamp(2.5rem,5vw,4.5rem) 0 2.5rem;max-width:57rem}
.qt-play-hero h1{max-width:17ch}
.qt-play-feature{display:grid;grid-template-columns:minmax(0,1.12fr) minmax(0,.88fr);gap:clamp(1.5rem,4vw,3rem);align-items:center;padding:clamp(1.5rem,3vw,3rem);background:#ece9df;border-radius:5px}
.qt-play-feature__tag{font-family:"IBM Plex Mono",monospace;font-size:.75rem;letter-spacing:.07em;text-transform:uppercase;color:#667b82}
.qt-play-feature h2{margin:.35rem 0 1rem;max-width:15ch}
.qt-play-feature__actions{display:flex;flex-wrap:wrap;gap:.7rem;margin-top:1.3rem}
.qt-play-visual{display:grid;grid-template-columns:1fr 1fr;align-items:center;gap:1rem;min-height:240px;padding:1.3rem;border:8px solid #a97444;border-radius:26px;background:repeating-linear-gradient(4deg,#e3b984 0 22px,#e9c391 23px 44px);box-shadow:0 8px 0 #8b5f39}
.qt-play-dial{display:flex;flex-direction:column;gap:.7rem;align-items:center;font-family:"IBM Plex Mono",monospace;font-size:.8rem;font-weight:700;color:#493a2e}
.qt-play-dial svg{width:100%;max-width:190px;filter:drop-shadow(0 3px 2px #75644a30)}
.qt-play-resources{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1rem}
.qt-home a.qt-play-resource{display:flex;flex-direction:column;padding:1.6rem;border:1px solid var(--qt-border);border-radius:4px;background:#f0eee6;color:var(--qt-text);text-decoration:none}
.qt-play-resource h3{color:var(--qt-forest);font-size:clamp(1.25rem,2vw,1.6rem);margin:.4rem 0 .75rem}
.qt-play-resource p{font-weight:400}
.qt-play-resource__link{margin-top:auto;color:var(--qt-forest);font-weight:700}
.qt-home a.qt-play-resource:hover,.qt-home a.qt-play-resource:focus-visible{border-color:var(--qt-forest);box-shadow:0 5px 15px #23302612}
.qt-play-more{margin-top:1.6rem;padding:1.5rem;border-top:1px solid var(--qt-border)}
@media(max-width:720px){.qt-play-feature,.qt-play-resources{grid-template-columns:1fr}.qt-play-visual{min-height:190px}.qt-play-feature{padding:1.4rem}}
</style>
<div class="qt-home qt-subpage qt-play">
  <section class="qt-play-hero">
    <p class="qt-kicker">The Quantum Turtle · Learning Lab</p>
    <h1>Quantum ideas you can play with.</h1>
    <p class="qt-lede">Interactive experiments and approachable resources for curious minds. Start with a qubit, press a gate, and see what happens.</p>
  </section>

  <section class="qt-play-feature" aria-labelledby="first-qubit-title">
    <div>
      <p class="qt-play-feature__tag">Featured interactive experiment</p>
      <h2 id="first-qubit-title">My First Qubit</h2>
      <p>What if quantum computing could feel like a hands-on toy? Explore a single qubit with two circles, controls for balance and phase, colorful quantum gates, and measurement.</p>
      <p>The browser version is an interactive concept for a physical learning toy I'm prototyping.</p>
      <div class="qt-play-feature__actions">
        <a class="qt-button qt-button--primary" href="/learn/my-first-qubit/">Play with My First Qubit →</a>
        <a class="qt-button qt-button--quiet" href="#more-experiments">More experiments ↓</a>
      </div>
    </div>
    <div class="qt-play-visual" aria-hidden="true">
      <div class="qt-play-dial">
        <svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="92" fill="#f5ead6" stroke="#846541" stroke-width="5"/><circle cx="100" cy="100" r="82" fill="#5d9ed0"/><line x1="100" y1="100" x2="100" y2="18" stroke="#293f4c" stroke-width="6" stroke-linecap="round"/><circle cx="100" cy="100" r="6" fill="#293f4c"/></svg>
        <span>|0⟩</span>
      </div>
      <div class="qt-play-dial">
        <svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="92" fill="#f5ead6" stroke="#846541" stroke-width="5"/><circle cx="100" cy="100" r="58" fill="#e99b66"/><line x1="100" y1="100" x2="143" y2="61" stroke="#293f4c" stroke-width="6" stroke-linecap="round"/><circle cx="100" cy="100" r="6" fill="#293f4c"/></svg>
        <span>|1⟩</span>
      </div>
    </div>
  </section>

  <section class="qt-section" id="more-experiments">
    <div class="qt-section__heading">
      <p class="qt-kicker">Explore further</p>
      <h2>More ways to learn</h2>
      <p>Move from the circle representation to the Bloch sphere, or take an experiment into the classroom.</p>
    </div>
    <div class="qt-play-resources">
      <a class="qt-play-resource" href="/learn/qubit-busy-board/">
        <span class="qt-meta">Interactive simulator</span>
        <h3>Bloch Sphere Busy Board</h3>
        <p>See how the same qubit behaves on the Bloch sphere. Explore gates, superposition, phase, and measurement.</p>
        <span class="qt-play-resource__link">Explore the Bloch sphere ↗</span>
      </a>
      <a class="qt-play-resource" href="/resources/bb84-classroom-worksheet/">
        <span class="qt-meta">Classroom activity</span>
        <h3>BB84 Quantum Key Distribution</h3>
        <p>A printable, guided group activity about quantum measurement, basis choices, and eavesdropping.</p>
        <span class="qt-play-resource__link">Open classroom worksheet ↗</span>
      </a>
    </div>
    <div class="qt-play-more">
      <p class="qt-kicker">Looking for university courses?</p>
      <p>Find complete materials for Programming Quantum Computers, Quantum Machine Learning, and previous semesters in the <a href="/teaching/">CMU course catalog →</a></p>
    </div>
  </section>
</div>
