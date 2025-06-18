import { useEffect, useState } from "react";
import blogService from "../services/blogs";

function Login({ setUser, setNotification }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const loggedUser = window.localStorage.getItem("loggedUser");
    if (loggedUser) {
      const user = JSON.parse(loggedUser);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, [setUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const user = await blogService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      setNotification({ message: "successful login", style: "success" });
      setTimeout(() => {
        setNotification({ message: null });
      }, 2000);
    } catch (error) {
      setNotification({ message: error.response.data.error, style: "error" });
      setTimeout(() => {
        setNotification({ message: null });
      }, 2000);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>log in to application</h1>
      <div>
        username
        <input
          data-testid="username"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
          type="text"
        />
      </div>
      <div>
        password
        <input
          data-testid="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
          type="password"
        />
      </div>
      <button type="submit">login</button>
    </form>
  );
}

export default Login;
