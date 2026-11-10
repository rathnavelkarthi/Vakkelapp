"use client";

import { Accordion } from "radix-ui";

const questions = [
  [
    "Can I ask about traffic police or a housing problem?",
    "Yes, those are core everyday topics envisioned for Vakeelapp. The landing page lets you explore a scripted intake flow. Live legal AI is not connected, so it does not generate advice or determine your rights."
  ],
  [
    "Can I hire a lawyer through this page?",
    "Not yet. The filters demonstrate the selection experience using clearly marked fictional profiles. Real hiring requires verified lawyer details, consent, consultation workflows and professional-conduct review."
  ],
  [
    "What does the number of cases tell me?",
    "It is intended as a disclosed professional-experience detail, not proof of competence or a success rate. In this preview every count, age and experience value is fictional."
  ],
  [
    "What can I use right now?",
    "The existing local workspace supports account creation, searching administrator-imported legal records, viewing provenance and saving searches privately. Start the application server to use those features. It is a foundation release, not a production legal service."
  ],
  [
    "Is my personal information needed for the preview?",
    "No. Use a general description, without names, addresses, case identifiers or sensitive details. The landing-page interactions run in your browser; they are not sent to a chatbot provider or saved by this page."
  ]
];

export function LandingFaq() {
  return (
    <Accordion.Root type="multiple" className="faq-list">
      {questions.map(([question, answer]) => (
        <Accordion.Item key={question} value={question} className="faq-item">
          <Accordion.Header>
            <Accordion.Trigger className="faq-trigger">
              {question}
              <span className="faq-indicator" aria-hidden="true" />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content><p>{answer}</p></Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
