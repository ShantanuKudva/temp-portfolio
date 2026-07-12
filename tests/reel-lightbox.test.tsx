import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ReelLightbox } from "@/components/work/reel-lightbox";
import type { Reel } from "@/lib/work";

vi.mock("@/components/ElasticSlider", () => ({
  ElasticSlider: () => null,
}));

const reel: Reel = {
  id: "granola",
  title: "The note-taker that finally stuck",
  subject: "Granola",
  kind: "app",
  poster: "/work/posters/granola.jpg",
  src: "/work/reels/sample.mp4",
};

describe("ReelLightbox", () => {
  it("renders nothing when reel is null", () => {
    const { container } = render(<ReelLightbox reel={null} onClose={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });
  it("renders the title and a video with the reel src when open", () => {
    render(<ReelLightbox reel={reel} onClose={() => {}} />);
    expect(screen.getByText(reel.title)).toBeInTheDocument();
    const video = document.querySelector("video");
    expect(video).toBeTruthy();
    expect(video?.getAttribute("src")).toContain("sample.mp4");
  });
  it("calls onClose when Escape is pressed", () => {
    const onClose = vi.fn();
    render(<ReelLightbox reel={reel} onClose={onClose} />);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalled();
  });
  it("calls onClose when the close button is clicked", () => {
    const onClose = vi.fn();
    render(<ReelLightbox reel={reel} onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(onClose).toHaveBeenCalled();
  });
});
