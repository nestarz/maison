# Maison

Git is not used to replicate the current house, but more it's foundation.

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

Remove dry-run if you accept the changes

```bash
rclone sync /Users/eliasrhouzlane/eliasrhouzlane.com/webdav/ chez-eliasrhouzlane-com: -P --exclude-from /Users/eliasrhouzlane/eliasrhouzlane.com/.rcloneignore --dry-run
```