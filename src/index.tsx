import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import 'typeface-roboto';
import 'react-virtualized/styles.css';

import App from './App';
import './index.css';

const theme = createMuiTheme({
  palette: {
  primary: blue,
  },
  typography: {
  useNextVariants: true,
  },
});

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
  <App />
  </MuiThemeProvider>,
  document.getElementById('root') as HTMLElement
);
serviceWorker.register();
