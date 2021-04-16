const fs = require('fs')
const path = require('path')
const imagemin = require('imagemin')
const imageminMozjpeg = require('imagemin-mozjpeg')
const imageminPngquant = require('imagemin-pngquant')
const imageminGifsicle = require('imagemin-gifsicle');
const imageminSvgo = require('imagemin-svgo')

const currentFolder: string = './images/'
const compressionFolder: string = './compressionImages/'

const jpegOption: {quality: number} = {
  quality: 50
}
const pngOption: {quality: number[]} = {
  quality: [0.3, 0.5]
}
const gifOption: {colors: number} = {
  colors: 128
}

const convertFileList: Array<string> = []

const getFileType = (path: string): string => {
  try {
    const stat = fs.statSync(path)

    switch (true) {
      case stat.isFile():
        return 'File'

      case stat.isDirectory():
        return 'Directory'

      default:
        return 'Other'
    }
  } catch (_e) {
    throw new Error('File type unknown.')
  }
}

const listFiles = (dirPath: string): void => {
  const fileName = fs.readdirSync(dirPath)
  fileName.forEach((image: string) => {
    const absPath = `${dirPath}/${image}`
    switch (getFileType(absPath)) {
      case 'File':
        if (
          absPath.includes('.jpg') ||
          absPath.includes('.jpeg') ||
          absPath.includes('.png') ||
          absPath.includes('.gif') ||
          absPath.includes('.svg')
        ) {
          convertFileList.push(absPath)
        }
        break

      case 'Directory':
        listFiles(absPath)
        break

      default:
        break
    }
  })
}

function searchFiles(): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const dirPath = path.resolve(currentFolder)
      resolve(listFiles(dirPath))
    } catch (e) {
      reject(e)
    }
  })
}

async function init(): Promise<void> {
  await searchFiles()

  imagemin(convertFileList, {
    destination: compressionFolder,
    plugins: [
      imageminMozjpeg(jpegOption),
      imageminPngquant(pngOption),
      imageminGifsicle(gifOption),
      imageminSvgo(),
    ],
  })
}

init()
