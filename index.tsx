import React, { Component } from 'react';
import { render } from 'react-dom';
import cn from 'classnames';
import './style.css';

interface AppProps {}
interface AppState {
  name: string;
}

class App extends Component<AppProps, AppState> {
  containerRef: HTMLDivElement;
  intersectionObserver: IntersectionObserver;
  scrollTop = 0;

  constructor(props) {
    super(props);
    this.state = {
      name: 'React',
    };
    this.observeIntersection = this.observeIntersection.bind(this);
    this.onIntersect = this.onIntersect.bind(this);
  }

  componentDidMount() {
    this.observeIntersection();
    document.addEventListener('wheel', (e) => {
      console.log(e.composed);
      this.scrollTop += e.deltaY;
      if (this.scrollTop > 250) {
        this.scrollTop = 250;
      } else if (this.scrollTop < -250) {
        this.scrollTop = -250;
      }
    });
  }

  componentWillUnmount() {
    this.intersectionObserver.disconnect();
  }

  onIntersect() {
    const children = Array.from(this.containerRef.children);
    const center = 2;
    const rootScrollTop = this.scrollTop;
    children.map((e, hexIndex) => {
      const div = e as HTMLDivElement;
      const centerIndexOffset = hexIndex - center;
      const centerOffset = centerIndexOffset * -100;
      const marginLeft = 300;
      const hexWidth = 100;
      const xPosition = marginLeft + hexWidth * hexIndex + rootScrollTop;
      const yPosition = centerOffset - rootScrollTop;
      const shouldDisappear = Math.abs(yPosition) > 250;
      div.style.transform = `translate(${xPosition}px, ${yPosition}px)`;
      div.style.opacity = shouldDisappear ? '0' : '1';
    });
  }

  observeIntersection() {
    this.onIntersect();
    requestAnimationFrame(this.observeIntersection.bind(this));
  }

  render() {
    return (
      <div ref={(ref) => (this.containerRef = ref)}>
        {Array(5)
          .fill(undefined)
          .map((_, i) => (
            <div key={i} className={cn('hex')} />
          ))}
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
