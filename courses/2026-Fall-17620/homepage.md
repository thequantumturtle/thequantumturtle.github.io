---
layout: archive
title: "17-620: Quantum Machine Learning"
type: "Fall Semester"
venue: "Carnegie Mellon University"
date: 2026-10-20
---

**Mini-2, Fall 2026 · 6 units**  
**Tuesdays and Thursdays · 8:00–9:20 AM Eastern**  
**October 20–December 3, 2026 · 12 class meetings**  
**Classroom: 3SC 265**

### Instructors
[Daniel Justice](https://thequantumturtle.github.io/) and [Rita Singh](http://mlsp.cs.cmu.edu/people/rsingh/index.html)

## Course access
- **Canvas:** [17-620 Canvas course](https://canvas.cmu.edu/courses/56017) for assignments, grades, and announcements.
- **Piazza:** [17-620 discussion board](https://piazza.com/class/mvbdanmie4m2bq/) for questions and class discussion.
- **Classroom:** 3SC 265. The course meets in person.
- **Zoom (when needed):** [Join the course meeting](https://cmu.zoom.us/j/99485025401?pwd=hZnubkqYkhjYeCsgh7WLrxlohq0hw5.1). The instructors will announce any remote arrangements.

## About the course
We will learn the foundations of quantum computing and apply them to machine learning. Along the way, we will use PennyLane to build circuits, encode data, study quantum clustering and classifiers, and test what happens when algorithms meet real, noisy quantum hardware.

The course includes **seven lectures and five labs**. Labs move from basic circuits to data encoding, real-device benchmarking, variational classifiers, and error mitigation.

## Course materials
Course resources and assignments will be shared here and on Canvas.

### Books and additional reading
- [Practical Quantum Machine Learning and Quantum Optimization](https://www.amazon.com/Practical-Quantum-Machine-Learning-Optimization/dp/1804613835)
- [Machine Learning with Quantum Computers](https://link.springer.com/book/10.1007/978-3-030-83098-4)
- [A Gentle Introduction to Quantum Computing](http://mmrc.amss.cas.cn/tlb/201702/W020170224608150244118.pdf)

## Class schedule

All dates below are in **2026**. Classes meet from **8:00 to 9:20 AM Eastern** in **3SC 265**, unless the instructors announce a change.

| # | Date | Format | Topic and activities |
|:--:|---|---|---|
| 1 | Tue, Oct 20 | Lecture | **Quantum computing foundations, Part 1.** Qubits, single-qubit gates, the Bloch sphere, superposition, measurement, and an overview of course tools. |
| 2 | Thu, Oct 22 | **Lab 1** | **PennyLane fundamentals.** Set up the environment; build circuits with parameterized gates, observables, and `qml.grad`; compare syntax with Qiskit and Cirq. Take-home: reproduce a Bell-state experiment on a real backend. |
| 3 | Tue, Oct 27 | Lecture | **Quantum computing foundations, Part 2.** Multi-qubit systems, entanglement, Bell states, universal gates, circuits, the no-cloning theorem, and a tour of quantum software tools. |
| 4 | Thu, Oct 29 | Lecture | **Data encoding and quantum k-means.** Amplitude, angle, and basis encoding; data-loading bottlenecks; the algorithm and its complexity claims. |
| — | **Tue, Nov 3** | **No class** | **Democracy Day.** No day classes. |
| 5 | Thu, Nov 5 | Lecture | **Perceptrons, MLPs, and quantum neural networks.** Classical and hybrid models, data re-uploading, expressibility, and entangling capability. |
| 6 | Tue, Nov 10 | **Lab 2** | **Encoding and quantum k-means.** Encode feature vectors in PennyLane; compare quantum k-means with a classical baseline. |
| 7 | Thu, Nov 12 | **Lab 3** | **Real hardware and benchmarking.** Explore IBM Quantum, IonQ, and Rigetti through PennyLane and Amazon Braket; compare noise, shots, queue time, run time, and energy footprint with simulation. |
| 8 | Tue, Nov 17 | Lecture | **Linear and variational quantum classifiers.** Decision boundaries, parameterized circuits, gradient-based training, quantum feature maps and kernels, expressibility, trainability, and barren plateaus. |
| 9 | Thu, Nov 19 | **Lab 4** | **Variational quantum classifiers in PennyLane.** Train a VQC / quantum neural network using PyTorch or JAX and compare it with a classical MLP. |
| 10 | Tue, Nov 24 | Lecture | **Quantum hardware, Part 1: Qubit modalities and the QPU.** Superconducting, trapped-ion, photonic, neutral-atom, silicon-spin, NV-center, topological, and emerging platforms; CPU, GPU, TPU, and QPU comparisons; energy considerations. |
| — | **Thu, Nov 26** | **No class** | **Thanksgiving.** |
| 11 | Tue, Dec 1 | **Lab 5** | **Noise, error mitigation, and the limits of NISQ.** Add depolarizing and readout noise to the Lab 4 classifier; test zero-noise extrapolation and measurement-error mitigation; compare ideal, noisy, mitigated, and classical results. |
| 12 | Thu, Dec 3 | Lecture | **Quantum hardware, Part 2: Noise, error, and the NISQ era.** Decoherence, gate and readout errors, error mitigation versus correction, hardware benchmarks, resource and energy outlook, and course wrap-up. |

**Lab 5 note:** Rita's draft also identifies **Quantum Kernel Methods** as an alternative for December 1. The schedule above uses the current *Noise, Error Mitigation, and the Limits of NISQ* plan. Any change will be announced in Canvas.

**Schedule updates:** Topics and activities follow the Fall 2026 syllabus draft. Check Canvas for final assignments, deadlines, and any teaching or classroom changes.
