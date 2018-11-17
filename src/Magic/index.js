import React, { Component } from "react";
import { TextInput, Button, Badge, RadioGroup } from "evergreen-ui";

class Magic extends Component {
	state = {
		ok: false,
		response: null,
		number: "",
		win: null,
		start: false
	};

	componentWillMount() {
		this.props.socket.on("ready", response => {
			this.setState({ response });
		});
		this.props.socket.on("messageMagic", response => {
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
							this.setState({
								number: "",
								response: null,
								ok: false,
								win: null
							});
						}}
					>
						reset
					</Button>
				) : (
					<div>
						<TextInput
							onChange={e => {
								this.setState({ number: e.target.value });
							}}
							value={this.state.number}
						/>
						<Button
							appearance="primary"
							onClick={() => {
								this.props.socket.emit("number", this.state.number);
								this.setState({ number: "" });
							}}
						>
							send
						</Button>
					</div>
				)}
			</div>
		);
	}
}

export default Magic;
