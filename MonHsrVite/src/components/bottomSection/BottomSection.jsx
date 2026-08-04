import { useState } from "react";
import RelicCard from "../relicComp/RelicCard";
import SkillCard, { SkillForm } from "./SkillCard";
import SkillTreePanel from "./skillTreePanel/SkillTreePanel";
import useBottomSection from "./useBottomSection";
import { sanitizeName, sanitizeAndFormatDescription } from "../../utils/textFormat";
import { SKILL_TYPE_CONFIG } from "../../constants/skillTypeConfig";

function RelicSetsPanel({ relicSets }) {
  if (!relicSets?.length) return null;
  return (
    <div className="mt-0">
      <h5 className="title is-6 font-orbitron has-text-gold mb-3">Bonus de Sets</h5>
      {relicSets.map((set) => (
        <div
          key={`${set.id}-${set.num}`}
          className="box has-background-black-bis p-3 mb-2"
          style={{ borderLeft: "3px solid #f29e38" }}
        >
          <div className="is-flex is-justify-content-space-between is-align-items-center mb-1">
            <span className="has-text-white is-size-7 has-text-weight-bold">{set.name}</span>
            <span className="tag is-warning is-small">{set.num} pcs</span>
          </div>
          <p className="is-size-7 has-text-grey-lighter" style={{ lineHeight: "1.3" }}>
            {set.desc}
          </p>
        </div>
      ))}
    </div>
  );
}

// icon vient désormais directement de skill.icon (URL fournie par
// HoYoLab) — plus de charId ni de imageMap ici.
function SkillDetailPanel({ skill }) {
  if (!skill) {
    return (
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <p style={{ color: "#444", fontSize: "0.65rem", fontStyle: "italic", fontFamily: "Inter, sans-serif", textAlign: "center" }}>
          Sélectionne une aptitude
          <br />
          pour afficher ses détails
        </p>
      </div>
    );
  }

  const cfg = SKILL_TYPE_CONFIG[skill.type] || { label: skill.typeText || skill.type, color: "#d8b467" };
  const hasDesc = !!(skill.description || skill.simpleDesc || (skill.isGrouped && skill.forms?.length));

  return (
    <div
      style={{
        padding: "16px 18px",
        background: "linear-gradient(135deg, rgba(216,180,103,0.04) 0%, rgba(0,0,0,0.3) 100%)",
        border: `1px solid ${cfg.color}33`,
        borderRadius: "12px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: "8%",
          bottom: "8%",
          width: "3px",
          background: cfg.color,
          borderRadius: "0 2px 2px 0",
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
        {skill.icon && (
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "9px",
              background: `${cfg.color}18`,
              border: `1.5px solid ${cfg.color}55`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              overflow: "hidden",
            }}
          >
            <img src={skill.icon} alt={skill.name} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
        )}
        <div>
          <p style={{ color: "#fff", fontSize: "0.9rem", fontWeight: 700, margin: 0, fontFamily: "Inter, sans-serif" }}>
            {sanitizeName(skill.name)}
          </p>
          <span style={{ color: cfg.color, fontSize: "0.6rem", fontFamily: "Orbitron, sans-serif" }}>
            {cfg.label}
            {skill.level != null && (
              <span style={{ color: "#666", marginLeft: "8px" }}>
                Niv. {skill.level} / {skill.maxLevel}
              </span>
            )}
          </span>
        </div>
      </div>

      {hasDesc ? (
        skill.isGrouped && skill.forms?.length ? (
          skill.forms.map((form, idx) => <SkillForm key={form.id} form={form} color={cfg.color} isFirst={idx === 0} />)
        ) : (
          <div style={{ fontSize: "0.73rem", lineHeight: "1.7", color: "#c0c0c0", fontFamily: "Inter, sans-serif" }}>
            {sanitizeAndFormatDescription(skill.description || skill.simpleDesc)}
          </div>
        )
      ) : (
        <p style={{ color: "#555", fontSize: "0.7rem", fontStyle: "italic", margin: 0 }}>Aucune description disponible.</p>
      )}
    </div>
  );
}

export default function BottomSection({ activeCharacter }) {
  const { activeTab, setActiveTab, tabs, mainSkills, memoSkills, specialSkills, relics, relicSets, skillTree } =
    useBottomSection(activeCharacter);

  const [selectedSkillId, setSelectedSkillId] = useState(null);

  if (!activeCharacter) return null;

  const allSkills = activeCharacter.skills || [];
  const allDisplayedSkills = [...mainSkills, ...memoSkills, ...specialSkills];
  const selectedSkill = allDisplayedSkills.find((s) => s.id === selectedSkillId) || null;

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSelectedSkillId(null);
  };

  return (
    <div className="box mt-4">
      <div className="bottom-tabs-nav">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`bottom-tab-btn${activeTab === tab.id ? " is-active" : ""}`}
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bottom-tab-content">
        {activeTab === "skills" && (
          <div style={{ display: "flex", gap: "20px", alignItems: "flex-start" }}>
            <div style={{ width: "260px", flexShrink: 0 }}>
              {mainSkills.map((skill) => (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  isSelected={selectedSkillId === skill.id}
                  onClick={() => setSelectedSkillId((s) => (s === skill.id ? null : skill.id))}
                />
              ))}

              {memoSkills.length > 0 && (
                <>
                  <div
                    style={{
                      fontSize: "0.55rem",
                      color: "#555",
                      fontFamily: "Orbitron, sans-serif",
                      letterSpacing: "0.12em",
                      marginTop: "14px",
                      marginBottom: "6px",
                      paddingTop: "10px",
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    MÉMO-SPRITES
                  </div>
                  {memoSkills.map((skill) => (
                    <SkillCard
                      key={skill.id}
                      skill={skill}
                      isSelected={selectedSkillId === skill.id}
                      onClick={() => setSelectedSkillId((s) => (s === skill.id ? null : skill.id))}
                    />
                  ))}
                </>
              )}

              {specialSkills.length > 0 && (
                <>
                  <div
                    style={{
                      fontSize: "0.55rem",
                      color: "#555",
                      fontFamily: "Orbitron, sans-serif",
                      letterSpacing: "0.12em",
                      marginTop: "14px",
                      marginBottom: "6px",
                      paddingTop: "10px",
                      borderTop: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    APTITUDES SPÉCIALES
                  </div>
                  {specialSkills.map((skill) => (
                    <SkillCard
                      key={skill.id}
                      skill={skill}
                      isSelected={selectedSkillId === skill.id}
                      onClick={() => setSelectedSkillId((s) => (s === skill.id ? null : skill.id))}
                    />
                  ))}
                </>
              )}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <SkillDetailPanel skill={selectedSkill} />
            </div>
          </div>
        )}

        {activeTab === "relics" && (
          <div className="columns">
            <div className="column is-8">
              <div className="columns is-multiline">
                {relics.map((relic) => (
                  <div key={relic.id || relic.name} className="column is-half-tablet is-one-third-widescreen">
                    <RelicCard relic={relic} />
                  </div>
                ))}
              </div>
            </div>
            <div className="column is-4">
              <RelicSetsPanel relicSets={relicSets} />
            </div>
          </div>
        )}

        {activeTab === "tree" && (
          // charId conservé par précaution : SkillTreePanel.jsx n'a jamais
          // été vu dans son intégralité, il pourrait s'en servir pour
          // autre chose que la logique déjà déplacée dans useSkillTree.js
          <SkillTreePanel
            skillTree={skillTree}
            path={activeCharacter.path}
            allSkills={allSkills}
            charId={activeCharacter.id}
          />
        )}
      </div>
    </div>
  );
}
