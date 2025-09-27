// src/components/Interviewee/InterviewChat.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Input, Button, Progress, Spin, Typography } from 'antd';
import { useInterviewTimer } from '../../hooks/useInterviewTimer';
import { generateQuestion, evaluateAnswer, generateFinalSummary } from '../../services/aiService';
import { submitAnswer, completeInterview } from '../../features/interviewSlice';

const { Title, Text } = Typography;
const { TextArea } = Input;

const TOTAL_QUESTIONS = 6;
const TIMERS = { easy: 20, medium: 60, hard: 120 };

const InterviewChat = () => {
  const dispatch = useDispatch();
  const { activeInterview, candidates } = useSelector((state) => state.interview);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 1. Add a new state to explicitly control the timer
  const [isTimerActive, setIsTimerActive] = useState(false);

  const answerRef = useRef(answer);
  useEffect(() => {
    answerRef.current = answer;
  }, [answer]);

  const isPaused = activeInterview.status === 'paused';
  const qIndex = activeInterview.currentQuestionIndex;

  const getTimerDuration = useCallback(() => {
    if (qIndex < 2) return TIMERS.easy;
    if (qIndex < 4) return TIMERS.medium;
    return TIMERS.hard;
  }, [qIndex]);

  const handleTimeUp = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);
    setIsTimerActive(false); // Stop the timer on submit
    const { score, feedback } = await evaluateAnswer(currentQuestion, answerRef.current);
    dispatch(submitAnswer({ question: currentQuestion, answer: answerRef.current, score, feedback }));
    setAnswer('');
    // No need to set isLoading to false, the useEffect will handle it
  }, [dispatch, isLoading, currentQuestion]);

  // 2. Control the timer's duration with our new state
  const timeLeft = useInterviewTimer(isTimerActive ? getTimerDuration() : 0, handleTimeUp);

  useEffect(() => {
    if (isPaused) return;
    const activeCandidate = candidates.find(c => c.id === activeInterview.candidateId);
    if (qIndex >= TOTAL_QUESTIONS) {
      if (activeCandidate && activeCandidate.status !== 'completed') {
        setIsLoading(true);
        const totalScore = activeCandidate.questions.reduce((acc, q) => acc + q.score, 0);
        const finalScore = (totalScore / (activeCandidate.questions.length * 10)) * 10;
        
        generateFinalSummary({ ...activeCandidate, finalScore }).then(summary => {
          dispatch(completeInterview({ finalScore, summary: summary || "Summary could not be generated." }));
          setIsLoading(false);
        });
      }
      return;
    }
    
    setIsLoading(true);
    setIsTimerActive(false); // Ensure timer is off while loading

    generateQuestion(qIndex, activeCandidate?.questions.map(q => q.question) || []).then(q => {
      setCurrentQuestion(q);
      setIsLoading(false);
      // 3. Start the timer only AFTER the question has been loaded and displayed
      setIsTimerActive(true); 
    });
  }, [qIndex, dispatch, activeInterview.candidateId, candidates, isPaused]);

  if (isPaused) {
    return <Spin tip="Waiting to resume..." />;
  }
  
  if (qIndex >= TOTAL_QUESTIONS && isLoading) {
    return <Spin tip="Calculating your results..." />;
  }
  
  const handleSubmit = () => {
    handleTimeUp();
  };

  return (
    <div>
      <Progress percent={Math.round(((qIndex) / TOTAL_QUESTIONS) * 100)} />
      <Title level={4}>Question {qIndex + 1} of {TOTAL_QUESTIONS}</Title>
      
      {isLoading ? (
        <Spin tip="Generating next question..." />
      ) : (
        <>
          <Text strong>{currentQuestion}</Text>
          <div style={{ margin: '1rem 0' }}>
            <Progress type="circle" percent={isTimerActive ? Math.round((timeLeft / getTimerDuration()) * 100) : 100} format={() => `${timeLeft}s`} />
          </div>
          <TextArea rows={6} value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Type your answer here..." />
          <Button type="primary" onClick={handleSubmit} style={{ marginTop: '1rem' }}>Submit Answer</Button>
        </>
      )}
    </div>
  );
};

export default InterviewChat;
