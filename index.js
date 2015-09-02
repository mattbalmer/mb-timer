/*
 * mb-timer v0.1.2
 * Precision JavaScript timer for recurring events.
 * (c) 2014 Matthew Balmer http://mattbalmer.com
 * License: MIT
 */
var mbTimer = {};

/**
 * mbTimer Constructor
 * @param delay milliseconds between execution
 * @param func function to execute at each interval
 * @constructor
 */
mbTimer = function(delay, func) {
    this.delay = delay;
    this.func = func;
};

/**
 * Stops the timer from running.
 * @returns {mbTimer}
 */
mbTimer.prototype.stop = function() {
    this.paused = true;

    return this;
}

/**
 * Starts the timer.
 * @param [debug] if true - will console.log() execution details
 * @returns {mbTimer}
 */
mbTimer.prototype.start = function(debug) {
    this.paused = false;
    var start, ticks = 0, first = new Date(), s = this, func = s.func, delay = s.delay;

    function tick(drift) {
        var next = new Date(start.getTime() + delay);
        ticks++;

        function _debug(now, drift) {
            var delta = now - start;
            var offset = delta - delay;

            console.log('delta: ', delta,
                'offset: ', offset,
                'drift: ', drift);
        }

        setTimeout(function() {
            if(s.paused) return;

            var now = new Date();
            var expected = ticks * delay;
            var actual = new Date() - first;
            var drift = actual - expected;

            if(debug) {
                _debug(now, drift);
            }

            start = now;
            tick(drift);

            func();
        }, delay - drift);
    }

    start = new Date();
    tick(0);

    return this;
}

/**
 * Pauses the timer. mbTimer will automatically resume after the specified duration.
 * @param duration milliseconds to pause the timer for.
 * @returns {mbTimer}
 */
mbTimer.prototype.pause = function(duration) {
    var timer = this;

    var pausembTimer = new mbTimer(duration, function() {
        timer.start();
        this.stop();
    });

    timer.stop();
    pausembTimer.start();

    return this;
}

module.exports = mbTimer;
