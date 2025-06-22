import React from 'react';
import Layout from '../components/Layout';
import { Col, Form, Row, Input, TimePicker, message } from 'antd';
import '../index.css'; 
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { showLoading, hideLoading } from '../redux/features/alertSlice';
import axios from 'axios';
import moment from 'moment';

const ApplyDoctor = () => {
  const { user } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleFinish = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post('/api/v1/user/apply-doctor',
        {
          ...values,
          userId: user._id,
          timings: [
            moment(values.timings[0]).format("HH:mm"),
            moment(values.timings[1]).format("HH:mm"),
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
        navigate('/');
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error('Something Went Wrong');
    }
  };

  return (
    <Layout>
      <h1 className='text-center'>Apply Doctor</h1>
      <Form layout='vertical' onFinish={handleFinish} className='m-3'>
        <h4>Personal Details:</h4>
        <Row gutter={20}>
          <Col xs={24} md={8}>
            <Form.Item
              label='First Name'
              name='firstName'
              rules={[{ required: true, message: 'Please enter your first name' }]}
            >
              <Input placeholder='Your first name' />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              label='Last Name'
              name='lastName'
              rules={[{ required: true, message: 'Please enter your last name' }]}
            >
              <Input placeholder='Your last name' />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              label='Phone No'
              name='phone'
              rules={[{ required: true, message: 'Please enter your phone number' }]}
            >
              <Input placeholder='Your contact number' />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              label='Email'
              name='email'
              rules={[{ required: true, message: 'Please enter your email' }]}
            >
              <Input placeholder='Your email address' />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              label='Website'
              name='website'
            >
              <Input placeholder='Your website (optional)' />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              label='Address'
              name='address'
              rules={[{ required: true, message: 'Please enter your address' }]}
            >
              <Input placeholder='Your clinic address' />
            </Form.Item>
          </Col>
        </Row>

        <h4>Professional Details:</h4>
        <Row gutter={20}>
          <Col xs={24} md={8}>
            <Form.Item
              label='Specialization'
              name='specialization'
              rules={[{ required: true, message: 'Please enter your specialization' }]}
            >
              <Input placeholder='Your specialization' />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              label='Experience'
              name='experience'
              rules={[{ required: true, message: 'Please enter your experience' }]}
            >
              <Input placeholder='Your experience in years' />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              label='Fee Per Consultation'
              name='feesPerConsultation'
              rules={[{ required: true, message: 'Please enter fee per consultation' }]}
            >
              <Input placeholder='Consultation fee' />
            </Form.Item>
          </Col>

          <Col xs={24} md={8}>
            <Form.Item
              label='Timings'
              name='timings'
              rules={[{ required: true, message: 'Please select your timings' }]}
            >
              <TimePicker.RangePicker format="HH:mm" />
            </Form.Item>
          </Col>

          <Col xs={24} md={8} lg={8}></Col>
          <Col xs={24} md={8} lg={8}>
            <button className='btn btn-primary form-btn' type='submit'>
              Submit
            </button>
          </Col>
        </Row>
      </Form>
    </Layout>
  );
};

export default ApplyDoctor;
