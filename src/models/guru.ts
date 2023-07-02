import { model, Schema } from 'mongoose'
import { IGuru } from '../interfaces/guru'

const GuruSchema: Schema = new Schema<IGuru>(
  {
    name: {
      type: String,
      required: [true, 'Nama guru tidak  boleh kosong.'],
      unique: true,
    },

    photos: { type: [String], required: true },
  },
  { timestamps: true }
)

export const Guru = model<IGuru>('Guru', GuruSchema)
