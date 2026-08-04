// Simplifié : l'icône vient désormais directement de
// activeCharacter.iconUrl (fournie par l'API HoYoLab), plus besoin de
// chercher dans un imageMap local.

export default function useCharacterDetails(activeCharacter) {
  if (!activeCharacter) {
    return { hasCharacter: false };
  }
  return { hasCharacter: true };
}
