import React, { useState, useEffect } from 'react';
import Layout from './../../components/Layout';
import axios from 'axios';
import { message, Table } from 'antd';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);

  // Fetch all doctors
  const getDoctors = async () => {
    try {
      const res = await axios.get("/api/v1/admin/getAllDoctors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);
      message.error("Failed to fetch doctors");
    }
  };

  // Handle doctor approval/rejection
  const handleAccountStatus = async (record, status) => {
    try {
      const res = await axios.post(
        '/api/v1/admin/changeAccountStatus', // unified and clearer
        {
          doctorId: record._id,
          userId: record.userId,
          status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        getDoctors(); // refresh the list
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      message.error('Something went wrong');
    }
  };

  useEffect(() => {
    getDoctors();
  }, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      render: (text, record) => (
        <span>{record.firstName} {record.lastName}</span>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status'
    },
    {
      title: 'Phone',
      dataIndex: 'phone'
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (text, record) => (
        <div className='d-flex gap-2'>
          {record.status === 'pending' ? (
            <button
              className='btn btn-success'
              onClick={() => handleAccountStatus(record, 'approved')}
            >
              Approve
            </button>
          ) : (
            <button
              className='btn btn-danger'
              onClick={() => handleAccountStatus(record, 'rejected')}
            >
              Reject
            </button>
          )}
        </div>
      )
    }
  ];

  return (
    <Layout>
      <h1 className="text-center">All Doctors</h1>
      <Table
        columns={columns}
        dataSource={doctors.map(doc => ({ ...doc, key: doc._id }))}
      />
    </Layout>
  );
};

export default Doctors;
