# Automatic withdrawal of ether from Ethereum wallet (tutorial)
This application is written for educational purposes only for video tutorial.

## Subscribe to my channel:
https://www.youtube.com/@YuliyaBedrosova/videos

## Run the System
We can easily run the whole with only a single command:
```bash
docker compose up
```

The services can be run on the background with command:
```bash
docker compose up -d
```

## Stop the System
Stopping all the running containers is also simple with a single command:
```bash
docker compose down
```

If you need to stop and remove all containers, networks, and all images used by any service in <em>docker-compose.yml</em> file, use the command:
```bash
docker compose down --rmi all
```
