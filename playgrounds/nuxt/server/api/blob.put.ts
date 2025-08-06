export default eventHandler(async (event) => {
  return hubBlob().handleUpload(event, {
    formKey: 'files', // read file or files form the `formKey` field of request body (body should be a `FormData` object)
    multiple: true, // when `true`, the `formKey` field will be an array of `Blob` objects
    ensure: {
      types: ['image/jpeg', 'image/png'] // allowed types of the file
    },
    put: {
      addRandomSuffix: true
    }
  })
})
