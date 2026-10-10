/**
 * Just enough ZIP to hand over a folder of text files as one download.
 *
 * The AI spec page offers its parts as a zip. Browsers block a page that starts
 * eight downloads at once, and a zip committed to public/ would be a binary
 * file to carry into Figma Make by hand on every regenerate. So the parts stay
 * as text and the archive is assembled here, on click. Entries are stored, not
 * compressed - a few hundred KB of markdown does not need it, and storing keeps
 * this to a header format and a checksum instead of a dependency.
 */

import { type Bundle, publicPath } from '../data/distribution'

const CRC_TABLE = (() => {
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[n] = c >>> 0
  }
  return table
})()

function crc32(bytes: Uint8Array): number {
  let c = 0xffffffff
  for (const b of bytes) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

export interface ZipEntry {
  /** Path inside the archive, `/`-separated: `folder/file.md`. */
  name: string
  text: string
}

/** The entries as a ZIP archive, stamped with `now` as their modified time. */
export function zipTextFiles(entries: ZipEntry[], now = new Date()): Blob {
  const encoder = new TextEncoder()
  // ZIP keeps MS-DOS time: two-second resolution, years from 1980.
  const time = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1)
  const date = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate()

  // Plain buffers, not shared ones - which is what a Blob will accept.
  const local: Uint8Array<ArrayBuffer>[] = []
  const central: Uint8Array<ArrayBuffer>[] = []
  let offset = 0

  for (const entry of entries) {
    const name = encoder.encode(entry.name)
    const data = encoder.encode(entry.text)
    const crc = crc32(data)

    const header = new DataView(new ArrayBuffer(30))
    header.setUint32(0, 0x04034b50, true) // local file header
    header.setUint16(4, 20, true) // version needed to extract
    header.setUint16(10, time, true)
    header.setUint16(12, date, true)
    header.setUint32(14, crc, true)
    header.setUint32(18, data.length, true) // stored: compressed size = size
    header.setUint32(22, data.length, true)
    header.setUint16(26, name.length, true)
    local.push(new Uint8Array(header.buffer), name, data)

    const record = new DataView(new ArrayBuffer(46))
    record.setUint32(0, 0x02014b50, true) // central directory record
    record.setUint16(4, 20, true) // version made by
    record.setUint16(6, 20, true) // version needed to extract
    record.setUint16(12, time, true)
    record.setUint16(14, date, true)
    record.setUint32(16, crc, true)
    record.setUint32(20, data.length, true)
    record.setUint32(24, data.length, true)
    record.setUint16(28, name.length, true)
    record.setUint32(42, offset, true) // where this entry's local header starts
    central.push(new Uint8Array(record.buffer), name)

    offset += 30 + name.length + data.length
  }

  const directorySize = central.reduce((sum, part) => sum + part.length, 0)
  const end = new DataView(new ArrayBuffer(22))
  end.setUint32(0, 0x06054b50, true) // end of central directory
  end.setUint16(8, entries.length, true)
  end.setUint16(10, entries.length, true)
  end.setUint32(12, directorySize, true)
  end.setUint32(16, offset, true)

  return new Blob([...local, ...central, new Uint8Array(end.buffer)], { type: 'application/zip' })
}

/**
 * Fetch every file in a bundle and save them as one zip, in the bundle's
 * folder. Throws, naming the file, when one is missing.
 *
 * `Response.text()` always decodes UTF-8 and `zipTextFiles` encodes it, so a
 * file that is not plain ASCII - the design guide - reaches the zip byte for
 * byte, whatever charset the host sends.
 */
export async function downloadBundle(bundle: Bundle): Promise<void> {
  const texts = await Promise.all(
    bundle.files.map(async (file) => {
      const response = await fetch(publicPath(file.from))
      const text = response.ok ? await response.text() : ''
      // A host that serves index.html for a missing path still answers 200,
      // so a web page, or a generated file without its opening line, means the
      // file is not there. Never zip a web page as a spec.
      const isPage = /^\s*<(!doctype|html)/i.test(text)
      if (!text || isPage || (file.startsWith && !text.startsWith(file.startsWith))) {
        throw new Error(`${file.from} is missing`)
      }
      return text
    }),
  )
  saveBlob(
    zipTextFiles(bundle.files.map((file, i) => ({ name: `${bundle.folder}/${file.to}`, text: texts[i] }))),
    bundle.zipName,
  )
}

/** Hand a blob to the browser as a download. */
export function saveBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
