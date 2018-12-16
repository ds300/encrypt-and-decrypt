#! /usr/bin/env node

import { createCipheriv, scryptSync } from "crypto"
import prompt from "password-prompt"
import { readdir, stat, readFile, writeFile, remove } from "fs-extra"
import cryptoRandomString from "crypto-random-string"
import { join } from "path"
import rimraf from "rimraf"

interface Payload {
  filename: string
  data: string
}

async function allFiles(root: string = ".", filenames: string[] = []) {
  const files = await readdir(root)
  for (const file of files) {
    const stats = await stat(join(root, file))
    if (stats.isDirectory()) {
      await allFiles(join(root, file), filenames)
    } else {
      filenames.push(join(root, file))
    }
  }

  return filenames
}

async function encrypt() {
  const password = await prompt("Password: ", { method: "hide" })
  if (!password.trim()) {
    console.log("no password given")
    process.exit(1)
  }
  const key = scryptSync(password, "", 32)

  const files = await allFiles()
  for (const filename of files) {
    const data = await readFile(filename)
    const payload: Payload = {
      filename,
      data: data.toString("base64"),
    }
    const iv = cryptoRandomString(16)
    const cipher = createCipheriv("aes-256-cbc", key, iv)

    const encryptedData = Buffer.concat([
      cipher.update(JSON.stringify(payload)),
      cipher.final(),
    ])

    await writeFile(iv, encryptedData)
    await remove(filename)
  }
  for (const dir of await readdir(".")) {
    const stats = await stat(dir)
    if (stats.isDirectory()) {
      new Promise(resolve => rimraf(dir, {}, resolve))
    }
  }
}

encrypt()
  .then(() => console.log("all done"))
  .catch(e => {
    console.error(e.stack)
  })
