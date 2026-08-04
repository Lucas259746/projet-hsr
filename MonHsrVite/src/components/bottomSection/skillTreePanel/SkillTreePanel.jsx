import { sanitizeAndFormatDescription } from "../../../utils/textFormat";
import useSkillTree, { getNodeStyle, isStatNode, isMainSkill } from "./useSkillTree";
import { SKILL_TYPE_CONFIG } from "../../../constants/skillTypeConfig";

// ── Forme individuelle d'un skill (identique à SkillCard) ──
// icon vient désormais directement de form.icon (URL fournie par
// HoYoLab) — plus de charId/formIndex/imageMap ici.
function SkillForm({ form, color, isFirst }) {
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
              {form.name}
            </span>
            {form.effect_text && (
              <span
                style={{
                  padding: "1px 6px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#888",
                  fontSize: "0.55rem",
                  fontFamily: "Orbitron, sans-serif",
                  letterSpacing: "0.05em",
                }}
              >
                {form.effect_text}
              </span>
            )}
          </div>
          <div style={{ color: "#666", fontSize: "0.6rem", fontFamily: "Orbitron, sans-serif", marginTop: "2px" }}>
            Niv. {form.level} / {form.maxLevel}
          </div>
        </div>
      </div>
      {(() => {
        const desc = form.description || form.simpleDesc || "";
        const isHtml = /<[a-z][\s\S]*>/i.test(desc);
        return (
          <div
            style={{ fontSize: "0.72rem", lineHeight: "1.65", color: "#c0c0c0", fontFamily: "Inter, sans-serif" }}
            {...(isHtml ? { dangerouslySetInnerHTML: { __html: desc } } : {})}
          >
            {isHtml ? null : sanitizeAndFormatDescription(desc)}
          </div>
        );
      })()}
    </div>
  );
}

// ── Nœud SVG interactif ──
// node.icon est désormais une URL directe — plus de getLocalIconPath/charId.
function Node({ node, pos, isSelected, onClick }) {
  const style = getNodeStyle(node);
  const stat = isStatNode(node);
  const main = isMainSkill(node);
  const nodeMaxLevel = node.maxLevel || 1;
  const isMaxed = node.level >= nodeMaxLevel;

  const { color, size, ring, shape } = style;
  const half = size / 2;
  const rx = shape === "circle" ? half : 9;
  const alpha = isMaxed ? "ff" : "55";
  const border = isSelected ? color : isMaxed ? color : "rgba(255,255,255,0.3)";
  const bWidth = isSelected ? 2.5 : 1.5;
  const glow = isSelected
    ? `drop-shadow(0 0 8px ${color})`
    : isMaxed && main
      ? `drop-shadow(0 0 5px ${color}88)`
      : "none";

  return (
    <g onClick={() => onClick(node)} style={{ cursor: "pointer", filter: glow }} transform={`translate(${pos.x}, ${pos.y})`}>
      {ring && (
        <rect
          x={-(half + 7)}
          y={-(half + 7)}
          width={size + 14}
          height={size + 14}
          rx={rx + 4}
          fill="none"
          stroke={isMaxed ? color + "44" : "rgba(255,255,255,0.1)"}
          strokeWidth="1"
        />
      )}
      <rect
        x={-half}
        y={-half}
        width={size}
        height={size}
        rx={rx}
        fill={`${color}${alpha}`}
        stroke={border}
        strokeWidth={bWidth}
        opacity={isMaxed ? 1 : 0.65}
      />
      {!stat &&
        (node.icon ? (
          <image
            href={node.icon}
            x={-half + 4}
            y={-half + 4}
            width={size - 8}
            height={size - 8}
            style={{ opacity: isMaxed ? 1 : 0.6 }}
          />
        ) : (
          <rect
            x={-half + 6}
            y={-half + 6}
            width={size - 12}
            height={size - 12}
            rx={shape === "circle" ? (size - 12) / 2 : 4}
            fill="#ffffff"
            opacity={isMaxed ? 0.9 : 0.5}
          />
        ))}
      <text
        y={half + 13}
        textAnchor="middle"
        fill={isMaxed ? "#ffffff" : "#999999"}
        fontSize="8.5"
        fontFamily="Orbitron, sans-serif"
        style={{ userSelect: "none", fontWeight: isMaxed ? "600" : "400" }}
      >
        {stat ? node.propLabel || "✦" : `${node.level}/${nodeMaxLevel}`}
      </text>
    </g>
  );
}

// ── Panneau de détail d'un nœud sélectionné ──
function NodeDetailPanel({
  selectedNode,
  selStyle,
  isSelectedStat,
  isSelectedMain,
  groupedForms,
  traceName,
  traceDesc,
  traceIcon,
  selectedMaxLevel,
}) {
  const color = selStyle?.color || "#d8b467";

  return (
    <div
      style={{
        padding: "14px 16px",
        background: "linear-gradient(135deg, rgba(216,180,103,0.05) 0%, rgba(0,0,0,0.35) 100%)",
        border: `1px solid ${color}33`,
        borderRadius: "10px",
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
          background: color,
          borderRadius: "0 2px 2px 0",
        }}
      />

      {isSelectedMain && groupedForms ? (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <span
              style={{
                color,
                fontSize: "0.65rem",
                fontWeight: 700,
                fontFamily: "Orbitron, sans-serif",
                letterSpacing: "0.06em",
              }}
            >
              {groupedForms.isGrouped ? "FORMES DE LA COMPÉTENCE" : traceName}
            </span>
            <span
              style={{
                padding: "2px 7px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#aaa",
                fontSize: "0.55rem",
                fontFamily: "Orbitron, sans-serif",
              }}
            >
              Niv. {selectedNode.level} / {selectedMaxLevel}
            </span>
          </div>
          {groupedForms.forms.map((form, idx) => (
            <SkillForm key={form.id} form={form} color={color} isFirst={idx === 0} />
          ))}
        </div>
      ) : (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
            {isSelectedStat ? (
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: "rgba(216,180,103,0.1)",
                  border: "1.5px solid #d8b467",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#d8b467",
                  fontSize: "0.6rem",
                  fontWeight: "700",
                  flexShrink: 0,
                }}
              >
                {selectedNode.propLabel || "✦"}
              </div>
            ) : traceIcon ? (
              <img src={traceIcon} alt="" style={{ width: 36, height: 36, borderRadius: "7px", flexShrink: 0 }} />
            ) : (
              <div style={{ width: 36, height: 36, borderRadius: "7px", background: "#ffffff22", flexShrink: 0 }} />
            )}
            <div>
              <span style={{ color, fontSize: "0.82rem", fontWeight: 700, fontFamily: "Inter, sans-serif", display: "block" }}>
                {traceName}
              </span>
              <span
                style={{
                  padding: "1px 7px",
                  borderRadius: "8px",
                  marginTop: "3px",
                  display: "inline-block",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#777",
                  fontSize: "0.55rem",
                  fontFamily: "Orbitron, sans-serif",
                }}
              >
                Niv. {selectedNode.level} / {selectedMaxLevel}
              </span>
            </div>
          </div>
          {traceDesc ? (
            <div
              style={{ fontSize: "0.72rem", lineHeight: "1.65", color: "#c0c0c0", fontFamily: "Inter, sans-serif" }}
              {...(/<[a-z][\s\S]*>/i.test(traceDesc) ? { dangerouslySetInnerHTML: { __html: traceDesc } } : {})}
            >
              {/<[a-z][\s\S]*>/i.test(traceDesc) ? null : sanitizeAndFormatDescription(traceDesc)}
            </div>
          ) : (
            <p style={{ fontSize: "0.68rem", color: "#555", fontStyle: "italic", margin: 0 }}>
              Aucune description disponible.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Composant principal ──
// charId accepté mais plus transmis à useSkillTree (n'en a plus besoin,
// les icônes sont déjà résolues côté backend) — gardé en props par
// compat si un futur usage en a besoin.
export default function SkillTreePanel({ skillTree, path, allSkills }) {
  const {
    hasData,
    positions,
    connections,
    pct,
    unlocked,
    total,
    selected,
    setSelected,
    selectedNode,
    selStyle,
    isSelectedStat,
    isSelectedMain,
    groupedForms,
    traceName,
    traceDesc,
    traceIcon,
    selectedMaxLevel,
  } = useSkillTree({ skillTree, path, allSkills });

  if (!hasData) return <p className="has-text-grey-light is-size-7 p-4">Données de l'arbre indisponibles.</p>;

  return (
    <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", fontFamily: "'Orbitron', sans-serif" }}>
      <div style={{ flex: "0 0 58%", minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
          <span style={{ fontSize: "0.6rem", color: "#d8b467", letterSpacing: "0.1em", whiteSpace: "nowrap" }}>
            TRACES
          </span>
          <div style={{ flex: 1, height: "3px", background: "rgba(255,255,255,0.07)", borderRadius: "2px", overflow: "hidden" }}>
            <div
              style={{
                width: `${pct}%`,
                height: "100%",
                background: "linear-gradient(90deg, #d8b467, #ece3c5)",
                transition: "width 0.4s ease",
                boxShadow: "0 0 6px rgba(216,180,103,0.5)",
              }}
            />
          </div>
          <span style={{ fontSize: "0.6rem", color: "#d8b467", whiteSpace: "nowrap" }}>
            {unlocked}/{total}
          </span>
        </div>

        <div
          style={{
            background: "linear-gradient(180deg, rgba(8,12,20,0.97) 0%, rgba(5,8,15,0.99) 100%)",
            borderRadius: "14px",
            border: "1px solid rgba(216,180,103,0.12)",
            overflow: "hidden",
          }}
        >
          <svg viewBox="0 0 640 520" width="100%" style={{ display: "block" }}>
            <defs>
              <filter id="stp-glow" filterUnits="userSpaceOnUse">
                <feGaussianBlur stdDeviation="2.5" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <ellipse cx="320" cy="260" rx="210" ry="160" fill="rgba(216,180,103,0.025)" />
            {connections.map(({ from, to, maxed }, i) => (
              <line
                key={i}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={maxed ? "rgba(216,180,103,0.75)" : "rgba(255,255,255,0.38)"}
                strokeWidth={maxed ? 2 : 1.4}
                strokeDasharray={maxed ? "none" : "4 4"}
                filter={maxed ? "url(#stp-glow)" : "none"}
              />
            ))}
            {skillTree.map((node) => {
              const pos = positions[node.anchor];
              if (!pos) return null;
              return (
                <Node
                  key={node.id}
                  node={node}
                  pos={pos}
                  isSelected={selected === node.id}
                  onClick={(n) => setSelected((s) => (s === n.id ? null : n.id))}
                />
              );
            })}
          </svg>
        </div>
      </div>

      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
        {selectedNode ? (
          <NodeDetailPanel
            selectedNode={selectedNode}
            selStyle={selStyle}
            isSelectedStat={isSelectedStat}
            isSelectedMain={isSelectedMain}
            groupedForms={groupedForms}
            traceName={traceName}
            traceDesc={traceDesc}
            traceIcon={traceIcon}
            selectedMaxLevel={selectedMaxLevel}
          />
        ) : (
          <div
            style={{
              padding: "20px",
              borderRadius: "10px",
              background: "rgba(0,0,0,0.2)",
              border: "1px solid rgba(255,255,255,0.05)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p style={{ fontSize: "0.63rem", color: "#444", fontStyle: "italic", fontFamily: "Inter, sans-serif", textAlign: "center", margin: 0 }}>
              Clique sur un nœud
              <br />
              pour afficher ses détails
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
