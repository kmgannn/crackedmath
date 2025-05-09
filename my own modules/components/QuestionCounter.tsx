import { useQuestionStatus } from "@/hooks/useQuestionStatus";

export const QuestionCounter = () => {
  const { questionsThisMonth, subscriptionStatus, extraPacks, loading, error } = useQuestionStatus();

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const FREE_LIMIT = 10;
  const SUBSCRIPTION_LIMIT = 40;

  let message = "";
  let action: React.ReactNode = null;

  if (questionsThisMonth < FREE_LIMIT) {
    message = `You have ${FREE_LIMIT - questionsThisMonth} free questions left this month.`;
  } else if (questionsThisMonth < SUBSCRIPTION_LIMIT) {
    if (subscriptionStatus === "active") {
      message = `You have ${SUBSCRIPTION_LIMIT - questionsThisMonth} questions left in your subscription this month.`;
    } else {
      message = "You've used your 10 free questions. Subscribe to unlock 30 more this month!";
      action = (
        <a
          href="/subscribe"
          className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Subscribe for $3.99/month
        </a>
      );
    }
  } else {
    if (extraPacks > 0) {
      message = `You have ${extraPacks * 10 - (questionsThisMonth - SUBSCRIPTION_LIMIT)} questions left in your extra packs.`;
    } else {
      message = "You've reached your monthly limit. Buy 10 more questions for $0.99!";
      action = (
        <a
          href="/buy-pack"
          className="ml-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Buy 10 More
        </a>
      );
    }
  }

  return (
    <div className="p-4 border border-border rounded-lg bg-background flex flex-col items-center">
      <span className="text-lg font-semibold">{message}</span>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
};
