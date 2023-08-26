import multer from 'multer';

const getStorage = (destination) => multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, destination);
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

export const carerProfileUpload = multer({ storage: getStorage('uploads/carer_profile_image/') });
export const petUpload = multer({ storage: getStorage('uploads/pet_image/') });

