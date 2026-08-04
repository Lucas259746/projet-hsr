// src/utils/textFormat.jsx
//
// Fonctions pures de nettoyage/format de texte, partagées par plusieurs
// composants (CharacterDetails, SkillCard, BottomSection...).
// Avant, SkillCard.jsx et BottomSection.jsx importaient ces fonctions
// depuis CharacterDetails.jsx (un composant) — mauvaise pratique corrigée
// ici avec un fichier utilitaire dédié.

export const sanitizeName = (value) => {
  if (!value) return "";
  return String(value)
    .replace(/<\/?unbreak>/gi, "")
    .replace(/\{F#([^}]*)\}\{M#[^}]*\}/gi, "$1")
    .replace(/\{M#([^}]*)\}\{F#[^}]*\}/gi, "$1")
    .replace(/\{[FM]#([^}]*)\}/gi, "$1")
    .trim();
};

export const sanitizeAndFormatDescription = (text) => {
  if (!text) return "Aucune description disponible.";
  const cleaned = String(text)
    .replace(/<\/?u>/gi, "")
    .replace(/<\/?unbreak>/gi, "")
    .replace(/<\/?i>/gi, "")
    .replace(/\{F#([^}]*)\}\{M#[^}]*\}/gi, "$1")
    .replace(/\{M#([^}]*)\}\{F#[^}]*\}/gi, "$1")
    .replace(/\{[FM]#([^}]*)\}/gi, "$1")
    .replace(/\s+/g, " ")
    .trim();

  const lines = cleaned.split(/\\n|\n/g);
  const colorRegex = /<color=([^>]+)>(.*?)<\/color>/gi;

  return lines.map((line, li) => {
    const parts = [];
    let last = 0;
    let m;
    colorRegex.lastIndex = 0;

    while ((m = colorRegex.exec(line)) !== null) {
      if (m.index > last) parts.push(line.substring(last, m.index));
      parts.push(
        <span
          key={`c-${li}-${m.index}`}
          style={{ color: m[1].substring(0, 7), fontWeight: "bold" }}
        >
          {m[2]}
        </span>,
      );
      last = colorRegex.lastIndex;
    }
    if (last < line.length) parts.push(line.substring(last));
    return (
      <span key={`l-${li}`}>
        {parts.length ? parts : line}
        {li < lines.length - 1 && <br />}{" "}
      </span>
    );
  });
};
