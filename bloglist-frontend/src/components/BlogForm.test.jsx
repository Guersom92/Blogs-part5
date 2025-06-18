import BlogForm from "./BlogForm";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("<BlogForm/>", () => {
  const addBlog = vi.fn();
  const setNotification = vi.fn();
  beforeEach(() => {
    render(<BlogForm addBlog={addBlog} setNotification={setNotification} />);
  });

  test("calls the event handler with correct argument ", async () => {
    const user = userEvent.setup();
    const blog = {
      author: "Kevin Powell",
      title: "My experience attending at CSS Day 2024",
      url: "www.kevinpowell.co/article/my-experience-attending-css-day-2024/",
    };
    const inputs = screen.getAllByRole("textbox");
    const createButton = screen.getByText("create");

    await user.type(inputs[0], blog.title);
    await user.type(inputs[1], blog.author);
    await user.type(inputs[2], blog.url);
    await user.click(createButton);

    expect(addBlog.mock.calls).toHaveLength(1);
    expect(addBlog.mock.calls[0][0].title).toBe(blog.title);
    expect(addBlog.mock.calls[0][0].author).toBe(blog.author);
    expect(addBlog.mock.calls[0][0].url).toBe(blog.url);
  });
});
