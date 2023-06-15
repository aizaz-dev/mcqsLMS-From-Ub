import React, { useState, useEffect } from "react";
import "./Questions.scss";
import Question from "../Question/Question";
import { db } from "../../../firebase";
import { collection, addDoc } from "firebase/firestore";
import Result from "../Result/Result";

// <added

const Questions = ({ singleLesson }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [scoreStored, setScoreStored] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [displayTime, setDisplayTime] = useState(0);
  const [timeUnit, setTimeUnit] = useState("s");
  const [totalTimeTaken, setTotalTimeTaken] = useState(0);
  const questions = singleLesson.questions;
  const currentQuestion = questions[currentQuestionIndex];
  const timeLimit = currentQuestion?.timeLimit || 30;

  useEffect(() => {
    if (currentQuestionIndex === 0) {
      setStartTime(new Date());
    }
  }, [currentQuestionIndex]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleNextQuestion();
    }, timeLimit * 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [currentQuestionIndex, timeLimit]);

  const handleNextQuestion = (answer) => {
    const correctArray = currentQuestion?.options
      .filter((item) => item.correct)
      .map((item) => item.text);

    const isCorrect = correctArray?.includes(answer);

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }
    setSelectedAnswer("");

    if (currentQuestionIndex + 1 >= questions.length && !scoreStored) {
      setEndTime(new Date());
      setScoreStored(true);
      console.log("StartTime:", startTime);
      console.log("EndTime:", endTime);
      storeScoreToFirestore();
    } else {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const onSelectAnswer = (answer) => {
    setSelectedAnswer(answer);
    handleNextQuestion(answer);
  };

  const localData = localStorage.getItem("userData");
  const id = localData ? JSON.parse(localData).userId : null;

  const storeScoreToFirestore = async () => {
    try {
      const timeTaken = Math.abs(Math.floor((endTime - startTime) / 1000));
      const calculatedDisplayTime =
        timeTaken >= 60 ? Math.floor(timeTaken / 60) : timeTaken;
      const calculatedTimeUnit = timeTaken >= 60 ? "min" : "s";
      setDisplayTime(calculatedDisplayTime);
      setTimeUnit(calculatedTimeUnit);

      const totalQuestions = questions.length;
      const percentage = (score / totalQuestions) * 100;
     
      const docRef = await addDoc(collection(db, "result"), {
        score: score,
        totalQuestions: totalQuestions,
        percentage: percentage,
        userId: id,
        chapterId: singleLesson.chapterId,
        lessonId: singleLesson.id,
        timeTaken: calculatedDisplayTime,
        timeUnit: calculatedTimeUnit,
      });

      console.log("Score stored successfully with ID:", docRef.id);
    } catch (error) {
      console.error("Error storing score:", error);
    }
  };

  useEffect(() => {
    if (scoreStored) {
      const totalTime = Math.abs(Math.floor((endTime - startTime) / 1000));
      const calculatedTotalTimeTaken =
        totalTime >= 60 ? Math.floor(totalTime / 60) : totalTime;
      const calculatedTimeUnit = totalTime >= 60 ? "min" : "s";

      setTotalTimeTaken(calculatedTotalTimeTaken);
      setTimeUnit(calculatedTimeUnit);
    }
  }, [scoreStored, endTime, startTime]);

  if (questions.length === 0) {
    return <div>No questions available</div>;
  }

  if (currentQuestionIndex >= questions.length) {
    return (
      <Result
        score={score}
        totalQuestions={questions.length}
        timeTaken={displayTime}
        timeUnit={timeUnit}
        totalTimeTaken={totalTimeTaken}
      />
    );
  }

  return (
    <Question
      question={currentQuestion.text}
      options={currentQuestion.options}
      onSelectAnswer={onSelectAnswer}
    />
  );
};

export default Questions;
