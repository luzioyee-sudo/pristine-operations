import { createFileRoute } from "@tanstack/react-router";

import { RibbleApp } from "@/components/RibbleApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ribble — Read, Listen and Learn Languages" },
      {
        name: "description",
        content:
          "Ribble turns real reading into language learning: tap any word for instant translation, build flashcards, practise pronunciation and track progress.",
      },
      { property: "og:title", content: "Ribble — Read, Listen and Learn Languages" },
      {
        property: "og:description",
        content:
          "Read PDFs and articles with instant word translation, flashcards, quizzes and pronunciation practice.",
      },
    ],
  }),
  component: RibbleApp,
});
