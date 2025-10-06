import { Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/home";
import AddTalent from "./pages/AddTalent";
import EditTalent from "./pages/EditTalent";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

function App() {
  const navLinkClassName = ({ isActive }) =>
    `app-nav__link${isActive ? " app-nav__link--active" : ""}`;

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__brand" aria-label="Freelance Talent Hub">
          <p className="app__brand-title">Freelance Talent Hub</p>
          <p className="app__brand-subtitle">
            Connect agencies with photographers, DJs, designers, and more
          </p>
        </div>

        <nav className="app-nav" aria-label="Primary navigation">
          <ul className="app-nav__list">
            <li>
              <NavLink to="/" className={navLinkClassName} end>
                Talent Directory
              </NavLink>
            </li>
            <li>
              <NavLink to="/add" className={navLinkClassName}>
                Add Talent Profile
              </NavLink>
            </li>
          </ul>
        </nav>
      </header>

      <main className="app__main" role="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddTalent />} />
          <Route path="/edit/:id" element={<EditTalent />} />
        </Routes>
      </main>

      <footer className="app__footer">
        <p>
          &copy; {new Date().getFullYear()} Freelance Talent Hub. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;
