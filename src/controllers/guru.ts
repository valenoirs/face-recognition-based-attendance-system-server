import { Request, Response } from 'express'
import { Guru } from '../models/guru'
import { http400, http500 } from '../helper/httpResponse'
import { getDaysInMonth } from '../helper/getDaysInMonth'
import { Rekap } from '../models/rekap'
import { emptyMonth } from '../helper/emptyMonth'

const success = {
  success: true,
  status: 200,
}

export const getGuru = async (req: Request, res: Response) => {
  try {
    const data = await Guru.find()

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
    const { date } = req.query
    await emptyMonth()

    const dateNow = new Date()
    let data: any
    const day: number[] = []

    if (!date) {
      const year = dateNow.getFullYear().toString()
      const month = dateNow.getMonth().toString()

      const daysInMonth = getDaysInMonth(parseInt(month) + 1, parseInt(year))

      for (let i = 1; i < daysInMonth + 1; i++) {
        day.push(i)
      }

      data = await Rekap.aggregate([
        { $match: { year } },
        { $unwind: '$months' },
        { $match: { 'months.month': month } },
        { $project: { 'months.rekap': 1, _id: 0 } },
      ])
    } else {
      const splitDate = date.toString().split('-')

      const year = splitDate[0]
      const month = parseInt(splitDate[1].replace('0', '')) - 1

      const daysInMonth = getDaysInMonth(month + 1, parseInt(year))

      for (let i = 1; i < daysInMonth + 1; i++) {
        day.push(i)
      }

      data = await Rekap.aggregate([
        { $match: { year } },
        { $unwind: '$months' },
        { $match: { 'months.month': month.toString() } },
        { $project: { 'months.rekap': 1, _id: 0 } },
      ])
    }

    return res.status(200).json({
      ...success,
      data: data[0],
      day,
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
    const year = dateNow.getFullYear()
    const month = dateNow.getMonth()
    const dayNow = dateNow.getDate()
    const daysInMonth = getDaysInMonth(month + 1, year)

    const day: number[] = []

    for (let i = 0; i < daysInMonth; i++) {
      if (i < dayNow) {
        day.push(3)
      } else {
        day.push(0)
      }
    }

    day[dayNow - 1] = 2

    const rekap = {
      name,
      day,
    }

    req.body.photos = files.map((file) => `/upload/${file.filename}`)

    const newGuru = new Guru(req.body)

    await newGuru.save()

    await Rekap.updateOne(
      { year },
      { $push: { 'months.$[a].rekap': rekap } },
      { arrayFilters: [{ 'a.month': month.toString() }] }
    )

    console.log('GuruAdded: ' + name)
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

    if (name) {
      const dateNow = new Date()
      const year = dateNow.getFullYear().toString()
      const month = dateNow.getMonth().toString()
      const dayNow = dateNow.getDate()

      await emptyMonth()

      const rekap = await Rekap.aggregate([
        { $match: { year } },
        { $unwind: '$months' },
        { $match: { 'months.month': month } },
        { $unwind: '$months.rekap' },
        { $match: { 'months.rekap.name': name } },
        { $project: { 'months.rekap.day': 1, _id: 0 } },
      ])

      const day = rekap[0].months.rekap.day

      day[dayNow - 1] = 1

      await Rekap.updateOne(
        { year },
        { $set: { 'months.$[a].rekap.$[b].day': day } },
        { arrayFilters: [{ 'a.month': month.toString() }, { 'b.name': name }] }
      )

      console.log('AttendanceUpdated: ' + name)
      return res.status(200).json({
        ...success,
        message: 'Kehadiran Diperbarui.',
      })
    }

    console.log('AttendanceUpdated: No Name Provided')
    return res.status(200).json({
      ...success,
      message: 'Kehadiran Diperbarui.',
    })
  } catch (error) {
    console.error('AttendanceUpdateError', error)
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
