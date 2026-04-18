/**
 * Expo config plugin — fixes fmt pod build error with Xcode 26 / Apple Clang.
 *
 * The fmt pod uses consteval which requires C++20, but conflicts with the
 * default Clang settings. Setting C++17 avoids the consteval codepath.
 *
 * This plugin patches the Podfile after every `expo prebuild` so the fix
 * survives `prebuild --clean`.
 */

const { withDangerousMod } = require('@expo/config-plugins')
const fs = require('fs')
const path = require('path')

const FMT_FIX = `
    # Fix fmt pod consteval error with Xcode 26 / Apple Clang
    installer.pods_project.targets.each do |target|
      if target.name == 'fmt'
        target.build_configurations.each do |config|
          config.build_settings['CLANG_CXX_LANGUAGE_STANDARD'] = 'c++17'
          # Also patch xcconfig which overrides build settings
          xcconfig_path = config.base_configuration_reference&.real_path
          if xcconfig_path && File.exist?(xcconfig_path)
            xcconfig = File.read(xcconfig_path)
            xcconfig.gsub!('CLANG_CXX_LANGUAGE_STANDARD = c++20', 'CLANG_CXX_LANGUAGE_STANDARD = c++17')
            File.write(xcconfig_path, xcconfig)
          end
        end
      end
    end`

module.exports = function withFmtCpp17Fix(config) {
  return withDangerousMod(config, [
    'ios',
    async (mod) => {
      const podfilePath = path.join(mod.modRequest.platformProjectRoot, 'Podfile')
      let contents = fs.readFileSync(podfilePath, 'utf8')

      if (contents.includes("target.name == 'fmt'")) {
        console.log('[withFmtCpp17Fix] Podfile already patched — skipping')
        return mod
      }

      // Insert before the final "end" of the post_install block
      // Find the last "end" which closes the target block
      const lastEnd = contents.lastIndexOf('\nend')
      if (lastEnd === -1) {
        console.warn('[withFmtCpp17Fix] Could not find target end in Podfile — skipping')
        return mod
      }

      // Insert before the post_install's closing end (second-to-last end)
      const secondLastEnd = contents.lastIndexOf('\n  end', lastEnd - 1)
      if (secondLastEnd === -1) {
        console.warn('[withFmtCpp17Fix] Could not find post_install end in Podfile — skipping')
        return mod
      }

      contents = contents.slice(0, secondLastEnd) + FMT_FIX + contents.slice(secondLastEnd)
      fs.writeFileSync(podfilePath, contents, 'utf8')
      console.log('[withFmtCpp17Fix] ✓ Patched Podfile with fmt C++17 fix')

      return mod
    },
  ])
}
