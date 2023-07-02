export interface IRekap {
  year: string
  months: [
    {
      month: string
      rekap: [
        {
          name: string
          day: [number]
        }
      ]
    }
  ]
}
