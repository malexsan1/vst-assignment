# VST Technical Interview / Take Home Task

## Build a one-page app to drag, drop and rescale a single HTML element

Note: 3 -4 hours is the most time you should spend on this task (i.e. doable in an evening)

### Expectations

- Typescript
- Use this for keeping track of the pointers https://github.com/GoogleChromeLabs/pointer-tracker
- `npm i && npm start` are the only thing that need to be done to get the app running
- It's sent back either as a zip file (with the node_modules folder removed) or as a link to a git repo

### Functionality (in priority order)

1. Drag the element around using a single finger/pointer
2. Add a button that smoothly animates the original element back to the centre
3. Resize the element using two fingers (ideally this works nicely with 1.)
4. Keep the edges of the target element within a bounded region which is 20px from the edges of the screen (what happens when the screen is resized?)
5. Prevent the target element from getting resized to more than 4x, nor less than 1/4 of its original size

### FAQ

- Q: Does all the functionality need to be implemented to “pass” this test?
  A: No, definitely not. A well-written implementation that just does #1 is better than a buggy implementation of all of it.
- Q: Should I write tests?
  A: If you want, but good typings probably offer better cost/benefit in terms of safety here
- Q: Does it matter what it looks like?
  A: There’s like 3 HTML elements here max. But yeah, pick a nice colour, maybe a 2px border-radius.
- Q: Can I [read this](https://github.com/GoogleChromeLabs/pinch-zoom/blob/master/lib/pinch-zoom.ts)?
  A: How can I possibly stop you?
- Q: Should I use React?
  A: Only if you’re a real glutton for punishment / want to show off / are happy to spend a lot of time on this. Sure.
- Q: ChatGPT?
  A: LLMs crush this type of question - use it if you want, but it's normally fairly clear when people have and often results in having a hard time when asked to modify it during the subsequent interview stage.
