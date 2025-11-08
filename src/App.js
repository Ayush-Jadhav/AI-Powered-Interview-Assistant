import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Layout, Menu, Modal } from "antd";
import IntervieweeView from "./pages/IntervieweeView";
import InterviewerView from "./pages/InterviewerDashboard";
import {
  loadInterview,
  resetActiveInterview,
  resumeInterview,
} from "./features/interviewSlice";
import "./App.css";

const { Header, Content } = Layout;

function App() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch = useDispatch();
  const activeInterview = useSelector(
    (state) => state.interview.activeInterview
  );

  useEffect(() => {
    const isSessionActive = sessionStorage.getItem("interview_session_active");

    // Check for a persisted interview that hasn't been paused yet
    if (
      activeInterview &&
      activeInterview.status === "in-progress" &&
      !isSessionActive
    ) {
      // Dispatch an action to formally pause it
      dispatch(loadInterview(activeInterview));
      setIsModalVisible(true);
    }

    sessionStorage.setItem("interview_session_active", "true");
  }, [activeInterview, dispatch]);

  const handleResume = () => {
    dispatch(resumeInterview());
    setIsModalVisible(false);
  };

  const handleStartNew = () => {
    // resets entire interview state
    dispatch(resetActiveInterview());
    setIsModalVisible(false);
  };

  return (
    <Router>
      <Layout className="layout">
        <Header>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
            <Menu.Item key="1">
              <NavLink to="/">Interviewee</NavLink>
            </Menu.Item>
            <Menu.Item key="2">
              <NavLink to="/interviewer">Interviewer</NavLink>
            </Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: "50px" }}>
          <div className="site-layout-content">
            <Routes>
              <Route path="/" element={<IntervieweeView />} />
              <Route path="/interviewer" element={<InterviewerView />} />
            </Routes>
          </div>
        </Content>
      </Layout>

      <Modal
        title="Welcome Back!"
        visible={isModalVisible}
        onOk={handleResume}
        onCancel={handleStartNew}
        okText="Resume Interview"
        cancelText="Start New"
        closable={false}
      >
        <p>
          You have an interview in progress. Would you like to continue where
          you left off?
        </p>
      </Modal>
    </Router>
  );
}

export default App;
