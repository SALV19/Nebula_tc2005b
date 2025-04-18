const express = require('express')
const router = express.Router()
const multer = require('multer');
const os = require("os");

const storage = multer.diskStorage({ destination: os.tmpdir(), filename: (req, file, callback) => callback(null, `${file.originalname}`) });
const upload = multer({ storage: storage })
const collabs_controller = require('../controller/collabs.controller')

router.get('/', collabs_controller.get_collabs);
router.post('/', collabs_controller.post_collab);

router.post('/Active', collabs_controller.get_collabs_info)
router.post('/Inactive', collabs_controller.get_inactive)
router.post('/get_collab_data', collabs_controller.get_collab_data);
router.post('/update_collab', collabs_controller.update_collab);
router.post('/register_fault', collabs_controller.register_fault)
router.get('/download', collabs_controller.download)
router.post('/uploadFA', upload.single("drive_file"), collabs_controller.uploadFA)
router.post('/deleteCollab', collabs_controller.delete_Collab);

router.post('/Faults', collabs_controller.get_faults);
router.get("/get_collabs_name", collabs_controller.get_collabs_name)

module.exports = router;