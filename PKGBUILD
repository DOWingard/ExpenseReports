# Maintainer: DOWingard <https://github.com/DOWingard>
pkgname=payroll-tracker-bin
pkgver=1.0.0
pkgrel=1
pkgdesc="Professional local-first payroll and expense tracker"
arch=('x86_64')
url="https://github.com/DOWingard/ExpenseReports"
license=('MIT')
depends=('webkit2gtk-4.1' 'openssl' 'libappindicator-gtk3' 'librsvg' 'libnm')
makedepends=('nodejs' 'npm' 'rust' 'cargo' 'pkgconf')
source=("payroll-tracker::git+https://github.com/DOWingard/ExpenseReports.git"
        "payroll-tracker.desktop")
sha256sums=('SKIP'
            'SKIP')

build() {
  cd "$srcdir/payroll-tracker"
  npm install
  npm run build
  # Build native Tauri binary
  npm run tauri build
}

package() {
  cd "$srcdir/payroll-tracker"
  
  # Install binary (Tauri v2 release binary is usually named after the productName)
  install -Dm755 "src-tauri/target/release/PayrollTracker" "$pkgdir/usr/bin/payroll-tracker"
  
  # Install desktop entry
  install -Dm644 "$srcdir/payroll-tracker.desktop" "$pkgdir/usr/share/applications/payroll-tracker.desktop"
  
  # Note: You may want to add icons here later if you create a custom branding set
}
