import { Request, Response } from 'express'
import { Guru } from '../models/guru'
import { http400, http500 } from '../helper/httpResponse'

const success = {
  success: true,
  status: 200,
}

export const getGuru = async (req: Request, res: Response) => {
  try {
    const data = await Guru.find({}, { rekap: 0 })

    return res.status(200).json({
      ...success,
      data,
    })
  } catch (error) {
    console.error('GetGuruError.', error)
    return http500(res)
  }
}

export const getRekap = async (req: Request, res: Response) => {
  try {
    const data = await Guru.find({}, { photos: 0 })

    return res.status(200).json({
      ...success,
      data,
    })
  } catch (error) {
    console.error('GetGuruError.', error)
    return http500(res)
  }
}

export const add = async (req: Request, res: Response) => {
  try {
    const { name } = req.body
    const files = req.files as Express.Multer.File[]

    const guru = await Guru.findOne({ name })

    if (!req.files) {
      return http400(
        res,
        'TambahGuruError',
        'Guru dengan nama yang sama ditemukan.'
      )
    }

    if (guru) {
      return http400(
        res,
        'TambahGuruError',
        'Guru dengan nama yang sama ditemukan.'
      )
    }

    const dateNow = new Date()
    const year = dateNow.getFullYear().toString()
    const month = dateNow.getMonth().toString()
    const day = dateNow.getDate().toString()

    req.body.rekap = {
      year,
      months: [
        {
          month,
          days: [
            {
              day,
            },
          ],
        },
      ],
    }

    req.body.photos = files.map((file) => `/upload/${file.filename}`)

    const newGuru = new Guru(req.body)

    newGuru.save()

    console.log('GuruAdded')
    return res.status(200).json({
      ...success,
      message: 'Guru berhasil ditambahkan.',
      data: {
        name,
        _id: newGuru._id,
      },
    })
  } catch (error) {
    console.error('AddGuruError', error)
    return http500(res)
  }
}

export const presence = async (req: Request, res: Response) => {
  try {
    const { name } = req.body

    const guru = await Guru.findOne({ name })

    const dateNow = new Date()
    const year = dateNow.getFullYear().toString()
    const month = dateNow.getMonth().toString()
    const day = dateNow.getDate().toString()

    req.body.rekap = {
      year,
      months: [
        {
          month,
          days: [
            {
              day,
            },
          ],
        },
      ],
    }

    console.log('GuruAdded')
    return res.status(200).json({
      ...success,
      message: 'Guru berhasil ditambahkan.',
      data: {
        name,
      },
    })
  } catch (error) {
    console.error('AddGuruError', error)
    return http500(res)
  }
}

export const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    await Guru.findByIdAndDelete(id)

    console.log('GuruDeleted')
    return res.status(200).json({
      ...success,
      message: 'Guru berhasil dihapus.',
    })
  } catch (error) {
    console.error('DeleteGuruError.', error)
    return http500(res)
  }
}

export const edit = async (req: Request, res: Response) => {
  console.log(req.body)
  try {
    return
  } catch (error) {
    console.error('EditGuruError.', error)
    return http500(res)
  }
}
