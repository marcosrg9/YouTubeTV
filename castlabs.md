## Manual rápido de Castlabs

Castlabs EVS permite obtener una firma VMP para obtener soporte de Widevine CDM, de modo que el reproductor de YouTube TV con interfaz para Cobalt funcione de forma adecuada. Además de ello, provee una versión modificada de Electron que integra los mecanismos necesarios para albergar soporte Widevine.

### Instalación de la CLI
Su uso se realiza a través de CLI python, la cual se puede instalar con el siguiente comando:
```
python3 -m pip install --upgrade castlabs-evs
```

### Registro
Para poder obtener una firma, previamente se debe crear una cuenta, esto se hace mediante el siguiente comando:
```
python3 -m castlabs_evs.account signup
```

### Instalación de dependencia
Hecho esto, lo siguiente será descargar el binario de Electron adaptado por Castlabs para poder obtener la firma.\
Principalmente lo conveniente es reemplazar la versión de Electron del `package.json` por la de Castlabs:
```json
"devDependencies": {
    "@types/express": "^4.17.13",
    "@types/node": "^18.7.14",
    "@types/peer-dial": "0.0.1",
    "@types/auto-launch": "^5.0.5",
    "electron": "https://github.com/castlabs/electron-releases#v39.0.0+wvcus",
    "electron-builder": "^23.0.2",
    "typescript": "^4.7.3"
},
```
Hecho esto, borrar todo el directorio `node_modules` y reinstalar todas las dependencias nuevamente:
```
    rm -rf node_modules
    npm i
```

### Resolución de errores
Una vez hecho esto, en principio, dispondremos de la versión de Electron proporcionada por Castlabs, no obstante, es probable que no sea usable (a día 9 de Diciembre de 2025). Si compilamos todo el proyecto (`tsc`) y luego iniciamos la aplicación (`npm start`, `electron .` o incluso `npx electron .`), el arranque producirá errores, emitiendo señales como `SIGSEGV`.

Hojeando los fallos en GitHub, hay personas que recomiendan:
- Correr el script de post-instalación de Castlabs: `npm run postinstall`. En mi caso no ha dado resultados.
- Ejecutar la aplicación fuera de Visual Studio Code, es decir, usar otra terminal. Tampoco da resultados.
- Correr la aplicación con el argumento `--no-zygote`; Tampoco produce mejoras.

Hasta ahora, la única solución encontrada, es ir a las [GitHub Releases](https://github.com/castlabs/electron-releases/releases) y descargar la versión adecuada para nuestro proyecto (existe una tabla de versiones soportadas en [este enlace](https://github.com/castlabs/electron-releases/wiki)).\
Hecho esto, descomprimir y reemplazar el contenido con el de la versión en `node_modules`.

### Obtención de firma
Finalmente obtener una firma de streaming para el propio binario de electron:
```
python3 -m castlabs_evs.vmp sign-pkg node_modules/electron/dist
```

Una vez realizado este procedimiento y correr la aplicación, el reproductor de YouTube TV no volverá a producir errores.

### Comprobación de firma
**Nota**: las firmas tienen un periodo de validez que podrá revisarse comprobando la firma del binario:
```
python3 -m castlabs_evs.vmp verify-pkg node_modules/electron/dist
```

Como resultado, la CLI deberá devolver una salida similar a la siguiente:
```
Verifying signature for: node_modules/electron/dist/Electron.app
    - Signature is valid [streaming, 1682 days of validity]
```