import { Math } from "@/components/Math";

export default function OCRResults({ questions }: { questions: string[] }) {
  return (
    <div>
      {questions.map((q, i) => (
        <div key={i} className="mb-4">
          <Math>{q}</Math>
        </div>
      ))}
    </div>
  );
} 