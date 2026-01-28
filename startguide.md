# 1. Basic Run

Android - npx expo run:android (rebuild)
Normal -npx expo start --clear

IOS (Make sure the Build is there) - npx expo start --dev-client

# 2. generate folder tree

"Get-ChildItem -Recurse | Where-Object {
$\_.FullName -notmatch 'node_modules|\.git|\.expo|android|ios|\.gradle|build'
} | Select-Object FullName | Out-File project_files.txt "
