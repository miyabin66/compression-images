const fs = require('fs')
const path = require('path')
const imagemin = require('imagemin')
const imageminMozjpeg = require('imagemin-mozjpeg')
const imageminPngquant = require('imagemin-pngquant')
const imageminGifsicle = require('imagemin-gifsicle');
const imageminSvgo = require('imagemin-svgo')

const currentFolder = './images/'
const compressionFolder = './dist/'

const jpegOption = {
  quality: 50
}
const pngOption = {
  quality: [0.3, 0.5]
}

const convertFileList = []

const getFileType = (path) => {
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
  } catch (e) {
    throw new Error('File type unknown.')
  }
}

const listFiles = (dirPath) => {
  const fileName = fs.readdirSync(dirPath)
  fileName.forEach((image) => {
    const absPath = `${dirPath}/${image}`
    switch (getFileType(absPath)) {
      case 'File':
        if (
          absPath.includes('.png') ||
          absPath.includes('.jpg') ||
          absPath.includes('.jpeg') ||
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

function searchFiles() {
  return new Promise((resolve, reject) => {
    try {
      const dirPath = path.resolve(currentFolder)
      resolve(listFiles(dirPath))
    } catch (e) {
      reject(e)
    }
  })
}

async function init() {
  await searchFiles()

  imagemin(convertFileList, {
    destination: compressionFolder,
    plugins: [
      imageminMozjpeg(jpegOption),
      imageminPngquant(pngOption),
      imageminGifsicle(),
      imageminSvgo(),
    ],
  })
}

init()
