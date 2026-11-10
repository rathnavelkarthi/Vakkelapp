import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Button } from "@/components/ui/button";
import { PerspectiveTunnelHero } from "@/components/ui/perspective-tunnel-hero";
import { DarkGradientBg } from "@/components/ui/elegant-dark-pattern";
import { EverydayExamples } from "@/components/landing/everyday-examples";
import { LandingFaq } from "@/components/landing/faq";

export const metadata: Metadata = {
  title: "Vakeelapp — Life happens. Know your next move.",
  description:
    "A simpler starting point for everyday legal problems. Explore guided intake and legal research.",
};
export const viewport: Viewport = { themeColor: "#161617" };

export default function LandingPage() {
  return (
    <>
      <link rel="stylesheet" href="/assets/landing.css" precedence="page" />
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <header>
        <nav className="wrap navigation">
          <a className="brand" href="#" aria-label="Vakeelapp home">
            <img
              className="brand-logo"
              src="/assets/vakeelapp-logo.png"
              width={132}
              height={132}
              alt=""
            />
            vakeelapp<span className="brand-period">.</span>
          </a>
          <div id="nav-links">
            <a href="#how">How it works</a>
            <a href="#everyday">Everyday problems</a>
            <a href="#lawyers">Example profiles</a>
            <a href="/workspace" className="mobile-workspace">Research workspace</a>
          </div>
          <div className="nav-right">
            <a href="/workspace" className="nav-cta">
              Open workspace ↗
            </a>
            <button
              id="menu-toggle"
              aria-expanded="false"
              aria-controls="nav-links"
            >
              Menu
            </button>
          </div>
        </nav>
      </header>

      <main id="main" tabIndex={-1}>
        <DarkGradientBg className="landing-pattern min-h-0 bg-[var(--bg)]">
          <PerspectiveTunnelHero />
          <section className="hero wrap">
            <div className="hero-intro">
              <h1>What legal problem are you facing?</h1>
              <p>Describe an everyday legal problem and work through the details one step at a time.</p>
            </div>
            <div className="chat-composer">
              <form id="chat-form" method="post">
                <div className="question-heading">
                  <label className="question-label" htmlFor="question">
                    Describe your legal problem
                  </label>
                  <span className="question-mode" id="question-mode">Guided preview</span>
                </div>
                <textarea
                  id="question"
                  name="question"
                  autoComplete="off"
                  rows={2}
                  maxLength={800}
                  aria-describedby="question-mode question-privacy"
                  placeholder="Tell us what happened…"
                ></textarea>
                <p id="question-error" className="form-error" role="alert" hidden>
                  Describe what happened or choose an example below.
                </p>
                <div className="composer-bottom">
                  <span id="question-privacy">Leave out names and identifying details.</span>
                  <Button
                    type="submit"
                    size="icon"
                    id="send"
                    aria-label="Start guided intake"
                  >
                    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 19V5m-6 6 6-6 6 6" />
                    </svg>
                  </Button>
                </div>
              </form>
              <div id="chat-response" hidden aria-live="polite"></div>
            </div>
            <div className="topic-chips" aria-label="Try an everyday legal topic">
              <button data-topic="traffic">
                <span data-icon="car"></span>Traffic police
              </button>
              <button data-topic="housing">
                <span data-icon="house"></span>Landlord & housing
              </button>
              <button data-topic="work">
                <span data-icon="briefcase"></span>Workplace issues
              </button>
              <button data-topic="notice">
                <span data-icon="file"></span>Received a notice
              </button>
            </div>
            <p className="hero-disclosure">No live AI or legal advice.</p>
            <a className="hero-secondary" href="#lawyers">Browse fictional lawyer profiles <span aria-hidden="true">↗</span></a>
          </section>
        </DarkGradientBg>

        <section id="how" className="wrap section">
          <div className="section-heading">
            <div>
              <h2>
                Find a clearer path
                <br />
                <em>through your legal problem.</em>
              </h2>
            </div>
            <p>
              A simpler legal journey, starting with a conversation and a path
              to professional help.
            </p>
          </div>
          <div className="steps">
            <article>
              <span className="step-number">01</span>
              <div className="step-art conversation-art" aria-hidden="true">
                <span>Here’s what happened…</span>
                <span>Let’s break it down.</span>
              </div>
              <h3>Say it your way.</h3>
              <p>
                Describe your situation as you would to a friend, even if you
                don’t know the relevant law.
              </p>
            </article>
            <article>
              <span className="step-number">02</span>
              <div className="step-art clarity-art" aria-hidden="true">
                <span></span>
                <span></span>
                <span></span>
                <b>Clarity, piece by piece.</b>
              </div>
              <h3>Make sense of it.</h3>
              <p>
                The planned assistant will explain relevant information with
                sources and clear limitations.
              </p>
            </article>
            <article>
              <span className="step-number">03</span>
              <div className="step-art connect-art" aria-hidden="true">
                <span>YOU</span>
                <i>────────</i>
                <span>LAWYER</span>
              </div>
              <h3>Find your person.</h3>
              <p>
                Explore a matching experience built around practice area,
                experience, age and cases handled.
              </p>
            </article>
          </div>
        </section>

        <EverydayExamples />

        <section id="lawyers" className="section wrap">
          <div className="section-heading">
            <div>
              <h2>
                The right expertise.
                <br />A more <em>personal choice.</em>
              </h2>
            </div>
            <p>
              Choose the factors that matter to you. Start with practice area
              and relevant experience, then refine by location, language, fee
              and consultation mode.
            </p>
          </div>
          <div className="directory-toolbar">
            <div>
              <span className="preview-badge">Preview</span>
              <p>
                Explore selection using fictional profiles; hiring is not
                available in this preview.
              </p>
            </div>
            <Button type="button" variant="ghost" className="reset" id="reset-filters">
              Reset filters ↺
            </Button>
          </div>
          <div className="lawyer-filters">
            <label>
              Practice area
              <select id="practice">
                <option value="all">All practice areas</option>
                <option value="Housing">Housing & property</option>
                <option value="Traffic">Traffic & police</option>
                <option value="Employment">Employment</option>
              </select>
            </label>
            <label>
              Experience
              <select id="experience">
                <option value="0">Any experience</option>
                <option value="5">5+ years</option>
                <option value="10">10+ years</option>
                <option value="15">15+ years</option>
              </select>
            </label>
            <label>
              Location
              <select id="location">
                <option value="all">All cities</option>
                <option>Chennai</option>
                <option>Bengaluru</option>
                <option>New Delhi</option>
              </select>
            </label>
            <label>
              Language
              <select id="language-filter">
                <option value="all">Any language</option>
                <option>English</option>
                <option>Tamil</option>
                <option>Kannada</option>
                <option>Hindi</option>
              </select>
            </label>
            <label>
              Consultation fee
              <select id="fee">
                <option value="0">Any example fee</option>
                <option value="1000">Up to ₹1,000</option>
                <option value="2000">Up to ₹2,000</option>
              </select>
            </label>
            <label>
              Consultation mode
              <select id="mode">
                <option value="all">Any mode</option>
                <option value="Online">Online</option>
                <option value="In person">In person</option>
              </select>
            </label>
          </div>
          <details className="extra-filters">
            <summary>Optional preferences: age & cases handled</summary>
            <div className="lawyer-filters">
              <label>
                Age (optional)
                <select id="age">
                  <option value="all">Any age</option>
                  <option value="under40">Under 40</option>
                  <option value="40plus">40 and above</option>
                </select>
              </label>
              <label>
                Cases handled
                <select id="cases">
                  <option value="0">Any case count</option>
                  <option value="100">100+ cases</option>
                  <option value="250">250+ cases</option>
                  <option value="500">500+ cases</option>
                </select>
              </label>
            </div>
            <p>
              Age does not measure competence. Counts are fictional, not
              verified outcomes or success rates.
            </p>
          </details>
          <div className="directory-result">
            <span id="lawyer-count" role="status">
              3 example profiles
            </span>
            <span>Case count does not imply success rate.</span>
          </div>
          <div id="lawyer-grid" className="lawyer-grid"></div>
          <div id="compare-tray" className="compare-tray" hidden>
            <span id="shortlist-count" role="status"></span>
            <Button type="button" variant="ghost" className="button" id="compare-button">
              Compare selected profiles ↗
            </Button>
            <Button type="button" variant="ghost" id="clear-shortlist">Clear shortlist</Button>
          </div>
          <div id="comparison" hidden></div>
          <p className="directory-note">
            Real profiles will require consent, verified professional details
            and applicable professional-conduct review before launch. Age is an
            optional preference, not a measure of competence.
          </p>
        </section>

        <section className="trust section">
          <div className="wrap trust-layout">
            <div>
              <h2>
                Legal help needs
                <br />
                <em>a little more care.</em>
              </h2>
              <a className="text-link" href="/workspace">
                Explore the research foundation <span>↗</span>
              </a>
            </div>
            <div className="trust-items">
              <article>
                <div>
                  <h3>See the source behind the information.</h3>
                  <p>
                    Research should link to its evidence. The foundation shows
                    imported records with provenance, never invented
                    authorities.
                  </p>
                </div>
              </article>
              <article>
                <div>
                  <h3>Know when professional advice matters.</h3>
                  <p>
                    Research assistance is a starting point. Advice about your
                    specific situation belongs with a qualified professional.
                  </p>
                </div>
              </article>
              <article>
                <div>
                  <h3>Honest about what’s ready.</h3>
                  <p>
                    Local research is available. Live AI, verified lawyer
                    profiles, consultations and secure uploads are not connected
                    yet.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="wrap section faq">
          <div>
            <h2>
              A few things
              <br />
              <em>worth knowing.</em>
            </h2>
          </div>
          <LandingFaq />
        </section>

        <section className="final-cta wrap">
          <h2>
            A problem on your mind?
            <br />
            <em>Start with your words.</em>
          </h2>
          <a className="button" href="#question" id="back-chat">
            Start guided intake <span aria-hidden="true">↗</span>
          </a>
        </section>
      </main>

      <footer className="wrap">
        <div className="footer-top">
          <a className="brand" href="#">
            <img
              className="brand-logo"
              src="/assets/vakeelapp-logo.png"
              loading="lazy"
              width={132}
              height={132}
              alt=""
            />
            vakeelapp<span className="brand-period">.</span>
          </a>
          <span>Legal clarity. For real life.</span>
          <div>
            <a href="#lawyers">Example profiles</a>
            <a href="#how">How it works</a>
            <a href="/workspace">Workspace ↗</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Vakeelapp · Designed for India</span>
          <p>
            This product preview provides neither legal advice nor live chat,
            lawyer booking or emergency assistance.
          </p>
        </div>
      </footer>

      <dialog id="profile-dialog" aria-labelledby="profile-title">
        <Button type="button" variant="ghost" id="close-dialog" aria-label="Close profile">
          ×
        </Button>
        <div id="profile-content"></div>
      </dialog>

      <Script src="/assets/landing.js" type="module" strategy="afterInteractive" />
    </>
  );
}
