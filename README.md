# compression images

JPG, PNG, GIF, SVGファイルの圧縮を行えるアプリです。

## Usage

`compressionImages.ts` がメインのファイルです。
`images`フォルダー内に圧縮したい画像を入れて実行すると`compressionImages`フォルダーに圧縮画像ができあがります。

```bash
yarn
yarn start
```

で動作します。

## Change settings

中身を変更した場合は

```bash
npx tsc
```

でtsファイルをコンパイルしてから

```bash
yarn start
```

で実行してください。
