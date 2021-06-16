const path = require('path')
const multer = require('multer')

const uploadPath = path.join('public', 'images')

const uploadFile = multer({ dest: uploadPath })

module.exports = uploadFile