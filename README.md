# encrypt-and-decrypt

Encrypts and decrypts all the files in a given folder.

## Usage

```
➜  my-secret-files $ npm i -g encrypt-and-decrypt

➜  my-secret-files $ tree
.
├── dossiers
│   └── weapons-manufacturers.md
├── journal.md
└── kompromat
    └── president-recording.wav

2 directories, 3 files

➜  my-secret-files $ encrypt
Password: ******
all done

➜  my-secret-files $ tree
.
├── 2b52f3046ad2bbd6
├── 2e06ae56d0d8bae3
└── f2183c4274a13a00

0 directories, 3 files

➜  my-secret-files $ decrypt
Password: ******
all done

➜  my-secret-files $ tree
.
├── dossiers
│   └── weapons-manufacturers.md
├── journal.md
└── kompromat
    └── president-recording.wav

2 directories, 3 files
```

## License

MIT
