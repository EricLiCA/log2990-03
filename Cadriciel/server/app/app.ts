/**
 * app.ts - Configures an Express application.
 *
 * @authors Nicolas Richard, Emilio Riviera
 * @date 2017/01/09
 */

import * as express from 'express';
import * as path from 'path';
import * as logger from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

import * as indexRoute from './routes/index';
import * as authenticationRoute from './routes/authentication';
import * as lexiconRoute from './routes/lexicon';

export class Application {

    public app: express.Application;

    /**
     * Bootstrap the application.
     *
     * @class Server
     * @method bootstrap
     * @static
     * @return {ng.auto.IInjectorService} Returns the newly created injector for this this.app.
     */
    public static bootstrap(): Application {
        return new Application();
    }

    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    constructor() {

        // Application instantiation
        this.app = express();

        // configure this.application
        this.config();

        // configure routes
        this.routes();
    }

    /**
     * The config function.
     *
     * @class Server
     * @method config
     */
    private config() {
        // Middlewares configuration
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.app.use(express.static(path.join(__dirname, '../client')));
        this.app.use(cors());
    }

    /**
     * The routes function.
     *
     * @class Server
     * @method routes
     */
    public routes() {
        let router: express.Router;
        router = express.Router();

        // create routes
        const index: indexRoute.Index = new indexRoute.Index();
        const authentication: authenticationRoute.Authentication = new authenticationRoute.Authentication();
        const lexicon: lexiconRoute.Lexicon = new lexiconRoute.Lexicon();

        // home page
        router.get('/basic', index.index.bind(index.index));
        router.get('/definition/:word', lexicon.wordDefinition.bind(lexicon.wordDefinition));
        router.get('/lexicon', lexicon.englishWordLexicon.bind(lexicon.englishWordLexicon));
        router.get('/lexicon/:wordLength', lexicon.getWordsOfLength.bind(lexicon.getWordsOfLength));
        router.get('/commonWords', lexicon.getCommonWords.bind(lexicon.getCommonWords));
        router.get('/uncommonWords', lexicon.getUncommonWords.bind(lexicon.getUncommonWords));

        // login api path
        router.post('/login', authentication.login.bind(authentication.login));

        // changePassword api path
        router.post('/changepassword', authentication.changePassword.bind(authentication.changePassword));

        // use router middleware
        this.app.use('/api', router);

        // Gestion des erreurs
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            const err = new Error('Not Found');
            next(err);
        });

        // development error handler
        // will print stacktrace
        if (this.app.get('env') === 'development') {
            this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
                res.status(err.status || 500);
                res.send({
                    message: err.message,
                    error: err
                });
            });
        }

        // production error handler
        // no stacktraces leaked to user (in production env only)
        this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.status(err.status || 500);
            res.send({
                message: err.message,
                error: {}
            });
        });
    }
}
