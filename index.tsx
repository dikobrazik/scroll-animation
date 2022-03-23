import React, { Component } from 'react';
import { render } from 'react-dom';
import cn from 'classnames';
import './style.css';

interface AppProps {}
interface AppState {
  name: string;
}

class App extends Component<AppProps, AppState> {
  intersectionObserver: IntersectionObserver;

  constructor(props) {
    super(props);
    this.state = {
      name: 'React',
    };
    this.observeIntersection = this.observeIntersection.bind(this);
    this.step = this.step.bind(this);
  }

  componentWillUnmount() {
    this.intersectionObserver.disconnect();
  }

  onIntersect<E extends Element>(root: E) {
    const children = Array.from(root.children).slice(3, 8);
    const center = 2;
    const rootScrollTop = root.scrollTop - 200;
    children.map((e, i) => {
      const div = e as HTMLDivElement;
      const centerIndexOffset = i - center;
      const centerOffset = centerIndexOffset * -100;
      const xPosition = 100 * i + rootScrollTop;
      const yPosition = centerOffset - rootScrollTop;
      div.style.transform = `translate(${xPosition}px, ${yPosition}px) scale(${
        Math.abs(yPosition) > 200 ? 0 : 1
      })`;
    });
  }

  step<E extends Element>(root: E) {
    this.onIntersect(root);
    requestAnimationFrame(() => this.step(root));
  }

  observeIntersection<E extends Element>(root: E) {
    root.scroll(0, 200);
    this.step(root);
  }

  render() {
    return (
      <div ref={this.observeIntersection} className="hex-container">
        <div
          style={{
            zIndex: 2,
            width: '900px',
            height: '500px',
            background: 'transparent',
          }}
        ></div>
        {Array(9)
          .fill(undefined)
          .map((_, i) => (
            <div key={i} className={cn('hex')} />
          ))}
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
