import React, { Component } from "react";
import "./App.css";
import Menu from "../Menu";
class App extends Component {
	render() {
		return (
			<div>
				<header className="App-header">
					<div className="App">
						<div id="title">OAV5</div>
						<Menu />
					</div>
				</header>
				{this.props.children}
			</div>
		);
	}
}

export default App;
