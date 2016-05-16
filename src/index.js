
export const createFnux = function(initialState, reducers, setState) {
  let state;

  const applyReducers = function(action) {
    let newState = state;

    (reducers || []).forEach(reducer => {
      newState = reducer(newState, action);
    });

    setInternalState(newState);
  };

  const applyAsync = function(promises) {
    return Promise.all(promises).then(action => {
      applyReducers(action);
    });
  };

  const setInternalState = function(newState) {
    state = newState;
    setState && setState(state);
  };

  setInternalState(initialState);

  return {
    apply: applyReducers,
    applyAsync: applyAsync,
    reducers: reducers,
    state: state
  };
};
