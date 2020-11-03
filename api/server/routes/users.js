const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const cors = require("cors");
const dotenv = require("dotenv");
const check_auth = require("../middlewares/auth");

dotenv.config();

const router = express.Router();

router.options("/login", cors());
router.options("/register", cors());
router.options("/:id_empleado", cors());

router.post("/signup", cors(), (req, res) => {
    User.findOne({ email: req.body.email }).exec().then(usuario => {
        if(usuario) return res.status(400).json({ error: "El usuario ya se ha registrado" });

        bcrypt.hash(req.body.password, 12, (error, hash) => {
            if(error) return res.status(500).json({ error: "Ha ocurrido un error al cifrar el password" });

            const new_user = new User({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name,
                email: req.body.email,
                password: hash
            });

            new_user.save().then(response => {
                if(!response) return res.status(500).json({ error: "Ha ocurrido un error al añadir el usuario" });
                return res.status(201).json({ message: "Se ha creado correctamente el usuario" });
            }).catch(error => {
                return res.status(500).json({ error });
            });
        });

    }).catch(error => {
        return res.status(500).json({ error });
    });
});

router.post("/login", cors(), (req, res) => {
    User.findOne({ email: req.body.email}).exec().then(user => {
        if(!user) return res.status(404).json({ error: "No se ha encontrado el usuario" });
        bcrypt.compare(req.body.password, user.password, (error, response) => {
            if(error) return res.status(500).json({ error: "Las credenciales son invalidas" });
            if(response){
                const token = jwt.sign({
                    email: user.email,
                    id: user._id
                }, process.env.JWT_KEY);
    
                return res.status(200).json({
                    message: "Autenticacion exitosa",
                    _id: user._id,
                    name: user.name,
                    type: user.type,
                    token
                });
            }
            return res.status(400).json({ error: "Las credenciales son incorrectas" });
        });
    }).catch(error => {
        return res.status(500).json({ error });
    });;
});

router.delete("/:id_empleado", cors(), check_auth, (req, res) => {
    const _id = req.params.id_empleado;

    User.findByIdAndRemove(_id).exec().then(response => {
        if(!response) return res.status(404).json({ error: "No se ha encontrado ningun usuario" });
        return res.status(200).json({ message: "Se ha eliminado correctamente" });
    }).catch(error => {
        return res.status(500).json({ error });
    })

});

module.exports = router;