import React, { Component } from "react";
import { TextInput, Button, Badge, RadioGroup } from "evergreen-ui";

import Magic from "../Magic";

import openSocket from "socket.io-client";
const socket = openSocket("localhost:5000");

class Home extends Component {
	constructor(props) {
		super(props);
		socket.on("welcome", response => {
			try {
				this.setState({ response });
			} catch (error) {}
		});
		this.state = {
			nickname: "",
			response: null,
			options: [
				{ label: "", value: "" },
				{ label: "/magicNumber", value: "/magicNumber" },
				{ label: "/fastkey", value: "/fastkey" },
				{ label: "/quickey", value: "/quickey" },
				{ label: "/hanged", value: "/hanged" }
			],
			game: null,
			socket: null
		};
	}

	componentDidMount(){
		// window.onbeforeunload = function(e) {
		// 	alert("hello")
		// 	var dialogText = 'Dialog text here';
		// 	e.returnValue = dialogText;
		// 	return dialogText;
		// };
	}

	
	render() {
		if (this.state.nickname && this.state.response) {
			return this.renderGame();
		}
		return (
			<div>
				<TextInput
					onChange={e => {
						console.log(e.target.value);
						this.setState({ nickname: e.target.value });
					}}
					value={this.state.nickname}
				/>
				<Button
					appearance="primary"
					onClick={() => {
						socket.emit("join", this.state.nickname);
					}}
				>
					Set
				</Button>
			</div>
		);
	}

	renderGame() {
		return (
			<div>
				{<Badge color="green">{this.state.response}</Badge>}
				<RadioGroup
					label="Choose a game"
					value={this.state.value}
					options={this.state.options}
					onChange={game => {
						if (game == "") {
							return;
						}
						console.log(game); 
						if (this.state.socket) {
							this.state.socket.close();
						}
						const newSocket = openSocket.connect(
							`http://localhost:5000${game}`
						);
						newSocket.emit("join", this.state.nickname);
						newSocket.on("welcome", response => {

						});
						this.setState({ game, socket: newSocket });
					}}
				/>
				{this.state.game ? this.renderM() : ""}
			</div>
		);
	}

	renderM() {
		return (
			<Magic
				nickname={this.state.nickname}
				socket={this.state.socket}
				name={this.state.game}
			/>
		);
	}
}

export default Home;
