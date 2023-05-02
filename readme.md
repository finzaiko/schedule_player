# Schedule Player

Tiny Smart Home Alarm schedule for Raspberry Pi

### Installation
1. Install `sudo apt install mpg123`

2. Create config file
    ```
    cd src/config
    cp constant.sample.js constant.js
    ```

    change audio/playlist path
    ```
    const AUDIO_PATH = "yourpath/schedule_player/audio";
    const PLAYLIST_PATH = "yourpath/schedule_player/playlist";
    ```

3. Install node modules
```
npm i && cd app && npm i
```

4. Run

    Backend:
    ```
    npm start
    ```

    Frontend:
    ```
    cd app && npm start
    ```

5. Open in browser `http://localhost:8080/`
