export function endpoint(path: `/${string}`) {
  return `${process.env.API_ENDPOINT}${path}`;
}
