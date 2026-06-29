import Link from "next/link";
import { Logo } from "@/components/Logo";

const QUALIFY = [
  "Pregnancy or postpartum",
  "Food insecurity",
  "Housing insecurity",
  "Diabetes & hypertension",
  "Heart conditions",
  "Mental health challenges",
  "Developmental disabilities",
  "Physical disabilities",
  "Medicaid members",
  "SNAP / WIC / SSI / TANF",
];

export default function Home() {
  return (
    <main>
      <div className="announce">
        ✓ A free program for <strong>Medicaid members</strong> in Rockland County
      </div>
      <header className="site-header">
        <Logo variant="mark" height={30} className="mark" />
        <div className="right">
          <Link href="/apply" className="btn btn-primary" style={{ padding: "11px 22px" }}>
            Apply Today
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-inner">
          <h1>
            A Helping <span className="accent">Hand Delivered</span>
          </h1>
          <p className="sub">Weekly Meal Boxes &amp; Support Services</p>
          <span className="badge">Free for Medicaid members · Rockland County</span>
          <div className="hero-cta">
            <Link href="/apply" className="btn btn-primary">
              Apply Today →
            </Link>
            <a href="#how" className="btn btn-light">
              How it works
            </a>
          </div>
        </div>
      </section>

      {/* We make it simple */}
      <section className="section band" id="how">
        <p className="eyebrow">How it works</p>
        <h2>We make it simple.</h2>
        <div className="steps">
          <div className="step-card">
            <div className="num">1</div>
            <h3>We help you apply</h3>
            <p>Fill out one short form. Our team helps you sign up and confirms your eligibility.</p>
          </div>
          <div className="step-card">
            <div className="num">2</div>
            <h3>Fresh boxes, weekly</h3>
            <p>Nutritious meal boxes are delivered to your door every week — no cost to you.</p>
          </div>
          <div className="step-card">
            <div className="num">3</div>
            <h3>Friendly support</h3>
            <p>We&apos;re with you from start to finish, with caring support whenever you need it.</p>
          </div>
        </div>
      </section>

      {/* Who qualifies */}
      <section className="section">
        <div className="qualify">
          <div>
            <p className="eyebrow">Who qualifies?</p>
            <h2>Support for those who need it most.</h2>
            <p className="lead">
              If you or a family member faces any of these, you may be eligible
              for weekly meal boxes and support services.
            </p>
            <div className="chips">
              {QUALIFY.map((q) => (
                <span className="chip" key={q}>
                  {q}
                </span>
              ))}
            </div>
            <ul className="checklist" style={{ marginTop: 28 }}>
              <li>
                <span className="tick">✓</span> We help you apply and sign up
              </li>
              <li>
                <span className="tick">✓</span> Fresh meal boxes delivered weekly
              </li>
              <li>
                <span className="tick">✓</span> Friendly support from start to finish
              </li>
            </ul>
          </div>
          <div className="qualify-img">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/box.jpg" alt="A weekly LOOM meal box" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-strip">
        <h2>Ready to get started?</h2>
        <p>
          It takes just a few minutes. A LOOM Care Team representative will reach
          out within 24–48 hours to finalize your enrollment.
        </p>
        <Link href="/apply" className="btn btn-light">
          Start your application →
        </Link>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div>
            <Logo variant="full" tone="white" height={54} className="logo-white" />
            <p style={{ maxWidth: "34ch", margin: 0, fontSize: 14 }}>
              Weekly meal boxes &amp; support services for Rockland County
              families. Benefits and eligibility depend on program requirements.
            </p>
          </div>
          <div className="contact">
            <a href="https://www.loomsupport.org" target="_blank" rel="noreferrer">
              loomsupport.org
            </a>
            <br />
            <a href="tel:+19294809101">(929) 480-9101</a>
            <br />
            Serving Rockland County, NY
          </div>
        </div>
        <div className="footer-note">A project by NYC4C.ORG · © LOOM Social Care Network</div>
      </footer>
    </main>
  );
}
