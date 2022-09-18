---
title: 'From Prototypes to Classes'
excerpt: "What's object-oriented programming really about?"
date: '2022-09-14'
author:
  name: Riley Stewart
---


The term 'object-oriented programming' is the source of a great deal of confusion. One of the most common definitions centers around classes as experienced in typical OOP languages like Java, C++, Ruby, and Smalltalk. A lot of software has been built where the concept of object is strongly related to that of class.

![Even Google gets fooled](/assets/blog/fromprototypestoclasses/google.png)

<figcaption>Google offers this questionable definition in the search info box.</figcaption>

Yet, there exist languages that are object-oriented but lack these concepts. In them, objects inherit directly from other objects through delegating to prototypes. The best known example of this is (pre-ES6) Javascript, where constructor functions serve to build objects and organize methods. In this way, object behavior can be specialized without having to define a new class, instead preempting delegation by simply setting a property. A tortured example:

```
function Person(name) {
  this.name = name;
}

Person.prototype.greeting = function() {
  return `Hi ${this.name}`;
}

let test = new Person('Tester');
console.log(test.greeting()); // Hi Tester

test.greeting = function() {
  return `What's up ${this.name}`;
}

console.log(test.greeting()); // What's up Tester
```

In this way, the behavior of the `test` object was changed by directly changing the object itself, because the `greeting` method being called is just a property. Delegation operates by querying for missing properties in the prototype, going up the chain until that prototype doesn't have a next one. Functions are first-class objects bound to the receiver but otherwise the semantics are the same.

In Javascript, it is easy (but dangerous) to extend the base types.
```
String.prototype.end = function() {
  return this[this.length - 1];
}

console.log('hmm?'.end()) // ?
```


<figcaption>This is considered bad practice, but it demonstrates the power of the system.</figcaption>

This style of programming wasn't loved by programmers, especially those coming from a C++ or Java class-based background. The first attempt to bring classes to Javascript was in the [failed Ecmascript 4 standard](https://en.wikipedia.org/wiki/ECMAScript#4th_Edition_(abandoned)), which [struck David Ungar](https://mail.mozilla.org/pipermail/es-discuss/2007-November/004998.html) with "the richness of the additions to the language", adding classes, interfaces, a nominal and structural type system, multimethods, namespacing, packages, generics, and perhaps most radical of all, integers. Brendan Eich tried to dissuade [programmers convinced that Javascript was becoming its namesake](https://web.archive.org/web/20080516222951/http://www.dustindiaz.com/java-in-our-script) in a [@media Ajax Keynote](https://brendaneich.com/2007/11/my-media-ajax-keynote/):

> I hold no brief for Java. JS does not need to look like Java. Classes in JS2 are an integrity device, already latent in the built-in objects of JS1, the DOM, and other browser objects. But I do not believe that most Java U. programmers will ever grok functional JS, and I cite [GWT](https://code.google.com/webtoolkit/) uptake as supporting evidence. This does not mean JS2 panders to Java. It does mean JS2 uses conventional syntax for those magic, built-in “classes” mentioned in the ES1-3 and DOM specs.
> 
> In other words, and whatever you call them, something like classes are necessary for integrity properties vital to security in JS2, required for bootstrapping the standard built-in objects, and appropriate to a large cohort of programmers. These independent facts combine to support classes as proposed in JS2.

For a variety of reasons, the ES4 proposal was ultimately abandoned for ES3.1, but many of the ideas from ES4 were carried on in [ECMAScript Harmony](https://mail.mozilla.org/pipermail/es-discuss/2008-August/003400.html). Eventually, they become the nice features that have made Javascript one of the most popular programming languages today (and ever). The classes, however, were reeled in, as the Harmony proposal explains:

> Other goals and ideas from ES4 are being rephrased to keep consensus in the committee; these include a notion of classes based on existing ES3 concepts combined with proposed ES3.1 extensions.

So, no more multimethods, `this` is still required for scoping, and no nominal or structural type system (though TypeScript would bring that later). ES6 classes can be nice but they aren't very flexible, especially compared to those of Smalltalk or CLOS. The triumph of React hooks over classes in an area where they typically excel is a clear indictment of their shortcomings.

It's quite easy to extend the original prototypical semantics into a class-based system, which was done some ancient frameworks like [Prototype](https://en.wikipedia.org/wiki/Prototype_JavaScript_Framework) (used in [Ruby on Rails](https://rubyonrails.org/2007/1/19/prototype-1-5-now-with-a-manual)) and [MooTools](https://en.wikipedia.org/wiki/MooTools) (used by [Bret Victor](http://worrydream.com/Tangle/download.html)). However, they still lack macros/syntax-level metaprogramming so using them was awkward. They ultimately died off with the advent of ES6 classes.

This flexible object system and first class functions make Javascript an attractive target for compilation of a higher level language, as Alan Kay recently mused about at the recent event celebrating the [50th anniversary of Smalltalk](https://youtu.be/3_bJyXfjztA?t=3019):

> ...Javascript is a little bit of a hodgepodge, but underneath, it has both a model that I think of as being a bit more like Lisp, and a really solid set of foundations, including a really great garbage collector, fabulous optimization. So it's a little bit of a scattershot of a language, but as something to treat, for example, as the machine code of the next machine you want to turn into something wonderful, Javascript is actually pretty good for the reasons that Lisp is pretty good. You've got this dynamic language, something where things run pretty fast, you've got WebAssembly if you want to make things run even faster. It, in my opinion, is probably the simplest place for both doing experiments and doing things that you want to deploy today.

<figcaption>The audio was difficult to understand so I hope I've trascribed it correctly.</figcaption>

WASM might eventually be a target for languages on the Web, but for now it lacks a lot compared to Javascript, like GC and JIT support, and isn't even [that much faster](https://zaplib.com/docs/blog_post_mortem.html) besides in some special cases. Some aspects, like W^X, make implementing a dynamic, incremental language much more difficult. Meanwhile, Javascript has been optimized to run within an order of magnitude of system languages.

Before Javascript, there was [Self](https://bibliography.selflanguage.org/_static/self-power.pdf). Self was inspired by Smalltalk, especially in its approach to message passing:

> Self features message passing as the fundamental operation, providing access to stored state solely via messages. There are no variables, merely slots containing objects that return themselves. Since Self objects access state solely by sending messages, message passing is more fundamental to Self than to languages with variables.

This mirrors Alan Kay's later [famed email](http://lists.squeakfoundation.org/pipermail/squeak-dev/1998-October/017019.html), where he clarifies that Smalltalk "is not even about classes", but rather messaging. Self exists on this more fundamental layer of objects, though it is able to ascend back to the higher level of class-based abstraction. Indeed, later in the project it was shown that both [Smalltalk and Java](http://merlintec.com/vmworkshop99/sub.pdf) could be implemented in Self, a feat which happened to produce a faster Smalltalk implementation. The Self VM pioneered techniques in optimization, culminating in Urs Hölzle's [runtime type feedback](https://bibliography.selflanguage.org/_static/type-feedback.pdf), which would later be put to use in the V8 Javascript VM by fellow Self VM wizard Lars Bak.

![Smalltalk in Self](/assets/blog/fromprototypestoclasses/smalltalk.png)

<figcaption>An example of Smalltalk in Self. A lot of the complexity here is from Smalltalk's class variables.</figcaption>


[Strongtalk](https://dl.acm.org/doi/pdf/10.1145/167962.165893) was a type-checked version of Smalltalk built on the Self VM. Originally created when Sun shuttered the Self team, it was ultimately bought back by Sun and became the HotSpot JVM. This fate seems to have disappointed the Smalltalk community, at least as I gather from [an aside by Dan Ingalls at the aforementioned Smalltalk event](https://youtu.be/3_bJyXfjztA?t=3528). It had a very smart type system that supported the flexibility of Smalltalk, but the Smalltalk ecosystem had [collapsed](https://gbracha.blogspot.com/2020/05/bits-of-history-words-of-advice.html) with the rise of Java and the Web, and by the time Strongtalk was open-sourced, its moment had passed.

There's one more prototypical language worth mentioning - [Newtonscript](https://en.wikipedia.org/wiki/NewtonScript), developed for the ahead-of-its-time Apple Newton. Prototypes offered a way to save on precious memory (the original launched with 640K RAM) and were fast enough for the modest processor. Simple GUI scripting was afforded for in the object system, where objects contained a normal prototype slot as well as a parent slot that was used for view inheritance. The parent slot was later found useful for [an informal class system](http://waltersmith.us/newton/Class-based%20NewtonScript%20Programming.pdf) extensively used on the Newton. 

What's interesting about these examples is that none were deliberately designed to be turned into a class system, yet they all accomodated one. Prototypes appear to be a more primitive inheritance mechanism than classes, which are moreso a very useful design pattern - it's just hard to see as they're so ingrained within their languages. When they were introduced, they were necessary for implementation on limited hardware and helpful for organizing behavior, so they remained key features in later languages, just as how those languages retained structured conditionals and loops while Smalltalk and Lisp showed that they could be integrated into the base language quite easily. This mixing of metaphors often leads to experienced programmers coming from the procedural side developing a bad taste for OOP, seeing it as something just getting in their way.

Object-oriented programming shouldn't be defined in terms of classes - refer to that as class-based programming. Instead, as [Alan Kay said](http://worrydream.com/EarlyHistoryOfSmalltalk/), the "whole point of OOP is not to have to worry about what is inside an object". Encapsulation is the ultimate goal and messaging is the means. This lets programmers drop into the shoes of objects and [reason about how they work](https://www.tech.dmu.ac.uk/~mjdean/notes/modules/education/EDUC2323/syntonicity2.pdf) just like children learning LOGO can reason about the turtle as it moves. A skill like programming is much more graspable if the user can bring in experiences from other domains, as metaphors and points of view. The success of object-oriented programming is not some conspiracy - it acknowledges the human at the other end and helps them build a world of meaning in software.
