```yaml
name: Build and Deploy
on: [push, pull_request]
jobs:
  build-and-deploy:
    name: Rust github pages deploy
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Actions
        uses: actions/checkout@v2.3.1
        with:
          persist-credentials: false
      - name: Install latest nightly
        uses: actions-rs/toolchain@v1
        with:
            toolchain: nightly
            override: true
            components: rustfmt, clippy
      - uses: jetli/wasm-pack-action@v0.3.0
        with:
          version: 'latest'
      - name: trunk build
        env: VERSION=v0.6.0
        run: |
            wget -qO- https://github.com/thedodd/trunk/releases/download/${VERSION}/trunk-x86_64-unknown-linux-gnu.tar.gz | tar -xzf-
            trunk build
      - name: Deploy to github pages
        uses: JamesIves/github-pages-deploy-action@3.6.2
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          BRANCH: gh-pages
          FOLDER: build
          CLEAN: true

```
