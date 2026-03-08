import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import pool from '../data/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = express.Router()

const normalizeDestination = (row) => ({
  ...row,
  submittedBy: row.submittedBy ?? row.submittedby ?? row.submitted_by ?? '',
  submittedOn: row.submittedOn ?? row.submittedon ?? row.submitted_on ?? null
})

// GET all destinations
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM destinations ORDER BY id')
    res.json(result.rows.map(normalizeDestination))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Database error' })
  }
})

router.post('/', async (req, res) => {
  const {
    name,
    state,
    category,
    image,
    description,
    submittedBy
  } = req.body

  if (!name || !state || !category || !image || !description || !submittedBy) {
    return res.status(400).json({ error: 'All fields are required' })
  }

  try {
    const result = await pool.query(
      `INSERT INTO destinations
        (name, state, category, image, description, submitted_by, submitted_on)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING *`,
      [name, state, category, image, description, submittedBy]
    )

    return res.status(201).json(normalizeDestination(result.rows[0]))
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Database error' })
  }
})

router.get('/:id', async (req, res, next) => {
  const requestedId = Number.parseInt(req.params.id, 10)

  if (Number.isNaN(requestedId)) {
    return next()
  }

  const acceptsHtml = req.accepts(['html', 'json']) === 'html'

  if (acceptsHtml) {
    return res.sendFile(path.resolve(__dirname, '../public/destination.html'))
  }

  try {
    const result = await pool.query('SELECT * FROM destinations WHERE id = $1', [requestedId])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Destination not found' })
    }

    return res.json(normalizeDestination(result.rows[0]))
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Database error' })
  }
})

router.delete('/:id', async (req, res, next) => {
  const requestedId = Number.parseInt(req.params.id, 10)

  if (Number.isNaN(requestedId)) {
    return next()
  }

  try {
    const result = await pool.query('DELETE FROM destinations WHERE id = $1 RETURNING *', [requestedId])

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Destination not found' })
    }

    return res.json(normalizeDestination(result.rows[0]))
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Database error' })
  }
})

export default router
