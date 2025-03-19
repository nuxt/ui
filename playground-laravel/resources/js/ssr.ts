import { createInertiaApp } from '@inertiajs/vue3';
import createServer from '@inertiajs/vue3/server';
import { renderToString } from '@vue/server-renderer';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createSSRApp, h } from 'vue';
import { route as ziggyRoute } from 'ziggy-js';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createServer((page) =>
    createInertiaApp({
        page,
        render: renderToString,
        title: (title) => `${title} - ${appName}`,
        resolve: (name) => resolvePageComponent(`./pages/${name}.vue`, import.meta.glob('./pages/**/*.vue')),
        setup({ App, props, plugin }) {
            const app = createSSRApp({ render: () => h(App, props) });

            // Configure Ziggy for SSR...
            const ziggyConfig = {
                ...page.props.ziggy,
                location: new URL(page.props.ziggy.location),
            };

            // Create route function...
            const route = (name: string, params?: any, absolute?: boolean) => ziggyRoute(name, params, absolute, ziggyConfig);

            // Make route function available globally...
            app.config.globalProperties.route = route;

            // Make route function available globally for SSR...
            if (typeof window === 'undefined') {
                global.route = route;
            }

            app.use(plugin);

            return app;
        },
    }),
);
