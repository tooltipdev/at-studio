import './App.css'
import Playground from './components/ui/oauth-playground'
import OAuthClientProvider from './contexts/oauth'

function App() {
  return (
    <>
      <OAuthClientProvider>
        <Playground className="" />
      </OAuthClientProvider>
    </>
  )
}

export default App
