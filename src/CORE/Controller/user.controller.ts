import User from "../Model/User.model"
import bcrypt from "bcrypt";

export const getUsers = async (req: any, res: any) => {
    await User.find({ role: "USUARIO" }).select(["-password", "-__v", "-token_confirm_account"]).exec().then((data: any) => {
        if (data.length === 0) res.status(404).json({ ok: false, msg: "No Record stored.", data: [] })
        else res.status(201).json({ ok: true, msg: "Data obtained.", data: data })
    });
}

export const desactivateUser = async (req: any, res: any) => {
    await User.findOne({ _id: req.params.id }).exec().then((data: any) => {
        if (!data) res.status(404).json({ ok: false, msg: "No record found." })
        else {
            User.findOneAndUpdate({ _id: req.params.id }, {
                userIsActiveByAdmin: req.body.userIsActiveByAdmin
            }).exec().then((success: any) => res.status(201).json({ ok: true, msg: "Status changed." }));
        }
    });
}

export const editProfileUser = async (req: any, res: any) => {
    await User.findOne({ _id: req.params.id }).exec().then((data: any) => {
        if (!data) res.status(404).json({ ok: false, msg: "No record found." })
        else {
            const { email, password, confirm_password, } = req.body;
            let arr_err: string[] = [];
            if (password !== confirm_password) arr_err.push(`Las contraseñas ingresadas deben ser iguales`);
            if (arr_err.length > 0) res.status(404).json({ ok: false, errors: arr_err })
            else {
                bcrypt.hash(password, 10, async function (err, hash) {
                    User.findOneAndUpdate({ _id: req.params.id }, {
                        password: hash, email: email
                    }).exec().then((success: any) => res.status(201).json({ ok: true, msg: "Actualización exitosa" }));
                });
            }
        }
    });
}