---
layout: archive
title: "Lab 1: Classical vs Quantum Information"
type: "Spring Semester"
venue: "Carnegie Mellon University"
date: 2026-01-01
permalink: /courses/2026-Spring-11860/labs/lab-01/
---

## Tool
- [O'Reilly Quantum Simulator](https://oreilly-qc.github.io/)

## Objectives
- Distinguish classical bits from quantum bits at the level of state
- Explain amplitudes vs probabilities
- Describe measurement and collapse
- Construct and observe an entangled two-qubit state
- Explain what a statevector simulator is simulating

## Core Ideas
- Amplitudes define the quantum state
- Probabilities are derived from amplitudes
- Measurement is probabilistic and destructive
- Entanglement means the system cannot be described independently

## Part 1: Single Qubit Behavior
1. Start with one qubit in |0⟩.
2. Apply X and observe.
3. Reset.
4. Apply H and inspect amplitudes.

**Questions**
- What are the amplitudes after H?
- Are probabilities alone sufficient to describe the state?
- Is the qubit randomly choosing a value before measurement?

## Part 2: Measurement and Collapse
1. Prepare H|0⟩.
2. Measure.
3. Observe post-measurement state.
4. Reset and repeat several times.

**Questions**
- Does measurement reveal the pre-measurement state?
- Can the superposition be recovered after measurement?
- Why is measurement irreversible?

## Part 3: Two Qubits and Entanglement
1. Initialize |00⟩.
2. Apply H to qubit 0.
3. Apply CNOT (0 control, 1 target).
4. Inspect the state vector.

**Questions**
- Can this be written as two independent single-qubit states?
- What happens if you measure only one qubit?
- How are outcomes correlated?

## What the Simulator Is Doing
- Tracks a complex state vector of size 2^n
- Gates are unitary operations
- Measurement samples using |amplitude|^2
- Does not scale to large n

## Submission
- Answers to all questions
- 1 to 2 circuit screenshots
- A brief reflection on quantum vs classical information

## Key Takeaway
- Quantum computation is about manipulating and measuring states, not faster classical logic.
