import morgan, { StreamOptions } from 'morgan';
import logger from './logger';

/**
 * Override the stream method by telling Morgan to use our
 * custom logger instead of the console.log.
 */
const stream: StreamOptions = {
	// Use the http severity configured on logger
	write: (message) => logger.http(message.trim()),
};

const morganMiddleware = morgan(
	/**
	 * Formats
	 * @see {@link https://github.com/expressjs/morgan#predefined-formats Morgan Formats}
	 */
	':method :url :status :res[content-length] - :response-time ms',
	/**
	 * Options
	 * @see {@link https://github.com/expressjs/morgan#options Morgan Options}
	 */
	{ stream }
);

export default morganMiddleware;
