import { Provider } from 'react-redux';
import "./assets/scss/main.scss"
import Main from './components/Main';
import store from './store/store';
import { StyledEngineProvider } from '@mui/material';

function App() {
  return (
    <Provider store={store}>
      <StyledEngineProvider injectFirst>
        <Main />
      </StyledEngineProvider>
    </Provider>
  );
}

export default App;
