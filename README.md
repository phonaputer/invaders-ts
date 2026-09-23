# Invaders Typescript

_As this was a hobby project, no LLMs were used in the generation of the source code, documentation, or assets (images,
audio) in this repository.
However, during implementation LLMs (specifically, Google search "AI Mode") were used to search through library docs
(particularly BitECS) & browser JS docs._

_This means any crap code is entirely my own fault._ 😉

---

This is a knockoff of the classic Taito game _Space Invaders_ written in [Typescript](https://www.typescriptlang.org/)
using HTML5 canvas and [BitECS](https://bitecs.dev/) for the game rendering and logic.

### Motivation

I wrote this for three reasons.

1. To see how a purely Typescript implementation would compare to my C++/Luau implementation of this project.
2. I haven't written a Javascript browser game in a while.
3. I realized all said games are on the private part of my GitHub. It would be nice to have something public on the
   chance someone wants proof I've coded an application in Typescript.

### Impressions

No new impressions about Typescript or HTML5 canvas since I've used those before.
So let me compare with the C++ Luau version of this project.

In comparison to C++, Typescript is unsurpisingly quite a bit more productive.
Of course you'll not get the same performance, but for a serious project it would be worth asking - do I really need it?

In comparison to Luau, for this particular use case I'd put the two languages on par with one another.
Both are productive and flexible enough to make it easy to write high-level game logic.
For other use cases (e.g. web), Typescript is unsuprisingly better as it's intended to be a general-purpose language
rather than an embeddable "configuration" language like Luau.
Plus TS & JS have millions of libraries for everything under the sun.

For the whole shebang, starting from scratch, Typescript is more productive.
The Luau coding in the C++ Luau project was also productive, but coding the C++ framework and bindings necessary to
support the Luau layer was slow.
I don't mind writing the framework in C++ since it's relatively small.
But the C++-to-Luau binding layer is pure overhead since it provides nothing other than glue.

This doesn't write off the C++ Luau combo though.
As mentioned above, if one really needs performance then having C++ in the mix is nice.
And perhaps more importantly for a simpler game, C++ is more crossplatform than TS.
At least as far as game console support is concerned.

### Build & Test

[Vite](https://vite.dev/) is used for building and [Vitest](https://vitest.dev/) is used for unit testing.

To build a production distribution, written out to the `dist` directory...

```
npm run build
```

To lint and unit test the code...

```
npm run verify
```

For more, see `package.json`.
