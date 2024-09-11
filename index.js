import dotenv from 'dotenv';

import express from "express";
import cors from "cors";
import { leerTareas,nuevaTarea,borrarTarea,actualizarEstado,actualizarTexto } from "./db.js";

dotenv.config();

const servidor = express();

servidor.use(cors()); 

servidor.use(express.json());

if(process.env.TEST){
    servidor.use("/pruebas", express.static("./pruebas")); 
}


servidor.get("/tareas", async (peticion,respuesta) => {
    try{
        let tareas = await leerTareas();
        respuesta.json(tareas);
    }catch(error){
        respuesta.status(500);
        respuesta.json({ error : "error en el servidor"});
    }
});

servidor.post("/tareas/nueva", async (peticion,respuesta,siguiente) => {
        let texto = peticion.body.tarea;
        if(texto && texto.trim() != ""){
                try{
                    let id = await nuevaTarea(texto);
                    return respuesta.json({id});
                }catch(error){
                        respuesta.status(500);
                        return respuesta.json({ error : "error en el servidor" }) 
                }
        }siguiente({ error : "no tiene la propiedad TAREA" });
      
});

servidor.put("/tareas/actualizar/texto/:id([0-9]+)", async (peticion,respuesta,siguiente) => {
    
    let id = peticion.params.id;
    let texto = peticion.body.tarea;

    if(texto && texto.trim() != ""){
        try{
            let cantidad = await actualizarTexto(id, texto);
            respuesta.json({ resultado : cantidad ? "ok" : "ko"});
        }catch(error){
                respuesta.status(500);
                return respuesta.json({ error : "error en el servidor" }) 
        }
        }siguiente({ error : "no tiene la propiedad TAREA" });

});

servidor.put("/tareas/actualizar/estado/:id([0-9]+)", async (peticion,respuesta) => {
    try{
        let cantidad = await actualizarEstado(peticion.params.id);
        respuesta.json({ resultado : cantidad ? "ok" : "ko"});
    }catch(error){
        respuesta.status(500);
        respuesta.json({ error : "error en el servidor" })
    }

});

/* servidor.put("/tareas/actualizar/:operacion(1|2)/:id([0-9]+)", async (peticion,respuesta,siguiente) => {
    let operaciones = [actualizarTexto,actualizarEstado];
    let {id, operacion} = peticion.params;

    operacion = Number(operacion); //Las operaciones serán:
                                    //1. actualizarTexto
                                    //2. actualizarEstado
                                   
    
    let { tarea } = peticion.body; //Este será el contenido de la tarea que estará almacenada en el body de la petición

    if (operacion == 1 && (!tarea || tarea.trim() == "")){
        return siguiente({ error : "no tiene la propiedad TAREA" });  
    }
    try{
        let cantidad = await operaciones[operacion - 1](id, operacion == 1 ? tarea : null);
        respuesta.json({ resultado : cantidad ? "ok" : "ko"});
    }catch(error){
        respuesta.status(500);
        respuesta.json({ error : "error en el servidor" })
    }
}); */

servidor.delete("/tareas/borrar/:id([0-9]+)", async (peticion,respuesta) => {//id es el nombre del parámetro los (:) lo identificará como dinámico
                                                                            //Le hemos dicho que puede ser uno o más (+) dígitos del 0 al 9
        try{
            let cantidad = await borrarTarea(peticion.params.id);
            respuesta.json({ resultado : cantidad ? "ok" : "ko"});
        }catch(error){
            respuesta.status(500);
            respuesta.json({ error : "error en el servidor"});
        }
    }
   
);

 servidor.use((error,peticion,respuesta,siguiente) => {
    respuesta.status(400);
    respuesta.json({ error : "error en la petición" });
})

servidor.use((peticion,respuesta) => {
    respuesta.status(404);
    respuesta.json({ error : "error recurso no encontrado" });
}) 


servidor.listen(process.env.PORT);
