import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import Login from "./components/Login";
import blogService from "./services/blogs";
import BlogForm from "./components/BlogForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState({ message: null });
  const blogFormRef = useRef();

  const sortedBlogs = [...blogs].sort((a, b) => a.likes - b.likes).reverse();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  const handleClick = () => {
    window.localStorage.clear();
    setUser(null);
    blogService.setToken(null);
  };

  const addBlog = async (blog) => {
    const returnBlog = await blogService.create(blog);
    setBlogs(
      blogs.concat({
        ...returnBlog,
        user: { name: user.name, id: returnBlog.user, username: user.username },
      })
    );
    blogFormRef.current.toggleVisibility();
  };

  const updateBlog = async (id) => {
    const blogToUpdate = blogs.find((blog) => blog.id === id);
    const newBlog = {
      ...blogToUpdate,
      user: blogToUpdate.user.id,
      likes: blogToUpdate.likes + 1,
    };
    blogService.update(id, newBlog);

    const updatedBlogs = blogs.map((blog) =>
      blog.id !== id ? blog : { ...blog, likes: blog.likes + 1 }
    );
    setBlogs(updatedBlogs);
  };
  const removeBlog = (blogToRemove) => {
    if (
      !window.confirm(`Rermove ${blogToRemove.title} by ${blogToRemove.author}`)
    )
      return;
    blogService.eliminate(blogToRemove.id);
    const updatedBlogs = blogs.filter((blog) => blog.id !== blogToRemove.id);
    setBlogs(updatedBlogs);
  };

  if (user === null) {
    return (
      <>
        <Notification notification={notification} />

        <Login setUser={setUser} setNotification={setNotification} />
      </>
    );
  }

  return (
    <>
      <h2>blogs</h2>
      <Notification notification={notification} />
      {user.name} logged in
      <button onClick={handleClick}>logout</button>
      <Togglable buttonLabel={"new Blog"} ref={blogFormRef}>
        <BlogForm addBlog={addBlog} setNotification={setNotification} />
      </Togglable>
      {sortedBlogs.map((blog) => (
        <Blog
          currentUser={user.username}
          key={blog.id}
          blog={blog}
          removeBlog={() => removeBlog(blog)}
          increaseLikes={() => updateBlog(blog.id)}
        />
      ))}
    </>
  );
};

export default App;
