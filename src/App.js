import Food from './Food';
import React, { Component } from 'react';
import Snake from './Snake';
import './App.css';

const genRandomCoords = () => {
  const x = Math.floor((Math.random() * 99) / 2) * 2;
  const y = Math.floor((Math.random() * 99) / 2) * 2;
  return [x, y];
}

const KEYCODES = {
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
}

const INIT_STATE = {
  direction: KEYCODES.RIGHT,
  speed: 200,
  moveIntervalId: null,
  food: genRandomCoords(),
  snakeBody: [
    [0, 0],
    [2, 0]
  ]
};

class App extends Component {
  state = INIT_STATE;

  componentDidMount() {
    document.addEventListener("keydown", this.onKeyDown);
    const key = setInterval(this.moveSnake, this.state.speed);
    this.setState({ moveIntervalId: key });
  }

  componentDidUpdate() {
    this.checkIfOutOfBoundaries();
    this.checkIfBodyCollision();
    this.checkIfEatFood();
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyDown);
    if (this.state.moveIntervalId) {
      clearInterval(this.state.moveIntervalId);
    }
  }

  onKeyDown = (e) => {
    e = e || window.event;
    let directionCode;
    switch (e.keyCode) {
      case KEYCODES.LEFT:
        directionCode = KEYCODES.LEFT;
        break;
      case KEYCODES.UP:
        directionCode = KEYCODES.UP;
        break;
      case KEYCODES.RIGHT:
        directionCode = KEYCODES.RIGHT;
        break;
      case KEYCODES.DOWN:
        directionCode = KEYCODES.DOWN;
        break;
      default:
        break;
    }

    const curDirection = this.state.direction;
    const bothDirections = new Set([curDirection, directionCode]);
    if (bothDirections.length === 1 ||
      (bothDirections.has(KEYCODES.LEFT) && bothDirections.has(KEYCODES.RIGHT)) ||
      (bothDirections.has(KEYCODES.UP) && bothDirections.has(KEYCODES.DOWN))) {
      return;
    }
    if (directionCode) {
      this.setState({ direction: directionCode });
    }
  }

  checkIfOutOfBoundaries() {
    const head = this.state.snakeBody[this.state.snakeBody.length - 1];
    if (head[0] < 0 || head[1] < 0 || head[0] >= 100 || head[1] >= 100) {
      this.endGame();
    }
  }

  checkIfBodyCollision() {
    const snakeBody = [...this.state.snakeBody];
    const head = this.state.snakeBody[this.state.snakeBody.length - 1];
    snakeBody.pop();
    snakeBody.forEach((dot) => {
      if (head[0] === dot[0] && head[1] === dot[1]) {
        this.endGame();
      }
    });
  }

  checkIfEatFood() {
    const head = this.state.snakeBody[this.state.snakeBody.length - 1];
    if (this.state.food[0] === head[0] && this.state.food[1] === head[1]) {
      this.enlargeSnake();
      this.increaseSpeed();
      this.setState({ food: genRandomCoords() });
    }
  }

  enlargeSnake = () => {
    let snakeBody = [...this.state.snakeBody];
    snakeBody.unshift([]);
    this.setState({ snakeBody });
  }

  increaseSpeed = () => {
    let speed = this.state.speed;
    if (speed > 10) {
      speed -= 10;
      this.setSpeed(speed);
    }
  }

  setSpeed = (speed) => {
    clearInterval(this.state.moveIntervalId);
    const key = setInterval(this.moveSnake, speed);
    this.setState({
      moveIntervalId: key,
      speed
    });
  }

  moveSnake = () => {
    let snakeBody = [...this.state.snakeBody];
    let head = snakeBody[snakeBody.length - 1];

    switch (this.state.direction) {
      case KEYCODES.LEFT:
        head = [head[0] - 2, head[1]];
        break;
      case KEYCODES.UP:
        head = [head[0], head[1] - 2];
        break;
      case KEYCODES.RIGHT:
        head = [head[0] + 2, head[1]];
        break;
      case KEYCODES.DOWN:
        head = [head[0], head[1] + 2];
        break;
      default:
        break;
    }

    snakeBody.push(head);
    snakeBody.shift();
    this.setState({ snakeBody });
  }

  endGame = () => {
    alert(`Game over. Snake length is ${this.state.snakeBody.length}`);
    this.resetGame();
  }

  resetGame = () => {
    this.setSpeed(INIT_STATE.speed);
    this.setState(INIT_STATE);
  }

  render() {
    return (
      <div className="snake-app">
        <Snake snakeBody={this.state.snakeBody}></Snake>
        <Food dot={this.state.food}></Food>
      </div>
    );
  }
}

export default App;
