//NOTE: if any imports are declared here, the String.prototype extension needs to be declared in a module with global scope!
// Handy little snippet picked up from https://stackoverflow.com/questions/22607806/defer-execution-for-es6-template-literals
// that allows deferred literal replacement (because ES6 string literals get evaluated when they're declared)
String.prototype.format = function() {
  var args = arguments;
  return this.replace(/\$\{p(\d)\}/g, function(match, id) {
      return args[id];
  });
};

export function charIndexToWordIndex(text, charIndex){
  return text.slice(0, charIndex).split(' ').length - 1;
}

// The polling function
export function poll(fn, args,timeout, interval) {
  let endTime = Number(new Date()) + (timeout || 2000);
  interval = interval || 100;

  let checkCondition = function(resolve, reject) {
      // If the condition is met, we're done!
      fn(args,function(result){
        if(result) {
          resolve(result);
        }
        // If the condition isn't met but the timeout hasn't elapsed, go again
        else if (Number(new Date()) < endTime) {
          setTimeout(checkCondition, interval, resolve, reject);
        }
        // Didn't match and too much time, reject!
        else {
          reject(new Error('timed out for ' + fn + ': ' + arguments));
        }
      })
      //.catch (err => reject(new Error(fn + 'threw error: ',err )));
  };

  return new Promise(checkCondition);
}

export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

//Get a random element from an array
export function getRandomArrayElement(inArray){
  let randomElement = inArray[getRandomInt(0, inArray.length)];
  return (randomElement);
}
