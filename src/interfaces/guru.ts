export interface IRekap {
  year: string
  months: [
    {
      month: string
      days: [
        {
          day: string
          isPresent: boolean
        }
      ]
    }
  ]
}

export interface IGuru {
  name: string
  rekap: [IRekap]
  photos: [string]
}
