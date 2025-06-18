import { useState } from "react";

const Blog = ({ blog, increaseLikes, removeBlog, currentUser }) => {
  const [show, setShow] = useState(false);

  const buttonStyle = {
    backgroundColor: "lightskyblue",
    borderRadius: 8,
  };

  const details = () => {
    return (
      <>
        <div>
          <a href={`https://${blog.url}`}>{blog.url}</a>
        </div>
        <div>
          likes <span>{blog.likes}</span>{" "}
          <button onClick={increaseLikes}>like</button>
        </div>
        <div>{blog.user.name}</div>
        {currentUser === blog.user.username && (
          <button style={buttonStyle} onClick={removeBlog}>
            remove
          </button>
        )}
      </>
    );
  };

  return (
    <div className="blog">
      {blog.title} {blog.author}{" "}
      <button onClick={() => setShow(!show)}>{show ? "hide" : "show"}</button>
      {show && details()}
    </div>
  );
};

export default Blog;
