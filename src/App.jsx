import './App.css'
// import { AddApp } from './components/AddApp'
import { AppDetails } from './components/AppDetails'

function App() {

  return (
    <>
      <div>
        {/* returns the AppDetails.jsx component; this also has the AddApp component inside */}
        <AppDetails/>
      </div>
    </>
  )
}

export default App
