import { BACKEND_URI } from 'constants/keys';
import path from 'path';

const imagePath = filename => `${BACKEND_URI}/images/${filename}`;

export default imagePath;
