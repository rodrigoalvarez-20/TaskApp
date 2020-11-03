const express = require("express");
const mongoose = require("mongoose");
const Task = require("../models/task");
const cors = require("cors");
const dotenv = require("dotenv");
const check_auth = require("../middlewares/auth");

dotenv.config();

const router = express.Router();

router.options("/", cors());
router.options("/create_task", cors());
router.options("/to_do", cors());
router.options("/:id_task", cors());

router.get("/", cors(), check_auth, (req, res) => {
    const { type, _id } = req.body;
    if(type === "Administrador"){
        Task.find().exec().then(tasks => {
            return res.status(200).json(tasks);
        });
    }else {
        Task.find({ user_id: _id }).exec().then(tasks => {
            return res.status(200).json(tasks);
        });
    }
});

router.post("/create_task", cors(), check_auth, (req, res) => {
    const new_task = new Task({
        _id: mongoose.Types.ObjectId(),
        description: req.body.description,
        user_id: req.body.user_id
    });

    new_task.save().then(response => {
        if(!response) return res.status(500).json({ error: "Ha ocurrido un error al añadir la tarea" });
        return res.status(201).json({ message: "Se ha creado correctamente la tarea" });
    }).catch(error => {
        return res.status(500).json({ error });
    });

});

router.patch("/:id_task", cors(), check_auth, (req, res) => {
    const _id = req.params.id_task;
    const updateUps = req.body;
    Task.findByIdAndUpdate(_id, { $set: updateUps } ).exec().then(response => {
        if(!response) return res.status(500).json({ error: "Ha ocurrido un error al actualizar la tarea" });
        return res.status(200).json({ message: "Se ha actualizado correctamente" });
    }).catch(error => {
        return res.status(500).json({ error });
    });

})

router.delete("/:id_task", cors(), check_auth, (req, res) => {
    const _id = req.params.id_task;
    Task.findByIdAndRemove(_id).exec().then(response => {
        if(!response)  return res.status(404).json({ error: "No se ha encontrado la tarea solicitada" });
        return res.status(200).json({ message: "Se ha eliminado correctamente la tarea" });
    }).catch(error => {
        return res.status(500).json({ error });
    });
})

router.get("/to_do", cors(), check_auth, (req, res) => {
    const { type, _id } = req.body;
    const last2Days = 1000 * 60 * 60 * 24 * 2;
    const hoy = new Date();
    const dias = hoy.getTime() - last2Days;
    if(type === "Administrador"){
        Task.find({ status: "Finalizada", fecha_fin: { $gte: new Date(dias) } }).exec().then(tasks => {
            return res.status(200).json(tasks);
        });
    }else {
        Task.find({ user_id: _id,  status: "Finalizada", fecha_fin: { $gte: new Date(dias) } }).exec().then(tasks => {
            return res.status(200).json(tasks);
        });
    }
});

module.exports = router;