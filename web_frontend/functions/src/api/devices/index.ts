import * as express from 'express';
const router = express.Router();

router.get("/", function(req,res){
    res.status(200).json({'hi':'bye'})
})

export default router