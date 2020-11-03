const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    description: { type: String, required: true },
    status: { type: String, required: false, default: "Pendiente" },
    fecha_fin: { type: Date, required: false },
    user_id: { type: mongoose.Schema.Types.ObjectId, required:true }
});

module.exports = mongoose.model("Tarea", TaskSchema);