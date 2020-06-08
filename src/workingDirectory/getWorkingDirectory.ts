import assertWorkingDirectory from "./assertWorkingDirectory";

export default async (args: any): Promise<string> =>
  args.path
    ? assertWorkingDirectory(args.path)
    : Promise.resolve(process.cwd());
