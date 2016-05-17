
export const createFnlux = function(initialState, reducers, setState) {
  const state = [initialState];

  const applyReducers = function(action) {
    let newState = state[state.length - 1];

    (reducers || []).forEach(reducer => {
      newState = reducer(newState, action);
    });

    setInternalState(newState);
  };

  const applyAsync = function(promises) {
    return Promise.all(promises).then(actions => {
      actions.forEach(action => {
        applyReducers(action);
      });
    });
  };

  const setInternalState = function(newState) {
    state.push(newState);
    setState && setState(newState);
  };

  const undo = function() {
    state.pop();
    const newState = state.pop();
    setInternalState(newState);
  };

  return {
    apply: applyReducers,
    applyAsync: applyAsync,
    reducers: reducers,
    state: () => state[state.length - 1],
    undo: undo
  };
};
