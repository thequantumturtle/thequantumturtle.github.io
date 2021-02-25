---
layout: post
title: Quantum State Space Explosion
date: 2021-02-17 22:51:00 -0500
description: How does a Quantum State Space explode compared to a Classical State Space?
img: nuclear-bomb-explosion.jpg # Add image post (optional)
fig-caption: # Add figcaption (optional)
tags: [Quantum Computers, Simulators]
---

I often find that when people claim that Quantum Computers leverage an explosion in state space to outperform classical computers more questions are raised instead of answered.

So, lets state that much of the power from quantum computers comes from a state space explosion.

And now lets ask some key questions:   
1. What is a state?
2. What is a state space?
3. Why does the state space explode for QCs?


## What is a state?
Let us first look at a classical bit. A bit can be either a 0 or a 1. And, importantly it can ONLY be a 0 or a 1, it cannot be both. The value that the bit holds is called its **state**. For a single bit there are only 2 states and we can put it in a table like below.



<center>
    <table class = 'bit-table'>
        <tr>
            <th>Binary</th>
            <th>Decimal</th>
        </tr>
        <tr>
            <td>0</td>
            <td>0</td>
        </tr>
        <tr>
            <td>1</td>
            <td>1</td>
        </tr>
    </table>
</center>

This is a bit boring so lets up it to 2 bits. There are 4 states here.

<center>
    <table class = 'bit-table'>
        <tr>
            <th>Binary</th>
            <th>Decimal</th>
        </tr>
        <tr>
            <td>00</td>
            <td>0</td>
        </tr>
        <tr>
            <td>01</td>
            <td>1</td>
        </tr>
        <tr>
            <td>10</td>
            <td>2</td>
        </tr>
            <tr>
            <td>11</td>
            <td>3</td>
        </tr>
    </table>
</center>

And 3 bits is where it starts to become a bit obnoxious. And we double our number of states again.

<center>
    <table class = 'bit-table'>
        <tr>
            <th>Binary</th>
            <th>Decimal</th>
        </tr>
        <tr>
            <td>000</td>
            <td>0</td>
        </tr>
        <tr>
            <td>001</td>
            <td>1</td>
        </tr>
        <tr>
            <td>010</td>
            <td>2</td>
        </tr>
            <tr>
            <td>011</td>
            <td>3</td>
        </tr>
                <tr>
            <td>100</td>
            <td>4</td>
        </tr>
        <tr>
            <td>101</td>
            <td>5</td>
        </tr>
        <tr>
            <td>110</td>
            <td>6</td>
        </tr>
            <tr>
            <td>111</td>
            <td>7</td>
        </tr>
    </table>
</center>


## What is a state space?
A state space is the set of all states available to a bit string.

For each bit added to the string, we will double the number of states. The number of possible states available for an $$n$$ bit string is $$2^n$$. For a 5 bit string we would require a table with $$2^5 = 32$$ rows. But, that's just too much effort for this blog post.

Using classical bits, there are $$2^n$$ possible states but there is only $$1$$ state that exists at any time. On our table, we can represent this by adding another column labeled **State**. In this column, if the register exists in that state (row), then the value will be $$1$$, otherwise the value will be $$0$$. Let's see an example by representing the decimal value $$2$$ on a 2 bit register.

<center>
    <table class = 'bit-table'>
        <tr>
            <th>Binary</th>
            <th>Decimal</th>
            <th>State</th>
        </tr>
        <tr>
            <td>00</td>
            <td>0</td>
            <td>0</td>
        </tr>
        <tr>
            <td>01</td>
            <td>1</td>
            <td>0</td>
        </tr>
        <tr>
            <td>10</td>
            <td>2</td>
            <td>1</td>
        </tr>
        <tr>
            <td>11</td>
            <td>3</td>
            <td>0</td>
        </tr>
    </table>
</center>

It doesn't matter how large this chart grows, there is only ever going to be a single $$1$$ in the **State** column. As that is the **state** we are interested in, we only need to show that 1 row.

<center>
    <table class = 'bit-table'>
        <tr>
            <th>Binary</th>
            <th>Decimal</th>
            <th>State</th>
        </tr>
        <tr>
            <td>10</td>
            <td>2</td>
            <td>1</td>
        </tr>
    </table>
</center>


## Why does the state space explode for QCs?
Qubits (not [qudits](https://arxiv.org/abs/2008.00959)) have access to the same sized state space as Bits, $$2^n$$. To make it clear that we are talking about about quantum states, we will encapsulate the binary and decimal representations in $$|ket\rangle$$ notation. So for the classical state $$2$$, $$10$$ will be used. For the quantum state $$|2\rangle$$, $$|10\rangle$$ will be used.

<center>
    <table class = 'bit-table'>
        <tr>
            <th>Binary</th>
            <th>Decimal</th>
        </tr>
        <tr>
            <td>$$|00\rangle$$</td>
            <td>$$|0\rangle$$</td>
        </tr>
        <tr>
            <td>$$|01\rangle$$</td>
            <td>$$|1\rangle$$</td>
        </tr>
        <tr>
            <td>$$|10\rangle$$</td>
            <td>$$|2\rangle$$</td>
        </tr>
            <tr>
            <td>$$|11\rangle$$</td>
            <td>$$|3\rangle$$</td>
        </tr>
    </table>
</center>
So far, this looks the same as Fig. 2 sans the $$|ket\rangle$$ notation. The change comes when we add in the state column. Qubits can be in a state of superposition where the quantum state is in multiple states in the statespace at the same time. (To those advanced readers, the wording here is to build understanding of the situation, not to be true to physics.) Lets represent a quantum state where we are equally in all states in the state space at the same time.



<center>
    <table class = 'bit-table'>
        <tr>
            <th>Binary</th>
            <th>Decimal</th>
            <th>State</th>
        </tr>
        <tr>
            <td>$$|00\rangle$$</td>
            <td>$$|0\rangle$$</td>
            <td>.25</td>
        </tr>
        <tr>
            <td>$$|01\rangle$$</td>
            <td>$$|1\rangle$$</td>
            <td>.25</td>
        </tr>
        <tr>
            <td>$$|10\rangle$$</td>
            <td>$$|2\rangle$$</td>
            <td>.25</td>
        </tr>
            <tr>
            <td>$$|11\rangle$$</td>
            <td>$$|3\rangle$$</td>
            <td>.25</td>
        </tr>
    </table>
</center>

There we go! Whats that? Whats the $$.25$$? 

That's the probability that when we read the quantum system it will fall into that state. Quantum systems can be split across multiple states at one time, but when we read the value the quantum system collapses into a classical state.

<center>
<table  style="background-color:rgba(0, 0, 0, 0); border:0;" ><tr><td style="border:0;">
    <table class = 'bit-table' style="margin:auto; width:50%" >
        <tr>
            <th>Binary</th>
            <th>Decimal</th>
            <th>State</th>
        </tr>
        <tr>
            <td>$$|00\rangle$$</td>
            <td>$$|0\rangle$$</td>
            <td>.25</td>
        </tr>
        <tr>
            <td>$$|01\rangle$$</td>
            <td>$$|1\rangle$$</td>
            <td>.25</td>
        </tr>
        <tr>
            <td>$$|10\rangle$$</td>
            <td>$$|2\rangle$$</td>
            <td>.25</td>
        </tr>
            <tr>
            <td>$$|11\rangle$$</td>
            <td>$$|3\rangle$$</td>
            <td>.25</td>
        </tr>
    </table>
</td> 
<td style="border:0;"><big><big>READ</big></big> <big><big><big><big><big><big><big><big><big><big><big><big>&#8680;</big></big></big></big></big></big></big></big></big></big></big></big></td>
<td style="border:0;">
    <table class = 'bit-table'  style="margin:auto; width:50%" >
        <tr>
            <th>Binary</th>
            <th>Decimal</th>
            <th>State</th>
        </tr>
        <tr>
            <td>$$|00\rangle$$</td>
            <td>$$|0\rangle$$</td>
            <td>0</td>
        </tr>
        <tr>
            <td>$$|01\rangle$$</td>
            <td>$$|1\rangle$$</td>
            <td>0</td>
        </tr>
        <tr>
            <td>$$|10\rangle$$</td>
            <td>$$|2\rangle$$</td>
            <td>1</td>
        </tr>
            <tr>
            <td>$$|11\rangle$$</td>
            <td>$$|3\rangle$$</td>
            <td>0</td>
        </tr>
    </table>
</td></tr></table>
</center>
In this case we start out with a Quantum System in equal superposition across the states and once we measure it, we are solidly in the $$|2\rangle$$ state. There was only a 25% chance we would get out the $$|2\rangle$$ state. 

Just like before, if we know we are only going to be in 1 state out in the whole state space, we can reduce the table to one row.

<center>
<table  style="background-color:rgba(0, 0, 0, 0); border:0;" ><tr><td style="border:0;">
    <table class = 'bit-table' style="margin:auto; width:50%" >
        <tr>
            <th>Binary</th>
            <th>Decimal</th>
            <th>State</th>
        </tr>
        <tr>
            <td>$$|00\rangle$$</td>
            <td>$$|0\rangle$$</td>
            <td>.25</td>
        </tr>
        <tr>
            <td>$$|01\rangle$$</td>
            <td>$$|1\rangle$$</td>
            <td>.25</td>
        </tr>
        <tr>
            <td>$$|10\rangle$$</td>
            <td>$$|2\rangle$$</td>
            <td>.25</td>
        </tr>
            <tr>
            <td>$$|11\rangle$$</td>
            <td>$$|3\rangle$$</td>
            <td>.25</td>
        </tr>
    </table>
</td> 
<td style="border:0;"><big><big>READ</big></big> <big><big><big><big><big><big><big><big><big><big><big><big>&#8680;</big></big></big></big></big></big></big></big></big></big></big></big></td>
<td style="border:0;">
    <table class = 'bit-table'  style="margin:auto; width:50%" >
        <tr>
            <th>Binary</th>
            <th>Decimal</th>
            <th>State</th>
        </tr>
        <tr>
            <td>$$|10\rangle$$</td>
            <td>$$|2\rangle$$</td>
            <td>1</td>
        </tr>
    </table>
</td></tr></table>
</center>

Notice that once the Quantum System collapses, its easy to represent the Quantum State, the same as a classical state. But while the Quantum State is in superposition, $$2^n$$ rows are required to represent the state. The **state** now has as many rows as the **state space**. This is Quantum State Space Explosion and its a huge problem. 

***NOTE:** In a Quantum System the probability shown in the state column for each state can be any value between 0 and 1 as long as the whole column adds up to exactly 1. To represent the generic probability we can use $$\alpha$$ like so. 
<center>
    <table class = 'bit-table'>
        <tr>
            <th>Binary</th>
            <th>Decimal</th>
            <th>State</th>
        </tr>
        <tr>
            <td>$$|00\rangle$$</td>
            <td>$$|0\rangle$$</td>
            <td>$$\alpha_{00}$$</td>
        </tr>
        <tr>
            <td>$$|01\rangle$$</td>
            <td>$$|1\rangle$$</td>
            <td>$$\alpha_{01}$$</td>
        </tr>
        <tr>
            <td>$$|10\rangle$$</td>
            <td>$$|2\rangle$$</td>
            <td>$$\alpha_{10}$$</td>
        </tr>
            <tr>
            <td>$$|11\rangle$$</td>
            <td>$$|3\rangle$$</td>
            <td>$$\alpha_{11}$$</td>
        </tr>
    </table>
</center>

****NOTE:** The probabilities we are talking about here aren't just simple probabilities or else quantum computers would not be able to achieve anything that probabilisic computing is able to achieve. Diving deeper into that is outside the scope of this post.

## Napkin Math

Lets imagine we can represent each row of the table with a single float value. It depends on the language, but lets say that's a single float is 64 bits. If we want to simulate 32 qubits, then there will be $$2^{32}$$ rows. That's 4,294,967,296 rows multiplied by 64 bits is 274,877,906,944 bits. Or, about 34 Gigabytes.

You would need 34 Gigabytes to represent a Quantum State of 32 qubits. And each time you add another qubit the classical requirement doubles, so at 40 qubits you need 8.8 Terabytes to store the quantum state.  

This is with no optimization and the numbers can be brought down a bit through some smart manipulation of math, but its very difficult to simulate beyond a 60 qubit quantum computer on classical hardware. The table just grows too quickly. Its almost like an Exponential Explosion in the number of rows.

## Ain't nobody got time for that!
No one wants to go around creating tables for every quantum state they want to represent, so we use equations that combine elements of the **State** column and either the **Binary** or **Decimal** column. $$\psi$$ is often the greek letter we use to represent an arbitrary Quantum State.

An arbitrary equation for a 2 qubit state might look like this: $$|\psi\rangle = \alpha_{00}|00\rangle + \alpha_{01}|01\rangle + \alpha_{10}|10\rangle + \alpha_{11}|11\rangle$$ 
.

OR like this: $$|\psi\rangle = \alpha_{0}|0\rangle + \alpha_{1}|1\rangle + \alpha_{2}|2\rangle + \alpha_{3}|3\rangle$$
.

For an $$n$$ qubit state:  $$|\psi\rangle = \alpha_{0}|0\rangle + ... + \alpha_{n-1}|n-1\rangle$$
.


