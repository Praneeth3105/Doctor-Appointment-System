import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { DatePicker, TimePicker, message } from 'antd';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { showLoading, hideLoading } from '../redux/features/alertSlice';

const BookingPage = () => {
  const { user } = useSelector(state => state.user);
  const params = useParams();
  const dispatch = useDispatch();
  const [doctor, setDoctor] = useState(null);
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const [isAvailable, setIsAvailable] = useState(false);

  const getDoctorData = async () => {
    try {
      const res = await axios.post(
        '/api/v1/doctor/getDoctorById',
        { doctorId: params.doctorId },
        {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        }
      );
      if (res.data.success) {
        setDoctor(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleBooking = async () => {
    try {
      if (!date && !time) {
        return alert('Date & Time Required');
      }
      dispatch(showLoading());
      const res = await axios.post(
        '/api/v1/user/book-appointment',
        {
          doctorId: params.doctorId,
          userId: user._id,
          doctorInfo: doctor,
          date:date,
          userInfo: user,
          time:time,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error('Something went wrong while booking');
    }
  };

  const handleAvailability=async()=>{
    try {
        dispatch(showLoading())
        const res=await axios.post('/api/v1/user/booking-availability',
            {doctorId:params.doctorId,date,time},
            {
                headers:{
                    Authorization:`Bearer ${localStorage.getItem('token')}`
                }
            }
        )
        dispatch(hideLoading())
        if (res.data.success) {
            setIsAvailable(true)
            message.success(res.data.message)
        } else {
            message.error(res.data.message)
        }
    } catch (error) {
        dispatch(hideLoading())
        console.log(error)
    }
  }

  useEffect(() => {
    getDoctorData();
    // eslint-disable-next-line
  }, []);

  return (
    <Layout>
      <h3>Booking Page</h3>
      <div className="container m-2">
        {doctor && (
          <div>
            <h4>
              Dr. {doctor.firstName} {doctor.lastName}
            </h4>
            <h4>Fees: ₹{doctor.feesPerCunsaltation}</h4>
            <h4>
              Timings: {doctor.timings[0]} - {doctor.timings[1]}
            </h4>
            <div className="d-flex flex-column w-50">
              <DatePicker
              aria-required={'true'}
                className="m-2"
                format="DD-MM-YYYY"
                onChange={(value) =>{
                  setDate(moment(value).format('DD-MM-YYYY'))
                }
                   
                }
              />
              <TimePicker
              aria-required={'true'}
                format="HH:mm"
                className="mt-3"
                onChange={(value) =>{
                     setTime(moment(value).format('HH:mm'))
                }
                 
                }
              />
              <button
                className="btn btn-primary mt-2"
                onClick={handleAvailability}
              >
                Check Availability
              </button>
              
                     <button
                  className="btn btn-dark mt-2"
                  onClick={handleBooking}
                >
                  Book Now
                </button>
                
               
              
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BookingPage;
