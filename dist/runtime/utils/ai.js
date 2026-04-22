export function getTextFromMessage(message) {
  return message.parts.filter((part) => part.type === "text").map((part) => part.text).join("");
}
export function isPartStreaming(part) {
  return part.state === "streaming";
}
export function isToolStreaming(part) {
  return !["output-available", "output-error", "output-denied"].includes(part.state);
}
export function isReasoningStreaming(message, partIndex, chat) {
  if (chat.status !== "streaming") return false;
  if (message.id !== chat.messages.at(-1)?.id) return false;
  if (partIndex < 0 || partIndex >= message.parts.length) return false;
  const partType = message.parts[partIndex].type;
  for (let i = partIndex + 1; i < message.parts.length; i++) {
    if (message.parts[i].type !== partType) return false;
  }
  return true;
}
