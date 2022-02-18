import fs from 'fs'
import path from 'path'
import imagemin from 'imagemin'
import imageminMozjpeg, { Options as jpegOptions } from 'imagemin-mozjpeg'
import imageminPngquant, { Options as pngOptions } from 'imagemin-pngquant'
import imageminGifsicle, { Options as gifOptions } from 'imagemin-gifsicle'
import imageminSvgo from 'imagemin-svgo'

// 圧縮したい画像を入れるフォルダー
const currentFolder: string = './images'
// 圧縮された画像が入るフォルダー
const compressionFolder: string = './compressionImages'

// jpegの圧縮設定
const jpegOption: jpegOptions = {
  quality: 50
}
// pngの圧縮設定
const pngOption: pngOptions = {
  quality: [0.3, 0.5]
}

// gifの圧縮設定
const gifOption: gifOptions = {
  colors: 128
}

const currentPath = path.resolve(currentFolder)

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

const searchFiles = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      resolve(listFiles(currentPath))
    } catch (e) {
      reject(e)
    }
  })
}

const init = async(): Promise<void> => {
  await searchFiles()

  const reg = new RegExp(currentPath)
  convertFileList.map(async (path) => {
    const rootPath = path.replace(reg , '').replace(/[^/]*$/, '')
    await imagemin([path], {
      destination: compressionFolder + rootPath,
      plugins: [
        imageminMozjpeg(jpegOption),
        imageminPngquant(pngOption),
        imageminGifsicle(gifOption),
        imageminSvgo(),
      ],
    })
  })
}

init()
