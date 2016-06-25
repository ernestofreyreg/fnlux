# fnlux

[![Build Status](https://travis-ci.org/ernestofreyreg/fnlux.svg?branch=master)](https://travis-ci.org/ernestofreyreg/fnlux)

The functional redux-like flux alternative for complex reusable 
components.

## Updated in version ^0.1.6 **Breaking change**

In versions 0.1.5 and lower the ES6 way to import the createFnLux function into
your projects was like:

```
import { createFnlux } from 'fnlux';
```

In versions 0.1.6 and above you have to:

```
import createFnLux from 'fnlux';
```

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

### Async state changes

**fnlux** Adds a simple way to create and apply actions events asynchronically using Promises. Create a promise that returns the action and use the `applyAsync` method.

```
const loadServerData = function(params) {
  return axios.get(API_ENDPOINT, params).then(response => {
  	return {type: 'LOADED_SERVER_DATA', data: response.data};
  }).catch(error => {
    return {type: 'ERROR_SERVER_DATA', error: error};
  });
};


export default class ServerComponent extends React.Component {

  handleLoadServerData = () => {
  	this.fnlux.applyAsync(loadServerData(params));
  }

}

```

Its posible to group several actions asynchronically by using `applyAsync` and passing an array of Promises.

```
this.fnlux.applyAsync([loadServerData(dataId), loadUserInfo(userId)]);
```

If any of the promises fails then all fails (Promise.all) and no action is applied to the **fnlux** state. If the Promise(s) is(are) fullfiled then all the actions will be applied in order (only the last one will trigger a setState change on the **fnlux** attached component)

You can also catch the rejection by concatenating a `catch` method on the returned promise.

```
this.fnlux.applyAsync(
  [loadServerData(dataId), loadUserInfo(userId), {type: 'LOADED_DATA'}]
).catch(error => {
  this.fnlux.apply('LOADING_DATA_ERROR');
});
```

#### Canceling Async Promises (^0.1.5)

Canceling an async promise is not actually possible, it is not in the nature of Promises to be canceled. So, you would assume that once you fire an async event nothing can prevent it from affecting the store/app state. Since version 0.1.5 you could, prevent the state of an async event to mutate the store/app state. We added the `cancelAsync(...)` method.

```
this.loadingData = this.fnlux.applyAsync(
  [loadServerData(dataId), loadUserInfo(userId), {type: 'LOADED_DATA'}]
).catch(error => {
  this.fnlux.apply('LOADING_DATA_ERROR');
});

...

this.fnlux.cancelAsync(this.loadingData);
```

This will prevent the async event once resolved to mutate store/app state. It won't nevertheless prevent catching errors.

### Undo

By default **fnlux** supports undo function. Just call the proper method.

```
this.fnlux.undo();
```

### Immutable Store

[Immutable.js](https://facebook.github.io/immutable-js/) is an amazing library, you
 should definitively use it. With **fnlux** is particulary easy to use immutable stores. Instead of passing a initial state as a plain JS object convert it to an immutable Map, create a special setState function that takes the Map state and shallow convert it to an object (using `toObject()`) and finally asign the initial state the same shallow object.
 
```
export default class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.fnlux = createFnlux(
      Immutable.Map({...}),
      [componentReducer1, componentReducer2, ...],
      this.setFnluxState
    );
    this.state = this.fnlux.state().toObject();
  }

  setFnluxState = (immutableState) => {
    this.setState(immutableState.toObject());
  };
  
  ...
}  
```  

Any first level properties from your immutable state Map will be part of the components state, mantaining their immutable properties. Also, reducers using immutable Map state are easier to craft.

```
export const startGameReducer = function(state, action) {
  if (action !== 'START_GAME') {
    return state;
  }

  return state
  			.set('playing', true)
  			.set('loading', false)
  			.set('canvas', createGameCanvas(10, 10));
};
```  
 