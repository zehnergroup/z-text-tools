export default (id: number, projectPrefix?: string) =>
  projectPrefix ? `${projectPrefix}-${id}` : "" + id;
