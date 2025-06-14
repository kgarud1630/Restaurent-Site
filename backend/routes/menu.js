const express = require('express');
const { pool, getRedisClient } = require('../config/database');
const { validateQuery } = require('../middleware/validation');
const { body, query } = require('express-validator');

const router = express.Router();

// GET /api/menu - Get all menu items with optional filtering
router.get('/', [
  query('category').optional().isString(),
  query('dietary').optional().isString(),
  query('search').optional().isString(),
  query('available').optional().isBoolean(),
  validateQuery
], async (req, res) => {
  try {
    const { category, dietary, search, available = true } = req.query;
    const redisClient = getRedisClient();
    
    // Create cache key based on query parameters
    const cacheKey = `menu:${JSON.stringify(req.query)}`;
    
    // Try to get from cache first
    if (redisClient) {
      try {
        const cached = await redisClient.get(cacheKey);
        if (cached) {
          return res.json(JSON.parse(cached));
        }
      } catch (cacheError) {
        console.warn('Cache read error:', cacheError);
      }
    }
    
    let query_text = `
      SELECT 
        mi.id,
        mi.name,
        mi.description,
        mi.price,
        mi.image_url as image,
        mi.dietary_info as dietary,
        mi.preparation_time,
        mi.popularity_score as popularity,
        mi.available,
        mi.ingredients,
        mi.allergens,
        mi.nutrition_info,
        mc.name as category
      FROM menu_items mi
      LEFT JOIN menu_categories mc ON mi.category_id = mc.id
      WHERE mi.available = $1
    `;
    
    const queryParams = [available];
    let paramCount = 1;
    
    if (category) {
      paramCount++;
      query_text += ` AND mc.name ILIKE $${paramCount}`;
      queryParams.push(`%${category}%`);
    }
    
    if (dietary) {
      paramCount++;
      query_text += ` AND $${paramCount} = ANY(mi.dietary_info)`;
      queryParams.push(dietary);
    }
    
    if (search) {
      paramCount++;
      query_text += ` AND (mi.name ILIKE $${paramCount} OR mi.description ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
    }
    
    query_text += ` ORDER BY mi.popularity_score DESC, mi.name ASC`;
    
    const result = await pool.query(query_text, queryParams);
    
    const menuItems = result.rows.map(item => ({
      ...item,
      price: parseFloat(item.price)
    }));
    
    // Cache the result for 5 minutes
    if (redisClient) {
      try {
        await redisClient.setEx(cacheKey, 300, JSON.stringify(menuItems));
      } catch (cacheError) {
        console.warn('Cache write error:', cacheError);
      }
    }
    
    res.json(menuItems);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
});

// GET /api/menu/:id - Get specific menu item
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT 
        mi.id,
        mi.name,
        mi.description,
        mi.price,
        mi.image_url as image,
        mi.dietary_info as dietary,
        mi.preparation_time,
        mi.popularity_score as popularity,
        mi.available,
        mi.ingredients,
        mi.allergens,
        mi.nutrition_info,
        mc.name as category
      FROM menu_items mi
      LEFT JOIN menu_categories mc ON mi.category_id = mc.id
      WHERE mi.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    
    const menuItem = {
      ...result.rows[0],
      price: parseFloat(result.rows[0].price)
    };
    
    res.json(menuItem);
  } catch (error) {
    console.error('Error fetching menu item:', error);
    res.status(500).json({ error: 'Failed to fetch menu item' });
  }
});

// GET /api/menu/categories - Get all menu categories
router.get('/categories/all', async (req, res) => {
  try {
    const redisClient = getRedisClient();
    const cacheKey = 'menu:categories';
    
    // Try cache first
    if (redisClient) {
      try {
        const cached = await redisClient.get(cacheKey);
        if (cached) {
          return res.json(JSON.parse(cached));
        }
      } catch (cacheError) {
        console.warn('Cache read error:', cacheError);
      }
    }
    
    const result = await pool.query(`
      SELECT id, name, description, display_order
      FROM menu_categories
      WHERE active = true
      ORDER BY display_order ASC, name ASC
    `);
    
    // Cache for 1 hour
    if (redisClient) {
      try {
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(result.rows));
      } catch (cacheError) {
        console.warn('Cache write error:', cacheError);
      }
    }
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

module.exports = router;