import * as express from 'express';
const router = express.Router();

router.get("/", function(req,res){
    res.status(200).json({'hi':'bye', 'jwt': JSON.stringify(req.headers.authorization), 'do we have auth?': 'yess', 'decoded': req.jwt})
})

export default router