mb-timer
============

Precision JavaScript timer for recurring events

## Description

Adds a global object `mbTimer`, which can be used in place of `setTimeout` and `setInterval` in need of more precise and self-correcting recurring timer events.

## Usage

Simply load the script into your page (`<script src='/path/to/mb-timer.min.js></script>` or using Require or any other method).

Timers can be created by calling the constructor, which takes two parameters: the duration in milliseconds between executions, and the function to execute after each delay.

    var mytimer = new mbTimer(100, function() {
        console.log('Do stuff here');
    });

The timer will need to be started by calling `mytimer.start()` (This will return your timer instance)

The timer can be stopped by calling `mytimer.stop()` (This will return your timer instance)

The timer may also be paused for a duration, and will resume automatically when that time is over.

    // Pause me for 2 seconds!
    mytimer.pause(2000);

Debug mode can be enabled by passing `true` as the first parameter to the `start` function, eg: `mytimer.start(true)` will output metrics to the console.

## Under-the-hood

Plain JS timers (`setTimeout`, `setInterval`) are relatively inaccurate. The browser takes the given duration as a 'recommendation', and will wait *at least* that long. Meaning that the following may happen 500, 504, or 2043 milliseconds after it is called.

    setTimeout(function() {
        console.log('What day is it?!')
    }, 500);

`mbTimer` works by registering its own `setTimeout` calls, and giving it a wrapped version of the user-submitted execution function. Each time the wrapper function is called, it will measure the elapsed time using the `Date` object, and register a new `setTimeout` with a reduced / increased duration to counteract any inaccuracies in the `setTimeout` function.

Three metrics are provided in debug mode: `delta`, `offset`, and `drift`.

  - `delta` is the real time elapsed between executions (using the `Date` object)
  - `offset` is the difference between the `delta` and the timer's registered delay
  - `drift` is the accumulated difference between the current time, and the expected time after the current number of executions

Ideally, both `offset` and `drift` will equal 0. Due to the nature of things, that will rarely be the case. Much more often, they will both be less than 5 milliseconds. That is still far, far better than `setInterval` can accomplish.

## Compatibility

The plugin has not yet been rigorously tested, but should work in all modern browsers, given the browser window has focus.

*NOTICE: Some browsers will reduce the importance of timer events if the browser window loses focus! This means that if a user clicks out of your browser window, events may not happen at the correct time until the window is focused again. At that time, the mbTimer will work to catch up for lost time.*

## Contact & License Info

Author: Matthew Balmer  
Twitter: [@mattbalmer](http://twitter.com/mattbalmer)  
Website: [http://mattbalmer.com](http://mattbalmer.com)  
License: MIT
