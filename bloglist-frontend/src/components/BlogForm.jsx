import { useState } from "react";

function BlogForm({ addBlog, setNotification }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addBlog({ title, author, url });
      setNotification({
        message: `a new blog ${title} by ${author}`,
        style: "success",
      });
      setTimeout(() => {
        setNotification({ message: null });
      }, 2000);
      setTitle("");
      setAuthor("");
      setUrl("");
    } catch (error) {
      setNotification({ message: error.response.data.error, style: "error" });
      setTimeout(() => {
        setNotification({ message: null });
      }, 2000);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>create new</h1>
      <div>
        title:{" "}
        <input
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          type="text"
        />
      </div>
      <div>
        author:{" "}
        <input
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
          type="text"
        />
      </div>
      <div>
        url:{" "}
        <input
          value={url}
          onChange={({ target }) => setUrl(target.value)}
          type="text"
        />
      </div>
      <button type="submit">create</button>
    </form>
  );
}

export default BlogForm;
