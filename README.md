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

