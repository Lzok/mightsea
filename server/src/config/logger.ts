import { createLogger, format, transports, addColors, Logform } from 'winston';
import { isProduction, DEBUG } from './vars';
import { id as reqId } from '@src/middlewares/tracer';

const colorizer = format.colorize();
const NO_TRACE = 'no-trace';

const config = {
	/**
	 * Numerical Code - Severity
	 *
	 *			0       Emergency: system is unusable
	 *			1       Alert: action must be taken immediately
	 *			2       Critical: critical conditions
	 *			3       Error: error conditions
	 *			4       Warning: warning conditions
	 *			5       Notice: normal but significant condition
	 *			6       Informational: informational messages
	 *			7       Debug: debug-level messages
	 * @see {@link https://tools.ietf.org/html/rfc5424 RFC5424}
	 */
	levels: {
		emerg: 0,
		alert: 1,
		crit: 2,
		error: 3,
		warn: 4,
		notice: 5,
		info: 6,
		debug: 7,
		/**
		 * http is not part of the RFC5424 but it is included here to be used with morgan to log
		 * the http requests through winston on development environment.
		 */
		http: 8,
	},
	/**
	 * This enables loggers using the colorize formatter to appropriately color and style the output of custom levels.
	 * Additionally, you can also change background color and font style.
	 *
	 * Possible options are:
	 * 	- Font styles: bold, dim, italic, underline, inverse, hidden, strikethrough.
	 * 	- Font foreground colors: black, red, green, yellow, blue, magenta, cyan, white, gray, grey.
	 * 	- Background colors: blackBG, redBG, greenBG, yellowBG, blueBG magentaBG, cyanBG, whiteBG
	 *
	 * @example baz: 'italic yellow',
	 * @example foobar: 'bold red cyanBG'
	 * @see {@link https://github.com/winstonjs/winston#using-custom-logging-levels Winston Custom Logging Levels}
	 */
	colors: {
		info: 'green',
		warn: 'italic yellow',
		error: 'bold red',
		debug: 'blue',
		http: 'magenta',
	},
};

/**
 * Global logger level.
 * In production we want to log all from warn level and up.
 * In other envs but production we want to log even the http requests.
 * If the DEBUG env variable is present, we will log debug and up, even if we are in production.
 */
const level = () => {
	if (DEBUG) return 'debug';

	return isProduction() ? 'warn' : 'http';
};

const getLabel = function (main: NodeModule | undefined) {
	if (!main) return '';
	const parts = main.filename.split('/');
	return parts[parts.length - 2] + '/' + parts.pop();
};

const printf = (entry: Logform.TransformableInfo) => {
	const id = reqId() ?? NO_TRACE;

	// http level is controlled by Morgan, so we have no metadata obj.
	if (entry.level === 'http')
		return colorizer.colorize(
			entry.level,
			`[${entry.timestamp}] [request-id ${id}] [${getLabel(
				require.main
			)}] ${entry.level}: ${entry.message}`
		);

	return colorizer.colorize(
		entry.level,
		`[${entry.timestamp}] [request-id ${id}] [${getLabel(require.main)}] ${
			entry.level
		}: ${entry.message}. metadata: ${JSON.stringify(
			entry.metadata,
			null,
			2
		)}`
	);
};

const consoleTransport = new transports.Console({
	level: 'http',
	format: format.combine(format.json(), format.printf(printf)),
});

const transps = [consoleTransport];

addColors(config.colors);

const logger = createLogger({
	level: level(),
	levels: config.levels,
	transports: transps,
	format: format.combine(format.metadata(), format.timestamp()),
});

export default logger;
