import './controllers';
import './css/style.scss';

require('dotenv').config();
import { initialize } from './store/setup';

initialize();