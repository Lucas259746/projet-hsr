export default function useCharacterDetails(activeCharacter) {
  if (!activeCharacter) {
    return { hasCharacter: false };
  }
  return { hasCharacter: true };
}
