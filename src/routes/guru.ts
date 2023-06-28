import { Router } from 'express'
import {
  getGuru,
  getRekap,
  presence,
  add,
  remove,
  edit,
} from '../controllers/guru'
// import multer from 'multer'
import { upload } from '../utils/multer'

// const upload = multer()

export const router = Router()

// POST
router.post('/', upload.array('file'), add)
router.post('/hadir', presence)

// GET
router.get('/', getGuru)
router.get('/rekap', getRekap)

// DELETE
router.delete('/:id', remove)

// PUT
router.put('/', edit)
