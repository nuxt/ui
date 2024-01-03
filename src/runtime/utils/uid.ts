let _id = 0

export function uid () {
  _id = (_id + 1) % Number.MAX_SAFE_INTEGER
  return `nuid-${_id}`
}
