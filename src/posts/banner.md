---
title: 'About that banner'
excerpt: 'Elementary cellular automata as ornament'
date: '2021-12-13'
author:
  name: Riley Stewart
---
(Note: this post refers to a banner that is no longer on this site)



I've been having a lot of fun in the past few days working on the banner for this blog.  It's a visualisation of elementary cellular automata, with each vertical strip being a state and the next state being to the right of the previous one.  If you click on it, you should be able to see some controls for changing various parameters, most interesting being the rule.  But let me explain first what this is and why I think it matters.

### The basic science

The automata are essentially a mapping of 8 possible states into a new boolean state, with the determining state being composed of the present value of the cell as well as its 2 neighbors.  Each rule is an encoding of the 8 possible transitions into an 8-bit integer, with the possible values being 0-255.  Check out [Wolfram's page](https://mathworld.wolfram.com/ElementaryCellularAutomaton.html) for more details about their operation.  I feel especially confident pointing there because Stephen Wolfram was the original investigator and namer of elementary cellular automata.

The banner, by default, displays rule 30, perhaps the most famous among them.  Rule 30 exhibits the property of chaos. Future states cannot be predicted from the starting state other than by running through them and are very sensitive to initial conditions.  Famously and [sexily explained by Jeff Goldblum in *Jurassic Park*](https://www.youtube.com/watch?v=n-mpifTiPV4), it underlies the dynamics in real world nonlinear complex systems, the noise out of which higher structures arise from self-ordering.  I find it fascinating that out of a few rules a simple system can degenerate into something unpredictable so quickly, and even be a [source for cryptographic randomness](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.89.6724&rep=rep1&type=pdf), which I apply here with the seed parameter in order to generate a random initial state.

But the weirdness with these simple automata doesn't stop there - Wolfram also established that [rule 110 is capable of universal computation](https://www.wolframscience.com/nks/notes-11-8--history-of-universality-in-1d-cellular-automata/)!  Arguably it is the simplest set of rules that are capable of universal computation, along with the Turing machine, [Conway's Game of Life](http://rendell-attic.org/gol/tm.htm) and [brainfuck](http://brainfuck.org/urmutm.b).  Of course actual silicon computation has a much more pragmatic basis but the theoretical notion of computability has immense importance across many domains.  Rule 110 especially shines in larger environments - try with a small cell size and a large window size and watch where different patterns emerge and interact, sloping lines drifting into each other in a stable medium.

There's a lot of diversity across the 256 possible rules.  Many of them produce relatively linear patterns or quickly halt, especially with smaller window sizes.  Others are reflections or inversions of other rules.  Rule 90 creates Sierpinski triangles of Zelda fame.  Try setting the seed to 0 to see the crystalline structures that emerge from the simplest basis, and also try adjusting the window size to see how the amount of space available for the automata can have a large influence on the patterns that emerge.  As the number of possible states is 2<sup>window size</sup>, there is hypothetically always a cycle where a state will eventually repeat and there is no memory involved, but for large enough states this number is very large - 2<sup>51</sup>, the default window size for my banner, is 2,251,799,813,685,248.  Refer to the [aforementioned randomness paper](http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.89.6724&rep=rep1&type=pdf) for a more mathmatical treatment of all this.

So, if you haven't yet, go ahead and click on the banner - that should bring up the controls.  From there you can change a few parameters: the rule number, window size, cell size, and seed.  I recommend playing around with the rule number and window size to see the different kind of structures that emerge from either seed 0, which means one bit and the rest zeroes, or various random seeds.

### Technical details
([code for automata](https://github.com/ristew/blog/blob/main/lib/wolfram.js), [code for component](https://github.com/ristew/blog/blob/main/components/banner.js))

I decided not to look at any other implementations of the automata, so some parts may be a little weird, but they produce accurate results so I'm happy with them.  First, the rule number is converted to an array of booleans akin to its binary representation.  Then, to determine the next state of the cell, we find the numeric value of the binary representation of the 3 determinant cells - the cell in question and its two neighbors - wrapping around if our cell is at the beginning or end of the window.  Using this, the corresponding rule in the boolean array is the state of the cell in the next step.  Essentially, each rule is an encoding of a truth table for the 8 possible states the determinant can be in.

The component is rendered with the browser Canvas API, which I found mostly enjoyable to use given that I render everything on one go.  The main issue was that by default the pixels are scaled oddly and look blurry because the canvas is scaled to the size of the window; to fix, the canvas' `width` and `height` attributes are specified based on the actual layout size and screen DPI.  This is all based on [this helpful post](https://medium.com/wdstack/fixing-html5-2d-canvas-blur-8ebe27db07da) - I wish all web shenanigans had such writeups.

As I mentioned earlier, the random initial states based off the seed are generated by the automata themselves.  The way the seed works is by creating a child instance with the same window size always in rule 30, then iterating seed times and using that state for the initial one in the parent.  I also ensure that the seed is greater than the window size so the final state is filled.

I have a few ideas for what to add in the future when I decide to come back to it.  I'd like to add some mechanism of persistence for settings, essentially letting people customize it for when they return to this blog.  What would be really cool is adding animation - I tried to with the basic Canvas APIs and I couldn't get a result I was happy with - the animation kept looking choppy and brought my so-so laptop to a crawl, but if I could get it to be smooth and fast while scrolling across the screen like a tape I would be happy, though it would have to be off by default lest I become a peddler of distractions.

Honestly, it feels really good to do some creative coding instead of pragmatic work.  As much as I love my role as a cloud plumber, there's a lot less sheer fun involved debugging system bugs compared to creating an interactive visualization.  Hopefully it's fun for you too. I'm confident the banner will stay atop my blog for a long time, continuing to motivate me to find chaos and emergence in all kinds of places.
