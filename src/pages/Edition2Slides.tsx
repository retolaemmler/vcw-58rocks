import { useEffect } from "react";

const SLIDES_URL =
  "https://docs.google.com/presentation/d/1jnIWUKFrwdy1sEstNFV9lU31Av0TlA5CKiU1y6VlJsI/edit?usp=sharing";

const Edition2Slides = () => {
  useEffect(() => {
    window.location.replace(SLIDES_URL);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center space-y-3">
        <h1 className="font-display text-2xl font-semibold">Opening Edition 2 - 30.6.26 slides…</h1>
        <p className="text-muted-foreground">
          If you are not redirected,{" "}
          <a href={SLIDES_URL} className="text-primary underline">
            click here to open the deck
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default Edition2Slides;