---
layout: single
title: ""
permalink: /work/
author_profile: false
---

<div class="qt-home qt-subpage">
  <section class="qt-subhero">
    <p class="qt-kicker">Work</p>
    <h1>Research, teaching, and practical questions about quantum technology.</h1>
    <p class="qt-lede">My work sits across quantum computing, software engineering, machine learning, and technology readiness. I’m especially interested in how we evaluate claims, compare alternatives, and decide what is actually useful.</p>
  </section>

  <section class="qt-section">
    <div class="qt-section__heading">
      <p class="qt-kicker">Selected work</p>
      <h2>Three areas I keep coming back to</h2>
    </div>
    <div class="qt-work-grid">
      <article id="algorithm-evaluation">
        <span id="qml-evaluation" aria-hidden="true"></span>
        <p class="qt-meta">Research · Benchmarking · Algorithms</p>
        <h3>Quantum Algorithm Evaluation</h3>
        <p>In our QAOA study, we simulated Max-Cut problems and compared the approximation ratios of individual samples with strong classical alternatives. Performance varied significantly with graph type.</p>
        <a href="/publication/2022-08-05-QAOA-Evaluation.html">Read the QAOA evaluation paper →</a>
      </article>
      <article id="pqc-readiness">
        <p class="qt-meta">PQC · Adoption · Readiness</p>
        <h3>Post-Quantum Readiness</h3>
        <p>Post-quantum migration requires more than selecting cryptographic algorithms. Organizations need to understand where cryptography is used, which systems and vendors depend on it, and who owns the changes.</p>
        <p>I approach readiness through practical questions: What needs to migrate? Who is responsible? What can be tested now? A useful plan connects that inventory to priorities, interoperability tests, and a staged rollout.</p>
      </article>
      <article id="quantum-programming">
        <p class="qt-meta">Teaching · Programming · Quantum</p>
        <h3>Programming Quantum Computers</h3>
        <p>I teach quantum computing by having students build, test, and reason about circuits so they develop enough intuition to question the tools and claims they encounter.</p>
        <a href="/courses/2026-Fall-17617/homepage/">Explore the current course →</a>
      </article>
    </div>
  </section>

  <section class="qt-questions">
    <p>Compared to what?</p>
    <p>Faster than what?</p>
    <p>Useful for what?</p>
    <span>These are simple questions, but they catch a surprising amount of bad reasoning around emerging technology.</span>
  </section>

  <section class="qt-section" id="evaluating-claims">
    <div class="qt-section__heading">
      <p class="qt-kicker">Evaluation</p>
      <h2>Make the comparison concrete.</h2>
    </div>
    <p class="qt-wide-copy">I start with the task and the outcome that matters, then choose a realistic classical baseline. I ask what resources each approach uses, which costs the comparison includes, and whether the result holds across different inputs.</p>
    <p class="qt-wide-copy">For example, our QAOA study examined the quality of individual Max-Cut samples rather than relying only on an average. Comparing across graph types helped show where performance changed and why one result should not stand in for every problem instance.</p>
    <p><a href="/publication/2022-08-05-QAOA-Evaluation.html">See the published example →</a></p>
  </section>

  <section class="qt-section">
    <div class="qt-section__heading">
      <p class="qt-kicker">More detail</p>
      <h2>Research record and teaching archive</h2>
    </div>
    <div class="qt-focus-list">
      <article>
        <h3>Publications</h3>
        <p>A selected publication on evaluating quantum optimization against classical alternatives.</p>
        <a href="/publications/">Browse publications →</a>
      </article>
      <article>
        <h3>Teaching</h3>
        <p>Current and past courses, including programming quantum computers and quantum machine learning.</p>
        <a href="/teaching/">Browse teaching →</a>
      </article>
      <article>
        <h3>Writing</h3>
        <p>Explanations of quantum state spaces and circle notation from the writing archive.</p>
        <a href="/year-archive/">Browse writing →</a>
      </article>
    </div>
  </section>
</div>
