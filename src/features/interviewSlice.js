// src/features/interviewSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

const initialState = {
  candidates: [],
  activeInterview: {
    candidateId: null,
    currentQuestionIndex: 0,
    status: "pending", // 'pending', 'paused', 'in-progress', 'completed'
    answers: [],
  },
};

const interviewSlice = createSlice({
  name: "interview",
  initialState,
  reducers: {
    startInterviewProcess: (state, action) => {
      const { name, email, phone } = action.payload;
      const newCandidateId = uuidv4();

      state.candidates.unshift({
        id: newCandidateId,
        name,
        email,
        phone,
        questions: [],
        finalScore: 0,
        summary: "",
        status: "in-progress",
      });

      state.activeInterview = {
        candidateId: newCandidateId,
        currentQuestionIndex: 0,
        status: "in-progress",
        answers: [],
      };
      sessionStorage.setItem("interview_session_active", "true");
    },
    submitAnswer: (state, action) => {
      const { question, answer, score, feedback } = action.payload;
      const activeCandidate = state.candidates.find(
        (c) => c.id === state.activeInterview.candidateId
      );
      if (activeCandidate) {
        activeCandidate.questions.push({ question, answer, score, feedback });
        state.activeInterview.currentQuestionIndex += 1;
      }
    },
    completeInterview: (state, action) => {
      const { finalScore, summary } = action.payload;
      const activeCandidate = state.candidates.find(
        (c) => c.id === state.activeInterview.candidateId
      );
      if (activeCandidate) {
        activeCandidate.finalScore = finalScore;
        activeCandidate.summary = summary;
        activeCandidate.status = "completed";
      }
      state.activeInterview.status = "completed";
      sessionStorage.removeItem("interview_session_active");
    },
    resetActiveInterview: (state) => {
      state.activeInterview = initialState.activeInterview;
      sessionStorage.removeItem("interview_session_active");
    },
    loadInterview: (state, action) => {
      state.activeInterview = { ...action.payload, status: "paused" };
    },
    resumeInterview: (state) => {
      if (state.activeInterview.status === "paused") {
        state.activeInterview.status = "in-progress";
      }
    },
  },
});

export const {
  startInterviewProcess,
  submitAnswer,
  completeInterview,
  resetActiveInterview,
  loadInterview,
  resumeInterview,
} = interviewSlice.actions;

export default interviewSlice.reducer;
