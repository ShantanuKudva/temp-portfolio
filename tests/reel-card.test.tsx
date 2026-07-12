import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ReelCard } from "@/components/work/reel-card";
import type { Reel } from "@/lib/work";

const reel: Reel = {
  id: "granola",
  title: "The note-taker that finally stuck",
  subject: "Granola",
  kind: "app",
  category: "Money & fintech",
  poster: "/work/posters/granola.jpg",
  src: "/work/reels/sample.mp4",
};

describe("ReelCard", () => {
  it("renders the title, subject and kind tag", () => {
    render(<ReelCard reel={reel} onOpen={() => {}} />);
    expect(screen.getByText(reel.title)).toBeInTheDocument();
    expect(screen.getByText(reel.subject)).toBeInTheDocument();
    expect(screen.getByText(/app/i)).toBeInTheDocument();
  });
  it("calls onOpen with its reel when activated", async () => {
    const onOpen = vi.fn();
    render(<ReelCard reel={reel} onOpen={onOpen} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onOpen).toHaveBeenCalledWith(reel);
  });
});
