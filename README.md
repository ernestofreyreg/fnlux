# fnlux

[![Build Status](https://travis-ci.org/ernestofreyreg/fnlux.svg?branch=master)](https://travis-ci.org/ernestofreyreg/fnlux)

The functional redux-like flux alternative for complex reusable 
components.

## Creating a fnlux store.

You can create **fnlux** store with the `createFnlux` function, once created you can then apply actions that will get processed by the reducer functions defined:

```
import { createFnlux } from 'fnlux';

const sumReducer = function(state, action) {
	if (action.type !== 'SUM') {
		return state;
	}
	
	return Object.assign({}, state, {c: action.a + action.b});
}

const flux = createFnlux({}, [sumReducer]);
flux.apply({type: 'SUM', a: 4, b: 5});

const storeState = flux.state();  // {c: 9}  
```

Reducer functions are easy to test individually, they get applied in the same order you defined in the creation process. (although is possible to modify the reducer functions array after creation time)

## Using fnlux with React

**fnlux** was created to support the creation of complex reusable components on React. 

Some react components tend to be complex enough that demands the use of a flux library to handle its states. If you plan to build truly reusable components then including a flux library on the component itself make them dependable of that library limiting is reusability. 

Using **fnlux** with React is simple, we added a third parameter to the `createFnlux` function specifying the `setState` function, that is a function that will receive the new component state.

```
export const startGameReducer = function(state, action) {
  if (action !== 'START_GAME') {
    return state;
  }
  
  return Object.assign({}, state, {playing: true, loading: false, canvas: createGameCanvas(10, 10)});
};

export const loadingGameReducer = function(state, action) {
  if (action !== 'LOADING_GAME') {
    return state;
  }

  return Object.assign({}, state, {loading: true});
};


export default class App extends React.Component {
  constructor() {
    super();
    this.fnlux = createFnlux(
      {playing: false, loading: false}, 	// Initial state
      [
        startGameReducer,					// Reducer list
        loadingGameReducer
      ],
      this.setState.bind(this)				// setState binding
    );
    this.state = this.fnlux.state();
  }

  handleStartGameButton = () => {
  	this.fnlux.apply('LOADING_GAME');
  	
  	BackendAsyncCall(...).then(() => {
  	  this.fnlux.apply('START_GAME');
  	});
  };

  render() {...}
}
```

The `apply()` function accepts any type of argument, it depends only on how you make your reducer functions.

### Undo

By default **fnlux** supports undo function. Just call the proper method.

```
this.fnlux.undo();
```
