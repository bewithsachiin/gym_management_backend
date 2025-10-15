import {prisma} from '../config/db.config.js';

//================add session================== 
export const addSession = async (req, res) => {

    try{
        const { class_id, trainer_id, date, time, duration, status, location} = req.body;
        
        const session = await prisma.session.create({
            data: {
                class_id: class_id ? class_id : null,
                trainer_id: trainer_id ? trainer_id : null,
                date:new Date(date),
                time,
                duration:parseInt(duration),
                status,
                location
            }
        });
        res.status(201).json({ message: "Session created successfully", session });
    }catch (error) {
        res.status(500).json({ error: "Failed to create session", details: error.message });
    }
};

//================get all sessions==================

export const getAllSessions = async (req, res) => {
    try{
        const sessions = await prisma.session.findMany();
        res.status(200).json(sessions);
    }catch (error) {

        res.status(500).json({ error: "Failed to fetch sessions", details: error.message });
}
}


//================get session by id==================
export const getSessionById = async (req, res) => {
    try{
        const { id } = req.params;
        const session = await prisma.session.findUnique({
            where: { id: parseInt(id) },
        });
        if(!session){
            return res.status(404).json({ error: "Session not found" });
            res.json(session);
    }
}catch (error) {
        res.status(500).json({ error: "Failed to fetch session", details: error.message });
    }
    }


//================ UPDATE DATA==================

export const rescheduleSession = async (req, res) => {
    try{
        const { id } = req.params;
        const {rescheduledDate, rescheduledTime}= req.body;

        if(!rescheduledDate || !rescheduledTime){
            return res.status(400).json({ error: "rescheduledDate and rescheduledTime are required" });
        }
        const updatedSession = await prisma.session.update({
            where: { id: parseInt(id) },
            data: {
                rescheduledDate: new Date(rescheduledDate),
                rescheduledTime,
                isRescheduled: true,
    },
        });
        res.json({ message: "Session rescheduled successfully", updatedSession });
    }catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to reschedule session", details: error.message });
    }
}

//================ DELETE DATA==================

export const deleteSession = async (req, res) => {
    try{
        const { id } = req.params;
        await prisma.session.delete({
            where: { id: parseInt(id) } });
            res.json({ message: "Session deleted successfully" });
    }catch (error) {
        res.status(500).json({ error: "Failed to delete session", details: error.message });
    }
}
