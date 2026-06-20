import './App.css'

import AssignmentForm from "./components/AssignmentForm.tsx";
import AssignmentTable from "./components/AssignmentTable.tsx";
import {Layout} from "./components/Layout.tsx";

import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

function App() {



  return (
      <Router>
          <Routes>
                  <Route element={<Layout/>}>
                      <Route path="/" element={<AssignmentForm/>} />
                      <Route path="/table" element={<AssignmentTable/>}/>
                  </Route>
          </Routes>
      </Router>
)
}

export default App
