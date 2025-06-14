const express = require('express');
const { pool } = require('../config/database');
const { validateBody } = require('../middleware/validation');
const { body } = require('express-validator');

const router = express.Router();

// POST /api/reservations - Create a new reservation
router.post('/', [
  body('customerName').notEmpty().withMessage('Customer name is required'),
  body('customerEmail').isEmail().withMessage('Valid email is required'),
  body('customerPhone').notEmpty().withMessage('Phone number is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid time is required'),
  body('partySize').isInt({ min: 1, max: 20 }).withMessage('Party size must be between 1 and 20'),
  validateBody
], async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      date,
      time,
      partySize,
      specialRequests
    } = req.body;
    
    // Check if the time slot is available
    const existingReservations = await pool.query(`
      SELECT COUNT(*) as count
      FROM reservations
      WHERE reservation_date = $1 
      AND reservation_time = $2
      AND status IN ('pending', 'confirmed')
    `, [date, time]);
    
    const reservationCount = parseInt(existingReservations.rows[0].count);
    const maxReservationsPerSlot = 5; // Configurable based on restaurant capacity
    
    if (reservationCount >= maxReservationsPerSlot) {
      return res.status(400).json({ 
        error: 'This time slot is fully booked. Please choose another time.' 
      });
    }
    
    // Create the reservation
    const result = await pool.query(`
      INSERT INTO reservations (
        customer_name, customer_email, customer_phone,
        reservation_date, reservation_time, party_size,
        special_requests, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, customer_name, reservation_date, reservation_time, 
                party_size, status, created_at
    `, [
      customerName,
      customerEmail,
      customerPhone,
      date,
      time,
      partySize,
      specialRequests || '',
      'confirmed'
    ]);
    
    const reservation = result.rows[0];
    
    res.status(201).json({
      reservationId: reservation.id,
      customerName: reservation.customer_name,
      date: reservation.reservation_date,
      time: reservation.reservation_time,
      partySize: reservation.party_size,
      status: reservation.status,
      createdAt: reservation.created_at,
      message: 'Reservation confirmed successfully'
    });
    
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ error: 'Failed to create reservation' });
  }
});

// GET /api/reservations/availability - Check availability for a date
router.get('/availability', async (req, res) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ error: 'Date parameter is required' });
    }
    
    // Get all time slots for the date
    const timeSlots = [
      '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
      '20:00', '20:30', '21:00', '21:30', '22:00'
    ];
    
    const reservationCounts = await pool.query(`
      SELECT reservation_time, COUNT(*) as count
      FROM reservations
      WHERE reservation_date = $1 
      AND status IN ('pending', 'confirmed')
      GROUP BY reservation_time
    `, [date]);
    
    const countMap = {};
    reservationCounts.rows.forEach(row => {
      countMap[row.reservation_time] = parseInt(row.count);
    });
    
    const availability = timeSlots.map(time => ({
      time,
      available: (countMap[time] || 0) < 5, // Max 5 reservations per slot
      reservationCount: countMap[time] || 0
    }));
    
    res.json({
      date,
      timeSlots: availability
    });
    
  } catch (error) {
    console.error('Error checking availability:', error);
    res.status(500).json({ error: 'Failed to check availability' });
  }
});

// GET /api/reservations/:id - Get reservation by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT *
      FROM reservations
      WHERE id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    
    res.json(result.rows[0]);
    
  } catch (error) {
    console.error('Error fetching reservation:', error);
    res.status(500).json({ error: 'Failed to fetch reservation' });
  }
});

// PATCH /api/reservations/:id/cancel - Cancel a reservation
router.patch('/:id/cancel', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      UPDATE reservations 
      SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND status IN ('pending', 'confirmed')
      RETURNING id, customer_name, status, updated_at
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ 
        error: 'Reservation not found or cannot be cancelled' 
      });
    }
    
    res.json({
      message: 'Reservation cancelled successfully',
      reservation: result.rows[0]
    });
    
  } catch (error) {
    console.error('Error cancelling reservation:', error);
    res.status(500).json({ error: 'Failed to cancel reservation' });
  }
});

module.exports = router;