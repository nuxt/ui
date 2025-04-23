type AnyString = string & {}

export interface FileRejection {
  file: File
  errors: FileError[]
}

export interface FileChangeDetails {
  acceptedFiles: File[]
  rejectedFiles: FileRejection[]
}

export type FileAcceptDetails = File[]
export type FileRejectDetails = FileRejection[]

export type FileError =
  | 'TOO_MANY_FILES'
  | 'FILE_INVALID_TYPE'
  | 'FILE_TOO_LARGE'
  | 'FILE_TOO_SMALL'
  | 'FILE_INVALID'
  | 'FILE_EXISTS'
  | AnyString

export type ImageFileMimeType =
  | 'image/png'
  | 'image/gif'
  | 'image/jpeg'
  | 'image/svg+xml'
  | 'image/webp'
  | 'image/avif'
  | 'image/heic'
  | 'image/bmp'

export type ApplicationFileMimeType =
  | 'application/pdf'
  | 'application/zip'
  | 'application/json'
  | 'application/xml'
  | 'application/msword'
  | 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  | 'application/vnd.ms-excel'
  | 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  | 'application/vnd.ms-powerpoint'
  | 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  | 'application/rtf'
  | 'application/x-rar'
  | 'application/x-7z-compressed'
  | 'application/x-tar'
  | 'application/vnd.microsoft.portable-executable'

export type TextFileMimeType = 'text/css' | 'text/csv' | 'text/html' | 'text/markdown' | 'text/plain'

export type FontFileMimeType = 'font/ttf' | 'font/otf' | 'font/woff' | 'font/woff2' | 'font/eot' | 'font/svg'

export type VideoFileMimeType = 'video/mp4' | 'video/webm' | 'video/ogg' | 'video/quicktime' | 'video/x-msvideo'

export type AudioFileMimeType =
  | 'audio/mpeg'
  | 'audio/ogg'
  | 'audio/wav'
  | 'audio/webm'
  | 'audio/aac'
  | 'audio/flac'
  | 'audio/x-m4a'

export type FileMimeTypeGroup = 'image/*' | 'audio/*' | 'video/*' | 'text/*' | 'application/*' | 'font/*'

export type FileMimeType =
  | ImageFileMimeType
  | ApplicationFileMimeType
  | TextFileMimeType
  | FontFileMimeType
  | VideoFileMimeType
  | AudioFileMimeType
  | FileMimeTypeGroup
  | AnyString
