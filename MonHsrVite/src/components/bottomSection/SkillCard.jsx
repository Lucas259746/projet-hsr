import { sanitizeName, sanitizeAndFormatDescription, formatSkillLevel } from "../../utils/textFormat";
import { SKILL_TYPE_CONFIG } from "../../constants/skillTypeConfig";

// Affiche une forme d'aptitude et sa description.
export function SkillForm({ form, color, isFirst }) {
  const cfg = SKILL_TYPE_CONFIG[form.type] || { label: form.typeText || form.type, color };

  return (
    <div
      style={{
        paddingTop: isFirst ? 0 : "14px",
        marginTop: isFirst ? 0 : "14px",
        borderTop: isFirst ? "none" : "1px dashed rgba(255,255,255,0.08)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
        {form.icon && (
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "7px",
              background: `${cfg.color}18`,
              border: `1.5px solid ${cfg.color}55`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              overflow: "hidden",
            }}
          >
            <img
              src={form.icon}
              alt={form.name}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
            <span style={{ color: cfg.color, fontSize: "0.78rem", fontWeight: 700, fontFamily: "Inter, sans-serif" }}>
              {sanitizeName(form.name)}
            </span>
          </div>
          <div style={{ color: "#666", fontSize: "0.6rem", fontFamily: "Orbitron, sans-serif", marginTop: "2px" }}>
            Niv. {formatSkillLevel(form.level, form.bonusLevel)} / {formatSkillLevel(form.maxLevel, form.bonusLevel)}
          </div>
        </div>
      </div>
      <div style={{ fontSize: "0.72rem", lineHeight: "1.65", color: "#c0c0c0", fontFamily: "Inter, sans-serif" }}>
        {sanitizeAndFormatDescription(form.description || form.simpleDesc)}
      </div>
    </div>
  );
}

// Carte d'aptitude sélectionnable.
export default function SkillCard({ skill, isSelected, onClick }) {
  const cfg = SKILL_TYPE_CONFIG[skill.type] || {
    label: skill.typeText || skill.type || "Aptitude",
    color: "#d8b467",
  };

  return (
    <div
      onClick={onClick}
      className="skill-card"
      style={{
        borderLeft: `3px solid ${cfg.color}`,
        padding: "10px 12px",
        cursor: "pointer",
        marginBottom: "6px",
        borderRadius: "0 6px 6px 0",
        background: isSelected
          ? `linear-gradient(90deg, ${cfg.color}18 0%, rgba(0,0,0,0.2) 100%)`
          : "rgba(255,255,255,0.02)",
        outline: isSelected ? `1px solid ${cfg.color}44` : "1px solid transparent",
        transition: "background 0.15s, outline 0.15s",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            background: `${cfg.color}18`,
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          {skill.icon ? (
            <img
              src={skill.icon}
              alt={skill.name}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          ) : (
            <span style={{ color: cfg.color }}>✦</span>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ color: "#fff", fontSize: "0.85rem", fontWeight: 700, margin: 0, fontFamily: "Inter, sans-serif" }}>
            {sanitizeName(skill.name)}
          </p>
          <span style={{ color: cfg.color, fontSize: "0.6rem", fontFamily: "Orbitron, sans-serif" }}>
            {cfg.label}
          </span>
        </div>
        <span style={{ color: cfg.color, fontSize: "0.6rem", opacity: 0.6 }}>›</span>
      </div>
    </div>
  );
}
