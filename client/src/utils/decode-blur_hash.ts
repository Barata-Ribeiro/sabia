import { decode } from "blurhash"

export default function decodeBlurHash(blurHash: string, width = 32, height = 32) {
    const pixels = decode(blurHash, width, height)
    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D

    const imageData = ctx.createImageData(width, height)
    imageData.data.set(Uint8ClampedArray.from(pixels))
    ctx.putImageData(imageData, 0, 0)

    return canvas.toDataURL()
}
