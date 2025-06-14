const express = require('express');
const { pool } = require('../config/database');
const { validateBody } = require('../middleware/validation');
const { body } = require('express-validator');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// POST /api/orders - Create a new order
router.post('/', [
  body('items').isArray().withMessage('Items must be an array'),
  body('items.*.id').isUUID().withMessage('Item ID must be a valid UUID'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  body('customerInfo.name').notEmpty().withMessage('Customer name is required'),
  body('customerInfo.email').isEmail().withMessage('Valid email is required'),
  body('customerInfo.phone').notEmpty().withMessage('Phone number is required'),
  body('deliveryAddress').optional().isObject(),
  body('paymentMethod').isObject().withMessage('Payment method is required'),
  validateBody
], async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const {
      items,
      customerInfo,
      deliveryAddress,
      paymentMethod,
      specialInstructions
    } = req.body;
    
    // Generate order number
    const orderNumber = `ORD-${Date.now().toString().slice(-8)}`;
    
    // Calculate totals
    let subtotal = 0;
    const orderItems = [];
    
    // Validate items and calculate subtotal
    for (const item of items) {
      const menuItemResult = await client.query(
        'SELECT id, name, price, available FROM menu_items WHERE id = $1',
        [item.id]
      );
      
      if (menuItemResult.rows.length === 0) {
        throw new Error(`Menu item ${item.id} not found`);
      }
      
      const menuItem = menuItemResult.rows[0];
      
      if (!menuItem.available) {
        throw new Error(`Menu item ${menuItem.name} is not available`);
      }
      
      const itemTotal = parseFloat(menuItem.price) * item.quantity;
      subtotal += itemTotal;
      
      orderItems.push({
        menuItemId: menuItem.id,
        quantity: item.quantity,
        unitPrice: parseFloat(menuItem.price),
        customizations: item.customizations || {},
        specialInstructions: item.specialInstructions || ''
      });
    }
    
    // Calculate tax and delivery fee
    const taxRate = 0.08; // 8% tax
    const taxAmount = subtotal * taxRate;
    const deliveryFee = subtotal > 50 ? 0 : 5.99;
    const totalAmount = subtotal + taxAmount + deliveryFee;
    
    // Create order
    const orderResult = await client.query(`
      INSERT INTO orders (
        order_number, status, payment_status, subtotal, tax_amount, 
        delivery_fee, total_amount, delivery_address, special_instructions,
        payment_method, estimated_delivery_time
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING id, order_number, created_at
    `, [
      orderNumber,
      'pending',
      'pending',
      subtotal,
      taxAmount,
      deliveryFee,
      totalAmount,
      JSON.stringify(deliveryAddress),
      specialInstructions,
      JSON.stringify(paymentMethod),
      new Date(Date.now() + 45 * 60 * 1000) // 45 minutes from now
    ]);
    
    const order = orderResult.rows[0];
    
    // Create order items
    for (const item of orderItems) {
      await client.query(`
        INSERT INTO order_items (
          order_id, menu_item_id, quantity, unit_price, 
          customizations, special_instructions
        ) VALUES ($1, $2, $3, $4, $5, $6)
      `, [
        order.id,
        item.menuItemId,
        item.quantity,
        item.unitPrice,
        JSON.stringify(item.customizations),
        item.specialInstructions
      ]);
    }
    
    await client.query('COMMIT');
    
    // Return order confirmation
    res.status(201).json({
      orderId: order.id,
      orderNumber: order.order_number,
      status: 'pending',
      total: totalAmount,
      estimatedDeliveryTime: new Date(Date.now() + 45 * 60 * 1000).toISOString(),
      createdAt: order.created_at,
      message: 'Order placed successfully'
    });
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating order:', error);
    res.status(400).json({ error: error.message || 'Failed to create order' });
  } finally {
    client.release();
  }
});

// GET /api/orders/:id - Get order by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const orderResult = await pool.query(`
      SELECT 
        o.*,
        json_agg(
          json_build_object(
            'id', oi.id,
            'menuItemId', oi.menu_item_id,
            'name', mi.name,
            'quantity', oi.quantity,
            'unitPrice', oi.unit_price,
            'customizations', oi.customizations,
            'specialInstructions', oi.special_instructions
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
      WHERE o.id = $1
      GROUP BY o.id
    `, [id]);
    
    if (orderResult.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    const order = orderResult.rows[0];
    
    res.json({
      ...order,
      subtotal: parseFloat(order.subtotal),
      tax_amount: parseFloat(order.tax_amount),
      delivery_fee: parseFloat(order.delivery_fee),
      total_amount: parseFloat(order.total_amount)
    });
    
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// PATCH /api/orders/:id/status - Update order status
router.patch('/:id/status', [
  body('status').isIn(['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'])
    .withMessage('Invalid status'),
  validateBody
], async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const result = await pool.query(`
      UPDATE orders 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, order_number, status, updated_at
    `, [status, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json({
      message: 'Order status updated successfully',
      order: result.rows[0]
    });
    
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

module.exports = router;