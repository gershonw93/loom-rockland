/**
 * Reference cards shown on the Insurance step so applicants know where to find
 * their Medicaid ID / CIN. Stylised examples — not real cards.
 */
export function InsuranceExamples() {
  return (
    <div>
      <div className="ref-note">
        💡 Your <strong>Medicaid ID (CIN)</strong> is the{" "}
        <strong>Member ID / CIN#</strong> printed on your insurance card — for
        example, <code>AB12345C</code>. Snap a clear photo of the card, or type
        the number below. Here&apos;s where to look on common cards:
      </div>
      <div className="ref-cards">
        <div>
          <div className="ref-card fidelis">
            <div className="brandname">Fidelis Care</div>
            <div>
              <div className="label">CIN#</div>
              <span className="cin">AB12345C</span>
            </div>
          </div>
          <p className="ref-caption">Bottom-right: “CIN#”</p>
        </div>
        <div>
          <div className="ref-card nys">
            <div className="brandname">NY State Benefit</div>
            <div>
              <div className="label">ID Number</div>
              <span className="cin">XX00000X</span>
            </div>
          </div>
          <p className="ref-caption">Front: “ID Number”</p>
        </div>
        <div>
          <div className="ref-card uhc">
            <div className="brandname">UnitedHealthcare</div>
            <div>
              <div className="label">Member ID</div>
              <span className="cin">123456789-00</span>
            </div>
          </div>
          <p className="ref-caption">Under name: “Member ID”</p>
        </div>
      </div>
    </div>
  );
}
