import express, { Request, Response, Application } from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import passport from 'passport';

import { errorHandler } from './middlewares/errorHandler';
import morgan from './config/morgan';
import { jwtStrategy } from './config/passport';
import { tracer } from './middlewares/tracer';

// import nftRoutes from './routes/v1/nfts';
import authRoutes from './routes/v1/auth';

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const app: Application = express();

app.use(
	tracer({
		useHeader: true,
		echoHeader: true,
		headerName: 'X-Request-Id',
	})
);

app.use(cookieParser());
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(jsonParser);
app.use(urlencodedParser);
app.use(morgan);

app.use(
	helmet({
		contentSecurityPolicy: false,
		hidePoweredBy: true,
		noSniff: true,
	})
);

app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

app.use('/api/v1/auth', authRoutes);

app.use((err: Request, _: Request, res: Response) => {
	errorHandler(err, res);
});

/**
 * Primary app routes.
 */
app.get('/', (request: Request, response: Response): object =>
	response.send(request.headers)
);

export default app;
