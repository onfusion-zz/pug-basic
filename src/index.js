// import ico from "./images/favicon.ico";
import "../node_modules/bootstrap/scss/bootstrap.scss";
import "./sass/theme.scss";

import "../node_modules/bootstrap/dist/js/bootstrap.js";
import "./js/custom.js";

// Get all required images
require.context("./images", false, /\.(png|jpe?g|svg|ico)$/);
