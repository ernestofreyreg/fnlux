
export const createFnlux = function(initialState, reducers, setState) {
  const state = [initialState];

  const apply = function(action) {
    setInternalState(applyReducers(action, state[state.length - 1]));
  };

  const applyReducers = function(action, oldState) {
    return (reducers || []).reduce((previousState, reducer) => {
      return reducer(previousState, action);
    }, oldState);
  };

  const applyAsync = function(promises) {
    return Promise.all(Array.isArray(promises) ? promises : [promises])
      .then(actions => {
        setInternalState(
          actions.reduce((previousState, action) => {
            return applyReducers(action, previousState);
          }, state[state.length - 1])
        );
      });
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
    reducers: reducers,
    state: () => state[state.length - 1],
    undo: undo
  };
};
