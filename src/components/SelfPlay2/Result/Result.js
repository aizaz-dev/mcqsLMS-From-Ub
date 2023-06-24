import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Result.scss";
import {
  addDoc,
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../firebase";
const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("userId");
  const lessonId = queryParams.get("lessonId");
  const chapterId = queryParams.get("chapterId");
  const lessonName = queryParams.get("lessonName");
  const score = queryParams.get("score");
  const questionsLength = queryParams.get("questionsLength");

  const storeScoreToFirestore = async () => {
    try {
      const totalQuestions = questionsLength;
      const percentage = Math.round((score / totalQuestions) * 100);

      const querySnapshot = await getDocs(
        query(
          collection(db, "result"),
          where("userId", "==", userId),
          where("lessonId", "==", lessonId)
        )
      );

      if (!querySnapshot.empty) {
        // User has already taken the quiz, update the existing document
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, {
          score: score,
          totalQuestions: totalQuestions,
          percentage: percentage,
        });

        console.log("Score updated successfully");
      } else {
        // User is taking the quiz for the first time, create a new document
        const docRef = await addDoc(collection(db, "result"), {
          score: score,
          totalQuestions: totalQuestions,
          percentage: percentage,
          userId: userId,
          chapterId: chapterId,
          lessonName: lessonName,
          lessonId: lessonId,

          // timeTaken: `${displayTime} s`,
          // timeUnit: "s",
        });
        console.log("Score stored successfully with ID:", docRef.id);
      }

      // setScoreStored(true);
    } catch (error) {
      console.error("Error storing/updating score:", error);
    }
  };
  useEffect(() => {
    storeScoreToFirestore();
  }, []);
  return (
    <div className="quiz_result_container">
      <div className="quiz_result">
        <div className="quiz_result_header">
          <h2>Quiz completed!</h2>
        </div>
        <div className="quiz_result_body">
          <p>
            Your score: {score} out of {questionsLength}
          </p>
          <p>{/* Time taken: {timeTaken} {timeUnit} */}</p>
          {/* {location} */}
          <div
            onClick={() => navigate(`/selfstudy/ground/${lessonId}`)}
            className="quiz_result_body_btn"
          >
            Play Again
          </div>
        </div>
        <div className="quiz_result_footer"></div>
      </div>
    </div>
  );
};

export default Result;
