import React from "react";
import {Route, Routes} from "react-router-dom";
import Chat from "./containers/chat";


export const BaseRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Chat />}/>  
            <Route path="/chat/:chatID/" element={<Chat />}/>  
        </Routes>  
    )
}

