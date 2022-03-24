import React, { Component } from 'react';
import { render } from 'react-dom';
import './style.css';

interface AppProps {}
interface AppState {
  name: string;
}

class App extends Component<AppProps, AppState> {
  containerRef: HTMLDivElement;
  intersectionObserver: IntersectionObserver;
  scrollTop = 0;
  elementsCount = 5;
  hexSize = 100;

  constructor(props) {
    super(props);
    this.observeIntersection = this.observeIntersection.bind(this);
    this.onIntersect = this.onIntersect.bind(this);
    this.onWheel = this.onWheel.bind(this);
  }

  componentDidMount() {
    this.observeIntersection();
    document.addEventListener('wheel', this.onWheel);
  }

  componentWillUnmount() {
    this.intersectionObserver.disconnect();
  }

  /**
   *
   * childrenCount = 3
   *
   *                  |yPosition  @@@@@@
   *                  |           @    @
   *                  |           @    @ <------hexIndex=2
   *                  |           @@@@@@
   *                  |     @@@@@@
   *     marginLeft   |     @    @
   * <--------------->|     @    @ <----- hexIndex=1
   *                  ↓     @@@@@@
   *                ↑ @@@@@@
   *                | @    @
   *        hexSize | @    @ <----- hexIndex=0
   *                ↓ @@@@@@
   *                  <---->
   *                  hexSize
   */

  onWheel(e: WheelEvent) {
    const templateScrollTop = this.scrollTop + e.deltaY;
    const sign = Math.sign(templateScrollTop);
    this.scrollTop =
      Math.abs(templateScrollTop) > 250 ? 250 * sign : templateScrollTop;
  }

  onIntersect() {
    const children = Array.from(this.containerRef.children);
    const rootScrollTop = this.scrollTop;
    children.map((e, hexIndex) => {
      const div = e as HTMLDivElement;
      const marginLeft = 300;
      const topOffset = (this.elementsCount - hexIndex) * this.hexSize;
      const xPosition = marginLeft + this.hexSize * hexIndex + rootScrollTop;
      const yPosition = topOffset - rootScrollTop;
      const shouldDisappear = yPosition > 550 || yPosition < 0;
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
        {Array(this.elementsCount)
          .fill(undefined)
          .map((_, i) => (
            <div key={i} className="hex">
              {i}
            </div>
          ))}
      </div>
    );
  }
}

render(<App />, document.getElementById('root'));
