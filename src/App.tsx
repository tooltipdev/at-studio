import './App.css';
import Playground from './components/oauth-playground';
import OAuthClientProvider from './contexts/oauth-provider';

function App() {
  return (
    <>
      <OAuthClientProvider>
        <Playground />
      </OAuthClientProvider>
    </>
  );
}

export default App;
