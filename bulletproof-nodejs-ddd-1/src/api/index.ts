import { Router } from 'express';
import auth from './routes/userRoute';
import user from './routes/userRoute';
import role from './routes/roleRoute';
import allergie from './routes/allergieRoute';

export default () => {
	const app = Router();

	auth(app);
	user(app);
	role(app);

	allergie(app);
	
	return app
}