import dotenv from 'dotenv';
//Importamos mongoDB
import { MongoClient,ObjectId } from "mongodb";

//const url = "mongodb+srv://tamayorodriguezang:DB.root@prueba.y1yzi.mongodb.net/";
//const url = process.env.MONG_URL;

dotenv.config();

function conectar(){
    return MongoClient.connect(process.env.MONG_URL);
}

//1. Función para obtener todas las tareas existentes de la base de datos de mongoDB
export function leerTareas(){
    return new Promise(async (ok,ko) => {
        try{
            const conexion = await conectar();
            const coleccion = conexion.db("tareas").collection("tareas");
            
            let tareas = await coleccion.find({}).toArray();
            
            conexion.close();
            
            ok(tareas.map(({_id,tarea,terminada}) => {
                return {id :_id, tarea, terminada};
                } 
            ));

        }catch(error){
            ko({ error: "error en la base de datos" });
        }

    });   
}

//2. Función para crear/actualizar datos de la base de datos pasándole como argumento la tarea
export function nuevaTarea(texto){
    return new Promise(async (ok,ko) => {
        try{
            let conexion = await conectar();
            let coleccion = conexion.db("tareas").collection("tareas");

            //Prueba: let resultado = coleccion.insertOne({ tarea texto, terminada : false })
            let {insertedId} = await coleccion.insertOne({texto});

            conexion.close();

            //Prueba: ok(resultado)
            ok(insertedId);
        }catch(error){
            //Si falla nos mostrará un error en la base de datos
            ko({ error: "error en la base de datos" });
        }

    });   
}

// 3. Función para eliminar una tarea de la base de datos basada en su ID
//El objetivo es eliminar una tarea especificando su id. Después de haber realizado esta acción, lo que devolverá esta consulta es un objeto que indicará el número de operaciones realizadas, lo que resultará en: 
        //que el número será 1 si se ha podido cumplir la consulta o 
        //0 si no.
export function borrarTarea(id){
    return new Promise(async (ok,ko) => {
        try{
            let conexion = await conectar();
            let coleccion = conexion.db("tareas").collection("tareas");

          
            let {deletedCount} = await coleccion.deleteOne({_id : new ObjectId(id) });

            conexion.close();

            ok(deletedCount);
        }catch(error){
            ko({ error: "error en la base de datos" });
        }

    });   
}

//4. Cambiar el estado de una tarea (terminada o no terminada) cambioando el valor ala opuesto TRUE O FALSE
//Después devolverá el número de tareas afectadas por esta acción
export function actualizarEstado(id){
    return new Promise(async (ok,ko) => {
        try{
            let conexion = await conectar();
            let coleccion = conexion.db("tareas").collection("tareas");

            //PARA PROBAR: let resultado = await coleccion.findOne({_id : new ObjectId(id) } );
            //let resultado = await coleccion.updateOne({_id : new ObjectId(id) }, { $set: { terminada: { $not: "$terminada" } } } );
            //El primer {} especifica que tarea queremos modificar

            let {terminada} = await coleccion.findOne({_id : new ObjectId(id) } );
            let {modifiedCount} = await coleccion.updateOne({_id : new ObjectId(id) }, { $set: { terminada : !terminada }});

            //Es importante comprobar manualmente que el toggle funciona
            conexion.close();
            
            ok(modifiedCount); 

        }catch(error){
            ko({ error : "error en base de datos" });
        }
    });
}

export function actualizarTexto(id,texto){
    return new Promise(async (ok,ko) => {
        try{
            //let {count} = await conexion`UPDATE tareas SET tarea = ${texto} WHERE id = ${id}`;

            let conexion = await conectar();
            let coleccion = conexion.db("tareas").collection("tareas");

            //Para probar: let resultado = await coleccion.updateOne({_id : new ObjectId(id) }, { $set: { tarea: texto } } );
            let {modifiedCount} = await coleccion.updateOne({_id : new ObjectId(id) }, { $set: { tarea: texto } } );
            conexion.close();
            //ok(resultado);
            ok(modifiedCount);

        }catch(error){
            ko({ error : "error en base de datos" });
        }
    });
}
 

//PRUEBA PARA PRUEBAS: '66e0234ee3fe7eabd1643f6c'
//PARA PROBAR LAS FUNCIONES:

//nuevaTarea("angela")
//.then(x => console.log(x))
//.catch(x => console.log(x))  


//borrarTarea("66deee619d56a8805ddec240")
//.then(x => console.log(x))
//.catch(x => console.log(x)) 

//actualizarEstado("66dedd345ca1b6af74184984", false)
//.then(x => console.log(x))



//actualizarTexto('66e0234ee3fe7eabd1643f6c', "un nuevo texto")
//.then(x => console.log(x))
//.catch(x => console.log(x));

//leerTareas()
//.then(x => console.log(x))
//.catch(x => console.log(x)) 
