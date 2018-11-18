import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import App from "./App";
import Home from "./Home";

const MyRoute = () => (
	<Router>
		<App>
			<Switch>
				<Route exact path="/" component={Home} />
			</Switch>
		</App>
	</Router>
);

export default MyRoute;
