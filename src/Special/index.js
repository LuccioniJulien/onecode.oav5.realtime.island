import React, { Component } from "react";
import { TextInput, Button, Badge, RadioGroup } from "evergreen-ui";

class Magic extends Component {
	constructor(props) {
		super(props);
	}
	state = {
		ok: false,
		response: null,
		number: "",
		win: null,
		start: false,
		socket: this.props.socket,
		keyToPress: "",
		numberPressed: 0
	};

	reset() {
		this.setState({
			ok: false,
			response: null,
			number: "",
			win: null,
			start: false
		});
	}
	componentWillReceiveProps(nextProps) {
		this.reset();
		nextProps.socket.on("ready", response => {
			this.setState({ response });
		});
		nextProps.socket.on("messageMagic", response => {
			if (response == "Waiting for another player") {
				this.setState({
					number: "",
					win: null,
					start: false,
					response
				});
				return;
			}
			this.setState({ response,numberPressed:0 });
		});
		nextProps.socket.on("start", response => {
			this.setState({ start: response });
		});
	}

	componentDidMount() {
		document.onkeypress = e => {
			e = e || window.event;
			if (this.state.keyToPress == e.keyCode) {
				let numberPressed = this.state.numberPressed;
				numberPressed++;
				this.setState({ numberPressed });
			}
		};
		this.props.socket.on("finish", response => {
			console.log("finish")
			this.props.socket.emit("number", this.state.numberPressed)
			this.setState({numberPressed:0})
		});
		this.props.socket.on("key", keyToPress => {
			this.setState({keyToPress});
		});
		this.props.socket.on("ready", response => {
			this.setState({ response });
		});
		this.props.socket.on("messageMagic", response => {
			if (response == "Waiting for another player") {
				this.setState({ response, start: false });
				return;
			}
			this.setState({ response });
		});
		this.props.socket.on("start", response => {
			this.setState({ start: response });
		});
	}

	render() {
		if (!this.props.nickname) {
			return <p>no user</p>;
		}
		if (this.state.ok) {
			if (this.state.start) {
				return this.renderGame();
			}
			return <div>{this.state.response}</div>;
		}
		return (
			<div>
				<h1>hello, {this.props.nickname}</h1>
				<h1>game : {this.props.name}</h1>
				<p>
					{" "}
					<Button
						appearance="primary"
						onClick={() => {
							this.props.socket.emit("start", this.state.nickname);
							this.setState({ ok: true });
							console.log("ready");
						}}
					>
						ready ?
					</Button>
				</p>
			</div>
		);
	}

	renderGame() {
		return (
			<div>
				<a>{this.state.response}</a>
				{this.state.response == "You win" ||
				this.state.response == "You lose" ? (
					<Button
						appearance="primary"
						onClick={() => {
							this.reset();
						}}
					>
						reset
					</Button>
				) : (
					<div>{"number: " + this.state.numberPressed}</div>
				)}
			</div>
		);
	}
}

export default Magic;
