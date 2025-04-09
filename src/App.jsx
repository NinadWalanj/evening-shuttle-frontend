import Student from "./components/Student/Student";
import Shuttle from "./components/Shuttle/Shuttle";
import "./App.css";

function App() {
  const students = [1, 2, 3, 4, 5];

  return (
    <div className="app-container">
      <header className="header">
        <h1>Evening Shuttle Tracker</h1>
      </header>
      <main className="main-content">
        <section className="students-panel">
          <h2>Students</h2>
          <div className="students-list">
            {students.map((suid) => (
              <Student key={suid} suid={suid} />
            ))}
          </div>
        </section>
        <section className="shuttle-panel">
          <h2>Shuttle Control</h2>
          <Shuttle />
        </section>
      </main>
    </div>
  );
}

export default App;
