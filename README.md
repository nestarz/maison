# Maison

## Development

### Prerequisites

```bash
curl https://getcaddy.com | bash -s personal http.cache,http.cors,http.nobots,http.ratelimit,http.webdav,http.permission
```

### Start Server

```bash
caddy -conf Caddyfile
```

## Deploy WebDAV Content

### Prerequisites

```bash
brew install rclone
rclone config
```

### Sync (Local to Remote)

```bash
rclone copy ./webdav/ chez-eliasrhouzlane-com: -P --exclude-from .rcloneignore
```