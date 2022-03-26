import "./App.css";
import LeftColumn from "./Components/LeftColumn";
import MainColumn from "./Components/MainColumn";

function App() {
  return (
    <div className="bg-gray-100 antialiased">
      <main className="main-container ">
        <div className="grid gap-5 lg:grid-cols-3">
          <LeftColumn />
          <MainColumn />
        </div>
      </main>
    </div>
  );
}

export default App;
