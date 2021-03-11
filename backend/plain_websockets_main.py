import asyncio
from asyncio.streams import start_server
import websockets

# """
# Client Side
# """
# async def hello():
#     uri = "ws://localhost:8765"
#     async with websockets.connect(uri) as websocket:
#         await websocket.send("Hello world!")
#         await websocket.recv()

# asyncio.get_event_loop().run_until_complete(hello())

# """
# Server Side
# """
# async def echo(websocket, path):
#     async for message in websocket:
#         await websocket.send (message)

# start_server = websockets.serve(echo, "localhost", 8765)

# asyncio.get_event_loop().run_until_complete(start_server)
# asyncio.get_event_loop().run_forever()