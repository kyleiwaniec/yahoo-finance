_log = (function (methods, undefined) {

    var Log = Error; // does this do anything?  proper inheritance...?
    Log.prototype.write = function (args, method) {
        /// <summary>
        /// Paulirish-like console.log wrapper.  Includes stack trace via @fredrik SO suggestion (see remarks for sources).
        /// </summary>
        /// <param name="args" type="Array">list of details to log, as provided by `arguments`</param>
        /// <param name="method" type="string">the console method to use:  debug, log, warn, info, error</param>
        /// <remarks>Includes line numbers by calling Error object -- see
        /// * http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
        /// * http://stackoverflow.com/questions/13815640/a-proper-wrapper-for-console-log-with-correct-line-number
        /// * http://stackoverflow.com/a/3806596/1037948
        /// </remarks>

        // via @fredrik SO trace suggestion; wrapping in special construct so it stands out
        var suffix = {
            "@": (this.lineNumber
                    ? this.fileName + ':' + this.lineNumber + ":1" // add arbitrary column value for chrome linking
                    : extractLineNumberFromStack(this.stack)
            )
        };

        args = args.concat([suffix]);
        // via @paulirish console wrapper
        if (window.console && console[method]) {
            if (console[method].apply) { console[method].apply(console, args); } else { console[method](args); } // nicer display in some browsers
        }
    };
    var extractLineNumberFromStack = function (stack) {
        /// <summary>
        /// Get the line/filename detail from a Webkit stack trace.  See http://stackoverflow.com/a/3806596/1037948
        /// </summary>
        /// <param name="stack" type="String">the stack string</param>

        // return the whole stack:
        // return stack;

        // correct line number according to how Log().write implemented
        if (stack) {
            var line = stack.split('\n')[3];
            // fix for various display text
            line = (line.indexOf(' (') >= 0
                ? line.split(' (')[1].substring(0, line.length - 1)
                : line.split('at ')[1]
                );
            return line;
        } else {
            return "";
        }
    };

    // method builder
    var logMethod = function(method) {
        return function (params) {
            /// <summary>
            /// Paulirish-like console.log wrapper
            /// </summary>
            /// <param name="params" type="[...]">list your logging parameters</param>

            // only if explicitly true somewhere
            if (typeof DEBUGMODE === typeof undefined || !DEBUGMODE) return;

            // call handler extension which provides stack trace
            Log().write(Array.prototype.slice.call(arguments, 0), method); // turn into proper array & declare method to use
        };//--  fn  logMethod
    };
    var result = logMethod('log'); // base for backwards compatibility, simplicity
    // add some extra juice
    for(var i in methods) result[methods[i]] = logMethod(methods[i]);

    return result; // expose
})(['error', 'debug', 'info', 'warn']);//--- _log

/* USAGE: 

// no debug mode
_log('this should not appear');

// turn it on
DEBUGMODE = true;

_log('you should', 'see this', {a:1, b:2, c:3});
console.log('--- regular log ---');
_log('you should', 'also see this', {a:4, b:8, c:16});

_log.error('this should show as an error', {a:9, b:6, c:3});
_log.debug('debug style', {a:9, b:6, c:3});
_log.info('info style', {a:99, b:67, c:35});
_log.warn('warning style', [1, 5, 7, 11]);

_log('and regular', 'again', 5);

// turn it off
DEBUGMODE = false;

_log('disabled, should not appear');
console.log('--- regular log2 ---');

*/
