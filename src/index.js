
export default function createFnlux(initialState, reducers, setState) {
  const state = [initialState];
  const asyncEvents = [];

  const apply = function(action) {
    setInternalState(applyReducers(action, state[state.length - 1]));
  };

  const applyReducers = function(action, oldState) {
    return (reducers || []).reduce((previousState, reducer) => {
      return reducer(previousState, action);
    }, oldState);
  };

  function asyncPromiseExists(asyncPromise) {
    return asyncEvents.indexOf(asyncPromise) >= 0;
  }

  const applyAsync = function(promises) {
    const asyncPromise = Promise.all(Array.isArray(promises) ? promises : [promises])
      .then(actions => {
        if (asyncPromiseExists(asyncPromise)) {
          setInternalState(
            actions.reduce((previousState, action) => {
              return applyReducers(action, previousState);
            }, state[state.length - 1])
          );
        }
      });

    asyncEvents.push(asyncPromise);
    return asyncPromise;
  };

  const cancelAsync = function(asyncPromise) {
    const index = asyncEvents.indexOf(asyncPromise);
    if (index >= 0) {
      asyncEvents.splice(index, 1);
    }
  };

  const undo = function() {
    if (state.length < 2) {
      return;
    }

    state.pop();
    const newState = state.pop();
    setInternalState(newState);
  };

  const setInternalState = function(newState) {
    state.push(newState);
    setState && setState(newState);
  };

  return {
    apply: apply,
    applyAsync: applyAsync,
    cancelAsync: cancelAsync,
    reducers: reducers,
    state: () => state[state.length - 1],
    undo: undo
  };
};
