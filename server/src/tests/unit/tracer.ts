import express, { Request } from 'express';
import request from 'supertest';
import * as tracerModule from '@src/middlewares/tracer';
// import { UUID } from '@src/@types/shared';

type Ids = {
	id1?: unknown;
	id2?: unknown;
};

describe('als-tracer for Express', () => {
	test('does not return id outside of request', () => {
		const id = tracerModule.id();
		expect(id).toBeUndefined();
	});

	test('generates id for request - available in handler', () => {
		const app = express();
		app.use(tracerModule.tracer());

		let id: unknown;

		app.get('/test', (_, res) => {
			id = tracerModule.id();
			res.json({ id });
		});

		return request(app)
			.get('/test')
			.then((res) => {
				expect(res.statusCode).toBe(200);
				expect(res.body.id).toEqual(id);
				expect(res.body.id.length).toBeGreaterThan(0);
			});
	});

	test('uses request id factory when provided', () => {
		const app = express();
		const idFactory = () => 'generated-id';

		app.use(
			tracerModule.tracer({
				requestIdFactory: idFactory,
			})
		);

		app.get('/test', (_, res) => {
			const id = tracerModule.id();
			res.json({ id });
		});

		return request(app)
			.get('/test')
			.then((res) => {
				expect(res.statusCode).toBe(200);
				expect(res.body.id).toEqual(idFactory());
			});
	});

	test('ignores header by default', () => {
		const app = express();
		app.use(tracerModule.tracer());

		const idInHead = 'id-from-header';

		app.get('/test', (_, res) => {
			const id = tracerModule.id();
			res.json({ id });
		});

		return request(app)
			.get('/test')
			.set('X-Request-Id', idInHead)
			.then((res) => {
				expect(res.statusCode).toBe(200);
				expect(res.body.id.length).toBeGreaterThan(0);
				expect(res.body.id).not.toEqual(idInHead);
			});
	});

	test('uses default header in case of override', () => {
		const app = express();
		app.use(tracerModule.tracer({ useHeader: true }));

		const idInHead = 'id-from-header';

		app.get('/test', (_, res) => {
			const id = tracerModule.id();
			res.json({ id });
		});

		return request(app)
			.get('/test')
			.set('X-Request-Id', idInHead)
			.then((res) => {
				expect(res.statusCode).toBe(200);
				expect(res.body.id).toEqual(idInHead);
			});
	});

	test('uses different header in case of override', () => {
		const app = express();
		app.use(
			tracerModule.tracer({
				useHeader: true,
				headerName: 'x-another-req-id',
			})
		);

		const idInHead = 'id-from-header';

		app.get('/test', (_, res) => {
			const id = tracerModule.id();
			res.json({ id });
		});

		return request(app)
			.get('/test')
			.set('x-another-req-id', idInHead)
			.then((res) => {
				expect(res.statusCode).toBe(200);
				expect(res.body.id).toEqual(idInHead);
			});
	});

	test('ignores header if empty', () => {
		const app = express();
		app.use(tracerModule.tracer({ useHeader: true }));

		app.get('/test', (_, res) => {
			const id = tracerModule.id();
			res.json({ id });
		});

		return request(app)
			.get('/test')
			.set('X-Request-Id', '')
			.then((res) => {
				expect(res.statusCode).toBe(200);
				expect(res.body.id.length).toBeGreaterThan(0);
			});
	});

	test('ignores header if disabled', () => {
		const app = express();
		app.use(tracerModule.tracer({ useHeader: false }));

		const idInHead = 'id-from-header';

		app.get('/test', (_, res) => {
			const id = tracerModule.id();
			res.json({ id });
		});

		return request(app)
			.get('/test')
			.set('X-Request-Id', idInHead)
			.then((res) => {
				expect(res.statusCode).toBe(200);
				expect(res.body.id).not.toEqual(idInHead);
				expect(res.body.id.length).toBeGreaterThan(0);
			});
	});

	test('generates id for request with callback', () => {
		const app = express();
		app.use(tracerModule.tracer());

		let id: unknown;

		app.get('/test', (_, res) => {
			setTimeout(() => {
				id = tracerModule.id();
				res.json({ id });
			}, 0);
		});

		return request(app)
			.get('/test')
			.then((res) => {
				expect(res.statusCode).toBe(200);
				expect(res.body.id).toEqual(id);
				expect(res.body.id.length).toBeGreaterThan(0);
			});
	});

	test('generates different ids for concurrent requests with callbacks', () => {
		const app = express();
		app.use(tracerModule.tracer());

		const ids: Ids = {};
		app.get('/test', (req: Request, res) => {
			setTimeout(() => {
				const id = tracerModule.id();
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				ids[req.query.reqName] = id;
				res.json({ id });
			}, 0);
		});

		const server = request(app);
		return Promise.all([
			server
				.get('/test')
				.query({ reqName: 'id1' })
				.then((res) => {
					expect(res.statusCode).toBe(200);
					expect(res.body.id.length).toBeGreaterThan(0);
					return res.body.id;
				}),
			server
				.get('/test')
				.query({ reqName: 'id2' })
				.then((res) => {
					expect(res.statusCode).toBe(200);
					expect(res.body.id.length).toBeGreaterThan(0);
					return res.body.id;
				}),
		]).then(([id1, id2]) => {
			expect(id1).toEqual(ids.id1);
			expect(id2).toEqual(ids.id2);
			expect(id1).not.toEqual(id2);
		});
	});

	test('generates different ids for concurrent requests with promises', () => {
		const app = express();
		app.use(tracerModule.tracer());

		const ids: Ids = {};
		app.get('/test', (req, res) => {
			new Promise((resolve) => setTimeout(resolve, 0)).then(() => {
				const id = tracerModule.id();

				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-ignore
				ids[req.query.reqName] = id;
				res.json({ id });
			});
		});

		const server = request(app);
		return Promise.all([
			server
				.get('/test')
				.query({ reqName: 'id1' })
				.then((res) => {
					expect(res.statusCode).toBe(200);
					expect(res.body.id.length).toBeGreaterThan(0);
					return res.body.id;
				}),
			server
				.get('/test')
				.query({ reqName: 'id2' })
				.then((res) => {
					expect(res.statusCode).toBe(200);
					expect(res.body.id.length).toBeGreaterThan(0);
					return res.body.id;
				}),
		]).then(([id1, id2]) => {
			expect(id1).toEqual(ids.id1);
			expect(id2).toEqual(ids.id2);
			expect(id1).not.toEqual(id2);
		});
	});

	test('generates different ids for concurrent requests with async/await', () => {
		const app = express();
		app.use(tracerModule.tracer());

		const ids: Ids = {};
		app.get('/test', async (req, res) => {
			await new Promise((resolve) => setTimeout(resolve, 0));
			const id = tracerModule.id();

			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			ids[req.query.reqName] = id;
			res.json({ id });
		});

		const server = request(app);
		return Promise.all([
			server
				.get('/test')
				.query({ reqName: 'id1' })
				.then((res) => {
					expect(res.statusCode).toBe(200);
					expect(res.body.id.length).toBeGreaterThan(0);
					return res.body.id;
				}),
			server
				.get('/test')
				.query({ reqName: 'id2' })
				.then((res) => {
					expect(res.statusCode).toBe(200);
					expect(res.body.id.length).toBeGreaterThan(0);
					return res.body.id;
				}),
		]).then(([id1, id2]) => {
			expect(id1).toEqual(ids.id1);
			expect(id2).toEqual(ids.id2);
			expect(id1).not.toEqual(id2);
		});
	});

	test('does not echo the header when the option is not set', () => {
		const app = express();
		app.use(tracerModule.tracer());

		app.get('/test', (_, res) => {
			const id = tracerModule.id();
			res.json({ id });
		});

		return request(app)
			.get('/test')
			.then((res) => {
				expect(res.statusCode).toBe(200);
				expect(res.headers['x-request-id']).toEqual(undefined);
			});
	});

	test('echoes the header when the option is set and a custom header is not defined', () => {
		const app = express();
		app.use(
			tracerModule.tracer({
				echoHeader: true,
			})
		);

		let id: string;

		app.get('/test', (_, res) => {
			id = tracerModule.id() as string;
			res.json({ id });
		});

		return request(app)
			.get('/test')
			.then((res) => {
				expect(res.statusCode).toBe(200);
				expect(res.headers['x-request-id']).toEqual(id);
			});
	});

	test('echoes the header when the option is set and a custom header is defined', () => {
		const app = express();
		app.use(
			tracerModule.tracer({
				echoHeader: true,
				headerName: 'x-another-req-id',
			})
		);

		let id: string;

		app.get('/test', (_, res) => {
			id = tracerModule.id() as string;
			res.json({ id });
		});

		return request(app)
			.get('/test')
			.then((res) => {
				expect(res.statusCode).toBe(200);
				expect(res.headers['x-another-req-id']).toEqual(id);
			});
	});
});
