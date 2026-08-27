import { createFileRoute } from "@tanstack/react-router";

import { RibbleApp } from "@/components/RibbleApp";

// The Ribble SPA drives its own views from the URL, so unknown paths render the app.
export const Route = createFileRoute("/$")({
  head: () => ({
    meta: [
      { title: "Ribble — Read, Listen and Learn Languages" },
      {
        name: "description",
        content:
          "Read with instant word translation, build flashcards, take quizzes and practise pronunciation with Ribble.",
      },
      { property: "og:title", content: "Ribble — Read, Listen and Learn Languages" },
      {
        property: "og:description",
        content: "Instant translation while you read, plus flashcards, quizzes and pronunciation practice.",
      },
    ],
  }),
  component: RibbleApp,
});
