import _ from "underscore";
import {Dispatcher} from "flux";
import isPromise from "./isPromise";

Dispatcher.prototype._invokeCallback = function (id) {
	this._isPending[id] = true;
	const resp = this._callbacks[id](this._pendingPayload);
	this._isHandled[id] = isPromise(resp) ? resp : true;
};

const _waitFor = Dispatcher.prototype.waitFor;
Dispatcher.prototype.waitFor = function (ids) {
	this._pendingPayload.await = ids;
	_waitFor.call(this, ids);
};

Dispatcher.prototype.dispatch = function dispatch(payload) {
	let that = this, cbNdxs = Object.keys(this._callbacks);
	let CallbackLoop = _.bind(function (id) {
		return new Promise((resolve, reject) => {
			if (id === undefined) return resolve();
			let pendingPromises = [], awaitToken;
			if (this._pendingPayload && this._pendingPayload.await) {
				while ((awaitToken = this._pendingPayload.await.pop())) {
					if (isPromise(this._isHandled[awaitToken])) {
						pendingPromises.push(this._isHandled[awaitToken]);
					}
				}
			}
			Promise.all(pendingPromises).then(() => {
				if (!this._isPending[id]) {
					this._invokeCallback(id);
				}
				CallbackLoop(cbNdxs.shift()).then(resolve, reject);
			}, reject);
		});
	}, this);

	this._startDispatching(payload);
	CallbackLoop(cbNdxs.shift()).then(() => {
		that._stopDispatching();
	}, () => {
		that._stopDispatching();
	});
}
;