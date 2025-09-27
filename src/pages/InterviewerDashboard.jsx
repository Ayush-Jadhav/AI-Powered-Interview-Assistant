import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Table, Modal, Tag, Input, Typography, Card } from 'antd';

const { Title, Text } = Typography;
const { Search } = Input;

const InterviewerDashboard = () => {
  const { candidates } = useSelector((state) => state.interview);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status',
      render: status => <Tag color={status === 'completed' ? 'green' : 'blue'}>{status.toUpperCase()}</Tag>
    },
    { 
      title: 'Final Score', 
      dataIndex: 'finalScore', 
      key: 'finalScore', 
      sorter: (a, b) => a.finalScore - b.finalScore,
      render: score => score > 0 ? score.toFixed(2) : 'N/A'
    },
  ];

  const handleRowClick = (candidate) => {
    setSelectedCandidate(candidate);
    setIsModalVisible(true);
  };
  
  const filteredCandidates = candidates.filter(c => 
    c.name.toLowerCase().includes(searchText.toLowerCase()) || 
    c.email.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      <Title level={2}>Interviewer Dashboard</Title>
      <Search
        placeholder="Search by name or email"
        onChange={e => setSearchText(e.target.value)}
        style={{ marginBottom: 16 }}
      />
      <Table
        dataSource={filteredCandidates}
        columns={columns}
        rowKey="id"
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
          style: { cursor: 'pointer' }
        })}
      />
      {selectedCandidate && (
        <Modal
            title={`Interview Details: ${selectedCandidate.name}`}
            visible={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
            footer={null}
            width={800}
        >
            <Card>
                <p><Text strong>Email:</Text> {selectedCandidate.email}</p>
                <p><Text strong>Phone:</Text> {selectedCandidate.phone}</p>
                {selectedCandidate.status === 'completed' && (
                  <>
                    <p><Text strong>Final Score:</Text> <Tag color="blue">{selectedCandidate.finalScore.toFixed(2)} / 10</Tag></p>
                    <p><Text strong>AI Summary:</Text> {selectedCandidate.summary}</p>
                  </>
                )}
            </Card>
            <Title level={4} style={{marginTop: '1rem'}}>Q&A History</Title>
            {selectedCandidate.questions.map((q, index) => (
            <div key={index} style={{ marginBottom: '1rem', borderBottom: '1px solid #f0f0f0', paddingBottom: '1rem' }}>
                <p><strong>Q{index+1}: {q.question}</strong></p>
                <p style={{whiteSpace: 'pre-wrap', background: '#fafafa', padding: '10px', borderRadius: '4px'}}>A: {q.answer || '(No answer provided)'}</p>
                <p><Tag color="purple">Score: {q.score}/10</Tag></p>
            </div>
            ))}
        </Modal>
      )}
    </>
  );
};

export default InterviewerDashboard;