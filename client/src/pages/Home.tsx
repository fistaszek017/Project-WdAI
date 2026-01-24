import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Witaj w aplikacji</h1>
        <button onClick={handleLogout} className="logout-btn">Wyloguj</button>
      </header>
      <main className="dashboard-content">
        <p>Jesteś zalogowany!</p>
        <div className="card">
          <h3>Twoje dane</h3>
          <p>Tu pojawią się twoje książki lub inne dane.</p>
        </div>
      </main>
    </div>
  );
};

export default Home;
