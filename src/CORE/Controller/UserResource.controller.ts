import User from "../Model/User.model"
import UserResource from "../Model/UserResource.model"
import AdminResource from "../Model/AdminResource.model"

import { decodeTokenUser } from "../../Helpers/generateHash";
import { varsConfig } from "../../Helpers/varsConfig";
import JWT from "jsonwebtoken";
import Cryptr from 'cryptr';
import { encrypt, decrypt } from 'decrypt-core'


export const userCreateResource = async (req: any, res: any) => {

    const { type_resource, inputs } = req.body;

    let arr_err: string[] = []; // 
    const HEADER: any = decodeTokenUser(req.headers.usuario_autorizacion);
    const src = await new UserResource();

    if (false) res.status(404).json({ ok: false, errors: arr_err });
    else {
        await User.findOne({ _id: HEADER._id, role: 'USUARIO' }).exec().then(async (data: any) => {
            if (!data) res.status(404).json({ ok: false, msg: "No se ha encontrado el usuario con ese ID" })
            else {

                // console.log(req.body)
                await AdminResource.findOne({ _id: type_resource }).exec().then((data: any) => {
                    if (!data) res.status(404).json({ ok: false, msg: "No record found." })

                    // JWT
                    if (data.type_encrypt === "RFC 7519") {
                        const encrypt = JWT.sign({
                            _id: src._id,
                            resource_admin_id: data._id,
                            inputs: inputs
                        }, varsConfig.JWT_STR);
                        src.resource_admin_id = data._id;
                        src.inputs = encrypt;

                        src.save();
                        res.status(201).json({ ok: true, msg: "Se ha creado un nuevo recurso" });

                    } else if (data.type_encrypt === "AES-256") {

                        const cryptr = new Cryptr(varsConfig.JWT_STR);

                        const encryptedString = cryptr.encrypt(JSON.stringify({
                            _id: src._id,
                            resource_admin_id: data._id,
                            inputs: inputs
                        }));

                        src.resource_admin_id = data._id;
                        src.inputs = encryptedString;

                        src.save();
                        res.status(201).json({ ok: true, msg: "Se ha creado un nuevo recurso" });

                    } else if (data.type_encrypt === "3DS") {
                        const encryptedString = encrypt(JSON.stringify({
                            _id: src._id,
                            resource_admin_id: data._id,
                            inputs: inputs
                        }), varsConfig.JWT_STR);

                        src.resource_admin_id = data._id;
                        src.inputs = encryptedString;
                        src.save();
                        res.status(201).json({ ok: true, msg: "Se ha creado un nuevo recurso" })
                    }
                });
            }
        });
    }
}

export const userGetResources = async (req: any, res: any) => {

    await UserResource.find({}).populate('resource_admin_id').select(["-__v"]).exec().then(async (data: any) => {
        if (data.length === 0) res.status(404).json({ ok: false, msg: "No Record stored.", data: [] })
        else {
            let arr: any = [];

            data.forEach((e: any) => {
                if (e.resource_admin_id.type_encrypt === "RFC 7519") {
                    arr.push(JWT.verify(e.inputs, varsConfig.JWT_STR));

                } else if (e.resource_admin_id.type_encrypt === "AES-256") {
                    const cryptr = new Cryptr(varsConfig.JWT_STR);
                    arr.push(cryptr.decrypt(e.inputs));
                } else if (e.resource_admin_id.type_encrypt === "3DS") {
                    arr.push(JSON.parse(decrypt(e.inputs, varsConfig.JWT_STR)));
                }
            });

            res.status(201).json({ ok: true, msg: "Data obtained.", data: arr })
        }
    });
}

export const userGetResourceById = async (req: any, res: any) => {
    await UserResource.findOne({ _id: req.params.id }).populate('resource_admin_id').select(["-__v"]).exec().then((data: any) => {
        if (!data) res.status(404).json({ ok: false, msg: "No record found." })
        else {

            if (data.resource_admin_id.type_encrypt === "RFC 7519") {
                res.status(201).json({ ok: true, msg: "Data obtained.", data: JWT.verify(data.inputs, varsConfig.JWT_STR) })
            } else if (data.resource_admin_id.type_encrypt === "AES-256") {
                const cryptr = new Cryptr(varsConfig.JWT_STR);
                res.status(201).json({ ok: true, msg: "Data obtained.", data: cryptr.decrypt(data.inputs) })
            } else if (data.resource_admin_id.type_encrypt === "3DS") {
                res.status(201).json({ ok: true, msg: "Data obtained.", data: JSON.parse(decrypt(data.inputs, varsConfig.JWT_STR)) })
            }
        }
    });
}

// FALTA!!!!
export const userEditResource = async (req: any, res: any) => {


    const { type_resource, inputs } = req.body;

    let arr_err: string[] = []; // 
    const HEADER: any = decodeTokenUser(req.headers.usuario_autorizacion);
    const src = await new UserResource();

    if (false) res.status(404).json({ ok: false, errors: arr_err });
    else {
        await User.findOne({ _id: HEADER._id, role: 'USUARIO' }).exec().then(async (data: any) => {
            if (!data) res.status(404).json({ ok: false, msg: "No se ha encontrado el usuario con ese ID" })
            else {

                // console.log(req.body)
                await AdminResource.findOne({ _id: type_resource }).exec().then((data: any) => {
                    if (!data) res.status(404).json({ ok: false, msg: "No record found." })

                    // JWT
                    if (data.type_encrypt === "RFC 7519") {
                        const encrypt = JWT.sign({
                            _id: src._id,
                            resource_admin_id: data._id,
                            inputs: inputs
                        }, varsConfig.JWT_STR);
                        src.resource_admin_id = data._id;
                        src.inputs = encrypt;

                        src.save();
                        res.status(201).json({ ok: true, msg: "Se ha creado un nuevo recurso" });

                    } else if (data.type_encrypt === "AES-256") {

                        const cryptr = new Cryptr(varsConfig.JWT_STR);

                        const encryptedString = cryptr.encrypt(JSON.stringify({
                            _id: src._id,
                            resource_admin_id: data._id,
                            inputs: inputs
                        }));

                        src.resource_admin_id = data._id;
                        src.inputs = encryptedString;

                        src.save();
                        res.status(201).json({ ok: true, msg: "Se ha creado un nuevo recurso" });

                    } else if (data.type_encrypt === "3DS") {
                        const encryptedString = encrypt(JSON.stringify({
                            _id: src._id,
                            resource_admin_id: data._id,
                            inputs: inputs
                        }), varsConfig.JWT_STR);

                        src.resource_admin_id = data._id;
                        src.inputs = encryptedString;
                        src.save();
                        res.status(201).json({ ok: true, msg: "Se ha creado un nuevo recurso" })
                    }
                });
            }
        });
    }



















    // const { resource_admin_id, inputs } = req.body;
    // /*
    //     TODO: VALIDAR (solo backend para arrojar una respuesta) campos que traigan PASSWORDS,
    //     nro_tarjeta, pin, y datos sensibles.
    // */
    // const HEADER: any = decodeTokenUser(req.headers.usuario_autorizacion);

    // const src = await new UserResource();

    // let arr_err: string[] = [];

    // if (arr_err.length > 0) {
    //     res.status(404).json({ ok: false, errors: arr_err });
    // } else {
    //     await User.findOne({ _id: HEADER._id, role: 'USUARIO' }).exec().then(async (data: any) => {
    //         if (!data) res.status(404).json({ ok: false, msg: "No se ha encontrado el usuario con ese ID" })
    //         else {
    //             src.user_id = data._id;
    //             src.inputs = inputs;
    //             if (src.resource_admin_id === undefined) {
    //                 src.resource_admin_id = resource_admin_id;
    //             }
    //             UserResource.findOneAndUpdate({ _id: req.params.id }, {
    //                 resource_admin_id: src.resource_admin_id,
    //                 inputs: src.inputs
    //             }).exec().then((success: any) => res.status(201).json({ ok: true, msg: "Se ha actualizado el recurso" }));
    //         }
    //     });
    // }
}

export const userDeleteResource = async (req: any, res: any) => {
    await UserResource.findOne({ _id: req.params.id }).exec().then((data: any) => {
        console.log(data)
        if (!data) res.status(404).json({ ok: false, msg: "No record found." })
        else {
            UserResource.findByIdAndDelete({ _id: req.params.id }).exec().then((success: any) => res.status(201).json({ ok: true, msg: "Resource deleted." }));
        }
    });
}

