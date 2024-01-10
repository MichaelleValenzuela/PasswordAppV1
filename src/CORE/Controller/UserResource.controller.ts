import User from "../Model/User.model"
import UserResource from "../Model/UserResource.model"
import AdminResource from "../Model/AdminResource.model"

import { decodeTokenUser } from "../../Helpers/generateHash";
import { varsConfig } from "../../Helpers/varsConfig";
import JWT from "jsonwebtoken";

export const userCreateResource = async (req: any, res: any) => {

    const { type_resource, resource_admin_id, inputs } = req.body;
    /*
        TODO: VALIDAR (solo backend para arrojar una respuesta) campos que traigan PASSWORDS,
        nro_tarjeta, pin, y datos sensibles.
    */

    let arr_err: string[] = []; // <-- validar?
    const HEADER: any = decodeTokenUser(req.headers.usuario_autorizacion);
    const src = await new UserResource();

    // TODO: ALMACENAR LOS DATOS NO BORRABLES YA QUE NOS DA PROBLEMA SI QUERERMOS ENCRIPTARLOS...
    if (false) res.status(404).json({ ok: false, errors: arr_err });
    else {
        await User.findOne({ _id: HEADER._id, role: 'USUARIO' }).exec().then(async (data: any) => {
            if (!data) res.status(404).json({ ok: false, msg: "No se ha encontrado el usuario con ese ID" })
            else {
                await AdminResource.findOne({ _id: type_resource }).exec().then((data: any) => {
                    if (!data) res.status(404).json({ ok: false, msg: "No record found." })
                    // else {

                    // JWT
                    if (data.type_encrypt === "RFC 7519") {
                        const encrypt = JWT.sign({
                            _id: src._id,
                            user_id: data._id,
                            inputs: inputs,
                            resource_admin_id: resource_admin_id
                        }, varsConfig.JWT_STR);
                        src.resource = encrypt;
                        src.save();
                        res.status(201).json({ ok: true, msg: "Se ha creado un nuevo recurso" });
                    } else if (data.type_encrypt === "AES-256") {

                    } else if (data.type_encrypt === "3DS") {

                    }
                });
            }

        })


        // src.user_id = data._id;
        // src.resource = resource;
        // if (src.resource_admin_id === undefined) {
        //     src.resource_admin_id = resource_admin_id;
        // }
        // src.save();
        // res.status(201).json({ ok: true, msg: "Se ha creado un nuevo recurso" });
        // });
    }
}

export const userGetResources = async (req: any, res: any) => {

    await UserResource.find({}).populate('resource_admin_id').select(["-__v"]).exec().then((data: any) => {
        if (data.length === 0) res.status(404).json({ ok: false, msg: "No Record stored.", data: [] })
        else {

            let arr: any = [];
            data.forEach((e: any) => {
                arr.push(JWT.verify(e.resource,varsConfig.JWT_STR ));
            });
            res.status(201).json({ ok: true, msg: "Data obtained.", data: arr})

        }
    });


    // await UserResource.find({}).populate('resource_admin_id').select(["-__v"]).exec().then((data: any) => {
    //     if (data.length === 0) res.status(404).json({ ok: false, msg: "No Record stored.", data: [] })
    //     else res.status(201).json({ ok: true, msg: "Data obtained.", data: data })
    // });
}

export const userGetResourceById = async (req: any, res: any) => {
    await UserResource.findOne({ _id: req.params.id }).exec().then((data: any) => {
        if (!data) res.status(404).json({ ok: false, msg: "No record found." })
        else res.status(201).json({ ok: true, msg: "Data obtained.", data: data })
    });
}
export const userEditResource = async (req: any, res: any) => {

    const { resource_admin_id, resource } = req.body;
    /*
        TODO: VALIDAR (solo backend para arrojar una respuesta) campos que traigan PASSWORDS,
        nro_tarjeta, pin, y datos sensibles.
    */
    const HEADER: any = decodeTokenUser(req.headers.usuario_autorizacion);

    const src = await new UserResource();

    let arr_err: string[] = [];

    if (arr_err.length > 0) {
        res.status(404).json({ ok: false, errors: arr_err });
    } else {
        await User.findOne({ _id: HEADER._id, role: 'USUARIO' }).exec().then(async (data: any) => {
            if (!data) res.status(404).json({ ok: false, msg: "No se ha encontrado el usuario con ese ID" })
            else {
                src.user_id = data._id;
                src.resource = resource;
                if (src.resource_admin_id === undefined) {
                    src.resource_admin_id = resource_admin_id;
                }
                UserResource.findOneAndUpdate({ _id: req.params.id }, {
                    resource_admin_id: src.resource_admin_id,
                    resource: src.resource
                }).exec().then((success: any) => res.status(201).json({ ok: true, msg: "Se ha actualizado el recurso" }));
            }
        });
    }
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

