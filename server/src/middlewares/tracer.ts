import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { AsyncLocalStorage } from 'async_hooks';

const als = new AsyncLocalStorage();

/**
 * Generates a request tracer middleware.
 *
 * @param {Object} options possible options
 * @param {boolean} options.useHeader respect request header flag
 *                                    (default: `false`)
 * @param {string} options.headerName request header name, used if `useHeader`/`echoHeader` is set to `true`
 *                                    (default: `X-Request-Id`)
 * @param {function} options.requestIdFactory function used to generate request ids
 *                                    (default: randomUUID fn from Nodejs crypto module)
 * @param {boolean} options.echoHeader injects `headerName` header into the response
 *                                    (default: `false`)
 */
type TracerOpts = {
	useHeader?: boolean;
	headerName?: string;
	requestIdFactory?: Function;
	echoHeader?: boolean;
};

function setResHeaderFn(
	res: Response,
	headerName: string,
	requestId: string
): void {
	res.set(headerName, requestId);
}

/**
 * Generates a function to generate tracer middleware.
 * @param setResHeaderFn {function} function used to set response header
 */
export function expressMiddleware(setResHeaderFn: Function) {
	return ({
		useHeader = false,
		headerName = 'X-Request-Id',
		requestIdFactory = randomUUID,
		echoHeader = false,
	}: TracerOpts = {}) => {
		return (req: Request, res: Response, next: NextFunction) => {
			let requestId;
			if (useHeader) {
				requestId = req.headers[headerName.toLowerCase()];
			}

			requestId = requestId || requestIdFactory?.();

			if (echoHeader) {
				setResHeaderFn(res, headerName, requestId);
			}

			als.run(requestId, () => {
				next();
			});
		};
	};
}

/**
 * Returns the current store. If called outside of an asynchronous context initialized by
 * calling asyncLocalStorage.run() or asyncLocalStorage.enterWith(), it returns undefined
 */
export function id() {
	return als.getStore();
}

export const tracer = expressMiddleware(setResHeaderFn);
