import { AdminComponent } from "./components/Admin/AdminComponent";
import { prepareUpload } from './handlers/uploadHandler';

prepareUpload();
customElements.define('admin-component', AdminComponent);
