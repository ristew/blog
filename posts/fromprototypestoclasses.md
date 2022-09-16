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

Yet, there exists another class of languages that are object-oriented but lack these concepts. They center around delegation, where objects are not instances of classes but instead share behavior in prototypes. The best known example of this is Javascript where constructor functions build objects and organize methods (though eventually ES6 classes were added, which are built on prototypes). In this way, object behavior can be specialized without having to define a new class, instead preempting delegation by simply setting a property. A tortured example:

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

So, no more multimethods, `this` is still required for scoping, and no nominal or structural type system (though TypeScript would bring that later). ES6 classes can be nice but they aren't very flexible, especially compared to those of Smalltalk or CLOS. This explains the triumph of React hooks over classes in an area where classes typically shined.

Javascript classes, ES4 and ES6

Before Javascript, there was Self, a prototypical language that took a much more principled stance. 

Smalltalk in Self + Java

Newtonscript, class based programming

None of the prototype systems were deliberately designed to be turned into a class system.

Raising Javascript to Self with clone and multiple delegation via Proxy.
