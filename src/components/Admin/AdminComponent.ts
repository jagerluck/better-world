import styles from './styles'

/**
 * Admin Component based on the Shadow DOM API
 */
export class AdminComponent extends HTMLElement {
  constructor() {
    super();  
    let shadow = this.attachShadow({mode: 'open'});
    let zoneWrapper = document.createElement('div');
    zoneWrapper.innerHTML = `
      <div class="zone">
        <div id="dropZ">
          <i class="fa fa-cloud-upload"></i>
          <h5>Drag and drop your file here</h5>
          <span>OR</span>
          <div class="selectFile">
            <label for="file">Select file</label>
            <input type="file" name="files[]" id="file">
        </div>
        <p>File size limit : 50 MB</p>
      </div>
    `;
    shadow.appendChild(styles);
    shadow.appendChild(zoneWrapper);
  }
}
