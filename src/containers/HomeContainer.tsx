// HomeContainer.tsx
import APIClient from "../api/client";
import Placeholder from "../components/Placeholder";
import { useQuery } from "react-query";
import { useState } from "react";

type Props = {
  apiClient: APIClient;
};

const DIFFICULTY = "medium"; // Default difficulty
const TYPE = "multiple"; // Default type

export default function HomeContainer(props: Props) {
  const [selectedNumberOfQuestions, setSelectedNumberOfQuestions] = useState<number>(5);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => props.apiClient.getCategories(),
  });

  const { data: questions = [], isLoading: isLoadingQuestions, refetch: refetchQuestions } = useQuery({
    queryKey: ["questions", selectedNumberOfQuestions, selectedCategory], 
    queryFn: () => props.apiClient.getQuestions(String(selectedNumberOfQuestions), selectedCategory ?? "11", DIFFICULTY, TYPE),
    enabled: false, // Initially disabled
  });

  function handleStartGame() {
    console.log("Start Game");
    refetchQuestions();
  }

  function handleSelectCategory(category: string) {
    console.log("Selected category:", category);
    setSelectedCategory(category);
  }

  function handleSelectNumberOfQuestions(number: number) {
    console.log("Selected number of questions:", number);
    setSelectedNumberOfQuestions(number);
  }

  if (isLoadingQuestions || isLoadingCategories) {
    return "Loading...";
  }

  const logCorrectAnswer = (questionIndex: number) => {
    const currentQuestion = questions[questionIndex];
    console.log("Correct answer:", currentQuestion.correct_answer);
  };

  return (
    <Placeholder
      questions={questions}
      categories={categories}
      onSelectCategory={handleSelectCategory}
      onSelectNumberOfQuestions={handleSelectNumberOfQuestions}
      onStartGame={handleStartGame}
      logCorrectAnswer={logCorrectAnswer} 
      selectedNumberOfQuestions={selectedNumberOfQuestions}
      selectedCategory={selectedCategory}
    />
  );
}
