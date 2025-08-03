import {Router} from 'express';
import {
    createPlaylist,
    getAllPlaylists,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
} from '../controllers/playlist.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/createPlaylist').post(verifyJWT,createPlaylist);
router.route('/getAllPlaylists').get(getAllPlaylists);
router.route('/getUserPlaylists/:userId').get(getUserPlaylists); 
router.route('/getPlaylistById/:playlistId').get(getPlaylistById);
router.route('/:playlistId/video/:videoId').post(addVideoToPlaylist);
router.route('/:playlistId/video/:videoId').delete(removeVideoFromPlaylist);
router.route('/updatePlaylist/:playlistId').put(updatePlaylist);
router.route('/deletePlaylist/:playlistId').delete(deletePlaylist);


export default router
