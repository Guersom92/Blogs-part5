import Blog from "./Blog";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("<Blog/>", () => {
  const increaseLikes = vi.fn();
  beforeEach(() => {
    const blog = {
      author: "Kevin Powell",
      title: "My experience attending at CSS Day 2024",
      url: "www.kevinpowell.co/article/my-experience-attending-css-day-2024/",
      likes: 50,
      user: { username: "guersom80", name: "guersom", id: 4546456456 },
    };
    render(<Blog blog={blog} increaseLikes={increaseLikes} />);
  });

  test("The component displays the title and author initially, but does not display the URL or likes", async () => {
    screen.getByText("My experience attending at CSS Day 2024 Kevin Powell");
    const url = await screen.queryByText(
      "www.kevinpowell.co/article/my-experience-attending-css-day-2024/"
    );
    expect(url).toBeNull();
    const like = await screen.queryByText("likes " + "50");
    expect(like).toBeNull();
  });
  test("Details are show after click", async () => {
    const user = userEvent.setup();
    const button = screen.getByText("show");
    await user.click(button);
    const url = await screen.queryByText(
      "www.kevinpowell.co/article/my-experience-attending-css-day-2024/"
    );
    expect(url).toBeDefined();
    const like = await screen.queryByText("likes " + "50");
    expect(like).toBeDefined();
  });

  test("Clicking the button calls a function", async () => {
    const user = userEvent.setup();
    const button = screen.getByText("show");
    await user.click(button);
    const likeButton = screen.getByText("like");
    await user.click(likeButton);
    await user.click(likeButton);
    expect(increaseLikes.mock.calls).toHaveLength(2);
  });
});
