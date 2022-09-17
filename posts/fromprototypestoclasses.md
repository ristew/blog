---
title: 'From Prototypes to Classes'
excerpt: ''
date: '2022-09-14'
author:
  name: Riley Stewart
---


The term 'object-oriented programming' is the source of a great deal of confusion. One of the most common definitions centers around classes as experienced in typical OOP languages like Java, C++, Ruby, and Smalltalk. A lot of software has been built where the concept of object is strongly related to that of classes.

![Even Google gets fooled](/assets/blog/fromprototypestoclasses/google.png)

<figcaption>Google offers this questionable definition in the search info box.</figcaption>

Yet, there exists another class of languages that are object-oriented but lack these concepts. Behavior is held in objects themselves, and shared directly with other objects through prototypes. The best thisknown example of this is (pre-ES6) Javascript where constructor functions build objects and organize methods. In this way, object behavior can be specialized without having to define a new class, instead preempting delegation by simply setting a property. A tortured example:

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
  return `What's up ${ .name}`;
}

console.log(test.greeting()); // What's up Tester
```

In this way, the behavior of the `test` object was changed by directly changing the object itself, because the method being called is just a property on the object subject to delegation. In this system, it is easy (but dangerous) to extend the base types.
```
String.prototype.end = function() {
  return this[this.length - 1];
}

console.log('hmm?'.end()) // ?
```

This is considered bad practice, but it demonstrates the power of the system. Objects do not have a class and expose all their fields, in flagrant violation of the common definition. While it's idiomatic to prefix private fields with a `_`, they are still visible to consumers.

This style of programming wasn't loved by programmers, especially those coming from a C++ or Java class-based background. The first attempt to bring classes to Javascript was in the [failed Ecmascript 4 standard](https://en.wikipedia.org/wiki/ECMAScript#4th_Edition_(abandoned)), which was a grand doubling of the language that [struck David Ungar](https://mail.mozilla.org/pipermail/es-discuss/2007-November/004998.html) with "the richness of the additions to the language", adding classes, interfaces, a nominal and structural type system, multimethods, namespacing, packages, generics, and perhaps most radical of all, integers. Brendan Eich tried to dissuade [programmers convinced that Javascript was becoming its namesake](https://web.archive.org/web/20080516222951/http://www.dustindiaz.com/java-in-our-script) in a [@media Ajax Keynote](https://brendaneich.com/2007/11/my-media-ajax-keynote/):

> I hold no brief for Java. JS does not need to look like Java. Classes in JS2 are an integrity device, already latent in the built-in objects of JS1, the DOM, and other browser objects. But I do not believe that most Java U. programmers will ever grok functional JS, and I cite [GWT](https://code.google.com/webtoolkit/) uptake as supporting evidence. This does not mean JS2 panders to Java. It does mean JS2 uses conventional syntax for those magic, built-in “classes” mentioned in the ES1-3 and DOM specs.
> 
> In other words, and whatever you call them, something like classes are necessary for integrity properties vital to security in JS2, required for bootstrapping the standard built-in objects, and appropriate to a large cohort of programmers. These independent facts combine to support classes as proposed in JS2.

For a variety of reasons, the ES4 proposal was ultimately abandoned for ES3.1, but many of the ideas from ES4 were carried on in [ECMAScript Harmony](https://mail.mozilla.org/pipermail/es-discuss/2008-August/003400.html) and eventually become the nice features that have made Javascript one of the most popular programming languages. The classes, however, were reeled in, as the Harmony proposal explains:

> Other goals and ideas from ES4 are being rephrased to keep consensus in the committee; these include a notion of classes based on existing ES3 concepts combined with proposed ES3.1 extensions.

So, no more multimethods, `this` is still required for scoping, and no nominal or structural type system (though TypeScript would bring that later). ES6 classes can be nice but they aren't very flexible, especially compared to those of Smalltalk or CLOS. This explains the triumph of React hooks over classes in an area where they typically excel. 

Thankfully, it's quite easy to extend the original prototypical semantics into a class-based system, which was done some ancient frameworks like [Prototype](https://en.wikipedia.org/wiki/Prototype_JavaScript_Framework) (used in [Ruby on Rails](https://rubyonrails.org/2007/1/19/prototype-1-5-now-with-a-manual)) and [MooTools](https://en.wikipedia.org/wiki/MooTools) (used by [Bret Victor](http://worrydream.com/Tangle/download.html)). However, they still lack macros/syntax-level metaprogramming, so these libraries weren't very popular and died off with the advent of ES6 classes.

Javascript is an attractive target for compilation of a higher level language, as Alan Kay recently mused about at the recent event celebrating the [50th anniversary of Smalltalk](https://youtu.be/3_bJyXfjztA?t=3019) (his audio was difficult to understand but I believe I've trascribed it correctly):

> ...Javascript is a little bit of a hodgepodge, but underneath, it has both a model that I think of as being a bit more like Lisp, and a really solid set of foundations, including a really great garbage collector, fabulous optimization. So it's a little bit of a scattershot of a language, but as something to treat, for example, as the machine code of the next machine you want to turn into something wonderful, Javascript is actually pretty good for the reasons that Lisp is pretty good. You've got this dynamic language, something where things run pretty fast, you've got WebAssembly if you want to make things run even faster. It, in my opinion, is probably the simplest place for both doing experiments and doing things that you want to deploy today. I wouldn't run Javascript now, even though I could complain about not having a strident metasystem to allow a really good debugger to be written in itself. That's always a test of a language - Smalltalk passed that test and most other languages don't.


Before Javascript, there was [SELF](https://bibliography.selflanguage.org/_static/self-power.pdf). Self was inspired by Smalltalk, especially in its approach to message passing:

> SELF features message passing as the fundamental operation, providing access to stored state solely via messages. There are no variables, merely slots containing objects that return themselves. Since SELF objects access state solely by sending messages, message passing is more fundamental to SELF than to languages with variables.

This mirrors Alan Kay's later [famed email](http://lists.squeakfoundation.org/pipermail/squeak-dev/1998-October/017019.html), where he clarifies that Smalltalk "is not even about classes", but rather messaging. SELF exists on this more fundamental layer of objects, though it is able to ascend back to the higher level of class-based abstraction. Indeed, later in the project it was shown that both [Smalltalk and Java](http://merlintec.com/vmworkshop99/sub.pdf) could be implemented in SELF, a feat which happened to produce a faster Smalltalk implementation. 

![Smalltalk in SELF](/assets/blog/fromprototypestoclasses/smalltalk.png)

<figcaption>An example of Smalltalk in SELF. A lot of the complexity here is from Smalltalk's class variables.</figcaption>

[Strongtalk](https://dl.acm.org/doi/pdf/10.1145/167962.165893) was a type-checked version of Smalltalk built on the SELF VM, optimized by the VM wizards Urs Hölzle and Lars Bak (who would go on to lead V8 and Dart). Originally created when Sun shuttered the SELF team, it was ultimately bought back by Sun and became the HotSpot JVM. This fate seems to have disappointed the Smalltalk community, at least as I gather from [an aside by Dan Ingalls at the aforementioned Smalltalk event](https://youtu.be/3_bJyXfjztA?t=3528). It had a very smart type system that supported the flexibility of Smalltalk, but the Smalltalk ecosystem had [collapsed](https://gbracha.blogspot.com/2020/05/bits-of-history-words-of-advice.html) with the rise of Java and the Web, and by the time Strongtalk was open-sourced, its moment had passed.

There's one more prototypical language worth mentioning - [Newtonscript](https://en.wikipedia.org/wiki/NewtonScript), developed for the ahead-of-its-time Apple Newton. Prototypes offered a way to save on precious memory (the original launched with 640K RAM) and were fast enough for the modest processor. Simple GUI scripting was afforded for in the object system, where objects contained a normal prototype slot as well as a parent slot that was used for view inheritance. The parent slot was later found useful for [an informal class system](http://waltersmith.us/newton/Class-based%20NewtonScript%20Programming.pdf) extensively used on the Newton. 

None of the prototype systems were deliberately designed to be turned into a class system.

Raising Javascript to Self with clone and multiple delegation via Proxy.

Classes are the ultimate design pattern.
