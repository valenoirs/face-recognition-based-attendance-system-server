import { Guru } from '../models/guru'
import { Rekap } from '../models/rekap'
import { getDaysInMonth } from './getDaysInMonth'

type TRekap = {
  name: string
  day: number[]
}

export const emptyMonth = async () => {
  const dateNow = new Date()
  const year = dateNow.getFullYear()
  const month = dateNow.getMonth()

  const data = await Rekap.aggregate([
    { $match: { year: year.toString() } },
    { $unwind: '$months' },
    { $match: { 'months.month': month.toString() } },
    { $project: { 'months.rekap': 1, _id: 0 } },
  ])

  if (!data[0]) {
    const guru = await Guru.find()

    const daysInMonth = getDaysInMonth(month + 1, year)

    let day: number[] = []
    const rekap: TRekap[] = []

    guru.forEach((guru) => {
      for (let i = 0; i < daysInMonth; i++) {
        day.push(0)
      }
      rekap.push({ name: guru.name, day })
      day = []
    })

    const newMonth = {
      month: month.toString(),
      rekap,
    }

    await Rekap.updateOne({ year }, { $push: { months: newMonth } })

    console.log('[server] OK! empty month created')
  }

  return
}
