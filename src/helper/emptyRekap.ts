import { Rekap } from '../models/rekap'

export const emptyRekap = async () => {
  const dateNow = new Date()
  const year = dateNow.getFullYear().toString()

  const rekap = await Rekap.find({ year }).count()

  if (!rekap) {
    const month = dateNow.getMonth().toString()

    const newRekap = {
      year,
      months: [
        {
          month,
          rekap: [],
        },
      ],
    }

    await new Rekap(newRekap).save()

    console.log('[server] OK! empty recap created')
  }

  return
}
