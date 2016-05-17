import expect from 'expect.js';
import { createFnlux } from '../../src/index';

describe('fnlux basic store', () => {
  const sumReducer = function(state, action) {
    if (!action.a || !action.b) {
      return state;
    }

    return Object.assign({}, state, {c: action.a + action.b});
  };

  const subReducer = function(state, action) {
    if (!action.a || !action.b) {
      return state;
    }

    return Object.assign({}, state, {d: action.a - action.b});
  };

  const asyncAction = function(time) {
    return new Promise(function(fullfiled, rejected) {
      setTimeout(() => {
        const action = {a: 6, b: 7, time: time || 5000};
        fullfiled(action);
      }, time || 5000);
    });
  };

  it('creates a empty fnlux', () => {
    const flux = createFnlux();
    expect(flux).to.be.ok();
  });

  it('creates a initial state only fnlux', () => {
    const flux = createFnlux({});
    flux.apply({a: 3, b: 5});
  });

  it('creates a initial state fnlux', () => {
    const setState = function(state) {
      expect(state).to.be.ok();
      expect(state.c).to.be(8);
      expect(state.d).to.be(2);
    };

    const flux = createFnlux({d: 2}, [sumReducer], setState);
    flux.apply({a: 3, b: 5});
    expect(flux.state().c).to.be(8);
  });

  it('creates a basic fnlux', () => {
    const setState = function(state) {
      expect(state).to.be.ok();
      if (state.c) {
        expect(state.c).to.be(8);
      }
    };

    const flux = createFnlux({}, [sumReducer], setState);
    flux.apply({a: 3, b: 5});
  });

  it('applies several actions', () => {
    const setState = function(state) {
      expect(state).to.be.ok();
    };

    const flux = createFnlux({}, [sumReducer], setState);
    flux.apply({a: 3, b: 5});
    flux.apply({a: 13, b: 15});
    flux.apply({a: 29, b: 14});
    expect(flux.state().c).to.be(43);
  });

  it('add reducer to reducer list after creation', () => {
    let finalApply = false;

    const setState = function(state) {
      expect(state).to.be.ok();
      if (finalApply) {
        expect(state.d).to.be.ok();
      }
    };

    const flux = createFnlux({}, [sumReducer], setState);
    flux.apply({a: 3, b: 5});
    flux.reducers.push(subReducer);
    finalApply = true;
    flux.apply({a: 29, b: 14});
  });

  it('apply async action', () => {
    const setState = function(state) {
      expect(state).to.be.ok();
    };

    const flux = createFnlux({}, [sumReducer], setState);
    const promise = asyncAction();
    return flux.applyAsync([promise]);
  });

  it('apply several async actions', () => {
    const setState = function(state) {
      expect(state).to.be.ok();
    };

    const flux = createFnlux({}, [sumReducer], setState);
    const promise3 = asyncAction(3000);
    const promise5 = asyncAction(5000);
    return flux.applyAsync([promise3, promise5]);
  });

  it('undo', () => {
    const setStateBuilder = function() {
      const states = [];

      return function(state) {
        states.push(state);
        expect(state).to.be.ok();
        if (states.length === 3) {
          expect(states[0].c === states[2].c).to.be(true);
          expect(states[0].c === states[1].c).to.be(false);
        }
      }
    };

    const flux = createFnlux({}, [sumReducer], setStateBuilder());
    flux.apply({a: 3, b: 5});
    flux.apply({a: 13, b: 15});
    flux.undo();
  });
});
