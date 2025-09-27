import React from 'react';
import { useSelector } from 'react-redux';
import ResumeUploader from '../components/Interviewee/ResumeUpload';
import InterviewChat from '../components/Interviewee/InterviewChat';
import { Card, Typography } from 'antd';

const { Title, Text } = Typography;

const IntervieweeView = () => {
  const { activeInterview, candidates } = useSelector((state) => state.interview);
  const activeCandidate = candidates.find(c => c.id === activeInterview.candidateId);

  const renderContent = () => {
    switch (activeInterview.status) {
      case 'in-progress':
        return <InterviewChat />;
      case 'completed':
        return (
          <Card>
            <Title level={3}>Interview Complete!</Title>
            <Text>Thank you, {activeCandidate?.name}. The interviewer will review your results.</Text>
            <br />
            <Text strong>Final Score: {activeCandidate?.finalScore.toFixed(2)} / 10</Text>
          </Card>
        );
      default:
        return <ResumeUploader />;
    }
  };

  return (
    <div>
      <Title level={2}>AI Interview Assistant</Title>
      {renderContent()}
    </div>
  );
};

export default IntervieweeView;