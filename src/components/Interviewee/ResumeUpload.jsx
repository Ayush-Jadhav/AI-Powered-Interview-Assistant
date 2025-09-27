import React from 'react';
import { useDispatch } from 'react-redux';
import { Upload, Button, message, Card, Form, Input } from 'antd';
import { UploadOutlined, UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import { startInterviewProcess, resetActiveInterview } from '../../features/interviewSlice';

// Required for pdfjs-dist
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

const ResumeUploader = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  // --- NEW, MORE ROBUST EXTRACTION LOGIC ---
  const extractInfo = (text) => {
    const emailRegex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i;
    const phoneRegex = /(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/;
    
    let name = '';

    // 1. Try to find a capitalized name (Firstname Lastname) at the beginning of the text.
    // This is much more reliable than just grabbing the first line.
    const nameMatch = text.match(/^\s*([A-Z][a-z]+(?:\s[A-Z][a-z]+)+)/);
    if (nameMatch) {
      name = nameMatch[0].trim();
    } else {
      // 2. As a fallback, use the original method.
      // This might still be useful for resumes with unusual formatting.
      name = text.split('\n')[0].trim();
      // 3. If the fallback grabs too much text (likely the whole resume), clear it.
      if (name.length > 50) {
        name = ''; 
      }
    }

    const email = text.match(emailRegex)?.[0] || '';
    const phone = text.match(phoneRegex)?.[0] || '';
    
    return { name, email, phone };
  };

  const handleFileUpload = async (file) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = async (e) => {
      try {
        const doc = await pdfjsLib.getDocument(e.target.result).promise;
        let text = '';
        for (let i = 1; i <= doc.numPages; i++) {
          const page = await doc.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map(item => item.str).join('\n'); 
        }
        const info = extractInfo(text);
        form.setFieldsValue(info);
        message.success('Resume parsed! Please confirm the details below.');
      } catch (error) {
        console.error('PDF Parsing Error:', error);
        message.error('Failed to parse PDF. Please fill in the details manually.');
      }
    };
    return false;
  };
  
  const onFinish = (values) => {
    dispatch(resetActiveInterview());
    dispatch(startInterviewProcess(values));
  };

  return (
    <Card title="Start Your Interview">
      <Upload beforeUpload={handleFileUpload} showUploadList={false} accept=".pdf">
        <Button icon={<UploadOutlined />}>Upload Resume (PDF)</Button>
      </Upload>
      <p style={{ margin: '1rem 0', color: '#888' }}>
        We'll try to extract your Name, Email, and Phone. Please verify and fill any missing fields.
      </p>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
          <Input prefix={<UserOutlined />} placeholder="Your Name" />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
          <Input prefix={<MailOutlined />} placeholder="your@email.com" />
        </Form.Item>
        <Form.Item name="phone" label="Phone Number" rules={[{ required: true }]}>
          <Input prefix={<PhoneOutlined />} placeholder="Your Phone Number" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">Start Interview</Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ResumeUploader;