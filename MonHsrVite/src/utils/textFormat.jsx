const genderPattern = /\{F#([^}]*)\}\{M#[^}]*\}/gi;
const reverseGenderPattern = /\{M#([^}]*)\}\{F#[^}]*\}/gi;
const genderTagPattern = /\{[FM]#([^}]*)\}/gi;
const numericPlaceholderPattern = /#(\d+)\[[^\]]+\]/gi;

function removeGenderVariants(value) {
  return value
    .replace(genderPattern, "$1")
    .replace(reverseGenderPattern, "$1")
    .replace(genderTagPattern, "$1");
}

export const sanitizeName = (value) => {
  if (!value) return "";
  return removeGenderVariants(String(value).replace(/<\/?unbreak>/gi, "")).trim();
};

export const formatSkillLevel = (level, bonusLevel = 0) =>
  bonusLevel > 0 ? `${level}+${bonusLevel}` : String(level);

export const sanitizeAndFormatDescription = (text) => {
  if (!text) return "Aucune description disponible.";
  const cleaned = removeGenderVariants(String(text))
    .replace(/<\/?u>/gi, "")
    .replace(/<\/?unbreak>/gi, "")
    .replace(/<\/?i>/gi, "")
    .replace(numericPlaceholderPattern, "valeur $1")
    .replace(/\\n/g, "\n");

  const lines = cleaned.split(/\n/g).map((line) => line.replace(/\s+/g, " ").trim());
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
