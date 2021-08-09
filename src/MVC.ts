/**
 * A astract class for creating mvc routes
 * This class can only be used when using webpack.
 *
 * @export
 * @abstract
 * @class MVC
 * @template T The type of the default exports of the route handler
 */
export abstract class MVC<T> {

    /**
     * regex used to strip the extention from the route method
     *
     * @protected
     * @type {RegExp}
     * @memberof MVC
     */
    protected methodRegEx: RegExp = /\.(tsx?|jsx?|mjs)$/g;

    /**
     * regex used to identify the route
     *
     * @protected
     * @type {RegExp}
     * @memberof MVC
     */
    protected routeRegEx: RegExp = /(?<=\.)(.*)(?=\/.*\.(tsx?|jsx?|mjs)$)/g;

    /**
     * the route cache of the MVC controller
     *
     * @private
     * @type {{
     *         [path: string]: {
     *             default: T
     *         }
     *     }}
     * @memberof MVC
     */
    private cache: {
        [path: string]: {
            default: T;
        };
    } = {};

    /**
     * This attribute is used to define the root of the mvc mapping
     * 
     * `require.context('./../relative/path/to/routes', true, /\.(tsx?|jsx?|mjs)$/)`
     *
     * @protected
     * @abstract
     * @type {__WebpackModuleApi.RequireContext}
     * @memberof MVC
     */
    private context: __WebpackModuleApi.RequireContext;

    /**
     * the fallback route
     *
     * @protected
     * @abstract
     * @type {{
     *         route: string;
     *         method: string;
     *     }}
     * @memberof MVC
     */
    protected readonly abstract fallback: {
        route: string;
        method: string;
    };


    /**
     * Creates an instance of MVC.
     * @param {__WebpackModuleApi.RequireContext} context This attribute is used to define the root of the mvc mapping (`require.context('./../relative/path/to/routes', true, /\.(tsx?|jsx?|mjs)$/)`)
     * 
     * @memberOf MVC
     */
    constructor(context: __WebpackModuleApi.RequireContext)
    {
        this.context = context;
        this.createRouteCache(this.context);
    }

    /**
     * generates the current route cache
     *
     * @private
     * @param {__WebpackModuleApi.RequireContext} r the require context
     * @memberof MVC
     */
    private createRouteCache(r: __WebpackModuleApi.RequireContext)
    {
        r.keys().forEach((key) =>
        {
            this.cache[key] = r(key);
        });
    }

    /**
     * Resolves a given route
     *
     * @param {string} route the route to resolve
     * @param {string} method the method of the route to resolve
     * @return {*}  {T} the type of the default export of the handler
     * @memberof MVC
     */
    public resolve(route: string, method: string): T
    {

        // match route
        let availableRoutes = Object.keys(this.cache).filter((modulePath) =>
        {
            let moduleRoute = `/${ modulePath.split("/").filter((_, i, array) => i > 0 && i < array.length - 1).join("/") }`;
            return moduleRoute.toUpperCase() === route.toUpperCase();
        });

        if (availableRoutes.length === 0)
        {
            if (route !== this.fallback.route) return this.resolve(this.fallback.route, this.fallback.method);
            throw new Error("The fallback route is not configured correctly or missing.");
        }

        // match methods
        let availableHandler = availableRoutes.filter(route =>
        {
            let routeMethod = route.split("/").pop()?.replace(new RegExp(this.methodRegEx), "").toUpperCase();
            return routeMethod && routeMethod.toUpperCase() === method.toUpperCase();
        });

        if (availableHandler.length === 0)
        {
            if (route !== this.fallback.route) return this.resolve(this.fallback.route, this.fallback.method);
            throw new Error("The fallback route is not configured correctly or missing.");
        }

        if (availableHandler.length > 1)
        {
            console.warn(`Duplicate method (${ method.toUpperCase() }) implementation on route: ${ route.toLowerCase() }`);
        }
        // get selected handler
        let selectedHandler = this.cache[availableHandler[0]];

        return selectedHandler.default;
    }
}
