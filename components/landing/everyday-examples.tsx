"use client";

import { Tabs } from "radix-ui";
import { Button } from "@/components/ui/button";
import { scenarioIcons, scenarios } from "@/public/assets/scenarios";

const topics = [
  { value: "traffic", label: "Traffic & police", icon: "car" },
  { value: "housing", label: "Housing & property", icon: "house" },
  { value: "work", label: "Work & salary", icon: "briefcase" },
  { value: "notice", label: "Notices & documents", icon: "file" },
] as const;

export function EverydayExamples() {
  return (
    <section className="everyday section" id="everyday">
      <Tabs.Root defaultValue="traffic" orientation="vertical" className="wrap everyday-grid">
        <div>
          <h2>Legal questions come up<br /><em>in everyday life.</em></h2>
          <p className="section-copy">
            Sometimes it starts on your way home. In a conversation with
            your landlord. Or with an email from work.
          </p>
          <Tabs.List className="scenario-tabs" aria-label="Everyday problem">
            {topics.map(({ value, label, icon }) => (
              <Tabs.Trigger value={value} key={value}>
                <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path d={scenarioIcons[icon]} />
                </svg>
                {label}
                <span aria-hidden="true">↗</span>
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </div>
        {topics.map(({ value }) => {
          const example = scenarios[value];
          return (
            <Tabs.Content key={value} value={value} className="conversation-preview">
              <div className="conversation-header">
                <span className="mini-brand">Example conversation</span>
              </div>
              <div className="conversation-body">
                <div className="user-message scenario-question">{example.question}</div>
                <div className="assistant-message">
                  <img className="chat-logo" src="/assets/vakeelapp-logo.png" loading="lazy" width={132} height={132} alt="" />
                  <div>
                    <span className="assistant-name">Vakeelapp</span>
                    <p>{example.answer}</p>
                    <div className="context-tags">
                      {example.tags.map(tag => <span key={tag}>{tag}</span>)}
                    </div>
                  </div>
                </div>
                <p className="conversation-note">
                  This example gathers context and offers a starting point for guided intake.
                </p>
              </div>
              <Button type="button" variant="ghost" className="conversation-try" data-try-scenario={value}>
                Try this topic <span aria-hidden="true">↗</span>
              </Button>
            </Tabs.Content>
          );
        })}
      </Tabs.Root>
    </section>
  );
}
