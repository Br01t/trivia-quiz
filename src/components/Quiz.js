import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
} from "@mui/material";
import Loading from "./Loading.js";
import Leaderboard from "./Leaderboard.js";

const Quiz = () => {
  const [question, setQuestion] = useState({});
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [lastClicked, setLastClicked] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [helped, setHelped] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    axios
      .get("https://the-trivia-api.com/api/questions?limit=1&difficulty=medium")
      .then((res) => {
        setQuestion(res.data[0]);
        setOptions([
          res.data[0].correctAnswer,
          ...res.data[0].incorrectAnswers,
        ]);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (lastClicked) {
      const timer = setTimeout(() => {
        setDisabled(false);
      }, 180000);
      return () => clearTimeout(timer);
    }
  }, [lastClicked]);

  const handleButtonClick = () => {
    if (!disabled) {
      setSelectedAnswer(null);
      setQuestion([]);
      setOptions([]);
      setLastClicked(Date.now());
      setDisabled(true);
      setGameOver(false);
      fetchData();
    }
  };

  const handleHelpClick = () => {
    if (!helped) {
      let incorrectOptions = options.filter(
        (option) => option !== question.correctAnswer
      );
      setOptions([
        question.correctAnswer,
        incorrectOptions[Math.floor(Math.random() * incorrectOptions.length)],
      ]);
      setHelped(true);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div style={{ backgroundColor: "lightskyblue" }}>
      <u>
        <Typography variant="h3" align="center" padding="5px">
          Trivia Quiz
        </Typography>
      </u>
      {loading ? (
        <Loading />
      ) : (
        <Card
          margin="auto"
          style={{ padding: "5px", backgroundColor: "#66b6d2" }}
        >
          <CardContent style={{ padding: "5px" }}>
            <Typography variant="h5">{question.question}</Typography>
          </CardContent>
          <CardActions>
            {options
              .sort(() => Math.random() - 0.5)
              .map((option, index) => (
                <Button
                  key={index}
                  color="primary"
                  variant="contained"
                  style={{
                    margin: "10px",
                    backgroundColor:
                      selectedAnswer === question.correctAnswer
                        ? "green"
                        : "primary",
                  }}
                  onClick={() => {
                    if (gameOver) {
                      return;
                    }
                    setSelectedAnswer(option);
                    if (option === question.correctAnswer) {
                      setScore(score + 1);
                      setTimeout(() => {
                        setSelectedAnswer(null);
                        setQuestion({});
                        setOptions([]);
                        fetchData();
                      }, 2000);
                    } else {
                      setGameOver(true);
                    }
                  }}
                  disabled={gameOver}
                >
                  {option}
                </Button>
              ))}
          </CardActions>
          {selectedAnswer !== null && (
            <CardContent>
              <Typography
                variant="h6"
                style={{
                  color:
                    selectedAnswer === question.correctAnswer ? "green" : "red",
                }}
              >
                {selectedAnswer === question.correctAnswer
                  ? `Correct: "${question.correctAnswer}"`
                  : `Incorrect, right answer was "${question.correctAnswer}"`}
              </Typography>
            </CardContent>
          )}
          <CardActions>
            <Button
              color={disabled ? "error" : "primary"}
              variant="contained"
              onClick={handleButtonClick}
              style={{ padding: "5px", margin: "auto" }}
            >
              New Question (only once every 3 minutes)
            </Button>
            <Button
              color={helped ? "error" : "primary"}
              variant="contained"
              onClick={handleHelpClick}
              style={{ padding: "5px", margin: "auto" }}
            >
              50/50
            </Button>
          </CardActions>
        </Card>
      )}
      {selectedAnswer !== null && gameOver && (
        <CardContent>
          <Typography
            variant="h6"
            style={{
              color:
                selectedAnswer === question.correctAnswer ? "green" : "red",
            }}
          ></Typography>
          <Button
            color="primary"
            variant="contained"
            onClick={() => {
              setScore(0);
              setSelectedAnswer(null);
              setQuestion({});
              setOptions([]);
              setGameOver(false);
              setDisabled(false);
              fetchData();
              setHelped(false);
            }}
            style={{ padding: "5px", marginTop: "10px" }}
          >
            Start New Game
          </Button>
        </CardContent>
      )}

      <Typography variant="h5" style={{ padding: "5px", marginTop: "10px" }}>
        Score: {score}
      </Typography>
      <Leaderboard
        score={score}
        style={{ padding: "5px", marginTop: "10px" }}
      ></Leaderboard>
    </div>
  );
};

export default Quiz;