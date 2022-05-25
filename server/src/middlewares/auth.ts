import passport from 'passport';

/**
 * Passport methods implementations are located in @src/config/passport.ts
 */
export function authenticate() {
	return passport.authenticate('jwt', { session: false });
}
