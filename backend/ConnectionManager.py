from typing import AsyncIterator, List
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, websockets

class ConnectionManager:
    def __init__(self) -> None:
        self.active_connections: List[WebSocket] = []
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)
    async def broadcast(self, from_src: str, message: str, group_id: str):
        for connection in [c for c in self.active_connections if group_id in c.path_params["group_id"]]:
            await connection.send_json({ "from": from_src, "message": message })
    async def announce(self, from_src: str, message: str):
        for connection in self.active_connections:
            await connection.send_json({ "from": from_src, "message": message })
