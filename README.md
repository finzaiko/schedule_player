# Schedule Player

Tiny Smart Home Alarm schedule for Raspberry Pi

### Installation
1. Install mpg123 and pulseaudio
    ```
    sudo apt install mpg123
    sudo apt install pulseaudio
    ```

2. Install node modules and setup
    ```
    make install
    make setup
    ```

3. Run

    Backend:
    ```
    npm start
    ```

4. Open in browser `http://<IP_ADDRESS>:3000`


### Deploy Live Server

Install pm2
```
sudo npm i -g pm2
```

Start pm2
```
pm2 start --name schedule_player index.js
or
pm2 start npm --name "schedule_player" -- start
```

Register Startup on boot
```
pm2 start --name schedule_player index.js
pm2 save
pm2 startup
<Copy paste script result and run again>
```

Monitor process
```
pm2 monit
```

more about [pm2](https://pm2.keymetrics.io/docs/usage/quick-start/)