from typing import List, Optional
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query

from ConnectionManager import ConnectionManager
import uvicorn

app = FastAPI()

connection_manager = ConnectionManager()

# NOTE: This is not working
# @app.websocket("/ws/")
# async def websocket_handcheck(
#     websocket: WebSocket,
#     client_id: str = Query(None, alias="clientId"),
#     client_name: str = Query(None, alias="clientName")
# ):

# NOTE: This is working
# @app.websocket("/ws/{client_id}/{client_name}")
# async def websocket_handcheck(
#     websocket: WebSocket,
#     client_id: str,
#     client_name: str,
#     group_id: Optional[str] = Query(None, alias="groupId")
# ):

@app.websocket("/ws/{client_id}/{client_name}/{group_id}")
async def websocket_handcheck(
    websocket: WebSocket,
    client_id: str,
    client_name: str,
    group_id: str
):
    await connection_manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_json()
            if data["isAnnounce"]:
                await connection_manager.announce(client_name, data["message"])
            else:
                await connection_manager.broadcast(client_name, data["message"], group_id)
    except WebSocketDisconnect:
        connection_manager.disconnect(websocket)
        await connection_manager.announce(f"{client_name} disconnected")

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8765)