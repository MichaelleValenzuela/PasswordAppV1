import mongoose from "mongoose";
import AdminResource from "../CORE/Model/AdminResource.model";

import { varsConfig } from "./varsConfig";

export const configDB = async () => {
    try {
        await mongoose.connect(varsConfig.ADRESS_MONGO);

        console.log("DB is connected ;)");
        
        // DATA LOADED!!! ONLY READABLE (TPE ENCRYPT: RFC 7519 | AES-256 | 3DS)
        AdminResource.findOne({ name_type: "Tipo de contraseña" || "Tipo de tarjeta" || "Nota" }).exec().then((dat: any) => {
            if (!dat) {

                AdminResource.insertMany([
                    {
                        name_type: "Tipo de contraseña",
                        type_encrypt: "RFC 7519",
                        fields: [
                            {
                                input_name: "Nombre",
                                input_type: "text",
                                input_atr_name: "nombre"
                            },
                            {
                                input_name: "Usuario",
                                input_type: "text",
                                input_atr_name: "usuario"
                            },
                            {
                                input_name: "Contraseña",
                                input_type: "password",
                                input_atr_name: "tipo_contraseña"
                            }
                        ]
                    },
                    {
                        name_type: "Tipo de tarjeta",
                        type_encrypt: "RFC 7519",
                        fields: [
                            {
                                input_name: "Nombre",
                                input_type: "text",
                                input_atr_name: "nombre"
                            },
                            {
                                input_name: "Nro de tarjeta",
                                input_type: "password",
                                input_atr_name: "nro_de_tarjeta"
                            },
                            {
                                input_name: "Mes de expiración",
                                input_type: "text",
                                input_atr_name: "mes_de_expiracion"
                            },
                            {
                                input_name: "Año de expiración",
                                input_type: "text",
                                input_atr_name: "anio_de_expiracion"
                            },
                            {
                                input_name: "Código de seguridad",
                                input_type: "password",
                                input_atr_name: "codigo_de_seguridad"
                            }
                        ]
                    },
                    {
                        name_type: "Nota",
                        type_encrypt: "RFC 7519",
                        fields: [
                            {
                                input_name: "Nombre",
                                input_type: "text",
                                input_atr_name: "nombre"
                            },
                            {
                                input_name: "Descripción",
                                input_type: "textarea",
                                input_atr_name: "descripcion"
                            }
                        ]
                    }

                ]).then(function () {
                    console.log("Data inserted")  // Success 
                }).catch(function (error) {
                    console.log(error)      // Failure 
                });
            }
        });
    } catch (error) {
        console.log(error);
    }
}

