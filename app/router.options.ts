import type { RouterConfig } from "nuxt/schema";

export default <RouterConfig>{
    routes: (_routes) => {
        if (import.meta.env.PROD) {
            // Remove routes with 'partials'
            _routes = _routes.filter((route) => !route.path.includes("partials"));
        }

        return _routes;
    },
};
