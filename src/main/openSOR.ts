import SOR from 'jsotdr'

export default async (filepath: string): Promise<{
  status: string;
  trace: object;
  dump: string;
}> => {
  const sor = new SOR()
  const results = await sor.reader(filepath)

  return {
    status: results[0],
    trace: results[1],
    dump: results[2]
  }
}