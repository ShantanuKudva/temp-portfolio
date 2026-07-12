import { render, screen } from "@testing-library/react";

function Hello() {
  return <p>harness ok</p>;
}

test("RTL + jest-dom harness renders and matches", () => {
  render(<Hello />);
  expect(screen.getByText("harness ok")).toBeInTheDocument();
});
