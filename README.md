# flux-dispatcherasync
Async flux dispatcher with promises

Works as the original dispatcher, except when the callback returns a promise.

When a promise is returned the flow will wait for the resolve of the promise to continue.
The waitfor for the promise should be called outside the depending callback as the waitfor does not wait by itself.
Best is to register a so called main callback, which checks for dependencies for the payload and calls the appropriate waitfor(s).

## Usage

```
import {Dispatcher} from "flux";
import "./lib/dispatcherAsync";

const dispatcher = new Dispatcher();
//see code example https://facebook.github.io/flux/docs/dispatcher/ for more information.

//general dispatcher needs to be registered first
dispatcher.register(function (payload) {
	switch (payload.actionType) {
		case "SaveClient":
			dispatcher.waitFor([Client.dispatchToken]);
			
		//and continue	...
	}
});

Client.dispatchToken = dispatcher.register(function(payload) {
  if (payload.actionType === 'FetchClient') {
    return new Promise((resolve, reject) => {
        //do some logic and resolve
        resolve();
    });
  }
});


```
