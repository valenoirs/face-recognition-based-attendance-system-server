import { model, Schema } from 'mongoose'
import { IRekap } from '../interfaces/rekap'

const RekapSchema: Schema = new Schema<IRekap>(
  {
    year: { type: String, required: true, unique: true },
    months: [
      {
        month: { type: String, required: true, unique: true },
        rekap: [
          {
            name: { type: String, required: true, unique: true },
            day: { type: [Number], default: [] },
          },
        ],
      },
    ],
  },
  { timestamps: true }
)

export const Rekap = model<IRekap>('Rekap', RekapSchema)
