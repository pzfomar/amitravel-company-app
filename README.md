npm install -g cordova-res
cordova-res android --skip-config --copy

ionic build
ionic capacitor copy android
ionic capacitor sync android
ionic capacitor build android




cd C:\Users\fredy\Documents\UtnGit\frontend\app
ionic build
ionic capacitor copy android
ionic capacitor sync android
cd android
gradlew assembleDebug
cd app\build\outputs\apk\debug
REN app-debug.apk AmiTravel-Usuario.apk
copy AmiTravel-Usuario.apk C:\Users\fredy\Downloads\pagina\public /Y
cd C:\Users\fredy\Downloads\pagina
firebase deploy

