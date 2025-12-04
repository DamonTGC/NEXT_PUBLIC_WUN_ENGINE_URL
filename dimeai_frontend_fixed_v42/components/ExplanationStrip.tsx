export default function ExplanationStrip({ text }: { text: string }) {
  if (!text) return null;
  return (
    <div className="explain-strip">
      <strong>WUN Engine focus:</strong>
      <span>{text}</span>
    </div>
  );
}
