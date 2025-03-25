# mf-user

## Overview

This is the user management function of the `Composable Disaggregated Infrastructure Manager` frontend.

Uses the micro frontend framework OSS `Luigi`.

It is assumed that it is at the same level as other micro frontend projects.

```bash
frontend/
├── mf-core
├── mf-layout
├── mf-resource
└── mf-user ★This repository
```

## Requirement

- Docker x86_64
- AlmaLinux 9

`mf-user` requires Node v18.20.04 or later.

Have a look at the dependencies and devDependencies sections in the [package.json](package.json) file to find an up-to-date list of the requirements of mf-user.

## Usage

Please refer to the `README.md` of the `mf-core` repository for installation and startup methods.

### For Development

Rename `.env.local.example` to `.env.local` and make the necessary settings.

```bash
$ cp .env.local.example .env.local
```

The settings will be reflected when you update the `.env.local` file.

If you are using it on the client side, please prefix the variable name with `NEXT_PUBLIC_`.

The settings in `.env.local` take precedence over the settings in `.env` under `mf-core`.

## Tests

Please refer to the `README.md` of the `mf-core` repository.

## License

Copyright (c) 2025 NEC Corporation.

`mf-user` is under [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0)
