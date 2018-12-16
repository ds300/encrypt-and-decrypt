#! /usr/bin/env node

import { createDecipheriv, scryptSync } from "crypto"
import prompt from "password-prompt"
import {
  readdir,
  readFile,
  existsSync,
  mkdirp,
  writeFile,
  remove,
} from "fs-extra"
import { dirname } from "path"

interface Payload {
  filename: string
  data: string
}

async function decrypt() {
  const password = await prompt("Password: ", { method: "hide" })
  if (!password.trim()) {
    console.log("no password given")
    process.exit(1)
  }
  const key = scryptSync(password, "", 32)
  const files = await readdir(".")
  for (const iv of files) {
    const encryptedData = await readFile(iv)
    const cipher = createDecipheriv("aes-256-cbc", key, iv)
    const decryptedData = Buffer.concat([
      cipher.update(encryptedData),
      cipher.final(),
    ])

    const { filename, data } = JSON.parse(
      decryptedData.toString("utf8"),
    ) as Payload

    const dir = dirname(filename)
    if (!existsSync(dir)) {
      await mkdirp(dir)
    }
    await writeFile(filename, Buffer.from(data, "base64"))
    await remove(iv)
  }
}

decrypt()
  .then(() => console.log("all done"))
  .catch(e => {
    console.error(e)
  })
