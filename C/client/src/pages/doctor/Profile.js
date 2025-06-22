import React, { useEffect, useState } from 'react';
import Layout from './../../components/Layout';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Col, Form, Row, Input, TimePicker, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../../redux/features/alertSlice';
import dayjs from 'dayjs';

const Profile = () => {
  const { user } = useSelector((state) => state.user);
  const [doctor, setDoctor] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const [form] = Form.useForm();

  useEffect(() => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
  }, []);

  const handleFinish = async (values) => {
    try {
      dispatch(showLoading());

      const timings = values.timings
        ? [values.timings[0].format('HH:mm'), values.timings[1].format('HH:mm')]
        : doctor.timings;

      const res = await axios.post('/api/v1/doctor/updateProfile', {
        ...values,
        timings,
        userId: user?._id,
      });

      dispatch(hideLoading());

      if (res.data.success) {
        message.success(res.data.message || 'Profile updated successfully');
        navigate('/');
      } else {
        message.error(res.data.message || 'Update failed');
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error(error);
      message.error('Something went wrong');
    }
  };

  const getDoctorInfo = async () => {
    try {
      if (!params.id) {
        message.error('No user ID found in URL');
        return;
      }

      const res = await axios.post('/api/v1/doctor/getDoctorInfo', {
        userId: params.id,
      });

      if (res.data.success && res.data.data) {
        const doctorData = res.data.data;

        doctorData.timings = [
          dayjs(doctorData.timings[0], 'HH:mm'),
          dayjs(doctorData.timings[1], 'HH:mm'),
        ];

        setDoctor(doctorData);
        form.setFieldsValue(doctorData);
      } else {
        message.error(res.data.message || 'Doctor not found');
      }
    } catch (error) {
      console.error(error);
      message.error('Something went wrong while fetching profile');
    }
  };

  useEffect(() => {
    if (params.id) {
      getDoctorInfo();
    } else {
      message.error('Missing user ID in URL');
    }
  }, [params.id]);

  return (
    <Layout>
      <h1 className="text-center">Manage Profile</h1>
      {doctor && (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          className="m-3"
          initialValues={{
            ...doctor,
            timings: [
              dayjs(doctor.timings[0], 'HH:mm'),
              dayjs(doctor.timings[1], 'HH:mm'),
            ],
          }}
        >
          <h4>Personal Details:</h4>
          <Row gutter={20}>
            <Col xs={24} md={8}>
              <Form.Item
                label="First Name"
                name="firstName"
                rules={[{ required: true, message: 'Please enter your first name' }]}
              >
                <Input placeholder="Your first name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Last Name"
                name="lastName"
                rules={[{ required: true, message: 'Please enter your last name' }]}
              >
                <Input placeholder="Your last name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Phone No"
                name="phone"
                rules={[{ required: true, message: 'Please enter your phone number' }]}
              >
                <Input placeholder="Your contact number" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Please enter your email' }]}
              >
                <Input placeholder="Your email address" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Website" name="website">
                <Input placeholder="Your website (optional)" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Address"
                name="address"
                rules={[{ required: true, message: 'Please enter your address' }]}
              >
                <Input placeholder="Your clinic address" />
              </Form.Item>
            </Col>
          </Row>

          <h4>Professional Details:</h4>
          <Row gutter={20}>
            <Col xs={24} md={8}>
              <Form.Item
                label="Specialization"
                name="specialization"
                rules={[{ required: true, message: 'Please enter your specialization' }]}
              >
                <Input placeholder="Your specialization" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Experience"
                name="experience"
                rules={[{ required: true, message: 'Please enter your experience' }]}
              >
                <Input placeholder="Your experience in years" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Fee Per Consultation"
                name="feesPerCunsaltation"
                rules={[{ required: true, message: 'Please enter fee per consultation' }]}
              >
                <Input placeholder="Consultation fee" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Timings"
                name="timings"
                rules={[{ required: true, message: 'Please select your timings' }]}
              >
                <TimePicker.RangePicker format="HH:mm" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}></Col>
            <Col xs={24} md={8}>
              <button className="btn btn-primary form-btn" type="submit">
                Update
              </button>
            </Col>
          </Row>
        </Form>
      )}
    </Layout>
  );
};

export default Profile;
