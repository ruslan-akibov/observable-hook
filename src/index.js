import "core-js/stable";

import 'whatwg-fetch';
import React from 'react';
import { render } from 'react-dom';

(async function () {
    try {
        window.CONFIG = await (await window.fetch('config.json')).json();

        const App = require('./App').default;
        render(
            <App />,
            document.getElementById(CONFIG.APP_CONTAINER)
        );
    } catch(error) {
        console.error(error);
    }
})();
