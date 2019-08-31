import React, { Component } from 'react';
import { Provider } from 'react-redux';
import RootNavigation from './src/navigations/RootNavigation';

import {store} from './src/redux/store';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <Provider store={store}>
      <RootNavigation />
      </Provider>
      );
  }
}

export default App;
