---
title: 'About that banner'
excerpt: 'Elementary cellular automata: chaos and computation distilled to a simple basis.'
date: '2021-12-10'
author:
  name: Riley Stewart
---
I've been having a lot of fun today working on the banner for this blog.  My creation is a visualisation of elementary cellular automata, with each column being a state that wraps around, and the next state being to the right of the previous one.  If you click on it, you should be able to see some controls for changing various parameters, most interesting being the rule.

Checkout out [Wolfram's page](https://mathworld.wolfram.com/ElementaryCellularAutomaton.html) for more details about their operation.  I feel especially confident pointing there because Stephen Wolfram was the original discoverer and namer of elementary cellular automata.  The banner, by default, displays rule 30, perhaps the most famous among them.  Rule 30 exhibits the property of chaos, where future states cannot be predicted from the starting state other than by running through them, as [sexily explained by Jeff Goldblum in *Jurassic Park*](https://www.youtube.com/watch?v=n-mpifTiPV4).  It's fascinating that out of a few rules a simple system can degenerate into something unpredictable so quickly, and even be a [source for cryptographic randomness](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.89.6724&rep=rep1&type=pdf).

But the weirdness with these simple automata doesn't stop there - Wolfram also showed that [rule 110 is capable of universal computation](https://www.wolframscience.com/nks/notes-11-8--history-of-universality-in-1d-cellular-automata/)!  Reduction to the basis of the Turing machine is the basis of proofs of computational singularity, as with [Conway's Game of Life](http://rendell-attic.org/gol/tm.htm) and [brainfuck](http://brainfuck.org/urmutm.b).  Of course actual silicon computation has a much more pragmatic basis but the theoretical notion of computability has immense importance across many domains.

There's a lot of diversity across the 256 possible rules.  Many of them produce relatively linear patterns or quickly halt, especially with smaller window sizes.  Others are reflections or inversions of other rules.  Rules like 90 create Sierpinski triangles of Zelda fame.  The behavior is probably one of the simplest examples of emergence, complex patterns arising out of a few simple rules.  Most comple
