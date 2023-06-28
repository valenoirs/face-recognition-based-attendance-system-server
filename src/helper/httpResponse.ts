import { Response } from 'express'

export const http500 = (res: Response) => {
  return res.status(500).json({
    error: true,
    status: 500,
    type: 'ServerError',
    message: 'Terjadi kesalahan pada server, mohon coba lagi.',
  })
}

export const http400 = (res: Response, type: string, message: string) => {
  return res.status(400).json({
    error: true,
    status: 400,
    type,
    message,
  })
}
